/* Supabase 동기화 설정 (Phase 2).
 *
 * 정적 사이트라 이 값들은 브라우저에 그대로 노출된다. 그래도 안전하다 —
 * 테이블은 RLS로 전면 차단돼 있고(supabase/schema.sql 참고), anon 키로는
 * cbk_get/cbk_upsert/cbk_delete RPC만 호출할 수 있으며, 그 함수들도 비밀
 * sync_key 를 알아야만 내 데이터에 닿는다. 즉 보안은 anon 키가 아니라
 * sync_key(24자 무작위 코드)가 책임진다.
 *
 * 두 값을 채우면 보관함에 "기기 간 동기화" 칸이 활성화된다.
 * 비워두면 동기화 UI는 "설정 안 됨" 상태로 남고 사이트는 그대로 동작한다.
 */
window.CBK_CONFIG = {
  // Project Settings → API → Project URL (뒤의 /rest/v1/ 는 뺀 기본 주소)
  supabaseUrl: "https://vroxtztoezsmkrmszgml.supabase.co",
  // Project Settings → API → anon public 키 (RLS로 보호되므로 공개해도 안전)
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyb3h0enRvZXpzbWtybXN6Z21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNzQ2NjUsImV4cCI6MjA5Nzg1MDY2NX0.A_rH6GJrEDVJfquQNXDhpFuk_wkUhI8xev-CnHH4upI"
};
