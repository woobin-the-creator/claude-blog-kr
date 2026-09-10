const assert=require('node:assert/strict'),fs=require('fs'),os=require('os'),path=require('path');
(async()=>{
 const {toMarkdownFile,fromMarkdownFile,writeSnapshot,takeSnapshot}=await import('../scripts/snapshot.mjs');
 const p={slug:'a',title:'제목: "인용"',nav:'N',main:'내 글',cat:'C',date:'2026-09-11',author:'me',rev:3,style_css:'body{}',body_md:'안녕\n<!-- rendered HTML -->\n---\n😀\n',body_html:'<p>한글 😀</p>\n\n'};
 assert.deepEqual(fromMarkdownFile(toMarkdownFile(p)),p);
 assert.deepEqual(fromMarkdownFile(toMarkdownFile({...p,body_md:null})),{...p,body_md:null});
 assert.throws(()=>fromMarkdownFile(toMarkdownFile(p).slice(0,-5)));
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cbk-snapshot-test-'));
 try{
  assert.equal(writeSnapshot([p],dir),1);const before=fs.readFileSync(path.join(dir,'a.md'),'utf8');
  assert.throws(()=>writeSnapshot([],dir));assert.throws(()=>writeSnapshot([p,{...p,slug:'../bad'}],dir));assert.throws(()=>writeSnapshot([p,p],dir));assert.throws(()=>writeSnapshot([{...p,body_html:''}],dir));
  assert.equal(fs.readFileSync(path.join(dir,'a.md'),'utf8'),before);
  assert.equal(await takeSnapshot(async()=>[p],dir),1);
  await assert.rejects(()=>takeSnapshot(async()=>{throw new Error('offline');},dir));
  assert.equal(fs.readFileSync(path.join(dir,'a.md'),'utf8'),before);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
 console.log('snapshot: 12 passed, 0 failed');
})().catch(e=>{console.error(e);process.exit(1);});
