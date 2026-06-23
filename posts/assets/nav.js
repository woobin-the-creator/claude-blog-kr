/* Shared sidebar nav. Add a post = add one entry below (newest first). */
(function () {
  var POSTS = [
    { file: "the-full-claude-desktop-experience-on-aws-google-cloud-and-microsoft-foundry.html", title: "완전한 Claude Desktop 경험", date: "2026-06-22" },
    { file: "steering-claude-code.html",          title: "Claude Code 길들이기",          date: "2026-06-18" },
    { file: "build-day-hackathon-winners.html",   title: "Opus 4.8 빌드 데이 해커톤",       date: "2026-06-17" },
    { file: "opus-4-7-hackathon-winners.html",    title: "Built with Opus 4.7 해커톤",     date: "2026-06-15" },
    { file: "opus-4-6-hackathon-winners.html",    title: "Built with Opus 4.6 해커톤",     date: "2026-04-20" }
  ];

  var current = location.pathname.split("/").pop();

  var items = POSTS.map(function (p) {
    var active = p.file === current ? " active" : "";
    return (
      '<li><a class="nav-link' + active + '" href="' + p.file + '">' +
        p.title +
        '<span class="nav-date">' + p.date + "</span>" +
      "</a></li>"
    );
  }).join("");

  var nav = document.createElement("nav");
  nav.id = "site-nav";
  nav.innerHTML =
    '<a class="nav-brand" href="../index.html">Claude 블로그 한글 번역</a>' +
    '<a class="nav-home" href="../index.html">← 메인으로</a>' +
    '<div class="nav-heading">다른 글</div>' +
    "<ul>" + items + "</ul>";

  document.body.insertBefore(nav, document.body.firstChild);
})();
