#!/usr/bin/env python3
"""Add a slug to seen.json so it isn't translated again. Usage: mark_seen.py <slug>"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SEEN = os.path.join(HERE, "seen.json")


def main():
    if len(sys.argv) != 2:
        print("usage: mark_seen.py <slug>", file=sys.stderr)
        sys.exit(1)
    slug = sys.argv[1]
    with open(SEEN) as f:
        data = json.load(f)
    if slug not in data["slugs"]:
        data["slugs"].append(slug)
        data["slugs"].sort()
        with open(SEEN, "w") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"marked seen: {slug}")
    else:
        print(f"already seen: {slug}")


if __name__ == "__main__":
    main()
