/* before/after 스크린샷 (스펙 AC1).
 *   node shots.mjs --root <레포 체크아웃 경로> --out <출력 폴더>
 * before 는 main 을 다른 폴더에 체크아웃해서 --root 로 준다(git worktree add ../before main).
 * 폰트 CDN 을 허용해 실제 모습으로 찍는다. 출력은 커밋하지 않는다(shots/ 는 gitignore).
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { startServer, wire, PAGES, WIDTHS, viewport, settle, overflowReport, REPO } from "./harness.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const root = path.resolve(arg("--root", REPO));
const out = path.resolve(arg("--out", "shots/after"));
const schemes = (arg("--schemes", "light,dark")).split(",");
const only = arg("--pages", "") ? arg("--pages", "").split(",") : null;   // 예: --pages home,library
fs.mkdirSync(out, { recursive: true });

const { server, base } = await startServer(root);
const browser = await chromium.launch();
const rows = [];
try {
  for (const scheme of schemes) {
    for (const pg of PAGES) {
      if (only && !only.includes(pg.name)) continue;
      for (const w of WIDTHS) {
        const ctx = await browser.newContext({ viewport: viewport(w), colorScheme: scheme });
        await wire(ctx, { allowFonts: true, root });
        const page = await ctx.newPage();
        await page.goto(base + pg.path, { waitUntil: "domcontentloaded" });
        await settle(page, pg.name);
        await page.evaluate(() => document.fonts && document.fonts.ready);
        const r = await overflowReport(page);
        const f = `${pg.name}-${w}-${scheme}`;
        await page.screenshot({ path: path.join(out, f + "-fold.png") });
        await page.screenshot({ path: path.join(out, f + ".png"), fullPage: true });
        rows.push({ shot: f, hscroll: r.scrollWidth > r.clientWidth });
        await ctx.close();
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}
fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(rows, null, 2));
console.log(rows.map((r) => `${r.shot} hscroll=${r.hscroll}`).join("\n"));
