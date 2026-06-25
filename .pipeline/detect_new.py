#!/usr/bin/env python3
"""Fetch the claude.com/blog index and print slugs NOT yet in seen.json (one per line)."""
import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SEEN = os.path.join(HERE, "seen.json")
INDEX_URL = "https://claude.com/blog"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def main():
    try:
        html = fetch(INDEX_URL)
    except Exception as e:
        print(f"ERROR fetching index: {e}", file=sys.stderr)
        sys.exit(2)

    slugs = sorted(set(re.findall(r'href="/blog/([a-z0-9][a-z0-9-]+)"', html)))
    slugs = [s for s in slugs if not s.startswith("category")]

    with open(SEEN) as f:
        seen = set(json.load(f)["slugs"])

    new = [s for s in slugs if s not in seen]
    for s in new:
        print(s)


if __name__ == "__main__":
    main()
