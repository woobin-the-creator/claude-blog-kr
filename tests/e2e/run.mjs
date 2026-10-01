/* e2e 검증: 스펙 docs/woobin_plan/specs/2026-10-01-site-redesign-design.md 의 AC2·3·5·5a·6.
 *   node run.mjs            전체
 *   node run.mjs --quick    전체 글 스윕(AC6 추가분) 생략
 */
import { chromium } from "playwright";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { startServer, wire, fixtures, PAGES, WIDTHS, viewport, settle, overflowReport, REPO } from "./harness.mjs";

const require = createRequire(import.meta.url);
const AXE = require.resolve("axe-core/axe.min.js");
const QUICK = process.argv.includes("--quick");

let pass = 0, fail = 0;
const failures = [];
function ok(name, cond, detail) {
  if (cond) pass++;
  else { fail++; failures.push(name + (detail ? " — " + detail : "")); console.log("  ✗ " + name + (detail ? " — " + detail : "")); }
}

const { server, base } = await startServer();
const browser = await chromium.launch();

async function open(path, { width = 1280, scheme = "light", ctx } = {}) {
  const context = ctx || await browser.newContext({ viewport: viewport(width), colorScheme: scheme });
  if (!ctx) await wire(context);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + path, { waitUntil: "domcontentloaded" });
  return { context, page, errors };
}

async function contrast(page) {
  await page.addScriptTag({ path: AXE });
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ["color-contrast"], resultTypes: ["violations"] });
    return r.violations.flatMap((v) => v.nodes.map((n) => n.target.join(" ") + " :: " + (n.any[0] && n.any[0].message || "").slice(0, 120)));
  });
}

