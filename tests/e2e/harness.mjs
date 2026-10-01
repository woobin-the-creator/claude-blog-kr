/* e2e 공용 하네스.
 *
 * 1) 정적 서버: 레포 루트를 GitHub Pages 처럼 /claude-blog-kr/ 아래에 서빙하고,
 *    없는 경로는 404.html 을 404 상태로 돌려준다(Pages 동작과 같다).
 * 2) Supabase 픽스처: content/*.md(포스트 스냅샷)에서 카탈로그와 글 본문을 만들어
 *    page.route 로 RPC 응답을 대신한다. 운영 DB 를 읽지도 쓰지도 않는다.
 * 3) 폰트 CDN 은 기본으로 막는다(결정적 실행). 스크린샷은 allowFonts 로 연다.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const REPO = path.resolve(HERE, "..", "..");
export const BASE_PATH = "/claude-blog-kr/";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8"
};

export function startServer(root = REPO) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, "http://x");
      let p = decodeURIComponent(url.pathname);
      if (!p.startsWith(BASE_PATH)) { res.writeHead(302, { Location: BASE_PATH }); return res.end(); }
      p = p.slice(BASE_PATH.length) || "index.html";
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(root, p);
      if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
      fs.stat(file, (err, st) => {
        if (!err && st.isFile()) {
          res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream" });
          return fs.createReadStream(file).pipe(res);
        }
        res.writeHead(404, { "Content-Type": TYPES[".html"] });
        fs.createReadStream(path.join(root, "404.html")).pipe(res);
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, origin: `http://127.0.0.1:${port}`, base: `http://127.0.0.1:${port}${BASE_PATH}` });
    });
  });
}

/* content/<slug>.md → { meta, body_html } */
function parseSnapshot(file) {
  const txt = fs.readFileSync(file, "utf8");
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(txt);
  if (!m) return null;
  const meta = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2];
    try { v = JSON.parse(v); } catch { /* 숫자·true 외 맨 문자열 */ }
    meta[kv[1]] = v;
  }
  const body = m[2].replace(/^\s*<!-- rendered HTML -->\s*/, "");
  return { meta, body_html: body };
}

let CACHE = null;
export function fixtures(root = REPO) {
  if (CACHE && CACHE.root === root) return CACHE;
  const dir = path.join(root, "content");
  const posts = {};
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    const s = parseSnapshot(path.join(dir, f));
    if (!s || !s.meta.slug) continue;
    posts[s.meta.slug] = s;
  }
  // 정적 파일이 없는 글 하나를 픽스처에만 둔다 — 404.html 폴백이 DB 글을 그리는 경로를 검증한다.
  const sample = posts["how-we-claude-code"];
  if (sample) {
    posts["e2e-fallback-post"] = {
      meta: { ...sample.meta, slug: "e2e-fallback-post", title: "폴백 렌더 확인용 글", nav: "폴백 확인", date: "2000-01-01" },
      body_html: sample.body_html.replace(/<h1>[\s\S]*?<\/h1>/, "<h1>폴백 렌더 확인용 글</h1>")
    };
  }
  // 카탈로그(목록)에는 넣지 않는다 — 실제 사이트처럼 104개 목록을 유지하고, 폴백 글은 본문 조회로만 닿는다.
  const list = Object.values(posts).filter(({ meta }) => meta.slug !== "e2e-fallback-post").map(({ meta }) => ({
    slug: meta.slug, title: meta.title, nav: meta.nav, main: meta.main, cat: meta.cat,
    date: meta.date, author: meta.author || "ai", rev: meta.rev || 1
  })).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug < b.slug ? -1 : 1));
  CACHE = { root, posts, list };
  return CACHE;
}

