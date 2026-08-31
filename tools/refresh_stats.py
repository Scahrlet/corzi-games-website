"""
Pull current visit/favorite counts for the portfolio games.

    py tools/refresh_stats.py

Prints the live numbers plus ready-to-paste values for the STATS block
and each project's `stat` field in assets/js/content.js. It does NOT
edit content.js -- that stays a manual paste so you always see what
changed before it goes live.

Worth running the morning of RDC so the headline number is current.
"""

import json
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


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return json.loads(urllib.request.urlopen(req, timeout=30).read())


def human(n):
    """303711938 -> '303M+'   4479694 -> '4.4M+'   88123 -> '88K+'"""
    if n >= 100_000_000:
        return f"{n // 1_000_000}M+"
    if n >= 10_000_000:
        return f"{n // 1_000_000}M+"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M+"
    if n >= 1_000:
        return f"{n // 1_000}K+"
    return str(n)


def main():
    data = get(API + ",".join(str(u) for u in GAMES))["data"]

    total_visits = 0
    total_favs = 0
    playing = 0
    rows = []

    for g in sorted(data, key=lambda g: -g["visits"]):
        total_visits += g["visits"]
        total_favs += g["favoritedCount"]
        playing += g["playing"]
        rows.append((GAMES.get(g["id"], g["name"]), g["visits"],
                     g["favoritedCount"], g["playing"]))

    print(f"{'GAME':36} {'VISITS':>14} {'FAVORITES':>11} {'PLAYING':>8}")
    print("-" * 73)
    for name, v, f, p in rows:
        print(f"{name:36} {v:>14,} {f:>11,} {p:>8,}")
    print("-" * 73)
    print(f"{'TOTAL':36} {total_visits:>14,} {total_favs:>11,} {playing:>8,}")

    print("\n\nPaste into the STATS block in assets/js/content.js:\n")
    print("const STATS = [")
    print(f'  {{ value: "{human(total_visits)}", label: "Combined visits" }},')
    print(f'  {{ value: "{len(rows)}",{" " * (7 - len(str(len(rows))))}label: "Shipped titles" }},')
    print(f'  {{ value: "{human(total_favs)}", label: "Favorites" }},')
    print('  { value: "14yr",  label: "On platform" },')
    print("];")

    print("\n\nPer-project `stat` values:\n")
    for name, v, _, _ in rows:
        print(f'  {name:36} stat: "{human(v)} visits",')

    print("\nAlso update the hero `pitch` in content.js and the About section")
    print("in index.html if the headline number has moved.")


if __name__ == "__main__":
    main()
