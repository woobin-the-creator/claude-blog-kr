#!/usr/bin/env python3
"""Print posts not yet translated, one per line as "<url>\t<category>".

Sources:
- claude.com/blog: slugs on the index page that are not in seen.json. The
  category is left empty; the translator reads it from the page.
- claude.dev: posts in its RSS feed whose slug is not in the catalog
  (posts/assets/posts.js). seen.json was seeded with claude.com slugs that were
  never translated, and some of those match claude.dev slugs, so it can't be
  used here. The same article cross-posted on both sites shares a slug.
"""
import json
import os
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
SEEN = os.path.join(HERE, "seen.json")
CATALOG = os.path.join(HERE, "..", "posts", "assets", "posts.js")
BLOG_INDEX = "https://claude.com/blog"
DEV_RSS = "https://claude.dev/rss.xml"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def claude_blog(seen):
    html = fetch(BLOG_INDEX)
    slugs = sorted(set(re.findall(r'href="/blog/([a-z0-9][a-z0-9-]+)"', html)))
    return [(f"{BLOG_INDEX}/{s}", "") for s in slugs
            if not s.startswith("category") and s not in seen]


def claude_dev(catalog):
    out = []
    for item in ET.fromstring(fetch(DEV_RSS)).iter("item"):
        url = (item.findtext("link") or "").strip().rstrip("/")
        m = re.fullmatch(r"https://claude\.dev/blog/([a-z0-9][a-z0-9-]+)", url)
        if m and m.group(1) not in catalog:
            out.append((url, (item.findtext("category") or "").strip()))
    return out


def main():
    with open(SEEN) as f:
        seen = set(json.load(f)["slugs"])
    with open(CATALOG) as f:
        catalog = set(re.findall(r'file: "([^"]+)\.html"', f.read()))

    # One source failing must not hide the other's new posts. claude.dev goes
    # first so a post listed on both sites is taken from there (it carries the
    # category), and the claude.com copy of the same slug is dropped.
    printed = set()
    for name, source, arg in (("claude.dev", claude_dev, catalog),
                              ("claude.com/blog", claude_blog, seen)):
        try:
            for url, cat in source(arg):
                slug = url.rsplit("/", 1)[-1]
                if slug not in printed:
                    printed.add(slug)
                    print(f"{url}\t{cat}")
        except Exception as e:
            print(f"ERROR fetching {name}: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
