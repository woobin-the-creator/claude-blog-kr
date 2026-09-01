/* 포스트 한 건을 DB에서 읽어 화면에 그린다. post.html 과 404.html 이 공유한다.
 *
 * 79개 이관 포스트가 서로 다른 <style> 을 쓰기 때문에 CSS 는 글마다 따로
 * 주입한다(cbk_posts.style_css). 공용 스타일시트로 합치면 대부분의 글이
 * 조용히 다르게 보이게 된다.
 */
(function () {
  function cfg() {
    var c = (typeof window !== "undefined" && window.CBK_CONFIG) || {};
    return { url: (c.supabaseUrl || "").replace(/\/+$/, ""), key: c.supabaseAnonKey || "" };
  }

  /* 경로 어디에 있든 슬러그를 찾아낸다:
     /post.html?slug=x  ·  /posts/x.html  ·  /<repo>/posts/x.html */
  function slugFromLocation() {
    var q = /[?&]slug=([^&#]+)/.exec(location.search);
    if (q) return decodeURIComponent(q[1]).replace(/\.html$/, "");
    var m = /\/posts\/([^\/?#]+?)(?:\.html)?$/.exec(location.pathname);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function fail(msg) {
    var e = document.getElementById("post-error");
    if (e) { e.textContent = msg; e.hidden = false; }
    var b = document.getElementById("post-body");
    if (b) b.innerHTML = "";
  }

  var slug = slugFromLocation();
  if (!slug) { fail("글을 찾을 수 없습니다."); return; }

  var c = cfg();
  if (!c.url || !c.key) { fail("동기화 설정이 없어 글을 불러올 수 없습니다."); return; }

  fetch(c.url + "/rest/v1/rpc/cbk_post_get", {
    method: "POST",
    headers: {
      "apikey": c.key,
      "Authorization": "Bearer " + c.key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ p_slug: slug })
  }).then(function (r) {
    if (!r.ok) throw new Error("cbk_post_get " + r.status);
    return r.json();
  }).then(function (rows) {
    var p = (rows || [])[0];
    if (!p) { fail("글을 찾을 수 없습니다: " + slug); return; }

    var st = document.getElementById("post-style");
    if (st) st.textContent = p.style_css || "";

    var body = document.getElementById("post-body");
    if (body) body.innerHTML = p.body_html || "";

    document.title = p.title || slug;
    document.documentElement.setAttribute("data-slug", p.slug);
    window.CBK_CURRENT_POST = p;

    var err = document.getElementById("post-error");
    if (err) err.hidden = true;

    /* 사이드바·평가바는 본문이 DOM 에 들어온 뒤에 붙어야 한다. */
    ["assets/store.js", "assets/catalog.js", "assets/nav.js", "assets/nav-mobile.js"]
      .forEach(function (rel) {
        var s = document.createElement("script");
        s.src = (window.CBK_ASSET_BASE || "posts/") + rel;
        s.async = false;
        document.body.appendChild(s);
      });
    document.dispatchEvent(new CustomEvent("cbk:post-rendered", { detail: p }));
  }).catch(function (e) {
    fail("글을 불러오지 못했습니다: " + e.message);
  });
})();
