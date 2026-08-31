"""
Generate Corzi Games QR codes for print and screen.

    py -m pip install segno
    py tools/make_qr.py

Outputs land in qr/. Everything is vector (SVG) so it prints crisply at
any size -- hand the SVG to your business-card printer, not the PNG.

Design notes:
  * Error correction is set to H (~30% recoverable), which is what makes
    it safe to punch the ring logo into the middle.
  * The LIGHT versions (dark modules on a white panel) are the ones to
    print. Inverted QR codes -- light modules on dark -- are legal per
    spec but a meaningful minority of scanner apps fail on them, so the
    dark variant is for on-screen use only.
"""

import segno

URL = "https://corzigames.com"

PINK = "#ff1b6e"
CYAN = "#1fe3e3"

BORDER = 4          # quiet zone, in modules. 4 is the spec minimum -- don't shrink it.
LOGO_FRACTION = 0.22  # share of the QR width the centre logo covers


def matrix(url):
    """Return the QR as a list of rows of 0/1, quiet zone included."""
    qr = segno.make(url, error="h")
    rows = [list(row) for row in qr.matrix]
    n = len(rows)
    size = n + BORDER * 2
    grid = [[0] * size for _ in range(size)]
    for y in range(n):
        for x in range(n):
            grid[y + BORDER][x + BORDER] = rows[y][x]
    return grid, size


def runs(grid, size, skip=None):
    """Merge horizontally-adjacent dark modules into single rects.

    Keeps the SVG small and avoids hairline seams between rects when a
    printer or renderer antialiases.
    """
    out = []
    for y in range(size):
        x = 0
        while x < size:
            if grid[y][x] and not (skip and skip(x, y)):
                start = x
                while x < size and grid[y][x] and not (skip and skip(x, y)):
                    x += 1
                out.append((start, y, x - start))
            else:
                x += 1
    return out


def logo_hole(size):
    """Square region (in modules) blanked out for the centre logo."""
    side = round(size * LOGO_FRACTION)
    if side % 2 != size % 2:
        side += 1                     # keep it symmetric about the centre
    lo = (size - side) // 2
    return lo, lo + side


def ring_mark(cx, cy, scale):
    """The Corzi split-ring mark, centred at (cx, cy)."""
    sw = 13 * scale / 100
    return f'''
  <g transform="translate({cx} {cy}) scale({scale / 100}) translate(-50 -50)">
    <path d="M48 16 A34 34 0 0 0 48 84"     fill="none" stroke="{PINK}" stroke-width="13"/>
    <path d="M52 16 A34 34 0 0 1 81.9 38.4" fill="none" stroke="{CYAN}" stroke-width="13"/>
    <path d="M81.9 61.6 A34 34 0 0 1 52 84" fill="none" stroke="{CYAN}" stroke-width="13"/>
    <circle cx="50" cy="50" r="11" fill="{PINK}"/>
  </g>'''


def build(path, *, dark, light, with_logo, rounded=False, px=1024):
    grid, size = matrix(URL)

    skip = None
    if with_logo:
        lo, hi = logo_hole(size)
        skip = lambda x, y: lo <= x < hi and lo <= y < hi

    rects = "".join(
        f'<rect x="{x}" y="{y}" width="{w}" height="1"/>' for x, y, w in runs(grid, size, skip)
    )

    bg = ""
    if light is not None:
        r = f' rx="{size * 0.045}"' if rounded else ""
        bg = f'<rect width="{size}" height="{size}" fill="{light}"{r}/>'

    logo = ""
    if with_logo:
        lo, hi = logo_hole(size)
        c = size / 2
        pad = (hi - lo) * 0.5
        logo = (
            f'<circle cx="{c}" cy="{c}" r="{pad + 0.4}" '
            f'fill="{light if light is not None else "#000000"}"/>'
            + ring_mark(c, c, (hi - lo) * 0.78)
        )

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}"
     width="{px}" height="{px}" shape-rendering="crispEdges"
     role="img" aria-label="QR code linking to {URL}">
  {bg}
  <g fill="{dark}">{rects}</g>
  {logo}
</svg>
'''
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"  {path}  ({size}x{size} modules)")


if __name__ == "__main__":
    print(f"Encoding {URL}\n")

    # --- PRINT: dark modules on white. These are the ones to put on cards. ---
    # Plain, no logo. The safest possible code -- use this if you want zero risk.
    build("qr/corzi-qr-print.svg", dark="#000000", light="#ffffff", with_logo=False)

    # White rounded panel + ring logo. THIS is the business-card one: it still
    # reads as Corzi on a black card, but the modules stay dark-on-light so
    # every scanner handles it.
    build("qr/corzi-qr-card.svg", dark="#000000", light="#ffffff", with_logo=True, rounded=True)

    # --- SCREEN ONLY: inverted, fully on-brand. ---
    # Verified: the encoded data is correct, but light-on-dark defeats some
    # scanners (OpenCV among them). Fine for a slide or a Discord embed where
    # nobody has to scan it. Do not print this one.
    build("qr/corzi-qr-screen-dark.svg", dark="#ffffff", light="#000000", with_logo=True, rounded=True)

    # --- Raster fallback, in case a printer insists on a bitmap. ---
    segno.make(URL, error="h").save(
        "qr/corzi-qr-print.png", scale=40, border=BORDER, dark="#000000", light="#ffffff"
    )
    print("  qr/corzi-qr-print.png")

    print("\nDone. TEST BEFORE PRINTING: scan each file with at least two")
    print("phones (one iOS, one Android) from about 8 inches away.")
