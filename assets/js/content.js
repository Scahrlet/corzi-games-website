/* ============================================================
   CORZI GAMES — SITE CONTENT
   ------------------------------------------------------------
   This is the ONLY file you need to edit to update the site.
   Everything below feeds the page. No build step, no npm.
   Edit -> save -> git push -> live in ~60 seconds.

   Anything marked TODO still needs your input.
   ============================================================ */

const SITE = {
  brand:     "Corzi Games",
  legalName: "Corzi Games LLC",
  domain:    "corzigames.com",

  // Your brand line, straight off the banner.
  tagline:   "Everything <strong>ROBLOX</strong>. <em>Let's create together!</em>",

  // The hero pitch. This is what a stranger reads 3 seconds
  // after scanning the QR code on your business card.
  pitch: "Solo Roblox developer and technical consultant. I've helped ship "
       + "experiences with over 930 million combined visits — and I help "
       + "studios and creators launch on Roblox for the first time.",

  // Green pill in the hero. Set to null to hide it.
  availability: "Available for contract work",

  // TODO: shown in the footer. Use a city/state or just "Remote".
  location: null,
};

/* ------------------------------------------------------------
   STATS — the credibility strip under the hero pitch.
   These are summed from live Roblox API data (Aug 2026).
   Re-run `py tools/refresh_stats.py` to update them.
   ------------------------------------------------------------ */
const STATS = [
  { value: "931M+", label: "Combined visits" },
  { value: "5",     label: "Shipped titles" },
  { value: "27M+",  label: "Favorites" },
  { value: "14yr",  label: "On platform" },
];

/* ------------------------------------------------------------
   LINKS — used in the hero, contact section and footer.
   Set any value to null to hide that link everywhere.
   ------------------------------------------------------------ */
const LINKS = {
  talentHub: "https://create.roblox.com/talent/creators/23828456",
  roblox:    "https://www.roblox.com/users/23828456/profile",  // verified: Scahrlet

  linkedin: null,       // TODO: https://www.linkedin.com/in/your-handle
  discord:  null,       // TODO: your Discord username, e.g. "scahrlet"
  discordServer: null,  // optional: server invite link
  email:    null,       // TODO: business email — see README, this is the #1 gap

  x:        null,       // optional
  youtube:  null,       // optional
  github:   null,       // optional
};

/* ------------------------------------------------------------
   SERVICES — what people can hire you for.
   Ordered most-important first. `featured: true` highlights one
   card in cyan with the halftone corner.
   ------------------------------------------------------------ */
const SERVICES = [
  {
    icon:  "code",
    title: "Gameplay & Systems Programming",
    body:  "Luau engineering for live games — core gameplay loops, data "
         + "persistence, monetization, replication, and the unglamorous "
         + "backend work that keeps a game stable under real player load.",
  },
  {
    icon:  "compass",
    title: "Roblox Onboarding for Studios",
    body:  "You already know how to make games. Roblox is a different platform "
         + "with its own engine constraints, economy and audience. I bridge "
         + "that gap — architecture, scoping, hiring guidance, and shipping.",
    featured: true,
  },
  {
    icon:  "spark",
    title: "Creator & YouTuber Launches",
    body:  "Turning an existing audience into a game. I've taken creators from "
         + "zero Roblox experience to a launched, playable title with millions "
         + "of visits.",
  },
  {
    icon:  "wrench",
    title: "Technical Consulting & Code Review",
    body:  "Performance audits, exploit-resistance passes, architecture reviews, "
         + "and rescuing projects that have outgrown their codebase.",
  },
];

