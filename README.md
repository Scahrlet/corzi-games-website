# Corzi Games — corzigames.com

*Website for Corzi Games! Created by me with the assistance of Claude; hire us for all things ROBLOX.*

Portfolio site for **Corzi Games LLC**. Static HTML/CSS/JS, no build step,
no dependencies. Edit a file, push, it's live in about a minute.

---

## Status

Live at <https://corzigames.com>, served by GitHub Pages from `main`.

Two small things are still open — search for `CHECK` in
`assets/js/content.js`:

- **Escape The Labryn** — your involvement window (currently `2024`; did it
  run into 2025?)
- **Meow Simulator** — one line on what you specifically built, plus your
  involvement window

Optional extras, each a `null` that simply stays hidden until filled in:
`LINKS.discord`, and `SITE.location` for the footer.

### On the contact email

`corzigames@gmail.com` works today, but an address at your own domain reads
better on an LLC site. Cloudflare Email Routing does it for free: Cloudflare
dashboard → corzigames.com → **Email** → **Email Routing**, forward
`hello@corzigames.com` to your Gmail, then update `LINKS.email`.

---

## Editing the site

**`assets/js/content.js` is the only file you need.** It holds your pitch,
stats, links, services and every project. Everything else renders from it.

To add a project, copy an existing block in `PROJECTS`:

```js
{
  title: "Game Name",
  blurb: "What it is, and what you built.",
  image: "assets/img/projects/game-name.webp",
  tags:  ["Roblox", "Gameplay Systems"],   // these become the filter buttons
  role:  "Lead Programmer",
  stat:  "12M+ visits",                    // shown big, in the brand gradient
  year:  "2026",
  link:  "https://www.roblox.com/games/...",
  featured: true,                          // true = large card at the top
},
```

Set `featured: true` for your best three. Everything else falls into the
filterable grid below. Filter buttons build themselves from whatever tags
you use, so keep tag names consistent.

### Adding project images

16:9, and convert to WebP — the Roblox PNGs are ~500 KB each and WebP takes
them to ~50 KB with no visible loss. That matters when someone scans your QR
code on conference wifi.

```bash
py -c "from PIL import Image; im=Image.open('in.png').convert('RGB'); im.save('assets/img/projects/out.webp','WEBP',quality=84,method=6)"
```

---

## Running it locally

```bash
py -m http.server 8080
```

Then open <http://localhost:8080>. Don't open `index.html` by double-clicking —
`file://` breaks the relative asset paths.

---

## Deploying

### Updating the live site

```bash
git add -A && git commit -m "Update projects" && git push
```

Live in about 60 seconds. That's the whole loop.

### How it's wired (already done — for reference)

**GitHub Pages**: Settings → Pages → Source *Deploy from a branch* →
`main` / `(root)`, custom domain `corzigames.com`. The repo must stay
**public** — Pages can't serve a private repo on a free plan.

**Cloudflare DNS** — all five records on **DNS only** (grey cloud):

| Type  | Name  | Content              |
|-------|-------|----------------------|
| A     | `@`   | `185.199.108.153`    |
| A     | `@`   | `185.199.109.153`    |
| A     | `@`   | `185.199.110.153`    |
| A     | `@`   | `185.199.111.153`    |
| CNAME | `www` | `scahrlet.github.io` |

SSL/TLS mode: **Full (strict)**.

**Why grey cloud matters.** GitHub issues the HTTPS certificate by serving a
challenge over plain HTTP. With Cloudflare's proxy on, GitHub never sees that
request, so the cert never issues — and then Full (strict) rejects the
uncertified origin with a **526**. It's a deadlock: proxy on → no cert → 526.
Turning proxying off breaks it. Once the cert exists you *can* re-enable the
orange cloud, and Full (strict) will accept it.

**Do not "fix" a 526 by switching SSL to Flexible.** The error vanishes, but
Cloudflare then talks to GitHub unencrypted and the cert still never issues,
so you're stuck on a workaround permanently.

---

## QR codes

Already generated, in `qr/`. They encode `https://corzigames.com`.

| File | Use |
|------|-----|
| `corzi-qr-card.svg` | **Business cards.** Ring logo in the centre, white rounded panel — reads as Corzi but still scans everywhere. |
| `corzi-qr-print.svg` | Plain, no logo. Maximum reliability if you want zero risk. |
| `corzi-qr-screen-dark.svg` | Slides, Discord, on-screen only. **Do not print.** |
| `corzi-qr-print.png` | Raster fallback if a printer refuses SVG. |

Give the printer the **SVG**, not the PNG — vector stays sharp at any size.

**The dark one is screen-only for a real reason.** It's a light-on-dark
(inverted) code. The data is correct — verified — but inverted codes defeat
a meaningful share of scanner apps, including OpenCV. On a black business
card, use `corzi-qr-card.svg`: its white panel looks deliberate against the
black stock and every scanner handles it.

Regenerate and verify:

```bash
py tools/make_qr.py && py tools/verify_qr.py
```

### Print checklist

- [ ] Print at **no smaller than 0.8 inch / 20 mm** square.
- [ ] Keep the white margin around the code. That quiet zone is part of the
      spec — cropping it tight is the most common reason a printed QR fails.
- [ ] The site must be **live before the cards are printed**. A QR pointing
      at a 404 is worse than no QR.
- [ ] Scan the physical proof with an iPhone *and* an Android before
      approving the full run.

---

## Repo layout

```
index.html                 Page structure. Rarely needs editing.
CNAME                      corzigames.com — tells GitHub Pages the domain.
.nojekyll                  Stops GitHub running Jekyll over the files.

assets/
  css/style.css            All styling. Brand colours are in :root at the top.
  js/content.js            >>> YOUR CONTENT. This is the file you edit. <<<
  js/main.js               Renders content.js into the page. Leave alone.
  img/brand/               Logo, favicon, OG social preview image.
  img/projects/            Game thumbnails (WebP).

qr/                        Generated QR codes.
tools/
  make_qr.py               Regenerate the QR codes.
  verify_qr.py             Confirm they still decode. Run before printing.
  make_og_image.py         Regenerate the social preview card.
  refresh_stats.py         Pull current visit counts from the Roblox API.
```

### Rebranding

Colours live in one block at the top of `assets/css/style.css`:

```css
--pink: #ff1b6e;
--cyan: #1fe3e3;
--bg:   #000000;
```

Change those and the whole site follows — buttons, glows, gradients, HUD
brackets, filter chips.

---

## Keeping numbers current

Visit counts only go up, so the site understates you a little more each week.
Before RDC:

```bash
py tools/refresh_stats.py
```

It prints current numbers and ready-to-paste values for the `STATS` block and
each project's `stat`. It deliberately doesn't edit `content.js` for you, so
you always see what changed first.

---

## Tooling

The Python scripts in `tools/` are development-only — the website itself has
zero dependencies and runs as plain static files.

```bash
py -m pip install segno pillow numpy opencv-python-headless
```

- `segno` — QR generation
- `pillow`, `numpy` — OG image rendering, WebP conversion
- `opencv-python-headless` — QR decode verification
