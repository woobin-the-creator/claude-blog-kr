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

  /* ---------- sidebar ---------- */
  function buildItems() {
    return POSTS.map(function (p) {
      var active = p.file === current ? " active" : "";
      var star = (CBK && CBK.isBookmarked(CBK.slugOf(p.file))) ? "★ " : "";
      return (
        '<li><a class="nav-link' + active + '" href="' + hrefFor(p.file) + '">' +
          star + (p.nav || p.title) +
          '<span class="nav-date">' + p.date + "</span>" +
        "</a></li>"
      );
    }).join("");
  }
  function buildTools() {
    if (!CBK) return "";
    var favCount = CBK.bookmarkedSlugs().length;
    return (
      '<div class="nav-tools">' +
        '<a class="nav-library" href="' + BASE + 'library.html">📑 보관함' +
          (favCount ? ' <span class="nav-count">' + favCount + "</span>" : "") +
        "</a>" +
      "</div>"
    );
  }

  var nav = document.createElement("nav");
  nav.id = "site-nav";
  nav.innerHTML =
    '<a class="nav-brand" href="' + BASE + 'index.html">Claude 블로그 한글 번역</a>' +
    '<a class="nav-home" href="' + BASE + 'index.html">← 메인으로</a>' +
    '<div class="nav-heading">다른 글</div>' +
    "<ul>" + buildItems() + "</ul>" +
    buildTools();

  document.body.insertBefore(nav, document.body.firstChild);

  /* re-render sidebar stars + favorite count after a background sync pull */
  function refreshSidebar() {
    var ul = nav.querySelector("ul");
    if (ul) ul.innerHTML = buildItems();
    var toolsEl = nav.querySelector(".nav-tools");
    var html = buildTools();
    if (toolsEl) {
      if (html) toolsEl.outerHTML = html;
      else toolsEl.parentNode.removeChild(toolsEl);
    } else if (html) {
      nav.insertAdjacentHTML("beforeend", html);
    }
  }

  /* ---------- breadcrumb (메인 › 서브 › 제목) ---------- */
  function buildCrumb() {
    var meta = window.CBK_postBySlug ? window.CBK_postBySlug(slug) : null;
    var header = document.querySelector("header");
    if (!meta || !header) return;
    if (document.querySelector(".post-crumb")) return;   // 갱신 시 중복 삽입 방지
    function enc(s) { return encodeURIComponent(s); }
    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }
    var crumb = document.createElement("nav");
    crumb.className = "post-crumb";
    crumb.setAttribute("aria-label", "breadcrumb");
    crumb.innerHTML =
      '<a href="' + BASE + 'index.html#m=' + enc(meta.main) + '">' + esc(meta.main) + "</a>" +
      '<span class="post-crumb-sep">›</span>' +
      '<a href="' + BASE + 'index.html#m=' + enc(meta.main) + "&c=" + enc(meta.cat) + '">' + esc(meta.cat) + "</a>" +
      '<span class="post-crumb-sep">›</span>' +
      '<span class="post-crumb-cur">' + esc(meta.title) + "</span>";
    header.parentNode.insertBefore(crumb, header);
  }

  if (window.CBK_onCatalog) window.CBK_onCatalog(function () { refreshSidebar(); buildCrumb(); });
  else { refreshSidebar(); buildCrumb(); }

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
        '" aria-pressed="' + (rating === 1) + '" title="좋아요">👍' +
        '<span class="cbk-rate-label">좋아요</span></button>' +
      '<button type="button" id="cbk-dislike" class="cbk-dislike' + (rating === -1 ? " on" : "") +
        '" aria-pressed="' + (rating === -1) + '" title="별로예요">👎' +
        '<span class="cbk-rate-label">별로</span></button>' +
    "</span>" +
    '<span id="cbk-reason-status" class="cbk-status"></span>' +
    '<span id="cbk-sync-status" class="cbk-status"></span>' +
    '<a class="cbk-library" href="' + BASE + 'library.html">📑 보관함</a>' +
    '<div id="cbk-reason-wrap" class="cbk-reason-wrap"' + (reasonOpen ? "" : " hidden") + ">" +
      '<textarea id="cbk-reason" class="cbk-reason" ' +
        'placeholder="왜 이렇게 평가했나요? — 이 이유가 나중에 취향 학습에 쓰입니다."></textarea>' +
      '<div class="cbk-note-hint">평가 이유 · 자동 저장됨</div>' +
    "</div>";

  var header = document.querySelector("header");
  if (header && header.parentNode) header.parentNode.insertBefore(bar, header.nextSibling);
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
      '<span class="cbk-note-title">📝 메모</span>' +
      '<span id="cbk-note-status" class="cbk-status"></span>' +
      '<button type="button" id="cbk-note-close" class="cbk-note-close" ' +
        'aria-label="메모 닫기" title="닫기">✕</button>' +
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
  fab.innerHTML = '<span class="cbk-fab-icon">📝</span>' +
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
