/* Mobile sidebar toggle (hamburger).
 *
 * Decoupled from nav.js on purpose: this only reads the already-built #site-nav
 * and its <ul>, injects a toggle button, and flips a `.nav-open` class. All the
 * actual show/hide is done in nav.css media queries. Safe to load after nav.js
 * regardless of how nav.js builds the list.
 *
 * Load order in each post: store.js → posts.js → nav.js → nav-mobile.js
 */
(function () {
  var nav = document.getElementById("site-nav");
  if (!nav) return;
  var ul = nav.querySelector("ul");
  if (!ul) return;
  if (nav.querySelector(".nav-toggle")) return; // idempotent

  if (!ul.id) ul.id = "site-nav-list";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-toggle";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", ul.id);
  btn.innerHTML = "☰ 글 목록"; // ☰

  ul.parentNode.insertBefore(btn, ul);

  function setOpen(open) {
    nav.classList.toggle("nav-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.innerHTML = open ? "✕ 닫기" : "☰ 글 목록"; // ✕ / ☰
  }

  btn.addEventListener("click", function () {
    setOpen(!nav.classList.contains("nav-open"));
  });

  // Tapping a post link navigates away anyway — collapse so the next page starts closed.
  ul.addEventListener("click", function (e) {
    if (e.target.closest("a")) setOpen(false);
  });
})();
