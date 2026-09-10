import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn as nodeSpawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ROOT, config, loadLocalEnv, rpc } from '../scripts/post-api.mjs';
import { validateFindings, submitReview } from '../scripts/review-submit.mjs';

const schema={type:'object',additionalProperties:false,required:['findings'],properties:{findings:{type:'array',maxItems:50,items:{type:'object',additionalProperties:false,required:['kind','severity','quote','comment','suggestion'],properties:{kind:{enum:['fact','logic','style']},severity:{enum:['high','medium','low']},quote:{type:'string'},comment:{type:'string'},suggestion:{type:'string'}}}}}};
export function reviewCommand() {
  // 커스텀 실행기는 JSON argv 배열. shell 평가를 하지 않는다.
  if(process.env.CBK_REVIEW_COMMAND_JSON) {
    const parts=JSON.parse(process.env.CBK_REVIEW_COMMAND_JSON);
    if(!Array.isArray(parts)||!parts.length||!parts.every(s=>typeof s==='string'))throw new Error('CBK_REVIEW_COMMAND_JSON 형식 오류');
    return {cmd:parts[0],args:parts.slice(1)};
  }
  return {cmd:'claude',args:['-p','--safe-mode','--restricted','--no-chrome','--no-session-persistence','--disable-slash-commands','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--tools','WebSearch,WebFetch','--allowedTools','WebSearch,WebFetch','--permission-mode','dontAsk','--output-format','json','--json-schema',JSON.stringify(schema),'--system-prompt',fs.readFileSync(path.join(ROOT,'.pipeline/review-prompt.md'),'utf8')]};
}
export function agentEnvironment(env=process.env) {
  // OAuth 구독 인증은 CLI가 읽는다. DB·GitHub·Telegram·API 과금 키는 상속하지 않는다.
  const result={};
  for(const k of ['HOME','PATH','USER','LOGNAME','SHELL','TMPDIR','LANG'])if(env[k])result[k]=env[k];
  return result;
}
export function parseReviewOutput(text) {
  const raw=JSON.parse(text);
  if(raw.is_error)throw new Error('첨삭 에이전트 실패');
  const body=raw.structured_output || raw;
  const v=validateFindings(body.findings);
  if(v.errors.length)throw new Error('첨삭 결과 형식 오류');
  return v.ok;
}
export async function runAgent(post, {spawn=nodeSpawn, timeoutMs=600000}={}) {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cbk-review-'));
  const {cmd,args}=reviewCommand();
  try {
    return await new Promise((resolve,reject)=>{
      const child=spawn(cmd,args,{cwd:dir,env:agentEnvironment(),stdio:['pipe','pipe','pipe']});
      let out='',timedOut=false;
      const timer=setTimeout(()=>{timedOut=true;child.kill('SIGKILL');},timeoutMs);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data',d=>{out+=d;if(out.length>1000000){timedOut=true;child.kill('SIGKILL');}});
      child.stderr.resume(); // CLI 출력에 환경·계정 정보가 섞일 수 있으므로 기록하지 않는다.
      child.on('error',()=>{clearTimeout(timer);reject(new Error('첨삭 명령을 실행하지 못했습니다'));});
      child.on('close',code=>{clearTimeout(timer);if(timedOut||code!==0){reject(new Error(timedOut?'첨삭 시간/출력 제한 초과':'첨삭 명령 실패 (종료 '+code+')'));return;}try{resolve(parseReviewOutput(out));}catch(e){reject(e);}});
      child.stdin.on('error',()=>{});
      child.stdin.end(JSON.stringify({slug:post.slug,rev:post.rev,title:post.title,date:post.date,body:post.body_md ?? post.body_html}));
    });
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
}
export function makeListener({rpc:call,spawn,log=()=>{},key=process.env.CBK_SYNC_KEY}) {
  const queued=new Set(), again=new Set(), queue=[]; let active=null;
  function handle(slug) {
    if(active===slug){again.add(slug);return;}
    if(queued.has(slug))return;
    queued.add(slug);queue.push(slug);void drain();
  }
  async function drain() {
    if(active!==null)return;
    const slug=queue.shift();if(!slug)return;
    active=slug;queued.delete(slug);let post;
    try {
      post=(await call('cbk_review_start',{p_key:key,p_slug:slug}))?.[0];
      if(post) {
        log('첨삭 시작: '+slug+' 판본 '+post.rev);
        const findings=await spawn(post);
        const saved=await submitReview(post,findings,call,key);
        log(saved?'첨삭 완료: '+slug:'수정된 판본이라 이전 결과 폐기: '+slug);
        if(!saved)again.add(slug);
      }
    } catch(e) {
      log('첨삭 실패: '+slug);
      if(post)try{await call('cbk_review_complete',{p_key:key,p_slug:slug,p_rev:post.rev,p_token:post.review_token,p_findings:[],p_error:'첨삭 실행 실패. 연결·구독 인증·로그를 확인하고 재시도하세요.'});}catch(ignore){log('실패 상태 저장 실패; 재연결 복구 대상: '+slug);}
    } finally {
      active=null;
      if(again.delete(slug))handle(slug);
      void drain();
    }
  }
  return {
    onPostEvent(row){if(row?.slug && row.review_status==='pending')handle(row.slug);},
    async catchUp(){for(const p of await call('cbk_review_pending',{p_key:key}) || [])handle(p.slug);},
    inFlight(){return [...(active?[active]:[]),...queue];}
  };
}
async function main() {
  loadLocalEnv();
  if(!process.env.CBK_SYNC_KEY || !process.env.SUPABASE_SERVICE_KEY)throw new Error('리스너 비밀키가 없습니다');
  const {createClient}=await import('@supabase/supabase-js');
  const c=config(),log=m=>console.log(new Date().toISOString()+' '+m);
  const listener=makeListener({rpc,spawn:runAgent,log});
  const sb=createClient(c.url,process.env.SUPABASE_SERVICE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
  // SUBSCRIBED마다 따라잡기. 임대 만료 전 재시작은 일회성 타이머로 복구한다(반복 폴링 없음).
  let recovery;
  async function catchUp(){try{await listener.catchUp();}catch(e){log('따라잡기 실패');process.exitCode=1;await sb.removeAllChannels();process.exit(1);}}
  sb.channel('cbk-posts').on('postgres_changes',{event:'*',schema:'public',table:'cbk_posts'},event=>listener.onPostEvent(event.new)).subscribe(status=>{
    log('realtime: '+status);
    if(status==='SUBSCRIBED'){void catchUp();clearTimeout(recovery);recovery=setTimeout(catchUp,16*60000);}
  });
  await catchUp();log('첨삭 리스너 가동');
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
