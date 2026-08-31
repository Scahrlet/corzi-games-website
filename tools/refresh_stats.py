"""
Pull current visit / favorite / concurrent-player counts for the portfolio.

    py tools/refresh_stats.py           # report only
    py tools/refresh_stats.py --write   # also patch assets/js/content.js

Without --write it just prints, so you can eyeball the numbers before they
go live. The daily GitHub Action runs it with --write.

A note on the concurrent-player figure: it's an instantaneous sample, not an
average, so it moves with time of day. The CI job samples at a fixed hour for
consistency, and the site footer shows the date the numbers were taken --
that's why the stat is labelled "Playing concurrently" rather than "right now".
"""

import argparse
import datetime
import io
import json
import re
import sys
import urllib.request

# universeId -> the `title` used in content.js
GAMES = {
    2970472544:  "Light Game",
    2032463184:  "World Defenders TD",
    10205485380: "Penalty Kicks!",
    8955905923:  "Fishing Chef",
    6928499048:  "Escape The Labryn - Shiloh & Bros",
}

API = "https://games.roblox.com/v1/games?universeIds="
CONTENT = "assets/js/content.js"

# Years since the Roblox account was created (2012-02-11).
JOINED = datetime.date(2012, 2, 11)


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


def human(n):
    """303711938 -> '303M+'   4479694 -> '4.5M+'   1751 -> '1.7K'"""
    if n >= 10_000_000:
        return f"{n // 1_000_000}M+"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M+"
    if n >= 10_000:
        return f"{n // 1_000}K+"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(n)


def patch(path, stats, today):
    """Rewrite the STATS values and statsUpdated date in content.js in place.

    Matches on the label text rather than array position, so reordering the
    stats strip by hand won't cause this to write the wrong number.
    """
    src = io.open(path, encoding="utf-8").read()
    before = src

    for label, value in stats:
        pattern = re.compile(
            r'(\{\s*value:\s*")[^"]*("\s*,\s*label:\s*"' + re.escape(label) + r'"\s*\})'
        )
        src, n = pattern.subn(lambda m: m.group(1) + value + m.group(2), src)
        if not n:
            print(f"  WARNING: no stat labelled {label!r} found; skipped", file=sys.stderr)

    src = re.sub(r'(statsUpdated:\s*")[^"]*(")', r"\g<1>" + today + r"\g<2>", src)

    if src == before:
        print("  content.js already current, nothing written")
        return False

    io.open(path, "w", encoding="utf-8", newline="\n").write(src)
    print(f"  wrote {path}")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true",
                    help="patch assets/js/content.js in place")
    args = ap.parse_args()

    data = get(API + ",".join(str(u) for u in GAMES))["data"]

    visits = favs = playing = 0
    rows = []
    for g in sorted(data, key=lambda g: -g["visits"]):
        visits += g["visits"]
        favs += g["favoritedCount"]
        playing += g["playing"]
        rows.append((GAMES.get(g["id"], g["name"]), g["visits"],
                     g["favoritedCount"], g["playing"]))

    print(f"{'GAME':36} {'VISITS':>14} {'FAVORITES':>11} {'PLAYING':>8}")
    print("-" * 73)
    for name, v, f, p in rows:
        print(f"{name:36} {v:>14,} {f:>11,} {p:>8,}")
    print("-" * 73)
    print(f"{'TOTAL':36} {visits:>14,} {favs:>11,} {playing:>8,}")

    today = datetime.date.today()
    years = (today - JOINED).days // 365

    stats = [
        ("Combined visits",      human(visits)),
        ("Playing concurrently", human(playing)),
        ("Favorites",            human(favs)),
        ("On platform",          f"{years}yr"),
    ]

    print("\nSTATS values:")
    for label, value in stats:
        print(f"  {value:>8}  {label}")

    print("\nPer-project `stat` values:")
    for name, v, _, _ in rows:
        print(f'  {name:36} stat: "{human(v)} visits",')

    if args.write:
        print()
        patch(CONTENT, stats, today.isoformat())
    else:
        print("\nRun again with --write to patch content.js.")
        print("Per-project `stat` values are always manual -- paste them yourself.")


if __name__ == "__main__":
    main()
