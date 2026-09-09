# Claude Blog KR agent instructions

## Supabase changes

- Never ask a person to paste SQL into the Supabase dashboard.
- Put every production database change in a new, immutable file under `supabase/migrations/` and register it in `supabase/deploy-manifest.json`.
- Do not edit an already-deployed migration. The deployer verifies SHA-256 checksums and rejects drift.
- Keep Supabase management credentials out of tracked files. Production deploys use the repository secret `SUPABASE_ACCESS_TOKEN`; owner-gated data writes use `CBK_SYNC_KEY`.
- The Supabase token must be scoped to project `vroxtztoezsmkrmszgml` with Database read/write and API Gateway Keys read only.
- On this Mac, `scripts/supabase-admin.mjs` reads that token from the Keychain service `claude-blog-kr.supabase-access-token`; in GitHub Actions it reads the encrypted repository secret.
- Pushes to `main` that touch the Supabase deployment surface run `.github/workflows/deploy-supabase.yml`. For an explicit retry, dispatch that workflow instead of using SQL Editor.
- When a local server worker needs its Supabase secret key, run `node scripts/supabase-admin.mjs sync-listener-secret`; it retrieves the key through the scoped token and updates the gitignored `.pipeline/.env` without printing the value.
- Before pushing a database change, run `cd tests && npm test`. The wiki test rewrites tracked files under `wiki/`; restore only that generated churn before committing.
- Never expose secret values in logs, command arguments, comments, pull-request bodies, or browser-visible source.
