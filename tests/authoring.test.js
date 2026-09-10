const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');const {PGlite}=require('@electric-sql/pglite');
const ROOT=path.resolve(__dirname,'..');let count=0;
function check(name,fn){fn();count++;console.log('  ✓ '+name);}
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const tick=()=>new Promise(r=>setTimeout(r,30));
function boot(url='https://test.local/write.html',opts={}) {
 const dom=new JSDOM(read('write.html'),{url,runScripts:'outside-only'}),w=dom.window,calls=[];
 w.CBK_CONFIG={supabaseUrl:'https://db.test',supabaseAnonKey:'anon'};
 if(!opts.noKey)w.localStorage.setItem('cbk:sync_key:v1','OWNERKEY123456789');
 if(opts.draft)w.localStorage.setItem('cbk:draft:v1',JSON.stringify(opts.draft));
 w.fetch=async(u,init)=>{const fn=u.split('/rpc/')[1],body=JSON.parse(init.body);calls.push({fn,body});const result=opts.fetch?await opts.fetch(fn,body):fn==='cbk_post_save'?{rev:1}:[];return {ok:true,status:200,json:async()=>result};};
 for(const p of ['store','catalog','markdown','reviews','write'])w.eval(read('posts/assets/'+p+'.js'));
 return {dom,w,calls,d:w.document};
}
(async()=>{
 const b=boot(),md=b.w.CBK_md;
 check('markdown block coverage',()=>{assert.equal(md('## 제목'),'<h2>제목</h2>');assert.equal(md('- 하나\n- 둘'),'<ul><li>하나</li><li>둘</li></ul>');assert.equal(md('1. 하나'),'<ol><li>하나</li></ol>');assert.equal(md('> 말'),'<blockquote><p>말</p></blockquote>');assert.equal(md('---'),'<hr>');});
 check('markdown escapes HTML and dangerous URLs',()=>{for(const s of ['<script>alert(1)</script>','[x](javascript:alert)','[x](data:text/html,x)','![x](javascript:foo)','[x](jav&#x61;script:foo)']){const host=b.d.createElement('div');host.innerHTML=md(s);assert.equal(host.querySelector('script,a[href^="javascript"],a[href^="data"],img'),null);} });
 check('markdown code is not recursively formatted',()=>{assert.equal(md('`**x**`'),'<p><code>**x**</code></p>');assert.equal(md('```\n<b>**x**</b>\n```'),'<pre><code>&lt;b&gt;**x**&lt;/b&gt;\n</code></pre>');assert.equal(md('CBKCODE0'),'<p>CBKCODE0</p>');});
 const set=(id,value)=>{b.d.getElementById('w-'+id).value=value;b.d.getElementById('w-'+id).dispatchEvent(new b.w.Event('input',{bubbles:true}));};
 set('body','## 본문');set('title','제목');set('slug','Bad!');b.d.getElementById('w-publish').click();await tick();
 check('invalid slug makes no write',()=>assert.equal(b.calls.filter(c=>c.fn==='cbk_post_save').length,0));
 check('draft autosaved',()=>assert.equal(JSON.parse(b.w.localStorage.getItem('cbk:draft:v1')).body,'## 본문'));
 set('slug','my-first');b.d.getElementById('w-publish').click();await tick();
 check('publishes rendered markdown with expected rev',()=>{const c=b.calls.find(c=>c.fn==='cbk_post_save');assert.equal(c.body.p_expected_rev,0);assert.equal(c.body.p_body_html,'<h2>본문</h2>');assert.equal(c.body.p_key,'OWNERKEY123456789');assert.equal(b.w.localStorage.getItem('cbk:draft:v1'),null);assert.equal(b.d.getElementById('w-slug').readOnly,true);});
 check('no browser owner-claim',()=>assert.ok(!b.calls.some(c=>c.fn==='cbk_owner_claim')));
 const no=boot(undefined,{noKey:true});await tick();check('no key disables publish and private review',()=>{assert.equal(no.d.getElementById('w-publish').disabled,true);assert.equal(no.calls.filter(c=>/review/.test(c.fn)).length,0);});
 const edit=boot('https://test.local/write.html?slug=a',{fetch:async fn=>fn==='cbk_post_get'?[{slug:'a',author:'me',rev:3,title:'T',body_md:'saved',date:'2026-09-11'}]:[]});await tick();
 check('existing authored post loads and locks slug',()=>{assert.equal(edit.d.getElementById('w-body').value,'saved');assert.equal(edit.d.getElementById('w-slug').readOnly,true);assert.equal(edit.d.getElementById('w-publish').disabled,false);});
 const translation=boot('https://test.local/write.html?slug=a',{fetch:async fn=>fn==='cbk_post_get'?[{slug:'a',author:'ai',rev:1,body_md:null}]:[]});await tick();
 check('translation edit is blocked',()=>assert.equal(translation.d.getElementById('w-publish').disabled,true));
 const db=new PGlite();await db.exec('create role anon; create role authenticated;');
 await db.exec(read('supabase/schema-posts.sql').replace(/notify pgrst.*?;/gi,''));
 await db.exec(read('supabase/migrations/20260911000000_authoring_review.sql').replace(/notify pgrst.*?;/gi,''));
 await db.query("select cbk_owner_claim('OWNERKEY123456789')");
 const key='OWNERKEY123456789';
 async function save(rev,body='본문',slug='new',k=key){return (await db.query('select * from cbk_post_save($1,$2,$3,$4,$5,$6,$7::date,$8,$9,$10)',[k,slug,'제목','제목','내 글','에세이','2026-09-11','<p>'+body+'</p>',body,rev])).rows[0];}
 await assert.rejects(()=>save(0,'bad','new','intruder'),/not the owner/);count++;
 const p=await save(0);check('DB creates pending authored post',()=>{assert.equal(p.rev,1);assert.equal(p.author,'me');assert.equal(p.review_status,'pending');});
 await assert.rejects(()=>save(0),/revision conflict/);count++;
 const claim=(await db.query('select * from cbk_review_start($1,$2)',[key,'new'])).rows[0];
 check('claim assigns opaque lease token',()=>assert.ok(claim.review_token));
 check('duplicate claim returns nothing',()=>{});assert.equal((await db.query('select * from cbk_review_start($1,$2)',[key,'new'])).rows.length,0);
 await save(1,'새 본문');
 async function complete(c,findings=[],error=null){return (await db.query('select cbk_review_complete($1,$2,$3,$4,$5::jsonb,$6) as v',[key,'new',c.rev,c.review_token,JSON.stringify(findings),error])).rows[0].v;}
 check('old review cannot finish new revision',()=>{});assert.equal(await complete(claim),false);assert.equal((await db.query("select review_status from cbk_posts where slug='new'")).rows[0].review_status,'pending');
 const claim2=(await db.query('select * from cbk_review_start($1,$2)',[key,'new'])).rows[0];
 const good={kind:'style',severity:'low',quote:'새 본문',comment:'구체적으로',suggestion:'예시 추가'};
 await assert.rejects(()=>complete(claim2,[good,{...good,kind:'invalid'}]));
 check('invalid batch rolls back every finding',()=>{});assert.equal((await db.query('select * from cbk_reviews')).rows.length,0);
 assert.equal(await complete(claim2,[good]),true);assert.equal(await complete(claim2,[good]),false);
 check('duplicate submission does not duplicate findings',()=>{});assert.equal((await db.query('select * from cbk_reviews')).rows.length,1);
 await db.exec('set role anon');
 await assert.rejects(()=>db.query('select * from cbk_reviews'));await assert.rejects(()=>db.query('select cbk_review_finish($1,$2,$3,null)',[key,'new','done']));count++;
 const state=await db.query('select * from cbk_review_states($1)',[key]);check('owner can read status without token leak',()=>assert.equal('review_token' in state.rows[0],false));
 await db.close();for(const x of [b,no,edit,translation])x.dom.window.close();
 console.log('authoring: '+count+' passed, 0 failed');
})().catch(e=>{console.error(e);process.exit(1);});
