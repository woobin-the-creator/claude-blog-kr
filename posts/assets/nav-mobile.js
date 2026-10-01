/* 전체 글 서랍(drawer) 토글.
 *
 * nav.js 와 일부러 분리돼 있다: 이미 만들어진 #site-nav 와 그 안의 <ul> 만 읽고,
 * 헤더 오른쪽(.site-actions)에 "글 목록" 버튼을 넣은 뒤 .nav-open 클래스만 뒤집는다.
 * 실제 보이기/숨기기는 nav.css 가 한다. nav.js 가 목록을 어떻게 만들든 그 뒤에 로드되면 안전하다.
 *
 * 닫는 방법: 버튼 다시 누르기 · Esc · 바깥(배경) 클릭 · 목록의 글 링크 클릭.
 *
 * Load order in each post: store.js → catalog.js → nav.js → nav-mobile.js
 */
(function () {
  var nav = document.getElementById("site-nav");
  if (!nav) return;
  var ul = nav.querySelector("ul");
  if (!ul) return;
  if (nav.querySelector(".nav-toggle")) return; // idempotent

  var drawer = nav.querySelector(".nav-drawer") || ul;
  if (!drawer.id) drawer.id = "site-nav-drawer";
  if (!ul.id) ul.id = "site-nav-list";

  var ICON_LIST = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h9"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>';

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-toggle btn small";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", drawer.id);

  var actions = nav.querySelector(".site-actions");
  if (actions) actions.insertBefore(btn, actions.firstChild);
  else ul.parentNode.insertBefore(btn, ul);

  function paint(open) {
    btn.innerHTML = (open ? ICON_CLOSE : ICON_LIST) +
      '<span class="nav-toggle-label">' + (open ? "닫기" : "글 목록") + "</span>";
  }

  function setOpen(open, restoreFocus) {
    nav.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-drawer-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    paint(open);
    if (open) {
      var active = ul.querySelector(".nav-link.active") || ul.querySelector("a");
      if (active) {
        if (active.scrollIntoView) active.scrollIntoView({ block: "center" });
        try { active.focus({ preventScroll: true }); } catch (e) { active.focus(); }
      }
    } else if (restoreFocus) {
      btn.focus();
    }
  }
  paint(false);

  btn.addEventListener("click", function () {
    setOpen(!nav.classList.contains("nav-open"), true);
  });

  // Tapping a post link navigates away anyway — collapse so the next page starts closed.
  ul.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false, false);
  });

  var backdrop = nav.querySelector(".nav-backdrop");
  if (backdrop) backdrop.addEventListener("click", function () { setOpen(false, true); });

  document.addEventListener("keydown", function (e) {
    if (!nav.classList.contains("nav-open")) return;
    if (e.key === "Escape") { setOpen(false, true); return; }
    // 서랍이 열려 있는 동안 Tab 은 서랍 안(과 닫기 버튼)에서만 돈다.
    if (e.key === "Tab") {
      var items = [btn].concat([].slice.call(drawer.querySelectorAll("a[href], button")));
      var first = items[0], last = items[items.length - 1];
      var inside = items.indexOf(document.activeElement) !== -1;
      if (!inside) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
