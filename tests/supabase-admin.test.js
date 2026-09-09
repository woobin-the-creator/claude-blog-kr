const path = require("path");
const fs = require("fs");
const ROOT = path.resolve(__dirname, "..");

let pass = 0, fail = 0;
function ok(name, condition) {
  if (condition) pass++;
  else { fail++; console.log("  ✗ FAIL:", name); }
}

(async () => {
  const mod = await import(ROOT + "/scripts/supabase-admin.mjs");
  const manifest = mod.loadManifest(ROOT + "/supabase/deploy-manifest.json");

  ok("manifest targets the configured production project", manifest.projectRef === "vroxtztoezsmkrmszgml");
  ok("manifest migration ids are unique", new Set(manifest.migrations.map(m => m.id)).size === manifest.migrations.length);
  ok("manifest files all exist", manifest.migrations.every(m => fs.existsSync(ROOT + "/" + m.path)));
  ok("environment secrets win over local fallbacks",
    mod.localSecret("SUPABASE_ACCESS_TOKEN", { SUPABASE_ACCESS_TOKEN: "from-env" }) === "from-env");

  const secret = "owner-secret-must-not-enter-sql";
  let request = null;
  const query = mod.apiClient({
    token: "scoped-token",
    projectRef: "project-ref",
    fetchImpl: async (url, init) => {
      request = { url, init, body: JSON.parse(init.body) };
      return { ok: true, status: 201, text: async () => '[{"owned":true}]' };
    }
  });
  await mod.seedOwner(query, secret);
  ok("Management API uses the project query endpoint", /\/projects\/project-ref\/database\/query$/.test(request.url));
  ok("Management API token is a bearer header", request.init.headers.Authorization === "Bearer scoped-token");
  ok("owner secret is sent as a parameter", request.body.parameters[0] === secret);
  ok("owner secret is not interpolated into SQL", !request.body.query.includes(secret));

  const serverKey = await mod.fetchProjectSecretKey({
    token: "scoped-token",
    projectRef: "project-ref",
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      text: async () => JSON.stringify([
        { type: "publishable", api_key: "public" },
        { type: "secret", api_key: "server-secret" }
      ])
    })
  });
  ok("listener setup prefers the new server-side secret key", serverKey === "server-secret");

  const tx = mod.migrationTransaction("2026_test", "abc", "select 1;");
  ok("migration and history write share a transaction", /^begin;[\s\S]*insert into public\.cbk_schema_migrations[\s\S]*commit;$/.test(tx));
  ok("SQL literals escape apostrophes", mod.sqlLiteral("a'b") === "'a''b'");

  const schema = fs.readFileSync(ROOT + "/supabase/schema-posts.sql", "utf8");
  ok("owner claim is explicitly blocked for browser roles",
    /revoke all on function public\.cbk_owner_claim\(text\)[^;]*anon[^;]*authenticated/i.test(schema));
  ok("owner claim is not granted to browser roles",
    !/grant execute on function public\.cbk_owner_claim\(text\)[^;]*anon/i.test(schema));

  const workflow = fs.readFileSync(ROOT + "/.github/workflows/deploy-supabase.yml", "utf8");
  ok("production workflow never runs on pull_request", !/^\s*pull_request\s*:/m.test(workflow));
  ok("production workflow receives only encrypted secrets", /secrets\.SUPABASE_ACCESS_TOKEN/.test(workflow) && /secrets\.CBK_SYNC_KEY/.test(workflow));

  console.log("supabase-admin: " + pass + " passed, " + fail + " failed");
  process.exit(fail ? 1 : 0);
})();
