import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from './post-api.mjs';
import { apiClient, localSecret, loadManifest } from './supabase-admin.mjs';
const fields=['slug','title','nav','main','cat','date','author','rev','style_css','body_md','body_html'];
function normalized(p) { return Object.fromEntries(fields.map(k=>[k,p[k] === undefined ? (k==='body_md'?null:'') : p[k]])); }
export function toMarkdownFile(post) {
  const p=normalized(post), md=p.body_md ?? '',html=p.body_html;
  // 길이 기반 프레임: 본문에 구분자나 마지막 개행이 있어도 정확히 복원한다.
  const meta={...p};delete meta.body_md;delete meta.body_html;
  meta.has_markdown=p.body_md!==null;meta.markdown_length=md.length;meta.html_length=html.length;
  return '---\n'+Object.entries(meta).map(([k,v])=>k+': '+JSON.stringify(v)).join('\n')+'\n---\n'+md+'\n<!-- rendered HTML -->\n'+html+'\n';
}
export function fromMarkdownFile(text) {
  const end=text.indexOf('\n---\n',4);if(!text.startsWith('---\n')||end<0)throw new Error('invalid frontmatter');
  const meta={};for(const line of text.slice(4,end).split('\n')){const at=line.indexOf(': ');meta[line.slice(0,at)]=JSON.parse(line.slice(at+2));}
  const rest=text.slice(end+5),len=meta.markdown_length,sep='\n<!-- rendered HTML -->\n';
  if(!Number.isSafeInteger(len)||len<0||rest.slice(len,len+sep.length)!==sep || !Number.isSafeInteger(meta.html_length))throw new Error('invalid body frame');
  const html=rest.slice(len+sep.length,-1);
  if(!rest.endsWith('\n')||html.length!==meta.html_length)throw new Error('truncated snapshot');
  return normalized({...meta,body_md:meta.has_markdown?rest.slice(0,len):null,body_html:html});
}
export function writeSnapshot(posts, out=path.join(ROOT,'content')) {
  if(!Array.isArray(posts)||!posts.length)throw new Error('빈 DB 스냅샷은 거부합니다');
  const slugs=new Set(),files=[];
  for(const p of posts) {
    if(!/^[a-z0-9][a-z0-9-]{0,120}$/.test(p.slug)||slugs.has(p.slug)||!p.title||typeof p.body_html!=='string'||!p.body_html.trim())throw new Error('유효하지 않은 글: 스냅샷 중단');
    slugs.add(p.slug);const text=toMarkdownFile(p);
    if(JSON.stringify(fromMarkdownFile(text))!==JSON.stringify(normalized(p)))throw new Error('스냅샷 복원 검증 실패');
    files.push([p.slug+'.md',text]);
  }
  // 전체 데이터 검증 전에는 파일을 건드리지 않는다. 삭제된 글도 파일은 보존하고 활성 목록만 갱신한다.
  fs.mkdirSync(out,{recursive:true});
  for(const [name,text] of files)fs.writeFileSync(path.join(out,name),text);
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({format:1,activeSlugs:[...slugs].sort()},null,2)+'\n');
  return files.length;
}
export async function takeSnapshot(query,out) {
  // 하나의 SELECT이므로 모든 본문이 같은 DB 스냅샷에서 나온다. RPC 1000행 페이지 제한도 없다.
  const rows=await query('select slug,title,nav,main,cat,date::text,author,rev,style_css,body_md,body_html from public.cbk_posts order by slug');
  return writeSnapshot(rows,out);
}
async function main(){const {projectRef}=loadManifest();const count=await takeSnapshot(apiClient({token:localSecret('SUPABASE_ACCESS_TOKEN'),projectRef}));console.log('스냅샷 '+count+'건 · 전체 복원 검증 통과');}
if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.message);process.exitCode=1;});