try {
  /* ---------- AC2 · AC3: 가로 스크롤 0, 표·코드·이미지가 박스 밖으로 안 나감 ---------- */
  console.log("· 반응형(가로 스크롤)");
  for (const scheme of ["light", "dark"]) {
    for (const pg of PAGES) {
      for (const w of WIDTHS) {
        const { context, page, errors } = await open(pg.path, { width: w, scheme });
        await settle(page, pg.name);
        const r = await overflowReport(page);
        ok(`${pg.name}@${w} ${scheme}: 가로 스크롤 없음`, r.scrollWidth <= r.clientWidth && r.offenders.length === 0,
          `scrollWidth=${r.scrollWidth} client=${r.clientWidth} ${r.offenders.join(" ")}`);
        ok(`${pg.name}@${w} ${scheme}: 스크립트 오류 없음`, errors.length === 0, errors.join(" | "));
        if (w === 375 && /^post/.test(pg.name)) {
          const media = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const bad = [];
            for (const el of document.querySelectorAll("#post-body table, #post-body pre, #post-body img")) {
              const r = el.getBoundingClientRect();
              if (!r.width) continue;
              const box = el.closest(".table-scroll, .tbl-wrap, .table-wrap, pre");
              const inBox = box && box !== el ? box.getBoundingClientRect().right <= vw + 1 : false;
              if (r.right > vw + 1 && !inBox && !(el.tagName === "PRE" && r.right <= vw + 1)) bad.push(el.tagName + "→" + Math.round(r.right));
            }
            return { count: document.querySelectorAll("#post-body table, #post-body pre, #post-body img").length, bad };
          });
          ok(`${pg.name}@375 ${scheme}: 표·코드·이미지가 화면 또는 스크롤 박스 안`, media.bad.length === 0, media.bad.join(" "));
          if (pg.name === "post-table") ok("post-table 픽스처에 표·코드가 있다", media.count > 2, "count=" + media.count);
        }
        await context.close();
      }
    }
  }

  /* ---------- AC5: 기능 ---------- */
  console.log("· 기능");
  const ctx = await browser.newContext({ viewport: viewport(1280), colorScheme: "light" });
  await wire(ctx);

  // 홈: 출처 탭 → 주제 칩 → 카운트·행 필터
  {
    const { page } = await open("index.html", { ctx });
    await settle(page, "home");
    const total = await page.locator(".post-row").count();
    ok("홈: 글 목록이 그려진다", total === fixtures().list.length, `rows=${total}`);
    await page.locator("#cat-main .tab", { hasText: "Claude blog" }).click();
    const mains = await page.$$eval(".post-row", (rows) => rows.length);
    ok("홈: 출처 탭이 목록을 좁힌다", mains > 0 && mains < total, `rows=${mains}`);
    ok("홈: 주제 칩 줄이 나타난다", await page.locator("#cat-sub:not(.hidden) .chip").count() > 1);
    const sub = page.locator("#cat-sub .chip").nth(1);
    const subName = await sub.getAttribute("data-val");
    await sub.click();
    const allSub = await page.$$eval(".post-row .post-tags", (els, n) => els.every((e) => e.textContent.includes(n)), subName);
    ok("홈: 주제 칩이 그 주제만 남긴다", allSub);
    ok("홈: 카운트 문구에 출처›주제가 붙는다", /›/.test(await page.locator("#count-note").textContent()));
    await page.close();
  }
  // 홈 딥링크
  {
    const { page } = await open("index.html#m=" + encodeURIComponent("Claude blog") + "&c=Agents", { ctx });
    await settle(page, "home");
    ok("딥링크: 출처 탭 선택", (await page.locator("#cat-main .tab.on").textContent()).trim() === "Claude blog");
    ok("딥링크: 주제 칩 선택", (await page.locator("#cat-sub .chip.on").textContent()).trim() === "Agents");
    await page.close();
  }
  // 글 페이지: 즐겨찾기·좋아요·이유·메모·서랍·목차
  const SLUG = "the-ai-native-sdlc-playbook";
  {
    const { page } = await open("post.html?slug=" + SLUG, { ctx });
    await settle(page, "post");
    ok("글: 사이트 헤더가 자리표시 헤더를 대체", await page.locator("#site-nav").count() === 1 && await page.locator("#site-nav-placeholder").count() === 0);
    ok("글: 브레드크럼", await page.locator(".post-crumb a").count() === 2);
    await page.click("#cbk-fav");
    ok("글: 즐겨찾기 켜짐", await page.locator("#cbk-fav.on").count() === 1);
    await page.click("#cbk-like");
    ok("글: 좋아요 켜짐 + 이유 칸 열림", await page.locator("#cbk-like.on").count() === 1 && await page.locator("#cbk-reason-wrap:not([hidden])").count() === 1);
    await page.fill("#cbk-reason", "표와 코드가 많아 검증용으로 좋다");
    await page.waitForTimeout(700);
    const saved = await page.evaluate((s) => window.CBK.getReason(s), SLUG);
    ok("글: 평가 이유 자동 저장", saved === "표와 코드가 많아 검증용으로 좋다", saved);
    await page.click("#cbk-note-fab");
    ok("글: 메모 패널 열림", await page.evaluate(() => document.body.classList.contains("cbk-notes-open")));
    await page.fill("#cbk-note", "e2e 메모");
    await page.waitForTimeout(700);
    ok("글: 메모 자동 저장", await page.evaluate((s) => window.CBK.getNote(s), SLUG) === "e2e 메모");
    await page.keyboard.press("Escape");
    ok("글: Esc 로 메모 닫힘", !(await page.evaluate(() => document.body.classList.contains("cbk-notes-open"))));
    // 서랍
    await page.click("#site-nav .nav-toggle");
    await page.waitForTimeout(400);   // 미끄러져 들어오는 애니메이션(0.22s)
    ok("서랍: 열림", await page.locator("#site-nav.nav-open").count() === 1);
    const box = await page.locator("#site-nav .nav-drawer").boundingBox();
    ok("서랍: 화면 안에 보인다", box && box.x >= 0 && box.x + box.width <= 1281 && box.height > 300, JSON.stringify(box));
    ok("서랍: 현재 글이 강조된다", await page.locator("#site-nav .nav-link.active").count() === 1);
    for (let i = 0; i < 6; i++) await page.keyboard.press("Shift+Tab");
    ok("서랍: Tab 포커스가 서랍 밖으로 안 나간다", await page.evaluate(() => {
      const a = document.activeElement; return !!a && (!!a.closest(".nav-drawer") || a.classList.contains("nav-toggle"));
    }));
    await page.keyboard.press("Escape");
    ok("서랍: Esc 로 닫힘", await page.locator("#site-nav.nav-open").count() === 0);
    await page.click("#site-nav .nav-toggle");
    await page.mouse.click(200, 400);
    ok("서랍: 바깥 클릭으로 닫힘", await page.locator("#site-nav.nav-open").count() === 0);
    // 목차
    ok("목차: 데스크톱 목차가 보인다", await page.locator(".post-toc").isVisible());
    const second = page.locator(".post-toc a").nth(1);
    const target = await second.getAttribute("data-target");
    await second.click();
    await page.waitForTimeout(900);
    const top = await page.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, target);
    ok("목차: 링크가 해당 제목으로 이동", top >= 0 && top < 160, "top=" + top);
    ok("목차: 이동한 항목이 강조된다", (await page.locator(".post-toc a.active").getAttribute("data-target")) === target);
    await page.close();
  }
  // 잘못된 % 이스케이프 해시도 글 페이지 UI 를 깨지 않는다
  {
    const { page, errors } = await open("post.html?slug=" + SLUG + "#100%", { ctx });
    await settle(page, "post");
    ok("글: 잘못된 해시에도 평가 바·목차가 그려진다", await page.locator(".cbk-bar").count() === 1 && await page.locator(".post-toc").count() === 1, errors.join(" | "));
    await page.close();
  }
  // 홈: 즐겨찾기만 보기
  {
    const { page } = await open("index.html", { ctx });
    await settle(page, "home");
    await page.click("#fav-filter");
    const rows = await page.$$eval(".post-row .post-title a", (as) => as.map((a) => a.getAttribute("href")));
    ok("홈: 즐겨찾기만 보기", rows.length === 1 && rows[0].includes(SLUG), rows.join(","));
    ok("홈: 보관함 배지 숫자", (await page.locator("#lib-count").textContent()).trim() === "1");
    await page.close();
  }
  // 보관함: 검색·필터
  {
    const { page } = await open("library.html", { ctx });
    await page.waitForSelector(".card");
    ok("보관함: 카드", await page.locator(".card").count() === 1);
    await page.fill("#q", "검증용");
    await page.waitForTimeout(200);
    ok("보관함: 이유로 검색", await page.locator(".card").count() === 1);
    await page.fill("#q", "없는말zzz");
    await page.waitForTimeout(200);
    ok("보관함: 검색 불일치면 카드 없음", await page.locator(".card").count() === 0);
    await page.fill("#q", "");
    await page.click('.chip[data-filter="dislike"]');
    ok("보관함: 싫어요 필터", await page.locator(".card").count() === 0);
    await page.click('.chip[data-filter="like"]');
    ok("보관함: 좋아요 필터", await page.locator(".card").count() === 1);
    await page.close();
  }
  // 테마 토글: 저장·유지·해제
  {
    const { page } = await open("index.html", { ctx });
    await settle(page, "home");
    await page.click("[data-theme-toggle]");
    ok("테마: 다크로 전환", (await page.getAttribute("html", "data-theme")) === "dark");
    ok("테마: 저장", (await page.evaluate(() => localStorage.getItem("cbk:theme"))) === "dark");
    await page.reload();
    await settle(page, "home");
    ok("테마: 새로고침 후 유지", (await page.getAttribute("html", "data-theme")) === "dark");
    ok("테마: 다크 배경 적용", (await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(20, 20, 19)");
    await page.goto(base + "post.html?slug=" + SLUG);
    await settle(page, "post");
    ok("테마: 다른 페이지에도 유지", (await page.getAttribute("html", "data-theme")) === "dark");
    await page.click("#site-nav [data-theme-toggle]");
    ok("테마: 시스템(라이트)과 같아지면 저장값 해제", (await page.getAttribute("html", "data-theme")) === null &&
      (await page.evaluate(() => localStorage.getItem("cbk:theme"))) === null);
    await page.close();
  }
  // 404 폴백 + 레거시 정적 글
  {
    const { page } = await open("posts/e2e-fallback-post.html", { ctx });
    await settle(page, "post");
    ok("404 폴백: DB 글을 그린다", /폴백 렌더 확인용 글/.test(await page.locator("#post-body h1").textContent()));
    ok("404 폴백: 사이트 안 링크", (await page.locator("#site-nav .nav-brand").getAttribute("href")) === "/claude-blog-kr/index.html");
    await page.goto(base + "posts/this-slug-has-no-static-file.html");
    await page.waitForSelector("#post-error:not([hidden])");
    ok("404: 오류 안내 + 홈 링크", (await page.locator("#post-error a").getAttribute("href")) === "/claude-blog-kr/");
    await page.goto(base + "posts/how-we-claude-code.html");
    await settle(page, "legacy");
    ok("레거시 글: 헤더", await page.locator("#site-nav.site-header").count() === 1);
    ok("레거시 글: 본문 래퍼", await page.locator("main.post-main > #post-body > header h1").count() === 1);
    ok("레거시 글: 목차", await page.locator(".post-toc").isVisible());
    ok("레거시 글: 평가 바", await page.locator("#post-body .cbk-bar").count() === 1);
    ok("레거시 글: 공용 배경 적용", (await page.evaluate(() => getComputedStyle(document.body).backgroundColor)) === "rgb(250, 249, 245)");
    await page.close();
  }
  await ctx.close();

  // AC5a: 375px 보관함 칩 한 줄, 메모 버튼 폭
  {
    const c = await browser.newContext({ viewport: viewport(375) });
    await wire(c);
    const { page } = await open("library.html", { ctx: c });
    await page.waitForTimeout(300);
    const hs = await page.$$eval(".chip[data-filter]", (els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
    ok("보관함@375: 칩이 한 줄", hs.every((h) => h <= 36), hs.join(","));
    await page.goto(base + "post.html?slug=" + SLUG);
    await settle(page, "post");
    const fw = (await page.locator("#cbk-note-fab").boundingBox() || {}).width;
    ok("글@375: 메모 버튼 폭 ≤ 48", fw && fw <= 48, "width=" + fw);
    ok("글@375: 접이식 목차", await page.locator(".post-toc-m").isVisible());
    await page.click("#site-nav .nav-toggle");
    await page.waitForTimeout(400);
    const box = await page.locator("#site-nav .nav-drawer").boundingBox();
    ok("서랍@375: 화면 폭 안", box && box.x >= 0 && box.x + box.width <= 376, JSON.stringify(box));
    await c.close();
  }

  /* ---------- AC6: 명도 대비 ---------- */
  console.log("· 명도 대비(axe color-contrast)");
  for (const scheme of ["light", "dark"]) {
    for (const pg of PAGES) {
      const { context, page } = await open(pg.path, { width: 1280, scheme });
      await settle(page, pg.name);
      const v = await contrast(page);
      ok(`${pg.name}@1280 ${scheme}: 대비 위반 0`, v.length === 0, v.slice(0, 4).join(" || "));
      await context.close();
    }
  }
  if (!QUICK) {
    console.log("· 전체 글 스윕(라이트·다크 대비 · 375 가로 스크롤)");
    const slugs = fixtures().list.map((p) => p.slug);
    const cd = await browser.newContext({ viewport: viewport(1280), colorScheme: "dark" });
    await wire(cd);
    const cl = await browser.newContext({ viewport: viewport(1280), colorScheme: "light" });
    await wire(cl);
    const cm = await browser.newContext({ viewport: viewport(375) });
    await wire(cm);
    const pd = await cd.newPage();
    const pl = await cl.newPage();
    const pm = await cm.newPage();
    for (const s of slugs) {
      for (const [pp, label] of [[pd, "다크"], [pl, "라이트"]]) {
        await pp.goto(base + "post.html?slug=" + encodeURIComponent(s));
        await settle(pp, "post");
        const v = await contrast(pp);
        ok(`스윕 ${s} ${label}: 대비 위반 0`, v.length === 0, v.slice(0, 3).join(" || "));
      }
      await pm.goto(base + "post.html?slug=" + encodeURIComponent(s));
      await settle(pm, "post");
      const r = await overflowReport(pm);
      ok(`스윕 ${s} 375: 가로 스크롤 없음`, r.scrollWidth <= r.clientWidth && r.offenders.length === 0, r.offenders.join(" "));
    }
    // 레거시 정적 URL(posts/<slug>.html): 인라인 CSS 가 layer 밖이라 특이도로만 이긴다 — 따로 훑는다.
    console.log("· 레거시 정적 글 스윕(다크 대비 · 375 가로 스크롤)");
    for (const s of slugs) {
      if (!fs.existsSync(path.join(REPO, "posts", s + ".html"))) continue;
      await pd.goto(base + "posts/" + encodeURIComponent(s) + ".html");
      await settle(pd, "legacy");
      const v = await contrast(pd);
      ok(`레거시 ${s} 다크: 대비 위반 0`, v.length === 0, v.slice(0, 3).join(" || "));
      await pm.goto(base + "posts/" + encodeURIComponent(s) + ".html");
      await settle(pm, "legacy");
      const r = await overflowReport(pm);
      ok(`레거시 ${s} 375: 가로 스크롤 없음`, r.scrollWidth <= r.clientWidth && r.offenders.length === 0, r.offenders.join(" "));
    }
    await cd.close();
    await cl.close();
    await cm.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`\ne2e: ${pass} passed, ${fail} failed`);
if (fail) { console.log(failures.slice(0, 40).map((f) => " - " + f).join("\n")); }
process.exit(fail ? 1 : 0);
