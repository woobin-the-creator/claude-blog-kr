# Supabase automation

Production project: `vroxtztoezsmkrmszgml`.

## Operating model

Agents do not use the Supabase SQL Editor. Production schema changes are immutable SQL files registered in `supabase/deploy-manifest.json`. The deployer records each file's SHA-256 in `public.cbk_schema_migrations`; changing an applied file fails instead of silently drifting production.

`Deploy Supabase` runs after relevant changes reach `main`, in this order:

1. install dependencies and run the complete test suite;
2. apply unapplied SQL files through the project-scoped Management API token;
3. seed or verify the owner key through a bound SQL parameter;
4. synchronize the 79 legacy posts while their source files exist;
5. verify row counts, body integrity, owner exclusivity, permissions, migration history, and Realtime publication membership.

The workflow never runs on `pull_request`, so unmerged code cannot read production secrets. Concurrent production runs are serialized.

## Credentials

Two encrypted GitHub repository secrets are required:

- `SUPABASE_ACCESS_TOKEN`: a scoped Supabase PAT limited to this project, with Database read/write and API Gateway Keys read permissions;
- `CBK_SYNC_KEY`: the existing owner key.

On the resident Mac, the PAT lives in Keychain under service `claude-blog-kr.supabase-access-token`, account `vroxtztoezsmkrmszgml`. `scripts/supabase-admin.mjs` reads it without printing it. `CBK_SYNC_KEY` remains in the gitignored `.pipeline/.env`.

Never put either value in a command argument, log, tracked file, issue, or pull request.

## Agent commands

```bash
node scripts/supabase-admin.mjs deploy
node scripts/migrate-posts.mjs
node scripts/supabase-admin.mjs verify
```

To refresh the resident listener's server-side key without visiting the dashboard:

```bash
node scripts/supabase-admin.mjs sync-listener-secret
```

To retry the production workflow after a transient platform failure:

```bash
gh workflow run deploy-supabase.yml --repo woobin-the-creator/claude-blog-kr
```

## Adding a database change

1. Add a new timestamped SQL file under `supabase/migrations/`.
2. Append its stable id and path to `supabase/deploy-manifest.json`.
3. Add or update a pglite/static contract test.
4. Run `cd tests && npm test`.
5. Push through the normal pull-request path. Production applies it after merge.

Never edit an entry already recorded in `public.cbk_schema_migrations`. Add a compensating migration instead.
