/* 포스트 카탈로그 단일 소스. 예전 posts.js(손편집 배열)를 대체한다.
 *
 * stale-while-revalidate: localStorage 캐시를 동기로 먼저 읽어 즉시 그리고,
 * 그다음 cbk_posts_list() 로 갱신해 구독자에게 다시 알린다.
 * 그래서 Supabase 가 안 떠 있어도 사이트는 마지막으로 본 목록으로 동작한다.
 *
 * 소비자는 CBK_onCatalog(fn) 안에서 렌더해야 한다 — 그래야 캐시 페인트와
 * 네트워크 갱신 양쪽에서 화면이 맞는다.
 */
(function () {
  var CACHE_KEY = "cbk:catalog:v1";
  var POSTS = [];
  var subs = [];
  var loaded = false;

  function cfg() {
    var c = (typeof window !== "undefined" && window.CBK_CONFIG) || {};
    return { url: (c.supabaseUrl || "").replace(/\/+$/, ""), key: c.supabaseAnonKey || "" };
  }

  /* 서버 행 → 소비자가 기대하는 모양. file 은 기존 코드 호환용 파생 필드다. */
  function shape(r) {
    var slug = r.slug;
    return {
      file: slug + ".html",
      slug: slug,
      date: typeof r.date === "string" ? r.date.slice(0, 10) : r.date,
      main: r.main || "",
      cat: r.cat || "",
      title: r.title || "",
      nav: r.nav || r.title || "",
      author: r.author || "ai",
      rev: r.rev || 1
    };
  }

  /* 참조를 유지한 채 내용만 갈아끼운다 — var POSTS = window.CBK_POSTS 로
     받아둔 소비자가 계속 올바른 배열을 보게 하기 위해서다. */
  function fill(list) {
    POSTS.length = 0;
    for (var i = 0; i < list.length; i++) POSTS.push(list[i]);
    POSTS.sort(function (a, b) {
      if (a.date === b.date) return a.slug < b.slug ? -1 : 1;
      return a.date < b.date ? 1 : -1;          // 최신순
    });
  }

  function notify() {
    for (var i = 0; i < subs.length; i++) {
      try { subs[i](POSTS); } catch (e) {}
    }
  }

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      return Array.isArray(v) ? v : null;
    } catch (e) { return null; }
  }
  function writeCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(POSTS)); } catch (e) {}
  }

  var cached = readCache();
  if (cached && cached.length) { fill(cached.map(shape)); loaded = true; }

  function refresh() {
    var c = cfg();
    if (!c.url || !c.key) return Promise.resolve(POSTS);
    return fetch(c.url + "/rest/v1/rpc/cbk_posts_list", {
      method: "POST",
      headers: {
        "apikey": c.key,
        "Authorization": "Bearer " + c.key,
        "Content-Type": "application/json"
      },
      body: "{}"
    }).then(function (r) {
      if (!r.ok) throw new Error("cbk_posts_list " + r.status);
      return r.json();
    }).then(function (rows) {
      fill((rows || []).map(shape));
      loaded = true;
      writeCache();
      notify();
      return POSTS;
    }).catch(function () {
      return POSTS;                 // 오프라인/장애: 캐시로 계속 간다
    });
  }

  window.CBK_POSTS = POSTS;

  window.CBK_postBySlug = function (key) {
    if (!key) return null;
    var want = String(key).replace(/\.html$/, "");
    for (var i = 0; i < POSTS.length; i++) {
      if (POSTS[i].slug === want) return POSTS[i];
    }
    return null;
  };

  window.CBK_onCatalog = function (fn) {
    if (typeof fn !== "function") return;
    subs.push(fn);
    if (loaded) { try { fn(POSTS); } catch (e) {} }
  };

  window.CBK_currentSlug = function () {
    var q = /[?&]slug=([^&#]+)/.exec(location.search);
    if (q) return decodeURIComponent(q[1]).replace(/\.html$/, "");
    var last = location.pathname.split("/").pop() || "";
    return last.replace(/\.html$/, "");
  };

  window.CBK_catalogRefresh = refresh;
  window.CBK_catalogReady = refresh();
})();
