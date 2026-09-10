import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export function config() {
  const src = fs.readFileSync(path.join(ROOT, 'posts/assets/cbk-config.js'), 'utf8');
  const url = src.match(/supabaseUrl:\s*"([^"]+)"/)?.[1];
  const key = src.match(/supabaseAnonKey:\s*"([^"]+)"/)?.[1];
  if (!url || !key) throw new Error('Supabase 설정이 없습니다');
  return { url:url.replace(/\/+$/, ''), key };
}
export function loadLocalEnv() {
  const file = path.join(ROOT, '.pipeline/.env');
  if (fs.existsSync(file)) process.loadEnvFile(file);
}
export async function rpc(fn, body, fetchImpl=fetch) {
  const c = config();
  const r = await fetchImpl(c.url+'/rest/v1/rpc/'+fn, {method:'POST',headers:{apikey:c.key,Authorization:'Bearer '+c.key,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  if (!r.ok) throw new Error('RPC '+fn+' 실패 (HTTP '+r.status+')'); // 응답에 비밀값이 포함될 수 있어 원문은 로그에 남기지 않는다.
  return r.status === 204 ? null : r.json();
}