/* 브라우저 컨텍스트에 Supabase·폰트 라우팅을 건다. */
export async function wire(context, { allowFonts = false, root = REPO } = {}) {
  const fx = fixtures(root);
  await context.route(/supabase\.co\/rest\/v1\/rpc\/([a-z_]+)/, async (route) => {
    const fn = /rpc\/([a-z_]+)/.exec(route.request().url())[1];
    let body = [];
    if (fn === "cbk_posts_list") body = fx.list;
    else if (fn === "cbk_post_get") {
      let slug = "";
      try { slug = JSON.parse(route.request().postData() || "{}").p_slug; } catch {}
      const p = fx.posts[slug];
      body = p ? [{ ...p.meta, body_html: p.body_html, style_css: p.meta.style_css || "" }] : [];
    }
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
  if (!allowFonts) {
    await context.route(/cdn\.jsdelivr\.net/, (route) => route.fulfill({ status: 200, contentType: "text/css", body: "" }));
  }
  // 글 본문 이미지는 운영 Pages 절대 주소로 박혀 있다 → 같은 경로의 로컬 레포 파일로 응답한다.
  await context.route(/^https:\/\/woobin-the-creator\.github\.io\/claude-blog-kr\//, (route) => {
    const rel = decodeURIComponent(new URL(route.request().url()).pathname.replace(/^\/claude-blog-kr\//, ""));
    const file = path.join(root, rel);
    if (file.startsWith(root) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      return route.fulfill({ status: 200, contentType: TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", body: fs.readFileSync(file) });
    }
    return route.fulfill({ status: 404, body: "" });
  });
  // 유튜브 임베드 등 그 밖의 외부 iframe/이미지는 막아 결정적으로 돌린다.
  await context.route(/^https?:\/\/(?!127\.0\.0\.1)(?!cdn\.jsdelivr\.net)(?![a-z0-9-]+\.supabase\.co)(?!woobin-the-creator\.github\.io\/claude-blog-kr\/)/, (route) => {
    const type = route.request().resourceType();
    if (type === "image") return route.fulfill({ status: 200, contentType: "image/svg+xml", body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>' });
    return route.abort();
  });
}

export const PAGES = [
  { name: "home", path: "index.html" },
  { name: "post-code", path: "post.html?slug=how-we-claude-code" },
  { name: "post-table", path: "post.html?slug=the-ai-native-sdlc-playbook" },
  { name: "legacy", path: "posts/how-we-claude-code.html" },
  { name: "library", path: "library.html" },
  { name: "queue", path: "youtube.html" },
  { name: "write", path: "write.html" },
  { name: "notfound", path: "posts/this-slug-has-no-static-file.html" }
];
export const WIDTHS = [375, 768, 1280];

export function viewport(w) { return { width: w, height: w < 500 ? 812 : w < 1000 ? 1024 : 800 }; }

/* 페이지가 "다 그려졌다"고 볼 수 있을 때까지 기다린다. */
export async function settle(page, name) {
  await page.waitForLoadState("networkidle").catch(() => {});
  if (/^post|legacy/.test(name)) await page.waitForSelector("#site-nav", { timeout: 8000 }).catch(() => {});
  if (name === "notfound") await page.waitForSelector("#post-error:not([hidden]), #site-nav", { timeout: 8000 }).catch(() => {});
  if (name === "home") await page.waitForSelector(".post-row", { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(300);
}

/* 가로 스크롤과, 스크롤 박스 밖으로 삐져나간 요소를 잰다. */
export async function overflowReport(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const vw = de.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (!r.width || r.right <= vw + 1) continue;
      let anc = el, clipped = false, hidden = false;
      while (anc && anc !== document.body) {
        const cs = getComputedStyle(anc);
        if (cs.position === "fixed" || cs.visibility === "hidden" || cs.display === "none") { hidden = true; break; }
        if (anc !== el && /(auto|scroll|hidden|clip)/.test(cs.overflowX)) { clipped = true; break; }
        anc = anc.parentElement;
      }
      if (!clipped && !hidden) offenders.push(el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + "." + String(el.className).split(" ")[0] + "→" + Math.round(r.right));
    }
    return { scrollWidth: de.scrollWidth, clientWidth: vw, offenders: offenders.slice(0, 5) };
  });
}
