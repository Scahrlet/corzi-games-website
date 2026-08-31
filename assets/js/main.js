/* ============================================================
   CORZI GAMES — RENDERER
   Reads content.js and builds the page. You should not need to
   edit this file to update the site; edit content.js instead.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $  = (sel) => document.querySelector(sel);
  const el = (tag, cls) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  };

  /** Escape text before it goes anywhere near innerHTML. */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

  const icon = (id) => `<svg><use href="#i-${id}"/></svg>`;

  /** A value counts as "set" only if it's a non-empty, non-TODO string. */
  const isSet = (v) => typeof v === "string" && v.trim() !== "" && !/^TODO/i.test(v.trim());

  /* ============================================================
     HERO TEXT
     ============================================================ */
  if (isSet(SITE.tagline)) $("#tagline").innerHTML = SITE.tagline; // trusted: authored by us
  if (isSet(SITE.pitch))   $("#pitch").textContent = SITE.pitch;

  if (isSet(SITE.availability)) {
    $("#availabilityText").textContent = SITE.availability;
    $("#availabilityPill").hidden = false;
  }

  /* Hero stats strip. */
  (function renderStats() {
    const host = $("#stats");
    if (!host || typeof STATS === "undefined" || !STATS.length) return;

    STATS.forEach((s) => {
      const cell = el("div");
      cell.innerHTML = `<dt>${esc(s.value)}</dt><dd>${esc(s.label)}</dd>`;
      host.appendChild(cell);
    });
  })();

  const year = new Date().getFullYear();
  $("#footerLegal").textContent =
    `© ${year} ${SITE.legalName}` + (isSet(SITE.location) ? ` · ${SITE.location}` : "");

  /* ============================================================
     SOCIAL / CONTACT LINKS
     Built once, cloned into the hero and the contact panel.
     ============================================================ */
  function buildLinks() {
    const out = [];
    const add = (href, label, ico, ext = true) =>
      out.push({ href, label, ico, ext });

    if (isSet(LINKS.talentHub)) add(LINKS.talentHub, "Talent Hub", "briefcase");
    if (isSet(LINKS.roblox))    add(LINKS.roblox,    "Roblox",     "roblox");
    if (isSet(LINKS.linkedin))  add(LINKS.linkedin,  "LinkedIn",   "linkedin");

    // Discord may be a username OR an invite URL.
    if (isSet(LINKS.discordServer)) {
      add(LINKS.discordServer, "Discord Server", "discord");
    } else if (isSet(LINKS.discord)) {
      const d = LINKS.discord.trim();
      /^https?:\/\//.test(d)
        ? add(d, "Discord", "discord")
        : out.push({ copy: d, label: d, ico: "discord" });
    }

    if (isSet(LINKS.email))   add("mailto:" + LINKS.email, "Email", "mail", false);
    if (isSet(LINKS.youtube)) add(LINKS.youtube, "YouTube", "external");
    if (isSet(LINKS.x))       add(LINKS.x,       "X",       "external");
    if (isSet(LINKS.github))  add(LINKS.github,  "GitHub",  "external");

    return out;
  }

  /* The contact panel already has a big CTA button; don't repeat that same
     destination as a pill directly underneath it. */
  const ctaHref = isSet(LINKS.email)
    ? "mailto:" + LINKS.email
    : (isSet(LINKS.talentHub) ? LINKS.talentHub : null);

  function renderSocial(target, skipHref) {
    const host = $(target);
    if (!host) return;

    buildLinks().forEach((l) => {
      if (skipHref && l.href === skipHref) return;
      // Discord usernames aren't links — make them copy to clipboard.
      if (l.copy) {
        const b = el("a");
        b.href = "#";
        b.innerHTML = `${icon(l.ico)}<span>${esc(l.label)}</span>`;
        b.addEventListener("click", (e) => {
          e.preventDefault();
          navigator.clipboard?.writeText(l.copy).then(() => {
            const span = b.querySelector("span");
            const old = span.textContent;
            span.textContent = "Copied!";
            setTimeout(() => { span.textContent = old; }, 1600);
          });
        });
        host.appendChild(b);
        return;
      }

      const a = el("a");
      a.href = l.href;
      if (l.ext) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      a.innerHTML = `${icon(l.ico)}<span>${esc(l.label)}</span>`;
      host.appendChild(a);
    });
  }

  renderSocial("#heroSocial");
  renderSocial("#contactSocial", ctaHref);

  /* Primary CTA in the contact panel: email if we have one, else Talent Hub. */
  (function contactCTA() {
    const host = $("#contactActions");
    if (!host) return;

    if (isSet(LINKS.email)) {
      host.innerHTML =
        `<a class="btn btn-primary" href="mailto:${esc(LINKS.email)}">` +
        `${icon("mail")} ${esc(LINKS.email)}</a>`;
    } else if (isSet(LINKS.talentHub)) {
      host.innerHTML =
        `<a class="btn btn-primary" href="${esc(LINKS.talentHub)}" target="_blank" rel="noopener noreferrer">` +
        `${icon("briefcase")} Hire me on Talent Hub</a>`;
    }
  })();

  /* ============================================================
     PROJECTS
     ============================================================ */
  const tagRow = (tags) =>
    Array.isArray(tags) && tags.length
      ? `<div class="tag-row">${tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>`
      : "";

  const metaRow = (p) => {
    const bits = [];
    if (isSet(p.role)) bits.push(`<span class="role">${esc(p.role)}</span>`);
    if (isSet(p.year)) bits.push(`<span>${esc(p.year)}</span>`);
    return bits.length ? `<div class="meta-row">${bits.join("")}</div>` : "";
  };

  /* ---------- featured cards ---------- */
  (function renderFeatured() {
    const host = $("#featuredGrid");
    const list = PROJECTS.filter((p) => p.featured);
    if (!host || !list.length) return;

    list.forEach((p) => {
      const card = el("article", "feature-card reveal");
      card.innerHTML = `
        <div class="feature-media">
          <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" decoding="async">
        </div>
        <div class="feature-body">
          ${metaRow(p)}
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.blurb)}</p>
          ${isSet(p.stat) ? `<span class="stat">${esc(p.stat)}</span>` : ""}
          ${tagRow(p.tags)}
          ${isSet(p.link)
            ? `<a class="btn btn-ghost" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">
                 ${esc(p.linkLabel || "View project")} ${icon("external")}
               </a>`
            : ""}
        </div>`;
      host.appendChild(card);
    });
  })();

  /* ---------- grid + filters ---------- */
  (function renderGrid() {
    const host    = $("#projectGrid");
    const filters = $("#filters");
    const empty   = $("#emptyState");
    const list    = PROJECTS.filter((p) => !p.featured);

    if (!host) return;

    // Hide the whole section if there's nothing but featured work.
    if (!list.length) {
      const section = $("#portfolio");
      if (section) section.hidden = true;
      return;
    }

    list.forEach((p) => {
      const card = el("article", "project-card reveal");
      card.dataset.tags = (p.tags || []).join("|");
      card.innerHTML = `
        <div class="project-thumb">
          <img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy" decoding="async">
          ${isSet(p.year) ? `<span class="year">${esc(p.year)}</span>` : ""}
        </div>
        <div class="project-body">
          ${isSet(p.role) ? `<div class="meta-row"><span class="role">${esc(p.role)}</span></div>` : ""}
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.blurb)}</p>
          ${tagRow(p.tags)}
          ${isSet(p.link)
            ? `<a class="card-link" href="${esc(p.link)}" target="_blank" rel="noopener noreferrer">
                 ${esc(p.linkLabel || "View project")} ${icon("arrow")}
               </a>`
            : ""}
        </div>`;
      host.appendChild(card);
    });

    // Build filter buttons from the tags actually in use.
    const tags = [...new Set(list.flatMap((p) => p.tags || []))].sort();
    if (tags.length < 2) { filters.hidden = true; return; }

    ["All", ...tags].forEach((t, i) => {
      const b = el("button", "filter" + (i === 0 ? " is-active" : ""));
      b.type = "button";
      b.textContent = t;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");

      b.addEventListener("click", () => {
        filters.querySelectorAll(".filter").forEach((x) => {
          x.classList.remove("is-active");
          x.setAttribute("aria-pressed", "false");
        });
        b.classList.add("is-active");
        b.setAttribute("aria-pressed", "true");

        let shown = 0;
        host.querySelectorAll(".project-card").forEach((c) => {
          const match = t === "All" || c.dataset.tags.split("|").includes(t);
          c.hidden = !match;
          if (match) shown++;
        });
        empty.hidden = shown > 0;
      });

      filters.appendChild(b);
    });
  })();

  /* ============================================================
     SERVICES
     ============================================================ */
  (function renderServices() {
    const host = $("#servicesGrid");
    if (!host) return;

    SERVICES.forEach((s) => {
      const card = el("article", "service reveal" + (s.featured ? " is-featured" : ""));
      card.innerHTML = `
        <div class="service-icon">${icon(s.icon)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.body)}</p>`;
      host.appendChild(card);
    });
  })();

  /* ============================================================
     NAV — mobile toggle
     ============================================================ */
  (function nav() {
    const toggle = $("#navToggle");
    const links  = $("#navLinks");
    const ico    = $("#navToggleIcon");
    if (!toggle || !links) return;

    const setOpen = (open) => {
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      ico.innerHTML = `<use href="#i-${open ? "close" : "menu"}"/>`;
    };

    toggle.addEventListener("click", () =>
      setOpen(!links.classList.contains("is-open")));

    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  })();

  /* ============================================================
     STICKY HEADER BORDER
     ============================================================ */
  (function stickyHeader() {
    const header = $("#header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  (function reveal() {
    const items = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach((n) => io.observe(n));
  })();

})();
