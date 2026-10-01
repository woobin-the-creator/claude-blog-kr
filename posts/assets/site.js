/* 사이트 공용 동작: 테마 토글 + 좁은 화면 메뉴.
 *
 * 테마: <html data-theme="light|dark"> 가 있으면 그 값을, 없으면 시스템 설정을 따른다.
 * 저장 키는 localStorage["cbk:theme"]. 토글은 "지금 보이는 테마의 반대"로 바꾸고,
 * 그 결과가 시스템 설정과 같으면 저장값을 지워 다시 시스템을 따르게 한다.
 * 각 페이지 <head> 의 인라인 스크립트가 같은 키를 먼저 읽어 첫 화면 깜빡임을 막는다.
 *
 * 레거시 정적 글(posts/*.html)에는 head 스크립트가 없으므로 nav.js 가 이 파일을 주입한다.
 * 그래서 이 파일은 두 번 로드돼도 안전해야 한다(window.CBK_site 가드).
 */
(function () {
  if (window.CBK_site) return;
  var KEY = "cbk:theme";
  var root = document.documentElement;

  var mem = null;   // 저장이 막힌 환경(사생활 보호 모드)에서 이번 화면 동안만 기억
  function stored() {
    if (mem !== null) return mem;
    try { var v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : ""; }
    catch (e) { return ""; }
  }
  function systemDark() {
    try { return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches); }
    catch (e) { return false; }
  }
  function effective() {
    var s = stored();
    return s || (systemDark() ? "dark" : "light");
  }
  function apply(v) {
    if (v === "light" || v === "dark") root.setAttribute("data-theme", v);
    else root.removeAttribute("data-theme");
  }
  function paint() {
    var cur = effective();
    var next = cur === "dark" ? "라이트" : "다크";
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-label", next + " 모드로 전환");
      btns[i].setAttribute("title", next + " 모드로 전환");
      btns[i].setAttribute("data-mode", cur);
    }
  }
  function toggle() {
    var want = effective() === "dark" ? "light" : "dark";
    var v = want === (systemDark() ? "dark" : "light") ? "" : want;
    try {
      if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY);
      mem = null;
    } catch (e) { mem = v; }
    apply(v);
    paint();
  }

  apply(stored());

  /* ---------- 좁은 화면 메뉴 ---------- */
  function closeMenus(except) {
    var open = document.querySelectorAll(".site-header.menu-open");
    for (var i = 0; i < open.length; i++) {
      if (open[i] === except) continue;
      open[i].classList.remove("menu-open");
      var b = open[i].querySelector("[data-menu-toggle]");
      if (b) b.setAttribute("aria-expanded", "false");
    }
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest("[data-theme-toggle]")) { toggle(); return; }
    var mb = t.closest("[data-menu-toggle]");
    if (mb) {
      var head = mb.closest(".site-header");
      if (!head) return;
      var open = !head.classList.contains("menu-open");
      closeMenus(head);
      head.classList.toggle("menu-open", open);
      mb.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }
    if (!t.closest(".site-header")) closeMenus(null);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenus(null);
  });

  // 시스템 설정이 바뀌면(저장값이 없을 때) 버튼 라벨만 다시 그린다. CSS 는 알아서 따라간다.
  try {
    var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (mq && mq.addEventListener) mq.addEventListener("change", paint);
  } catch (e) {}

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();

  window.CBK_site = { theme: effective, toggleTheme: toggle, paint: paint };
})();
