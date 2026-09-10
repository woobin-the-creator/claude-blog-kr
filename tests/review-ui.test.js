const fs=require('fs'),assert=require('node:assert/strict'),path=require('path');
const {JSDOM}=require('jsdom');const tick=()=>new Promise(r=>setTimeout(r,20));
(async()=>{
 const dom=new JSDOM('<div id="host"></div>',{url:'https://test.local',runScripts:'outside-only'}),w=dom.window;
 w.eval(fs.readFileSync(path.join(__dirname,'../posts/assets/reviews.js'),'utf8'));
 const host=w.document.getElementById('host'),calls=[];
 let rows=[{id:1,post_slug:'a',post_rev:1,kind:'style',severity:'low',quote:'<img src=x onerror=alert(1)>',comment:'<script>alert(1)</script>',suggestion:'구체화',status:'open'}],fail=false;
 const rpc=async(fn,b)=>{calls.push({fn,b});if(fn==='cbk_review_states')return [{slug:'a',title:'T',rev:2,review_status:'error'}];if(fn==='cbk_reviews_list')return rows;if(fn==='cbk_review_set_status'){if(fail)throw new Error('offline');rows=[];}return true;};
 w.CBK_reviews.mount(host,{syncKey:'',rpc});await tick();assert.equal(host.innerHTML,'');assert.equal(calls.length,0);
 const panel=w.CBK_reviews.mount(host,{syncKey:'owner',rpc});await tick();
 assert.ok(host.textContent.includes('이전 판본'));assert.ok(host.textContent.includes('첨삭 실패'));assert.equal(host.querySelector('script,img'),null);
 fail=true;host.querySelector('[data-act="applied"]').click();await tick();assert.ok(host.textContent.includes('저장하지 못했습니다'));assert.equal(host.querySelector('[data-act="applied"]').disabled,false);
 fail=false;host.querySelector('[data-act="dismissed"]').click();await tick();assert.equal(host.querySelector('[data-review-id]'),null);assert.ok(calls.some(c=>c.fn==='cbk_review_set_status'&&c.b.p_status==='dismissed'));
 host.querySelector('[data-retry]').click();await tick();assert.ok(calls.some(c=>c.fn==='cbk_review_retry'&&c.b.p_slug==='a'));
 await panel.refresh();dom.window.close();console.log('review-ui: 10 passed, 0 failed');
})().catch(e=>{console.error(e);process.exit(1);});
