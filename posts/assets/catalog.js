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

  function dropCache() {
    try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
  }

  /* 캐시를 통째로 믿지 않는다. 한 칸이라도 null/비객체면 shape() 가 r.slug 에서
     던지고, 그러면 이 IIFE 가 통째로 죽어 CBK_POSTS·CBK_onCatalog·CBK_catalogReady 가
     전부 undefined 로 남는다. 죽는 지점이 refresh() 앞이라 나쁜 캐시를 갈아끼울
     기회조차 없다 — 사용자가 직접 localStorage 를 지우기 전까지 인덱스·보관함·
     레거시 79개 포스트의 사이드바가 영구히 빈 화면이 된다.
     그래서 의심스러우면 지우고 네트워크로 다시 채운다. */
  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      var good = Array.isArray(v);
      if (good) {
        for (var i = 0; i < v.length; i++) {
          if (!v[i] || typeof v[i] !== "object" || !v[i].slug) { good = false; break; }
        }
      }
      if (!good) { dropCache(); return null; }
      return v;
    } catch (e) { dropCache(); return null; }
  }
  function writeCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(POSTS)); } catch (e) {}
  }

  /* 빈 화면 + 아무 설명 없음을 막는다. 캐시가 한 건이라도 있으면 사이트는 그걸로
     정상 동작하므로 배너를 띄우지 않는다 — 정말 아무것도 못 그릴 때만 뜬다. */
  function setError(msg) {
    window.CBK_CATALOG_ERROR = msg || "";
    var el = document.getElementById("cbk-catalog-error");
    if (!msg || POSTS.length) {
      if (el && el.parentNode) el.parentNode.removeChild(el);
      return;
    }
    if (!document.body) return;
    if (!el) {
      el = document.createElement("p");
      el.id = "cbk-catalog-error";
      el.setAttribute("role", "status");
      el.style.cssText = "margin:16px 0;padding:12px 14px;border:1px solid #e6d9c8;" +
        "border-radius:8px;background:#fdf8f2;color:#8a5a3b;font-size:14px;line-height:1.6;";
      document.body.insertBefore(el, document.body.firstChild);
    }
    el.textContent = msg;
  }

  /* 성공이든 실패든 구독자를 정확히 한 번은 깨운다.
     실패 경로에서 notify() 를 빼먹으면 콜드 스타트(네트워크 장애 또는 DB 가 아직
     비어 있는 지금 상태)에서 render() 가 아예 호출되지 않아 안내조차 없는
     백지 화면이 된다. 캐시로 이미 한 번 그렸다면(painted) 다시 알릴 것이 없으므로
     중복 렌더도 하지 않는다. */
  function settle(msg) {
    var painted = loaded;
    loaded = true;
    setError(msg || "");
    if (!painted || !msg) notify();
  }

  var cached = readCache();
  if (cached && cached.length) { fill(cached.map(shape)); loaded = true; }

  function refresh() {
    var c = cfg();
    if (!c.url || !c.key) {
      settle("동기화 설정이 없어 글 목록을 불러올 수 없습니다.");
      return Promise.resolve(POSTS);
    }
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
      writeCache();
      settle("");
      return POSTS;
    }).catch(function () {
      // 오프라인/장애: 캐시가 있으면 그걸로 계속 가고, 아무것도 없으면 안내를 띄운다.
      settle("글 목록을 불러오지 못했습니다. 연결을 확인한 뒤 새로고침해 주세요.");
      return POSTS;
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
