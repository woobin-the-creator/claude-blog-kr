#!/usr/bin/env python3
"""Fetch a TLDR(tech) issue and emit its items as normalized JSON (pre-translation).

TLDR publishes every issue at a public URL: https://tldr.tech/tech/<YYYY-MM-DD>.
Item markup (verified 2026-06-26) is clean and regex-friendly:

  <section><header>...<h3 class="...font-bold">Section Name</h3></header>
    <article>
      <a class="font-bold" href="URL"><h3>Title (N minute read)</h3></a>
      <div class="newsletter-html">Summary text…</div>
    </article>
  </section>

Usage:
  feed_fetch.py <YYYY-MM-DD>     # fetch the live issue for that date
  feed_fetch.py --file <path>    # parse a local HTML file (for tests, offline)

Output: a JSON array on stdout. Empty array ([]) when there is no issue (404 /
network error) or the page carries no parseable items — so the caller can treat
"nothing to do" and "fetch failed" the same way: a no-op run.

Each item (translation + added_at are filled later by run-feed.sh):
  { id, url, issue, section, title_en, summary_en, read_min }
"""
import sys
import re
import json
import html as _html
import urllib.request

BASE = "https://tldr.tech/tech/"

# An item: <a class="font-bold" href="URL"><h3>Title</h3></a> + optional summary div.
ITEM_RE = re.compile(
    r'<a[^>]*class="[^"]*\bfont-bold\b[^"]*"[^>]*href="([^"]+)"[^>]*>\s*'
    r'<h3[^>]*>(.*?)</h3>\s*</a>'
    r'(?:\s*<div[^>]*class="[^"]*\bnewsletter-html\b[^"]*"[^>]*>(.*?)</div>)?',
    re.S,
)
# A section header: <h3 class="...font-bold...">Name</h3> (item titles use a bare <h3>).
SECTION_RE = re.compile(r'<h3[^>]*class="[^"]*\bfont-bold\b[^"]*"[^>]*>(.*?)</h3>', re.S)
READ_RE = re.compile(r'\s*\((\d+)\s*minute read\)\s*$', re.I)
GITHUB_RE = re.compile(r'\(github repo\)', re.I)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def clean_text(s):
    """Strip tags, unescape entities (&#x27; etc.), collapse whitespace."""
    s = re.sub(r"<[^>]+>", "", s or "")
    s = _html.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def normalize_url(url):
    """Stable dedup key: unescape, drop query (?utm_source=…) and #anchor, trim slash."""
    url = _html.unescape(url or "")
    url = url.split("#")[0].split("?")[0]
    return url.rstrip("/")


def parse(html_text):
    """Return the list of news items in document order (sponsors/CTAs excluded)."""
    sections = [(m.start(), clean_text(m.group(1))) for m in SECTION_RE.finditer(html_text)]

    def section_for(pos):
        name = ""
        for spos, sname in sections:
            if spos <= pos:
                name = sname
            else:
                break
        return name

    items = []
    seen = set()
    for m in ITEM_RE.finditer(html_text):
        url_raw, title_raw, summary_raw = m.group(1), m.group(2), m.group(3)
        title = clean_text(title_raw)
        # Keep only real stories: they carry a "(N minute read)" or "(GitHub Repo)"
        # marker. Sponsor/CTA links (e.g. "Get hired") don't, so they drop out.
        rm = READ_RE.search(title)
        is_github = bool(GITHUB_RE.search(title))
        if not rm and not is_github:
            continue
        url = normalize_url(url_raw)
        if not url or url in seen:
            continue
        seen.add(url)
        title_en = READ_RE.sub("", title)
        title_en = re.sub(r"\s*\(GitHub Repo\)\s*$", "", title_en, flags=re.I).strip()
        items.append({
            "id": url,
            "url": _html.unescape(url_raw),
            "section": section_for(m.start()),
            "title_en": title_en,
            "summary_en": clean_text(summary_raw),
            "read_min": int(rm.group(1)) if rm else None,
        })
    return items


def main():
    args = sys.argv[1:]
    issue = ""
    if len(args) >= 2 and args[0] == "--file":
        with open(args[1], encoding="utf-8") as f:
            html_text = f.read()
        m = re.search(r"(\d{4}-\d{2}-\d{2})", args[1])
        issue = m.group(1) if m else ""
    elif len(args) == 1 and re.match(r"^\d{4}-\d{2}-\d{2}$", args[0]):
        issue = args[0]
        try:
            html_text = fetch(BASE + issue)
        except Exception as e:  # 404 (no issue yet / weekend) or network error → no-op
            print("[]")
            print(f"feed_fetch: no issue for {issue} ({e})", file=sys.stderr)
            return
    else:
        print("usage: feed_fetch.py <YYYY-MM-DD> | --file <path>", file=sys.stderr)
        sys.exit(2)

    items = parse(html_text)
    for it in items:
        it["issue"] = issue
    print(json.dumps(items, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
