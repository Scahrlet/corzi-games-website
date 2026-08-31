# Corzi Games — corzigames.com

Portfolio site for **Corzi Games LLC**. Static HTML/CSS/JS, no build step,
no dependencies. Edit a file, push, it's live in about a minute.

---

## Before you publish

Two things must happen before this site goes in front of anyone at RDC.

### 1. Fix the role claims — do this first

Every visit count, link and thumbnail in `assets/js/content.js` is real,
pulled from the live Roblox API on 2026-08-31. **Every `role` field is a
placeholder.** I know from your Roblox bio that you worked on Light Game,
World Defenders and Labryn, but not in what capacity — and I had no source
at all for your role on Penalty Kicks or Fishing Chef.

Find them all:

```bash
grep -n "CHECK" assets/js/content.js
```

Replace each `role:` with your real title, and each `CHECK: add one line
on what you specifically built` with the actual thing you built. Be
specific — "wrote the tower upgrade and trading systems" beats "developer".
A studio lead at RDC will ask about these, and a claim you can't back is
worse than a modest one you can.

### 2. Add a business email

`LINKS.email` is `null`, so the site currently has **no way to contact you**
except Talent Hub. That's the single biggest gap. Get something at your own
domain — `hello@corzigames.com` — because a Gmail address on an LLC site
reads as a hobby. Cloudflare Email Routing does this free: Cloudflare
dashboard → your domain → Email → Email Routing, forward to your Gmail.

While you're in `content.js`, also fill in `linkedin`, `discord`, and
`location`. Anything left `null` is simply hidden, so the site won't break —
it just won't convert.

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

### One-time: push to GitHub

```bash
git init -b main
git remote add origin https://github.com/Scahrlet/corzi-games-website.git
git add -A
git commit -m "Initial site"
git push -u origin main
```

### One-time: turn on GitHub Pages

1. Repo → **Settings** → **Pages**
2. **Source**: Deploy from a branch → **main** / **(root)** → Save
3. **Custom domain**: enter `corzigames.com` → Save

The `CNAME` file in this repo already contains `corzigames.com`, so GitHub
will pick it up.

### One-time: point Cloudflare at GitHub

In the Cloudflare dashboard → `corzigames.com` → **DNS** → add:

| Type  | Name | Content                | Proxy status         |
|-------|------|------------------------|----------------------|
| A     | `@`  | `185.199.108.153`      | **DNS only** (grey)  |
| A     | `@`  | `185.199.109.153`      | **DNS only** (grey)  |
| A     | `@`  | `185.199.110.153`      | **DNS only** (grey)  |
| A     | `@`  | `185.199.111.153`      | **DNS only** (grey)  |
| CNAME | `www`| `scahrlet.github.io`   | **DNS only** (grey)  |

Then **SSL/TLS** → **Overview** → set encryption mode to **Full (strict)**.

**Two gotchas that will waste your afternoon if you miss them:**

- **Start with the grey cloud, not orange.** GitHub issues your HTTPS
  certificate by fetching a challenge file over plain HTTP. If Cloudflare's
  proxy is on, GitHub can't reach it and the certificate never issues. Leave
  proxying off until GitHub Pages shows the green "certificate issued" notice
  (usually 10–20 minutes), then turn the orange cloud on if you want it.
- **Never use SSL mode "Flexible."** Cloudflare would talk to GitHub over
  HTTP while GitHub forces HTTPS, and you get an infinite redirect loop.
  Full (strict) is correct.

Once the certificate is issued, go back to repo → Settings → Pages and tick
**Enforce HTTPS**.

### Every update after that

```bash
git add -A && git commit -m "Update projects" && git push
```

Live in about 60 seconds.

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
