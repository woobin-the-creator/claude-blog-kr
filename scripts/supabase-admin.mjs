#!/usr/bin/env node
import crypto from "node:crypto";
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_MANIFEST = path.join(ROOT, "supabase/deploy-manifest.json");
const API_BASE = "https://api.supabase.com/v1/projects";
const KEYCHAIN_SERVICE = "claude-blog-kr.supabase-access-token";

export function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function sqlLiteral(value) {
  return "'" + String(value).replace(/'/g, "''") + "'";
}

export function loadManifest(file = DEFAULT_MANIFEST) {
  const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!manifest.projectRef || !Array.isArray(manifest.migrations) || !manifest.migrations.length) {
    throw new Error("supabase/deploy-manifest.json 형식이 올바르지 않습니다");
  }
  const ids = new Set();
  for (const migration of manifest.migrations) {
    if (!migration.id || !/^[0-9A-Za-z_-]+$/.test(migration.id)) {
      throw new Error("잘못된 migration id: " + migration.id);
    }
    if (ids.has(migration.id)) throw new Error("중복 migration id: " + migration.id);
    ids.add(migration.id);
    const fullPath = path.resolve(ROOT, migration.path || "");
    if (!fullPath.startsWith(ROOT + path.sep) || !fs.existsSync(fullPath)) {
      throw new Error("migration 파일을 찾을 수 없습니다: " + migration.path);
    }
  }
  return manifest;
}

export function localSecret(name, env = process.env) {
  if (env[name]) return env[name];
  if (name === "CBK_SYNC_KEY") {
    const envFile = path.join(ROOT, ".pipeline/.env");
    if (!fs.existsSync(envFile)) return "";
    const line = fs.readFileSync(envFile, "utf8").split(/\r?\n/)
      .find(value => value.startsWith("CBK_SYNC_KEY="));
    return line ? line.slice("CBK_SYNC_KEY=".length).trim() : "";
  }
  if (name === "SUPABASE_ACCESS_TOKEN" && process.platform === "darwin") {
    const result = childProcess.spawnSync("security", [
      "find-generic-password", "-a", "vroxtztoezsmkrmszgml",
      "-s", KEYCHAIN_SERVICE, "-w"
    ], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return result.status === 0 ? result.stdout.trim() : "";
  }
  return "";
}

export function apiClient({ token, projectRef, fetchImpl = fetch }) {
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN 이 없습니다");
  if (!projectRef) throw new Error("Supabase project ref가 없습니다");

  return async function query(sql, parameters = []) {
    const response = await fetchImpl(API_BASE + "/" + encodeURIComponent(projectRef) + "/database/query", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: sql, parameters, read_only: false })
    });
    const text = await response.text();
    let payload = null;
    if (text) {
      try { payload = JSON.parse(text); }
      catch (_) { payload = { message: text }; }
    }
    if (!response.ok) {
      const detail = payload && (payload.message || payload.error || payload.msg);
      throw new Error("Supabase Management API " + response.status + (detail ? ": " + detail : ""));
    }
    return payload;
  };
}

export async function fetchProjectSecretKey({ token, projectRef, fetchImpl = fetch }) {
  if (!token) throw new Error("SUPABASE_ACCESS_TOKEN 이 없습니다");
  const response = await fetchImpl(
    API_BASE + "/" + encodeURIComponent(projectRef) + "/api-keys?reveal=true",
    { headers: { Authorization: "Bearer " + token } }
  );
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch (_) {}
  if (!response.ok) throw new Error("Supabase API key 조회 실패: " + response.status);
  const keys = Array.isArray(payload) ? payload : [];
  const selected = keys.find(key => key.type === "secret") ||
    keys.find(key => key.name === "service_role");
  if (!selected || !selected.api_key) throw new Error("서버용 Supabase secret key를 찾지 못했습니다");
  return selected.api_key;
}

export function writePipelineSecret(value, file = path.join(ROOT, ".pipeline/.env")) {
  const key = "SUPABASE_SERVICE_KEY";
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  const lines = current.split(/\r?\n/).filter(line => line && !line.startsWith(key + "="));
  lines.push(key + "=" + value);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, lines.join("\n") + "\n", { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}

function rows(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.result)) return payload.result;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export function migrationTransaction(id, checksum, sql) {
  return [
    "begin;",
    sql.trim(),
    "insert into public.cbk_schema_migrations (id, checksum)",
    "values (" + sqlLiteral(id) + ", " + sqlLiteral(checksum) + ");",
    "commit;"
  ].join("\n");
}

