(function () {
  var key = window.CBK && window.CBK.sync ? window.CBK.sync.getKey() : '';
  var ids = ['slug','title','nav','main','cat','date','body'], fields = {}, msg = document.getElementById('w-msg');
  var btn = document.getElementById('w-publish'), loading = document.getElementById('w-loading');
  var match = /[?&]slug=([^&#]+)/.exec(location.search), slug = match ? decodeURIComponent(match[1]) : '';
  var rev = 0, ready = !slug, saving = false, draftKey = 'cbk:draft:v1' + (slug ? ':' + slug : '');
  if (!slug && /[?&]new=1(?:&|$)/.test(location.search)) {
    try { var previous = localStorage.getItem(draftKey); if (previous) { localStorage.setItem(draftKey + ':previous', previous); localStorage.removeItem(draftKey); } } catch (ignore) {}
    history.replaceState(null,'','write.html');
  }
  ids.forEach(function (id) { fields[id] = document.getElementById('w-' + id); });
  function message(text, cls) { msg.textContent = text; msg.className = cls || ''; }
  function rpc(fn, body) {
    var c = window.CBK_CONFIG || {};
    return fetch(String(c.supabaseUrl || '').replace(/\/+$/, '') + '/rest/v1/rpc/' + fn, {
      method:'POST', headers:{ apikey:c.supabaseAnonKey, Authorization:'Bearer ' + c.supabaseAnonKey, 'Content-Type':'application/json' }, body:JSON.stringify(body)
    }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t); }); return r.status === 204 ? null : r.json(); });
  }
  function snapshot() { var d = { rev:rev }; ids.forEach(function (id) { d[id] = fields[id].value; }); return d; }
  function preview() { document.getElementById('w-preview').innerHTML = window.CBK_md(fields.body.value); }
  function saveDraft() {
    preview();
    if (!ready) return;
    try { localStorage.setItem(draftKey, JSON.stringify(snapshot())); } catch (e) { message('임시 저장에 실패했습니다. 본문을 별도로 보관하세요.', 'err'); }
  }
  function restore() {
    try {
      var d = JSON.parse(localStorage.getItem(draftKey) || 'null');
      if (d) {
        if (slug && d.rev !== rev) {
          message('다른 기기에서 수정된 글입니다. 이전 임시 글을 내려받아 비교한 뒤 최신 글에서 계속하세요. ', 'err');
          var download = document.createElement('a'); download.textContent = '임시 글 내려받기'; download.download = slug + '-draft.json'; download.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(d,null,2)); msg.appendChild(download);
          var resume = document.createElement('button'); resume.type='button'; resume.textContent='최신 글에서 계속';
          resume.addEventListener('click',function(){try{localStorage.setItem(draftKey+':conflict',JSON.stringify(d));localStorage.removeItem(draftKey);}catch(e){return;}ready=true;btn.disabled=false;message('최신 글을 불러왔습니다. 이전 임시 글은 별도로 보관했습니다.');preview();});msg.appendChild(resume);
          ready = false; preview(); return;
        }
        ids.forEach(function (id) { if (typeof d[id] === 'string') fields[id].value = d[id]; });
      }
    } catch (e) { message('임시 글을 읽지 못했습니다.', 'err'); }
    preview();
  }
  var now = new Date(); fields.date.value = now.getFullYear() + '-' + ('0' + (now.getMonth()+1)).slice(-2) + '-' + ('0'+now.getDate()).slice(-2);
  ids.forEach(function (id) { fields[id].addEventListener('input', saveDraft); });
  var panel;
  function tab(name) {
    document.querySelectorAll('[data-tab]').forEach(function (b) { var on = b.getAttribute('data-tab') === name; b.classList.toggle('on',on); b.setAttribute('aria-selected',String(on)); b.tabIndex = on ? 0 : -1; });
    document.getElementById('tab-edit').hidden = name !== 'edit'; document.getElementById('tab-review').hidden = name !== 'review';
    if (name === 'review' && panel) panel.refresh();
  }
  document.querySelectorAll('[data-tab]').forEach(function (b) {
    b.addEventListener('click', function () { tab(b.getAttribute('data-tab')); });
    b.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); var other = b.getAttribute('data-tab') === 'edit' ? 'review' : 'edit'; tab(other); document.querySelector('[data-tab="' + other + '"]').focus(); } });
  });
  if (!key) { btn.disabled = true; message('동기화 코드가 없습니다. 보관함에서 먼저 설정하세요.', 'err'); restore(); return; }
  panel = window.CBK_reviews && window.CBK_reviews.mount(document.getElementById('review-list'), { slug:slug || null, syncKey:key, rpc:rpc });
  document.getElementById('rv-refresh').addEventListener('click', function () { if (panel) panel.refresh(); });
  if (location.hash === '#review') tab('review');
  if (slug) {
    ready = false; btn.disabled = true; loading.hidden = false;
    rpc('cbk_post_get', {p_slug:slug}).then(function (rows) {
      var p = rows && rows[0];
      if (!p) throw new Error('글을 찾을 수 없습니다.');
      if (p.author !== 'me' || p.body_md === null) throw new Error('번역 글은 웹에서 편집할 수 없습니다.');
      ids.forEach(function (id) { fields[id].value = id === 'body' ? p.body_md : p[id] || ''; });
      fields.slug.readOnly = true; rev = p.rev; ready = true; btn.textContent = '수정 발행'; restore(); btn.disabled = !ready;
    }).catch(function (e) { message(e.message, 'err'); }).then(function () { loading.hidden = true; });
  } else { restore(); }
  btn.addEventListener('click', function () {
    if (!ready || saving) return;
    var d = snapshot();
    if (!/^[a-z0-9][a-z0-9-]{0,120}$/.test(d.slug)) { message('슬러그는 영문 소문자·숫자·하이픈만 쓸 수 있습니다.', 'err'); return; }
    if (!d.title.trim() || !d.body.trim() || !fields.date.checkValidity() || !d.date) { message('제목·본문·날짜를 입력하세요.', 'err'); return; }
    saving = true; btn.disabled = true; fields.slug.readOnly = true; message('발행 중…');
    rpc('cbk_post_save', {p_key:key,p_slug:d.slug,p_title:d.title.trim(),p_nav:d.nav || d.title,p_main:d.main,p_cat:d.cat,p_date:d.date,p_body_html:window.CBK_md(d.body),p_body_md:d.body,p_expected_rev:rev}).then(function (p) {
      rev = p.rev; fields.slug.readOnly = true;
      if (!slug) { slug = d.slug; history.replaceState(null,'','write.html?slug=' + encodeURIComponent(slug)); }
      var unchanged = ids.every(function (id) { return fields[id].value === d[id]; });
      try { localStorage.removeItem(draftKey); draftKey = 'cbk:draft:v1:' + slug; if (!unchanged) saveDraft(); } catch (e) {}
      message(unchanged ? '발행됐습니다 · ' : '발행됐습니다. 발행 중 추가 수정한 내용은 임시 저장했습니다 · ', 'ok');
      var a = document.createElement('a'); a.href = 'post.html?slug=' + encodeURIComponent(slug); a.textContent = '글 보기'; msg.appendChild(a);
      btn.textContent = '수정 발행';
      if (window.CBK_catalogRefresh) window.CBK_catalogRefresh();
    }).catch(function (e) {
      message(/not the owner/.test(e.message) ? '이 사이트의 소유자 키가 아닙니다.' : /revision conflict|already exists/.test(e.message) ? '다른 기기에서 수정됐거나 이미 사용 중인 주소입니다. 임시 글은 보관했습니다. 새로고침해 확인하세요.' : '발행 실패: ' + e.message, 'err');
    }).then(function () { saving = false; btn.disabled = !ready; fields.slug.readOnly = !!slug; });
  });
})();