/* ============================================================
   PROJECTS
   ============================================================

   >>> READ THIS BEFORE YOU PUBLISH <<<

   Every NUMBER, LINK and IMAGE below is real — pulled from the
   live Roblox API on 2026-08-31 and verified.

   Every `role` is a PLACEHOLDER I could not verify. I know from
   your bio that you worked on Light Game, World Defenders and
   Labryn, but not in what capacity, and not on the other two.
   Overstating a role on a portfolio is the one mistake that can
   actually cost you a contract — so go through each `role` and
   each "I built..." sentence and make it exactly true.

   Search this file for "CHECK:" to find every line that needs you.

   FIELDS
     title / blurb / image / tags   (required)
     role    Your role, e.g. "Lead Programmer"
     stat    Headline number shown in gradient
     year    Shown as a pill on grid cards
     link    URL to the experience
     featured (bool)  true = large hero card up top
   ============================================================ */
const PROJECTS = [
  {
    title: "Light Game",
    blurb: "A Squid Game-inspired minigame collection — Red Light Green Light, "
         + "Glass Bridge, Honeycomb, Tug of War and more, running 70 players to "
         + "a server. One of the largest party experiences on the platform. "
         + "CHECK: add one line on what you specifically built.",
    image: "assets/img/projects/light-game.webp",
    tags:  ["Roblox", "Gameplay Systems", "Live Ops"],
    role:  "CHECK — your role on Light Game",
    stat:  "582M+ visits",
    year:  "2021",
    link:  "https://www.roblox.com/games/7645738534/Light-Game",
    featured: true,
  },
  {
    title: "World Defenders TD",
    blurb: "A large-scale tower defense game with 360+ unique towers, "
         + "multi-world progression, quests, and a player-to-player trading "
         + "economy. CHECK: add one line on what you specifically built — "
         + "the trading system and tower framework are the impressive parts "
         + "if you owned them.",
    image: "assets/img/projects/world-defenders-td.webp",
    tags:  ["Roblox", "Gameplay Systems", "Economy"],
    role:  "CHECK — your role on World Defenders TD",
    stat:  "303M+ visits",
    year:  "2020",
    link:  "https://www.roblox.com/games/5732966938/World-Defenders-TD",
    featured: true,
  },
  {
    title: "Penalty Kicks!",
    blurb: "Head-to-head penalty shootout duels — players alternate as kicker "
         + "and goalie, first to five. Launched May 2026 and past 33 million "
         + "visits in its first few months, with a live concurrent playerbase "
         + "in the thousands. CHECK: add one line on what you specifically built.",
    image: "assets/img/projects/penalty-kicks.webp",
    tags:  ["Roblox", "Gameplay Systems", "PvP"],
    role:  "CHECK — your role on Penalty Kicks",
    stat:  "33M+ visits",
    year:  "2026",
    link:  "https://www.roblox.com/games/107750563478039/Penalty-Kicks",
    featured: true,
  },
  {
    title: "Escape The Labryn — Shiloh & Bros",
    blurb: "A co-op maze escape built for the Shiloh & Bros YouTube channel, "
         + "bringing an established off-platform audience onto Roblox. Encounter "
         + "system, modifier-based runs and 1-4 player co-op. "
         + "CHECK: add one line on what you specifically built.",
    image: "assets/img/projects/escape-the-labryn.webp",
    tags:  ["Roblox", "Creator Launch", "Co-op"],
    role:  "CHECK — your role on Escape The Labryn",
    stat:  "4.5M+ visits",
    year:  "2024",
    link:  "https://www.roblox.com/games/86053660293681/Escape-The-Labryn-Shiloh-Bros",
    featured: false,
  },
  {
    title: "Fishing Chef",
    blurb: "Catch, cook and serve — a fishing-and-restaurant loop set in an "
         + "ancient Japanese town, with rod progression and stall upgrades. "
         + "CHECK: add one line on what you specifically built.",
    image: "assets/img/projects/fishing-chef.webp",
    tags:  ["Roblox", "Simulation", "Progression"],
    role:  "CHECK — your role on Fishing Chef",
    stat:  "8.0M+ visits",
    year:  "2025",
    link:  "https://www.roblox.com/games/88599461076137/Fishing-Chef",
    featured: false,
  },
];
