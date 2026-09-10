import { pathToFileURL } from 'node:url';
import { rpc, loadLocalEnv } from './post-api.mjs';
export function validateFindings(raw) {
  if (!Array.isArray(raw) || raw.length > 50) return {ok:[], errors:['findings must be an array of at most 50 items']};
  const ok=[],errors=[];
  raw.forEach((f,i)=>{
    if (!f || !['fact','logic','style'].includes(f.kind)) {errors.push('#'+i+': invalid kind');return;}
    if (!['high','medium','low'].includes(f.severity)) {errors.push('#'+i+': invalid severity');return;}
    if (typeof f.comment !== 'string' || !f.comment.trim() || f.comment.length > 4000) {errors.push('#'+i+': invalid comment');return;}
    if (typeof f.quote !== 'string' || !f.quote.trim() || f.quote.length > 4000) {errors.push('#'+i+': invalid quote');return;}
    if (f.suggestion != null && (typeof f.suggestion !== 'string' || f.suggestion.length > 4000)) {errors.push('#'+i+': invalid suggestion');return;}
    ok.push({kind:f.kind,severity:f.severity,quote:f.quote,comment:f.comment.trim(),suggestion:f.suggestion || ''});
  });
  return {ok,errors};
}
export async function submitReview(post, findings, call=rpc, key=process.env.CBK_SYNC_KEY) {
  const v=validateFindings(findings);
  if(v.errors.length) throw new Error(v.errors.join('; '));
  if(!key || !post.review_token || !Number.isInteger(post.rev)) throw new Error('소유자 키와 첨삭 실행 토큰·판본이 필요합니다');
  return call('cbk_review_complete',{p_key:key,p_slug:post.slug,p_rev:post.rev,p_token:post.review_token,p_findings:v.ok,p_error:null});
}
async function main() {
  loadLocalEnv();
  const get=n=>{const i=process.argv.indexOf('--'+n);return i<0?null:process.argv[i+1];};
  let text='';for await(const data of process.stdin){text+=data;if(text.length>1000000)throw new Error('입력 제한 초과');}
  const v=validateFindings(JSON.parse(text));if(v.errors.length)throw new Error(v.errors.join('; '));
  if(!process.argv.includes('--dry')) {
    const done=await submitReview({slug:get('slug'),rev:Number(get('rev')),review_token:process.env.CBK_REVIEW_TOKEN},v.ok);
    if(!done)throw new Error('판본이 바뀌었거나 만료된 첨삭입니다');
  }
  console.log('SUBMITTED '+v.ok.length);
}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
