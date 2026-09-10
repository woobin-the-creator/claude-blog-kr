# 운영 문제 해결

배포·검증 전에 같은 증상의 기록이 있는지 확인한다. 비밀값은 기록하지 않는다.

## §0 빠른 분류

| 증상 | 기록 |
|---|---|
| Supabase 토큰 생성이 완료되지 않음 | [#1 최대 만료일 검증](#1) |
| 서버 키 조회 403 또는 조회한 새 키로 401 | [#2 scoped PAT의 키 공개 범위](#2) |

## <a id="1"></a>#1 — 토큰 최대 만료일 검증

- **증상**: 2026-09-10에 UI에서 2027-09-10을 선택할 수 있지만 Create token 요청은 400으로 실패했다.
- **원인**: 서버가 `expires_at: Token expiration must be in the future, but no later than one year from now`로 거부했다. UI의 날짜 선택 가능 범위와 서버의 시각 검증 경계가 일치하지 않았다.
- **진단**: 토큰 생성 요청의 실패 응답 상태와 본문만 확인했다. 성공 응답이나 인증 헤더는 로그로 출력하지 않는다.
- **수정**: 2027-09-09로 하루 짧게 설정하자 Token created 화면이 나타났고 Keychain 저장을 검증했다.
- **재발방지**: 갱신 시 최대 날짜 경계를 피한다. 현재 토큰의 만료일은 `docs/supabase-automation.md`에 기록했다.

## <a id="2"></a>#2 — scoped PAT의 새 서버 키 공개 실패

- **증상**: `fetchProjectSecretKey`가 `/api-keys?reveal=true`에서 403을 받았다. 일반 `/api-keys`는 200이지만 그 목록의 새 secret key로 Data API를 호출하면 401이었다.
- **원인**: 현재 프로젝트 한정 Database read/write + API Keys read 토큰은 공개 요청 권한이 없었다. 일반 목록의 새 secret key는 사용 가능한 값이 아니었다. 같은 목록의 legacy service_role은 실제로 동작했다.
- **진단**: 응답 상태와 키 종류만 출력했다. 각 서버 키를 메모리에서 읽어 `GET /rest/v1/cbk_posts?select=slug&limit=1`에 사용하자 새 secret은 401, legacy는 200이었다.
- **수정**: 공개 요청이 403일 때만 일반 목록의 legacy service_role을 선택하도록 보완했다. Mac의 gitignored `.pipeline/.env`에 0600 권한으로 저장했다.
- **재발방지**: 마스킹된 새 secret을 선택하지 않는 회귀 테스트를 추가했다. 기존 키가 폐기되기 전에 새 secret 공개 권한을 검토하고 교체해야 한다. 데이터·스키마 배포 자체는 PAT를 사용하므로 이 서버 키에 의존하지 않는다.
