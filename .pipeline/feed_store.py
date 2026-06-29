#!/usr/bin/env python3
"""feed.json bookkeeping for the TLDR feed pipeline (deterministic, no LLM).

Subcommands:
  feed_store.py new <feed.json> <raw.json>
      Print (JSON array) the items in raw.json whose `id` is not already in
      feed.json — i.e. the genuinely new items to translate. Dedup by `id`.

  feed_store.py merge <feed.json> <translated.json> <added_at_iso>
      Prepend the translated items (newest first) to feed.json, stamping each
      with `added_at`. Items already present (by `id`) are skipped. Writes
      feed.json in place and prints how many were added.

Translation is defensive: if an item lacks `title_ko`/`summary_ko` (the LLM step
failed or returned partial output), fall back to the English text so the feed is
never left blank and the pipeline never hard-fails.
"""
import sys
import json


def load(path):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else []
    except FileNotFoundError:
        return []


def ids(feed):
    return {it.get("id") for it in feed if isinstance(it, dict)}


def cmd_new(feed_path, raw_path):
    have = ids(load(feed_path))
    raw = load(raw_path)
    fresh = [it for it in raw if isinstance(it, dict) and it.get("id") and it["id"] not in have]
    print(json.dumps(fresh, ensure_ascii=False, indent=2))


def cmd_merge(feed_path, translated_path, added_at):
    feed = load(feed_path)
    have = ids(feed)
    translated = load(translated_path)

    added = []
    for it in translated:
        if not isinstance(it, dict):
            continue
        _id = it.get("id")
        if not _id or _id in have:
            continue
        have.add(_id)
        added.append({
            "id": _id,
            "url": it.get("url", _id),
            "issue": it.get("issue", ""),
            "section": it.get("section", ""),
            "title_en": it.get("title_en", ""),
            "title_ko": (it.get("title_ko") or it.get("title_en") or "").strip(),
            "summary_en": it.get("summary_en", ""),
            "summary_ko": (it.get("summary_ko") or it.get("summary_en") or "").strip(),
            "read_min": it.get("read_min"),
            "added_at": added_at,
        })

    # newest first: new items on top, preserving their in-issue order.
    merged = added + feed
    with open(feed_path, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(len(added))


def main():
    a = sys.argv[1:]
    if len(a) == 3 and a[0] == "new":
        cmd_new(a[1], a[2])
    elif len(a) == 4 and a[0] == "merge":
        cmd_merge(a[1], a[2], a[3])
    else:
        print(__doc__, file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
