"""
Render the Open Graph social-preview card (1200x630).

    py -m pip install pillow numpy
    py tools/make_og_image.py

This is the image Discord, LinkedIn, iMessage and X show when someone
pastes corzigames.com. Without it they show a blank grey box, which
looks broken -- worth getting right before you hand the link out.
"""

import io
import os
import urllib.request

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BLACK = (0, 0, 0)
PINK = (255, 27, 110)
CYAN = (31, 227, 227)
WHITE = (244, 245, 250)
DIM = (150, 156, 180)

OUT = "assets/img/brand/og-image.png"

# Orbitron is the closest free match to the Corzi wordmark. Fall back to
# Segoe UI Semibold if we can't reach Google Fonts (offline, proxy, etc).
ORBITRON = "https://raw.githubusercontent.com/google/fonts/main/ofl/orbitron/Orbitron%5Bwght%5D.ttf"
CACHE = "tools/.orbitron.ttf"


def load_fonts():
    """(wordmark, sub, small) -- Orbitron if reachable, else a system fallback."""
    data = None
    if os.path.exists(CACHE):
        data = open(CACHE, "rb").read()
    else:
        try:
            req = urllib.request.Request(ORBITRON, headers={"User-Agent": "Mozilla/5.0"})
            data = urllib.request.urlopen(req, timeout=20).read()
            os.makedirs("tools", exist_ok=True)
            open(CACHE, "wb").write(data)
            print("  fetched Orbitron from Google Fonts")
        except Exception as e:
            print(f"  could not fetch Orbitron ({e}); using Segoe UI")

    if data:
        def orb(size, weight=700):
            f = ImageFont.truetype(io.BytesIO(data), size)
            try:
                f.set_variation_by_axes([weight])
            except Exception:
                pass
            return f
        return orb(78), orb(30, 600), orb(21, 600)

    seg = "C:/Windows/Fonts/seguisb.ttf"
    return (ImageFont.truetype(seg, 78),
            ImageFont.truetype(seg, 30),
            ImageFont.truetype(seg, 21))


def fog():
    """Pink bottom-left + cyan bottom-right glow, matching the brand banner."""
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    canvas = np.zeros((H, W, 3), np.float32)

    for (cx, cy), rad, col, peak in (
        ((0.10 * W, 1.02 * H), 0.62 * W, PINK, 0.42),
        ((0.92 * W, 1.05 * H), 0.60 * W, CYAN, 0.34),
        ((0.50 * W, -0.15 * H), 0.55 * W, PINK, 0.10),
    ):
        d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / rad
        falloff = np.clip(1 - d, 0, 1) ** 2 * peak
        canvas += falloff[..., None] * np.array(col, np.float32)

    return np.clip(canvas, 0, 255)


def tech_grid(img):
    """Faint 60px grid, fading out toward the bottom."""
    d = ImageDraw.Draw(img, "RGBA")
    for gx in range(0, W, 60):
        d.line([(gx, 0), (gx, H)], fill=(255, 255, 255, 10))
    for gy in range(0, H, 60):
        d.line([(0, gy), (W, gy)], fill=(255, 255, 255, 10))


def hud(d, inset=42, arm=64):
    """The signature bracket frame: pink on the left, cyan on the right."""
    w = 3
    x0, y0, x1, y1 = inset, inset, W - inset, H - inset
    d.line([(x0, y0), (x0 + arm, y0)], fill=PINK, width=w)
    d.line([(x0, y0), (x0, y0 + arm)], fill=PINK, width=w)
    d.line([(x1 - arm, y0), (x1, y0)], fill=CYAN, width=w)
    d.line([(x1, y0), (x1, y0 + arm)], fill=CYAN, width=w)
    d.line([(x0, y1 - arm), (x0, y1)], fill=PINK, width=w)
    d.line([(x0, y1), (x0 + arm, y1)], fill=PINK, width=w)
    d.line([(x1, y1 - arm), (x1, y1)], fill=CYAN, width=w)
    d.line([(x1 - arm, y1), (x1, y1)], fill=CYAN, width=w)

    # dotted trails running off each top bracket
    for i in range(4):
        d.ellipse([x0 + arm + 16 + i * 11, y0 - 1, x0 + arm + 19 + i * 11, y0 + 2], fill=PINK)
        d.ellipse([x1 - arm - 19 - i * 11, y0 - 1, x1 - arm - 16 - i * 11, y0 + 2], fill=CYAN)


def ring(d, cx, cy, r, w):
    """The split-ring 'C': pink left half, cyan right with a 3 o'clock gap."""
    box = [cx - r, cy - r, cx + r, cy + r]
    d.arc(box, start=93, end=267, fill=PINK, width=w)     # left half
    d.arc(box, start=273, end=340, fill=CYAN, width=w)    # upper right
    d.arc(box, start=20, end=87, fill=CYAN, width=w)      # lower right
    dot = r * 0.32
    d.ellipse([cx - dot, cy - dot, cx + dot, cy + dot], fill=PINK)


def centered(d, y, text, font, fill, tracking=0):
    """Draw text centred on the canvas, with optional letter-spacing."""
    if not tracking:
        w = d.textlength(text, font=font)
        d.text(((W - w) / 2, y), text, font=font, fill=fill)
        return

    widths = [d.textlength(c, font=font) for c in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (W - total) / 2
    for c, cw in zip(text, widths):
        d.text((x, y), c, font=font, fill=fill)
        x += cw + tracking


def main():
    wordmark, sub, small = load_fonts()

    img = Image.fromarray(fog().astype(np.uint8), "RGB")
    tech_grid(img)
    d = ImageDraw.Draw(img)

    hud(d)
    ring(d, W // 2, 196, 62, 22)

    centered(d, 288, "CORZI GAMES", wordmark, WHITE, tracking=10)

    # tagline, drawn in three colours to match the brand banner
    parts = [("Everything ", WHITE), ("ROBLOX", PINK),
             (". Let's create together!", CYAN)]
    total = sum(d.textlength(t, font=sub) for t, _ in parts)
    x = (W - total) / 2
    for text, col in parts:
        d.text((x, 396), text, font=sub, fill=col)
        x += d.textlength(text, font=sub)

    # Keep this line ASCII-only: Orbitron has no glyph for "·" or "—" and
    # Pillow renders missing glyphs as a tofu box.
    centered(d, 468, "930M+ VISITS   //   ROBLOX DEVELOPMENT & CONSULTING",
             small, DIM, tracking=2)
    centered(d, 524, "CORZIGAMES.COM", small, CYAN, tracking=6)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"  {OUT}  ({W}x{H}, {os.path.getsize(OUT) / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
