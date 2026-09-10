(function () {
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  var kinds = {fact:'사실',logic:'논리',style:'문장'}, severities = {high:'높음',medium:'보통',low:'낮음'};
  function mount(el, opts) {
    if (!el || !opts.syncKey) { if (el) el.innerHTML=''; return {refresh:function(){}}; }
    var sequence = 0;
    function refresh() {
      var seq = ++sequence;
      el.setAttribute('aria-busy','true');
      if (!el.textContent) el.innerHTML='<div class="skeleton"></div><div class="skeleton"></div><p>리뷰를 불러오는 중…</p>';
      return Promise.all([opts.rpc('cbk_reviews_list',{p_key:opts.syncKey,p_slug:opts.slug || null}),opts.rpc('cbk_review_states',{p_key:opts.syncKey})]).then(function(result){
        if (seq !== sequence) return;
        var states=result[1] || [], rows=result[0] || [], versions={}, h='';
        states.forEach(function(p){
          versions[p.slug]=p.rev;
          if (opts.slug && p.slug !== opts.slug) return;
          if (p.review_status !== 'done') h += '<p>'+esc(p.title)+' · '+({pending:'첨삭 대기 중',running:'첨삭 중',error:'첨삭 실패'}[p.review_status] || '')+(p.review_status === 'error' ? ' <button type="button" data-retry="'+esc(p.slug)+'">재시도</button>' : '')+'</p>';
        });
        var open=rows.filter(function(r){return r.status === 'open';});
        h+='<p>열린 지적 '+open.length+'건'+(!open.length ? ' · 아직 지적이 없습니다.' : '')+'</p><ul class="rv-list">';
        open.forEach(function(r){
          h+='<li class="rv-item" data-review-id="'+esc(r.id)+'" data-kind="'+esc(r.kind)+'" data-severity="'+esc(r.severity)+'"><div class="rv-head"><span>'+esc(kinds[r.kind])+' · '+esc(severities[r.severity])+'</span> <a href="post.html?slug='+encodeURIComponent(r.post_slug)+'">'+esc(r.post_slug)+'</a><span>판본 '+esc(r.post_rev)+(versions[r.post_slug] !== undefined && r.post_rev !== versions[r.post_slug] ? ' · 이전 판본의 지적' : '')+'</span></div><blockquote class="rv-quote">'+esc(r.quote)+'</blockquote><p class="rv-comment">'+esc(r.comment)+'</p>'+(r.suggestion ? '<p class="rv-suggest">제안: '+esc(r.suggestion)+'</p>' : '')+'<div class="rv-acts"><button type="button" data-act="applied">반영함</button><button type="button" data-act="dismissed">무시</button><a href="write.html?slug='+encodeURIComponent(r.post_slug)+'">글 편집</a></div><p class="rv-error" role="alert"></p></li>';
        });
        el.innerHTML=h+'</ul>';
        el.querySelectorAll('[data-act]').forEach(function(b){b.addEventListener('click',function(){
          var li=b.closest('[data-review-id]'); li.querySelectorAll('button').forEach(function(v){v.disabled=true;});
          opts.rpc('cbk_review_set_status',{p_key:opts.syncKey,p_id:Number(li.getAttribute('data-review-id')),p_status:b.getAttribute('data-act')}).then(refresh).catch(function(){li.querySelector('.rv-error').textContent='저장하지 못했습니다. 다시 시도하세요.';li.querySelectorAll('button').forEach(function(v){v.disabled=false;});});
        });});
        el.querySelectorAll('[data-retry]').forEach(function(b){b.addEventListener('click',function(){b.disabled=true;opts.rpc('cbk_review_retry',{p_key:opts.syncKey,p_slug:b.getAttribute('data-retry')}).then(refresh).catch(function(){b.disabled=false;b.textContent='재시도 실패 · 다시 시도';});});});
      }).catch(function(){if(seq === sequence) el.innerHTML='<p role="alert">리뷰를 불러오지 못했습니다. 소유자 동기화 코드와 연결을 확인한 뒤 새로고침하세요.</p>';}).then(function(){if(seq === sequence) el.removeAttribute('aria-busy');});
    }
    refresh(); return {refresh:refresh};
  }
  window.CBK_reviews={mount:mount};
  document.addEventListener('cbk:post-rendered',function(e){
    var p=e.detail,key='',badge=document.getElementById('post-review-badge');
    try{key=localStorage.getItem('cbk:sync_key:v1') || '';}catch(ignore){}
    if (!badge || !key || !p || p.author !== 'me') return;
    var c=window.CBK_CONFIG || {};
    fetch(c.supabaseUrl+'/rest/v1/rpc/cbk_reviews_list',{method:'POST',headers:{apikey:c.supabaseAnonKey,Authorization:'Bearer '+c.supabaseAnonKey,'Content-Type':'application/json'},body:JSON.stringify({p_key:key,p_slug:p.slug})}).then(function(r){if(!r.ok)throw new Error();return r.json();}).then(function(rows){
      var n=rows.filter(function(r){return r.status==='open' && r.post_rev===p.rev;}).length;
      badge.innerHTML='<a href="write.html?slug='+encodeURIComponent(p.slug)+'">글 편집</a> · <a href="write.html?slug='+encodeURIComponent(p.slug)+'#review">AI 첨삭 '+({pending:'대기 중',running:'진행 중',error:'실패 · 재시도',done:n+'건'}[p.review_status] || '')+'</a>';badge.hidden=false;
    }).catch(function(){});
  });
})();
