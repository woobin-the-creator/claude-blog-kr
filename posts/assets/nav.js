/* Shared sidebar nav + per-post bookmark/notes UI.
 * Add a post = add one entry below (newest first).
 * Requires store.js (window.CBK) to be loaded first; degrades gracefully if not. */
(function () {
  var POSTS = [
    { file: "the-full-claude-desktop-experience-on-aws-google-cloud-and-microsoft-foundry.html", title: "완전한 Claude Desktop 경험", date: "2026-06-22" },
    { file: "artifacts-in-claude-code.html",      title: "Claude Code 아티팩트",          date: "2026-06-18" },
    { file: "enterprise-managed-auth.html",       title: "MCP 커넥터 중앙 권한 관리",       date: "2026-06-18" },
    { file: "steering-claude-code.html",          title: "Claude Code 길들이기",          date: "2026-06-18" },
    { file: "claude-design-stays-on-brand-for-daily-work.html", title: "Claude Design 브랜드 유지", date: "2026-06-17" },
    { file: "workload-identity-federation.html",  title: "워크로드 아이덴티티 페더레이션",   date: "2026-06-17" },
    { file: "build-day-hackathon-winners.html",   title: "Opus 4.8 빌드 데이 해커톤",       date: "2026-06-17" },
    { file: "opus-4-7-hackathon-winners.html",    title: "Built with Opus 4.7 해커톤",     date: "2026-06-15" },
    { file: "building-with-claude-managed-agents.html", title: "Managed Agents로 만들기",   date: "2026-06-10" },
    { file: "whats-new-in-claude-managed-agents.html",  title: "관리형 에이전트 새 기능",     date: "2026-06-09" },
    { file: "opus-4-6-hackathon-winners.html",    title: "Built with Opus 4.6 해커톤",     date: "2026-04-20" }
  ];

  var CBK = window.CBK || null;
  var current = location.pathname.split("/").pop();
  var slug = CBK ? CBK.slugOf(current) : current.replace(/\.html$/, "");

  /* ---------- sidebar ---------- */
  var items = POSTS.map(function (p) {
    var active = p.file === current ? " active" : "";
    var star = (CBK && CBK.isBookmarked(CBK.slugOf(p.file))) ? "★ " : "";
    return (
      '<li><a class="nav-link' + active + '" href="' + p.file + '">' +
        star + p.title +
        '<span class="nav-date">' + p.date + "</span>" +
      "</a></li>"
    );
  }).join("");

  var tools = CBK
    ? '<div class="nav-tools">' +
        '<button type="button" id="cbk-export">메모 내보내기</button>' +
        '<label class="cbk-import">메모 가져오기' +
          '<input type="file" id="cbk-import-input" accept="application/json" hidden>' +
        '</label>' +
      "</div>"
    : "";

  var nav = document.createElement("nav");
  nav.id = "site-nav";
  nav.innerHTML =
    '<a class="nav-brand" href="../index.html">Claude 블로그 한글 번역</a>' +
    '<a class="nav-home" href="../index.html">← 메인으로</a>' +
    '<div class="nav-heading">다른 글</div>' +
    "<ul>" + items + "</ul>" +
    tools;

  document.body.insertBefore(nav, document.body.firstChild);

  if (CBK) {
    var exportBtn = document.getElementById("cbk-export");
    if (exportBtn) exportBtn.addEventListener("click", function () { CBK.exportData(); });
    var importInput = document.getElementById("cbk-import-input");
    if (importInput) importInput.addEventListener("change", function () {
      if (!importInput.files || !importInput.files[0]) return;
      CBK.importData(importInput.files[0], function (err) {
        alert(err ? "가져오기 실패: 파일 형식을 확인하세요." : "메모를 가져왔습니다. 새로고침합니다.");
        if (!err) location.reload();
      });
    });
  }

  /* ---------- per-post bookmark + note bar ---------- */
  if (!CBK) return;

  var style = document.createElement("style");
  style.textContent =
    "#cbk-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:0 0 28px;" +
      "padding:12px 14px;border:1px solid var(--line,#e5e5e5);border-radius:10px;background:#faf9f7;}" +
    "#cbk-bar button{font:inherit;cursor:pointer;border:1px solid var(--line,#e5e5e5);" +
      "background:#fff;color:var(--fg,#1a1a1a);border-radius:8px;padding:6px 12px;}" +
    "#cbk-bar button:hover{border-color:var(--accent,#c96442);color:var(--accent,#c96442);}" +
    "#cbk-fav.on{background:var(--accent,#c96442);color:#fff;border-color:var(--accent,#c96442);}" +
    "#cbk-note-status{color:var(--muted,#888);font-size:.82rem;margin-left:auto;}" +
    "#cbk-note-wrap{flex-basis:100%;margin-top:4px;}" +
    "#cbk-note{width:100%;min-height:84px;resize:vertical;font:inherit;line-height:1.6;" +
      "padding:10px 12px;border:1px solid var(--line,#e5e5e5);border-radius:8px;background:#fff;}" +
    "#cbk-note:focus{outline:none;border-color:var(--accent,#c96442);}";
  document.head.appendChild(style);

  var faved = CBK.isBookmarked(slug);
  var note = CBK.getNote(slug);

  var bar = document.createElement("div");
  bar.id = "cbk-bar";
  bar.innerHTML =
    '<button type="button" id="cbk-fav" class="' + (faved ? "on" : "") + '">' +
      (faved ? "★ 즐겨찾기됨" : "☆ 즐겨찾기") + "</button>" +
    '<button type="button" id="cbk-note-toggle">📝 메모' + (note ? " (작성됨)" : "") + "</button>" +
    '<span id="cbk-note-status"></span>' +
    '<div id="cbk-note-wrap"' + (note ? "" : " hidden") + '>' +
      '<textarea id="cbk-note" placeholder="이 글에 대한 메모 — 이 브라우저에 저장됩니다.">' +
      "</textarea></div>";

  var header = document.querySelector("header");
  if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
  else document.body.insertBefore(bar, nav.nextSibling);

  var favBtn = document.getElementById("cbk-fav");
  favBtn.addEventListener("click", function () {
    var on = CBK.toggleBookmark(slug);
    favBtn.classList.toggle("on", on);
    favBtn.textContent = on ? "★ 즐겨찾기됨" : "☆ 즐겨찾기";
  });

  var noteToggle = document.getElementById("cbk-note-toggle");
  var noteWrap = document.getElementById("cbk-note-wrap");
  noteToggle.addEventListener("click", function () {
    noteWrap.hidden = !noteWrap.hidden;
    if (!noteWrap.hidden) document.getElementById("cbk-note").focus();
  });

  var ta = document.getElementById("cbk-note");
  ta.value = note;
  var status = document.getElementById("cbk-note-status");
  var t = null;
  ta.addEventListener("input", function () {
    status.textContent = "저장 중…";
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      CBK.setNote(slug, ta.value);
      status.textContent = "저장됨";
      noteToggle.textContent = "📝 메모" + (ta.value.trim() ? " (작성됨)" : "");
      setTimeout(function () { status.textContent = ""; }, 1500);
    }, 500);
  });
})();