export async function applyMigrations(query, manifest) {
  await query(`
    create table if not exists public.cbk_schema_migrations (
      id text primary key,
      checksum text not null,
      applied_at timestamptz not null default now()
    );
    alter table public.cbk_schema_migrations enable row level security;
    revoke all on table public.cbk_schema_migrations from public, anon, authenticated;
  `);

  let applied = 0;
  for (const migration of manifest.migrations) {
    const fullPath = path.resolve(ROOT, migration.path);
    const sql = fs.readFileSync(fullPath, "utf8");
    const checksum = sha256(sql);
    const found = rows(await query(
      "select checksum from public.cbk_schema_migrations where id = $1",
      [migration.id]
    ))[0];
    if (found) {
      if (found.checksum !== checksum) {
        throw new Error("적용된 migration이 수정되었습니다: " + migration.id);
      }
      console.log("skip " + migration.id);
      continue;
    }
    await query(migrationTransaction(migration.id, checksum, sql));
    console.log("apply " + migration.id);
    applied++;
  }
  return applied;
}

export async function seedOwner(query, syncKey) {
  if (!syncKey || syncKey.trim().length < 8) throw new Error("CBK_SYNC_KEY 가 없거나 너무 짧습니다");
  const result = rows(await query(
    "select public.cbk_owner_claim($1) as owned",
    [syncKey.trim()]
  ))[0];
  if (!result || result.owned !== true) {
    throw new Error("CBK_SYNC_KEY가 기존 Supabase 소유자와 일치하지 않습니다");
  }
  console.log("owner verified");
}

export async function verifyProduction(query, manifest) {
  const result = rows(await query(`
    select
      (select count(*)::int from public.cbk_owner) as owner_count,
      (select count(*)::int from public.cbk_posts) as post_count,
      (select count(*)::int from public.cbk_posts where coalesce(trim(title), '') = '') as empty_titles,
      (select count(*)::int from public.cbk_posts where author = 'ai' and length(body_html) < 200) as short_legacy_bodies,
      (select count(*)::int from public.cbk_schema_migrations) as migration_count,
      has_function_privilege('anon', 'public.cbk_owner_claim(text)', 'execute') as anon_can_claim,
      exists (
        select 1 from pg_publication_tables
         where pubname = 'supabase_realtime'
           and schemaname = 'public'
           and tablename = 'cbk_posts'
      ) as posts_realtime
  `))[0];
  if (!result) throw new Error("Supabase 검증 결과가 비었습니다");

  const checks = [
    [Number(result.owner_count) === 1, "owner_count=1"],
    [Number(result.post_count) >= 79, "post_count>=79"],
    [Number(result.empty_titles) === 0, "empty_titles=0"],
    [Number(result.short_legacy_bodies) === 0, "short_legacy_bodies=0"],
    [Number(result.migration_count) >= manifest.migrations.length, "migration_count>=manifest"],
    [result.anon_can_claim === false, "anon_owner_claim=blocked"],
    [result.posts_realtime === true, "cbk_posts_realtime=enabled"]
  ];
  const failed = checks.filter(([ok]) => !ok).map(([, name]) => name);
  if (failed.length) throw new Error("Supabase 검증 실패: " + failed.join(", "));
  console.log("verify owner=1 posts=" + result.post_count + " migrations=" + result.migration_count);
  return result;
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const command = argv[0] || "deploy";
  const manifest = loadManifest(env.SUPABASE_DEPLOY_MANIFEST || DEFAULT_MANIFEST);
  const query = apiClient({
    token: localSecret("SUPABASE_ACCESS_TOKEN", env),
    projectRef: env.SUPABASE_PROJECT_REF || manifest.projectRef
  });
  if (command === "deploy") {
    await applyMigrations(query, manifest);
    await seedOwner(query, localSecret("CBK_SYNC_KEY", env));
    return;
  }
  if (command === "verify") {
    await verifyProduction(query, manifest);
    return;
  }
  if (command === "sync-listener-secret") {
    const secret = await fetchProjectSecretKey({
      token: localSecret("SUPABASE_ACCESS_TOKEN", env),
      projectRef: env.SUPABASE_PROJECT_REF || manifest.projectRef
    });
    writePipelineSecret(secret);
    console.log("listener secret updated");
    return;
  }
  throw new Error("사용법: node scripts/supabase-admin.mjs <deploy|verify|sync-listener-secret>");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(error.message);
    process.exit(1);
  });
}
