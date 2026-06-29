#!/usr/bin/env python3
"""Offline, deterministic tests for the TLDR feed pipeline (parser + feed.json store).

Parser runs against a committed fixture (tests/fixtures/tldr-tech-2026-06-26.html)
so it never hits the network. Store logic runs the feed_store.py CLI on temp files.

Run: python3 tests/feed_fetch_test.py   (exit 0 = all pass)
"""
import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PIPE = os.path.join(ROOT, ".pipeline")
FIXTURE = os.path.join(HERE, "fixtures", "tldr-tech-2026-06-26.html")

sys.path.insert(0, PIPE)
import feed_fetch  # noqa: E402

_pass = 0
_fail = 0


def ok(name, cond):
    global _pass, _fail
    if cond:
        _pass += 1
    else:
        _fail += 1
        print("  x FAIL:", name)


def eq(name, a, b):
    ok(f"{name} (got {a!r})", a == b)


# ---- parser ----
with open(FIXTURE, encoding="utf-8") as f:
    items = feed_fetch.parse(f.read())

ok("parses several items", len(items) >= 6)
ok("every item has a non-empty id", all(it["id"] for it in items))
ok("ids carry no query string", all("?" not in it["id"] for it in items))
ok("ids carry no anchor", all("#" not in it["id"] for it in items))
ok("titles strip '(N minute read)'", all("minute read" not in it["title_en"].lower() for it in items))
ok("read_min is int or None", all(it["read_min"] is None or isinstance(it["read_min"], int) for it in items))
ok("no duplicate ids", len({it["id"] for it in items}) == len(items))
ok("at least one section assigned", any(it["section"] for it in items))

apple = next((it for it in items if "Apple Raises Prices" in it["title_en"]), None)
ok("known Apple item parsed", apple is not None)
if apple:
    eq("apple title clean", apple["title_en"],
       "Apple Raises Prices on Macs, iPads by $200 or More on Some Models")
    eq("apple read_min", apple["read_min"], 5)
    eq("apple section", apple["section"], "Big Tech & Startups")
    ok("apple summary non-empty", len(apple["summary_en"]) > 20)
    ok("apple id has no query", "?" not in apple["id"])

# entity decoding: fixture contains &#x27; / &amp; — none should leak through
ok("entities decoded (no &#x27;)", all("&#" not in it["title_en"] and "&#" not in it["summary_en"] for it in items))

# normalize_url unit
eq("normalize drops query+slash", feed_fetch.normalize_url("https://x.com/a/?utm_source=tldr"), "https://x.com/a")
eq("normalize drops anchor", feed_fetch.normalize_url("https://x.com/a#top"), "https://x.com/a")


# ---- store: new + merge via CLI ----
def write(tmp, name, obj):
    p = os.path.join(tmp, name)
    with open(p, "w", encoding="utf-8") as fh:
        json.dump(obj, fh)
    return p


def run_store(*args):
    return subprocess.run(
        [sys.executable, os.path.join(PIPE, "feed_store.py"), *args],
        capture_output=True, text=True,
    )


with tempfile.TemporaryDirectory() as tmp:
    feed = write(tmp, "feed.json", [{"id": "https://have.com/1", "title_ko": "있음"}])
    raw = write(tmp, "raw.json", [
        {"id": "https://have.com/1", "title_en": "dup"},
        {"id": "https://new.com/2", "title_en": "fresh A"},
        {"id": "https://new.com/3", "title_en": "fresh B"},
    ])
    r = run_store("new", feed, raw)
    fresh = json.loads(r.stdout)
    eq("new() returns only unseen items", sorted(i["id"] for i in fresh),
       ["https://new.com/2", "https://new.com/3"])

    # merge translated items
    translated = write(tmp, "tr.json", [
        {"id": "https://new.com/2", "url": "https://new.com/2?utm=1", "issue": "2026-06-29",
         "section": "Sci", "title_en": "fresh A", "title_ko": "신선 A",
         "summary_en": "eng", "summary_ko": "한글", "read_min": 4},
        {"id": "https://new.com/3", "issue": "2026-06-29", "title_en": "fresh B"},  # no _ko
    ])
    r = run_store("merge", feed, translated, "2026-06-29T23:00:00.000Z")
    eq("merge reports 2 added", r.stdout.strip(), "2")

    with open(feed, encoding="utf-8") as fh:
        merged = json.load(fh)
    eq("feed now has 3 items", len(merged), 3)
    eq("new items prepended (newest first)", merged[0]["id"], "https://new.com/2")
    ok("added_at stamped", merged[0]["added_at"] == "2026-06-29T23:00:00.000Z")
    eq("ko kept when present", merged[0]["title_ko"], "신선 A")
    eq("ko falls back to en when missing", merged[1]["title_ko"], "fresh B")
    eq("original item preserved at bottom", merged[2]["id"], "https://have.com/1")

    # idempotent: merging the same again adds nothing
    r2 = run_store("merge", feed, translated, "2026-06-30T00:00:00.000Z")
    eq("merge is idempotent by id", r2.stdout.strip(), "0")


print(f"\n=== feed pipeline (py): {_pass} passed, {_fail} failed ===")
sys.exit(1 if _fail else 0)
