-- smart-reports 글 본문 앞에 다른 글(message-threads) 머리말 조각과 두 번째 <body>가
-- 섞여 들어간 채로 이관됐다. 조각이 남아 있을 때만 첫 "<body>\n" 앞을 잘라낸다.
update public.cbk_posts
set body_html = substring(body_html from position(E'<body>\n' in body_html) + 7),
    updated_at = now()
where slug = 'smart-reports-surveys-pooled-budgets'
  and body_html like E'<header>\n  <h1>메시지 스레드로%';
