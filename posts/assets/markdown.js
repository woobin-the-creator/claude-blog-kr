/* 작은 블록 파서. 원문 HTML과 URL을 분리해 검증한 뒤 렌더한다. */
(function () {
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function safe(url) { return /^(https?:\/\/|mailto:|#|\/(?!\/)|\.\.?\/)/i.test(url) && !/[\u0000-\u0020]/.test(url); }
  function inline(src) {
    var out = '', re = /`([^`]+)`|!\[([^\]]*)\]\(([^\s)]+)\)|\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g, m, at = 0;
    while ((m = re.exec(src))) {
      out += esc(src.slice(at, m.index));
      if (m[1] !== undefined) out += '<code>' + esc(m[1]) + '</code>';
      else if (m[3] !== undefined) out += safe(m[3]) && /^https?:|^\.?\.?\//i.test(m[3]) ? '<img src="' + esc(m[3]) + '" alt="' + esc(m[2]) + '">' : esc(m[0]);
      else if (m[5] !== undefined) out += safe(m[5]) ? '<a href="' + esc(m[5]) + '">' + esc(m[4]) + '</a>' : esc(m[0]);
      else if (m[6] !== undefined) out += '<strong>' + esc(m[6]) + '</strong>';
      else out += '<em>' + esc(m[7]) + '</em>';
      at = re.lastIndex;
    }
    return out + esc(src.slice(at));
  }
  window.CBK_md = function render(src) {
    var lines = String(src || '').replace(/\r\n?/g, '\n').split('\n'), out = [], i = 0;
    function block(s) { return /^\s*$|^```|^#{1,6}\s|^\s*>|^\s*[-*+]\s|^\s*\d+[.)]\s|^\s*(---|\*\*\*|___)\s*$/.test(s); }
    while (i < lines.length) {
      var ln = lines[i], m, parts = [], tag;
      if (/^\s*$/.test(ln)) { i++; continue; }
      if (/^```/.test(ln)) {
        i++; while (i < lines.length && !/^```\s*$/.test(lines[i])) parts.push(lines[i++]);
        if (i < lines.length) i++;
        out.push('<pre><code>' + esc(parts.join('\n') + '\n') + '</code></pre>'); continue;
      }
      if (/^\s*(---|\*\*\*|___)\s*$/.test(ln)) { out.push('<hr>'); i++; continue; }
      m = /^(#{1,6})\s+(.*)$/.exec(ln);
      if (m) { out.push('<h' + m[1].length + '>' + inline(m[2]) + '</h' + m[1].length + '>'); i++; continue; }
      if (/^\s*>/.test(ln)) {
        while (i < lines.length && /^\s*>/.test(lines[i])) parts.push(lines[i++].replace(/^\s*>\s?/, ''));
        out.push('<blockquote>' + render(parts.join('\n')) + '</blockquote>'); continue;
      }
      tag = /^\s*[-*+]\s/.test(ln) ? 'ul' : /^\s*\d+[.)]\s/.test(ln) ? 'ol' : '';
      if (tag) {
        var pattern = tag === 'ul' ? /^\s*[-*+]\s+/ : /^\s*\d+[.)]\s+/;
        while (i < lines.length && pattern.test(lines[i])) parts.push('<li>' + inline(lines[i++].replace(pattern, '')) + '</li>');
        out.push('<' + tag + '>' + parts.join('') + '</' + tag + '>'); continue;
      }
      parts.push(ln); i++;
      while (i < lines.length && !block(lines[i])) parts.push(lines[i++]);
      out.push('<p>' + inline(parts.join('\n')) + '</p>');
    }
    return out.join('');
  };
})();
