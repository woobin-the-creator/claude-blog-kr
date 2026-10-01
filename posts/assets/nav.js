/* Shared sidebar nav + breadcrumb + per-post bookmark/notes UI.
 * Post catalog lives in catalog.js (window.CBK_POSTS + CBK_onCatalog) — load it before this file.
 * Requires store.js (window.CBK) for bookmarks; degrades gracefully if absent. */
(function () {
  var POSTS = window.CBK_POSTS || [];

  /* 이 파일은 posts/ 안(레거시 79개)과 저장소 루트(Task 5 의 post.html / 404.html)
   * 양쪽에서 로드된다. 루트에서 서빙될 때 "../index.html" 은 사이트 밖을 가리키므로
   * 링크 접두사를 한 곳에서 계산한다. post.html 은 이 파일 로드 전에
   * window.CBK_AT_ROOT = true 를 세팅한다.
   *
   * CBK_AT_ROOT 만으로는 부족하다: 404.html 은 GitHub Pages 가 없는 경로에
   * 돌려주는 파일이라 주소창이 /claude-blog-kr/posts/<slug>.html 인 채로 실행된다.
   * 그 상태에서 BASE 를 "" 로 두면 index.html 이 /claude-blog-kr/posts/index.html
   * 로 풀려 또 404 로 떨어지고(그리고 slug "index" 로 렌더를 시도한다) 방문자가
   * 사이트 밖으로 나갈 길이 없다. 그래서 "루트에서 서빙된다"(CBK_AT_ROOT)와
   * "링크를 어디 기준으로 걸어야 하나"(CBK_SITE_BASE)를 분리한다.
   *   post.html  → CBK_SITE_BASE 미설정. 주소가 /claude-blog-kr/post.html 이라
   *                상대경로가 이미 맞고, 로컬 파일로 열 때도 깨지지 않는다.
   *   404.html   → CBK_SITE_BASE = "/claude-blog-kr/". 주소가 임의 깊이라 절대경로만 안전하다. */
  var SITE = window.CBK_SITE_BASE || "";
  var BASE = window.CBK_AT_ROOT ? SITE : "../";
  /* assets/ 자체도 마찬가지다. posts/ 안에서는 "assets/…", 루트에서 서빙될 때는
   * post.html 이 세팅한 CBK_ASSET_BASE("posts/" 또는 "/claude-blog-kr/posts/")를 앞에 붙인다. */
  var ASSETS = (window.CBK_ASSET_BASE || "") + "assets/";

  /* posts/ 안에서는 예전처럼 파일 상대 링크, 루트에서는 post.html?slug= 로 건다.
     404 폴백에서는 SITE 를 붙여야 한다 — 안 붙이면 /claude-blog-kr/posts/post.html?slug=x
     라는 없는 경로가 되고, 404 가 쿼리스트링을 먼저 읽는 덕에 "동작하는 것처럼" 보일 뿐
     HTTP 상태는 계속 404 다. */
  function hrefFor(file) {
    if (!window.CBK_AT_ROOT) return file;
    return SITE + "post.html?slug=" + encodeURIComponent(String(file).replace(/\.html$/, ""));
  }

  var CBK = window.CBK || null;
  var slug = window.CBK_currentSlug ? window.CBK_currentSlug()
           : (location.pathname.split("/").pop() || "").replace(/\.html$/, "");
  var current = slug + ".html";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  var ICON = {
    list: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h9"/></svg>',
    close: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>',
    moon: '<svg class="i-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7z"/></svg>',
    sun: '<svg class="i-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10" cy="10" r="3.4"/><path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/></svg>',
    up: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6.5 9.5V17H4a1 1 0 0 1-1-1v-5.5a1 1 0 0 1 1-1h2.5zm0 0L9.6 3a1.6 1.6 0 0 1 2.9 1.2L11.8 8H16a1.5 1.5 0 0 1 1.5 1.7l-.9 5.8A1.8 1.8 0 0 1 14.8 17H6.5"/></svg>',
    down: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M13.5 10.5V3H16a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1h-2.5zm0 0L10.4 17a1.6 1.6 0 0 1-2.9-1.2L8.2 12H4a1.5 1.5 0 0 1-1.5-1.7l.9-5.8A1.8 1.8 0 0 1 5.2 3h8.3"/></svg>',
    note: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 16h3.2L16 7.2a2.3 2.3 0 0 0-3.2-3.2L4 12.8V16z"/><path d="M11.6 5.2l3.2 3.2"/></svg>'
  };

  /* ---------- 레거시 정적 글: post.html 과 같은 껍데기로 감싼다 ----------
   * posts/<slug>.html 은 본문 노드가 body 바로 아래에 있다. 공용 CSS 가 post.html 과
   * 같은 선택자(#post-body …)로 두 경로를 다루도록 노드를 옮겨 담는다(내용은 그대로).
   * 이미 실행된 <script> 는 옮기지 않는다. */
  function ensurePostShell() {
    if (document.getElementById("post-body")) return;
    var main = document.createElement("main");
    main.className = "post-main";
    main.id = "post-main";
    var wrap = document.createElement("div");
    wrap.id = "post-body";
    var kids = [].slice.call(document.body.childNodes);
    for (var i = 0; i < kids.length; i++) {
      var n = kids[i];
      if (n.nodeType === 1 && (n.tagName === "SCRIPT" || n.id === "site-nav" || n.id === "cbk-catalog-error")) continue;
      wrap.appendChild(n);
    }
    main.appendChild(wrap);
    document.body.insertBefore(main, document.body.firstChild);
  }
  ensurePostShell();
  document.body.classList.add("cbk-post");

  /* 레거시 글에는 head 인라인 테마 스크립트도, site.js 도 없다. 한 번만 붙인다.
   * (site.css 는 레거시 글이 정적으로 링크하는 nav.css 가 @import 한다.) */
  if (!window.CBK_site && !document.querySelector('script[src$="site.js"]')) {
    var siteJs = document.createElement("script");
    siteJs.src = ASSETS + "site.js";
    document.body.appendChild(siteJs);
  }

  /* ---------- 사이트 헤더 + 전체 글 서랍 ---------- */
  function buildItems() {
    return POSTS.map(function (p) {
      var active = p.file === current ? " active" : "";
      var star = (CBK && CBK.isBookmarked(CBK.slugOf(p.file))) ? '<span class="nav-star" aria-label="즐겨찾기">★</span> ' : "";
      return (
        '<li><a class="nav-link' + active + '" href="' + hrefFor(p.file) + '"' +
          (active ? ' aria-current="page"' : "") + ">" +
          '<span class="nav-title">' + star + esc(p.nav || p.title) + "</span>" +
          '<span class="nav-date">' + esc(p.date) + "</span>" +
        "</a></li>"
      );
    }).join("");
  }
  function buildTools() {
    if (!CBK) return "";
    var favCount = CBK.bookmarkedSlugs().length;
    return (
      '<div class="nav-tools">' +
        '<a class="nav-library site-link" href="' + BASE + 'library.html">보관함' +
          (favCount ? ' <span class="nav-count">' + favCount + "</span>" : "") +
        "</a>" +
      "</div>"
    );
  }

  var nav = document.createElement("nav");
  nav.id = "site-nav";
  nav.className = "site-header";
  nav.setAttribute("aria-label", "사이트");
  nav.innerHTML =
    '<div class="site-header-inner">' +
      '<a class="nav-brand site-brand" href="' + BASE + 'index.html">' +
        '<span class="brand-mark" aria-hidden="true">KR</span>' +
        '<span class="brand-text">Claude 블로그<span class="brand-sub"> 한글 번역</span></span>' +
      "</a>" +
      '<div class="site-links">' +
        '<a class="nav-home site-link" href="' + BASE + 'index.html">홈</a>' +
        buildTools() +
      "</div>" +
      '<div class="site-actions">' +
        '<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="테마 전환">' +
          ICON.moon + ICON.sun + "</button>" +
      "</div>" +
    "</div>" +
    '<div class="nav-drawer" id="site-nav-drawer" aria-label="전체 글 목록">' +
      '<div class="nav-drawer-head">' +
        '<span class="nav-heading label">전체 글</span>' +
        '<span class="nav-drawer-count label">' + (POSTS.length || "") + "</span>" +
      "</div>" +
      "<ul>" + buildItems() + "</ul>" +
    "</div>" +
    '<div class="nav-backdrop" aria-hidden="true"></div>';

  var placeholder = document.getElementById("site-nav-placeholder");
  if (placeholder && placeholder.parentNode) placeholder.parentNode.removeChild(placeholder);
  document.body.insertBefore(nav, document.body.firstChild);
  if (window.CBK_site && window.CBK_site.paint) window.CBK_site.paint();

  /* re-render sidebar stars + favorite count after a background sync pull */
  function refreshSidebar() {
    var ul = nav.querySelector("ul");
    if (ul) ul.innerHTML = buildItems();
    var cnt = nav.querySelector(".nav-drawer-count");
    if (cnt) cnt.textContent = POSTS.length || "";
    var toolsEl = nav.querySelector(".nav-tools");
    var html = buildTools();
    if (toolsEl) {
      if (html) toolsEl.outerHTML = html;
      else toolsEl.parentNode.removeChild(toolsEl);
    } else if (html) {
      var links = nav.querySelector(".site-links");
      if (links) links.insertAdjacentHTML("beforeend", html);
      else nav.insertAdjacentHTML("beforeend", html);
    }
  }

  /* 글 머리(<header>)는 본문 안의 것만 본다 — 사이트 헤더와 헷갈리지 않게. */
  function postHeader() {
    return document.querySelector("#post-body header") || document.querySelector("header");
  }

  /* ---------- breadcrumb (메인 › 서브 › 제목) ---------- */
  function buildCrumb() {
    var meta = window.CBK_postBySlug ? window.CBK_postBySlug(slug) : null;
    var header = postHeader();
    if (!meta || !header) return;
    if (document.querySelector(".post-crumb")) return;   // 갱신 시 중복 삽입 방지
    function enc(s) { return encodeURIComponent(s); }
    var crumb = document.createElement("nav");
    crumb.className = "post-crumb";
    crumb.setAttribute("aria-label", "breadcrumb");
    crumb.innerHTML =
      '<a href="' + BASE + 'index.html#m=' + enc(meta.main) + '">' + esc(meta.main) + "</a>" +
      '<span class="post-crumb-sep" aria-hidden="true">/</span>' +
      '<a href="' + BASE + 'index.html#m=' + enc(meta.main) + "&c=" + enc(meta.cat) + '">' + esc(meta.cat) + "</a>" +
      '<span class="post-crumb-sep" aria-hidden="true">/</span>' +
      '<span class="post-crumb-cur">' + esc(meta.title) + "</span>";
    header.parentNode.insertBefore(crumb, header);
  }

  if (window.CBK_onCatalog) window.CBK_onCatalog(function () { refreshSidebar(); buildCrumb(); });
  else { refreshSidebar(); buildCrumb(); }

  /* ---------- 표: 박스 안에서만 가로 스크롤 ---------- */
  var postBody = document.getElementById("post-body");
  function wrapTables() {
    if (!postBody) return;
    var tables = postBody.querySelectorAll("table");
    for (var i = 0; i < tables.length; i++) {
      var t = tables[i];
      if (t.closest(".table-scroll, .tbl-wrap, .table-wrap")) continue;
      var w = document.createElement("div");
      w.className = "table-scroll";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    }
    // 키보드로도 가로 스크롤할 수 있게 스크롤 박스를 포커스 가능하게 한다.
    var boxes = postBody.querySelectorAll(".table-scroll, .tbl-wrap, .table-wrap, pre");
    for (var j = 0; j < boxes.length; j++) {
      var b = boxes[j];
      if (b.scrollWidth > b.clientWidth + 1 && !b.hasAttribute("tabindex")) {
        b.setAttribute("tabindex", "0");
        if (b.tagName !== "PRE") { b.setAttribute("role", "region"); b.setAttribute("aria-label", "가로로 스크롤되는 표"); }
      }
    }
  }
  wrapTables();
  window.addEventListener("load", wrapTables);

  /* ---------- 목차 ----------
   * h2 가 2개 이상일 때만 만든다. id 가 없으면 제목 텍스트로 만든다(중복은 -2, -3…).
   * 데스크톱(≥1080px)은 왼쪽 고정 열(.post-toc), 그보다 좁으면 본문 위 접이식(.post-toc-m). */
  function slugify(t) {
    var s = String(t).trim().toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^0-9a-z\-_ㄱ-ㆎ가-힣]/g, "")
      .replace(/-+/g, "-").replace(/^-|-$/g, "");
    return s || "section";
  }
  function buildToc() {
    if (!postBody || document.querySelector(".post-toc")) return;
    var all = postBody.querySelectorAll("h2, h3");
    var hs = [], h2n = 0;
    for (var i = 0; i < all.length; i++) {
      if (all[i].closest("header, footer")) continue;
      if (!all[i].textContent.trim()) continue;
      hs.push(all[i]);
      if (all[i].tagName === "H2") h2n++;
    }
    if (h2n < 2) return;
    var items = "";
    for (var k = 0; k < hs.length; k++) {
      var h = hs[k];
      if (!h.id) {
        var base = slugify(h.textContent), id = base, n = 2;
        while (document.getElementById(id)) id = base + "-" + (n++);
        h.id = id;
      }
      items += '<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + encodeURIComponent(h.id) +
        '" data-target="' + esc(h.id) + '">' + esc(h.textContent.trim().replace(/\s+/g, " ")) + "</a></li>";
    }
    var aside = document.createElement("nav");
    aside.className = "post-toc";
    aside.setAttribute("aria-label", "목차");
    aside.innerHTML = '<p class="toc-label label">목차</p><ol>' + items + "</ol>";
    postBody.parentNode.insertBefore(aside, postBody);

    var details = document.createElement("details");
    details.className = "post-toc-m";
    details.innerHTML = '<summary><span class="label">목차</span><span class="toc-count label">' + hs.length + "</span></summary><ol>" + items + "</ol>";
    var header = postHeader();
    if (header && postBody.contains(header)) header.parentNode.insertBefore(details, header.nextSibling);
    else postBody.insertBefore(details, postBody.firstChild);

    document.body.classList.add("has-toc");

    var links = document.querySelectorAll(".post-toc a, .post-toc-m a");
    var activeId = "";
    function setActive(id) {
      if (id === activeId) return;
      activeId = id;
      for (var i = 0; i < links.length; i++) {
        var on = links[i].getAttribute("data-target") === id;
        links[i].classList.toggle("active", on);
        if (on) links[i].setAttribute("aria-current", "location"); else links[i].removeAttribute("aria-current");
      }
    }
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      (window.requestAnimationFrame || setTimeout)(function () {
        ticking = false;
        var id = hs[0].id;
        for (var i = 0; i < hs.length; i++) {
          if (hs[i].getBoundingClientRect().top <= 120) id = hs[i].id; else break;
        }
        setActive(id);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // 목차 id 는 렌더 뒤에 생기므로, 주소에 #id 가 있으면 여기서 이동한다.
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target && target.scrollIntoView) target.scrollIntoView();
    }
  }
  buildToc();

  /* ---------- per-post bookmark + note bar ---------- */
  if (!CBK) return;

  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = ASSETS + "cbk.css";
  document.head.appendChild(link);

  var faved = CBK.isBookmarked(slug);
  var note = CBK.getNote(slug);
  var rating = CBK.getRating(slug);   // 1 | -1 | 0
  var reason = CBK.getReason(slug);
  var reasonOpen = rating !== 0 || !!reason; // show reason box when rated or a reason exists

  var bar = document.createElement("div");
  bar.className = "cbk-bar";
  bar.innerHTML =
    '<button type="button" id="cbk-fav" class="cbk-fav' + (faved ? " on" : "") + '">' +
      '<span class="cbk-star">' + (faved ? "★" : "☆") + "</span>" +
      '<span class="cbk-fav-label">' + (faved ? "즐겨찾기됨" : "즐겨찾기") + "</span>" +
    "</button>" +
    '<span class="cbk-rate">' +
      '<button type="button" id="cbk-like" class="cbk-like' + (rating === 1 ? " on" : "") +
        '" aria-pressed="' + (rating === 1) + '" title="좋아요">' + ICON.up +
        '<span class="cbk-rate-label">좋아요</span></button>' +
      '<button type="button" id="cbk-dislike" class="cbk-dislike' + (rating === -1 ? " on" : "") +
        '" aria-pressed="' + (rating === -1) + '" title="별로예요">' + ICON.down +
        '<span class="cbk-rate-label">별로</span></button>' +
    "</span>" +
    '<span id="cbk-reason-status" class="cbk-status"></span>' +
    '<span id="cbk-sync-status" class="cbk-status"></span>' +
    '<a class="cbk-library" href="' + BASE + 'library.html">보관함 →</a>' +
    '<div id="cbk-reason-wrap" class="cbk-reason-wrap"' + (reasonOpen ? "" : " hidden") + ">" +
      '<textarea id="cbk-reason" class="cbk-reason" ' +
        'placeholder="왜 이렇게 평가했나요? — 이 이유가 나중에 취향 학습에 쓰입니다."></textarea>' +
      '<div class="cbk-note-hint">평가 이유 · 자동 저장됨</div>' +
    "</div>";

  var header = postHeader();
  if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
  else if (postBody) postBody.insertBefore(bar, postBody.firstChild);
  else document.body.insertBefore(bar, nav.nextSibling);

  /* ---------- 메모: Notion-style docked note panel (right sidebar) ----------
   * Lives in its own fixed panel instead of the top bar, so it follows on
   * scroll. On wide screens it stays docked open in the right gutter; on
   * narrower/mobile screens a floating 📝 button toggles it as a slide-over. */
  var panel = document.createElement("aside");
  panel.id = "cbk-note-panel";
  panel.className = "cbk-note-panel";
  panel.setAttribute("aria-label", "이 글에 대한 메모");
  panel.innerHTML =
    '<div class="cbk-note-head">' +
      '<span class="cbk-note-title">' + ICON.note + '메모</span>' +
      '<span id="cbk-note-status" class="cbk-status"></span>' +
      '<button type="button" id="cbk-note-close" class="cbk-note-close" ' +
        'aria-label="메모 닫기" title="닫기">' + ICON.close + '</button>' +
    "</div>" +
    '<textarea id="cbk-note" class="cbk-note" ' +
      'placeholder="이 글에 대한 메모를 남겨보세요 — 이 브라우저에 자동 저장됩니다."></textarea>' +
    '<div class="cbk-note-hint">자동 저장됨 · <kbd>Esc</kbd> 로 닫기</div>';

  var backdrop = document.createElement("div");
  backdrop.id = "cbk-note-backdrop";
  backdrop.className = "cbk-note-backdrop";

  var fab = document.createElement("button");
  fab.type = "button";
  fab.id = "cbk-note-fab";
  fab.className = "cbk-note-fab" + (note ? " has-note" : "");
  fab.setAttribute("aria-expanded", "false");
  fab.setAttribute("aria-label", "메모");
  fab.innerHTML = '<span class="cbk-fab-icon">' + ICON.note + '</span>' +
    '<span class="cbk-fab-label">메모</span><span class="cbk-dot"></span>';

  document.body.appendChild(panel);
  document.body.appendChild(backdrop);
  document.body.appendChild(fab);

  var favBtn = document.getElementById("cbk-fav");
  favBtn.addEventListener("click", function () {
    var on = CBK.toggleBookmark(slug);
    favBtn.classList.toggle("on", on);
    favBtn.querySelector(".cbk-star").textContent = on ? "★" : "☆";
    favBtn.querySelector(".cbk-fav-label").textContent = on ? "즐겨찾기됨" : "즐겨찾기";
  });

  var ta = document.getElementById("cbk-note");
  var noteStatus = document.getElementById("cbk-note-status");
  var noteClose = document.getElementById("cbk-note-close");

  function openNotes(focus) {
    document.body.classList.add("cbk-notes-open");
    fab.setAttribute("aria-expanded", "true");
    if (focus) ta.focus();
  }
  function closeNotes() {
    document.body.classList.remove("cbk-notes-open");
    fab.setAttribute("aria-expanded", "false");
  }
  fab.addEventListener("click", function () {
    if (document.body.classList.contains("cbk-notes-open")) closeNotes();
    else openNotes(true);
  });
  noteClose.addEventListener("click", function () { closeNotes(); fab.focus(); });
  backdrop.addEventListener("click", closeNotes);

  /* Docked open by default on wide screens; a slide-over toggle elsewhere. */
  if (window.matchMedia && window.matchMedia("(min-width: 1660px)").matches) {
    document.body.classList.add("cbk-notes-open");
    fab.setAttribute("aria-expanded", "true");
  }

  ta.value = note;

  var t = null;
  function showNoteStatus(text, saved) {
    noteStatus.textContent = text;
    noteStatus.classList.add("show");
    noteStatus.classList.toggle("saved", !!saved);
  }
  ta.addEventListener("input", function () {
    showNoteStatus("저장 중…", false);
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      CBK.setNote(slug, ta.value);
      fab.classList.toggle("has-note", !!ta.value.trim());
      showNoteStatus("저장됨 ✓", true);
      setTimeout(function () { noteStatus.classList.remove("show"); }, 1600);
    }, 500);
  });
  ta.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeNotes(); fab.focus(); }
  });

  /* ---------- like / dislike + reason ---------- */
  var likeBtn = document.getElementById("cbk-like");
  var dislikeBtn = document.getElementById("cbk-dislike");
  var reasonWrap = document.getElementById("cbk-reason-wrap");
  var reasonTa = document.getElementById("cbk-reason");
  var reasonStatus = document.getElementById("cbk-reason-status");
  var reasonTimer = null;

  function showReasonStatus(text, saved) {
    reasonStatus.textContent = text;
    reasonStatus.classList.add("show");
    reasonStatus.classList.toggle("saved", !!saved);
  }

  function reasonAutosize() {
    reasonTa.style.height = "auto";
    reasonTa.style.height = Math.max(reasonTa.scrollHeight, 72) + "px";
  }
  function paintRating(v) {
    likeBtn.classList.toggle("on", v === 1);
    likeBtn.setAttribute("aria-pressed", v === 1);
    dislikeBtn.classList.toggle("on", v === -1);
    dislikeBtn.setAttribute("aria-pressed", v === -1);
  }

  reasonTa.value = reason;
  paintRating(rating);
  if (!reasonWrap.hidden) reasonAutosize();

  function applyRating(v) {
    var cur = CBK.getRating(slug);
    var next = (cur === v) ? 0 : v;          // pressing the active one again → 중립
    var now = CBK.setRating(slug, next);
    paintRating(now);
    if (now !== 0) { reasonWrap.hidden = false; reasonAutosize(); reasonTa.focus(); }
    else reasonWrap.hidden = true;            // collapse but keep the reason text
  }
  likeBtn.addEventListener("click", function () { applyRating(1); });
  dislikeBtn.addEventListener("click", function () { applyRating(-1); });

  reasonTa.addEventListener("input", function () {
    reasonAutosize();
    showReasonStatus("저장 중…", false);
    if (reasonTimer) clearTimeout(reasonTimer);
    reasonTimer = setTimeout(function () {
      CBK.setReason(slug, reasonTa.value);
      showReasonStatus("저장됨 ✓", true);
      setTimeout(function () { reasonStatus.classList.remove("show"); }, 1600);
      reasonTimer = null;
    }, 500);
  });

  /* ---------- background sync on load: pull newer remote bookmarks/notes ----
   * Reuses the very same two-way merge as the 보관함 button (CBK.sync.syncNow),
   * just fired automatically when a post opens. The page already rendered from
   * local data above, so this only reconciles in the background: a pull (remote
   * was newer) refreshes the star + note + sidebar, and we never overwrite a
   * note the user is actively editing. Offline / transient errors stay quiet. */
  function refreshBar() {
    var f = CBK.isBookmarked(slug);
    favBtn.classList.toggle("on", f);
    favBtn.querySelector(".cbk-star").textContent = f ? "★" : "☆";
    favBtn.querySelector(".cbk-fav-label").textContent = f ? "즐겨찾기됨" : "즐겨찾기";

    var n = CBK.getNote(slug);
    var editing = document.activeElement === ta || t !== null; // unsaved edit in flight
    if (!editing && n !== ta.value) {
      ta.value = n;
      fab.classList.toggle("has-note", !!n.trim());
    }

    // rating + reason (don't clobber a reason the user is actively editing)
    var rv = CBK.getRating(slug);
    paintRating(rv);
    var rs = CBK.getReason(slug);
    var editingReason = document.activeElement === reasonTa || reasonTimer !== null;
    if (!editingReason && rs !== reasonTa.value) {
      reasonTa.value = rs;
      if (!reasonWrap.hidden) reasonAutosize();
    }
    if (rv !== 0 && reasonWrap.hidden && !editingReason) { reasonWrap.hidden = false; reasonAutosize(); }
  }

  function flashSync() {
    var s = document.getElementById("cbk-sync-status");
    if (!s) return;
    s.textContent = "🔄 동기화됨";
    s.classList.add("show", "saved");
    setTimeout(function () { s.classList.remove("show"); }, 1800);
  }

  if (CBK.sync && CBK.sync.isConfigured() && CBK.sync.getKey()) {
    CBK.sync.syncNow().then(function (res) {
      if (res && res.pulled) { refreshBar(); refreshSidebar(); flashSync(); }
    }).catch(function () { /* offline / transient — local data already shown */ });
  }
})();
