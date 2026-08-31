/* ============================================================
   CORZI GAMES — SITE CONTENT
   ------------------------------------------------------------
   This is the ONLY file you need to edit to update the site.
   Everything below feeds the page. No build step, no npm.
   Edit -> save -> git push -> live in ~60 seconds.
   ============================================================ */

const SITE = {
  brand:     "Corzi Games",
  legalName: "Corzi Games LLC",
  domain:    "corzigames.com",

  // Your brand line, straight off the banner.
  tagline:   "Everything <strong>ROBLOX</strong>. <em>Let's create together!</em>",

  // The hero pitch. This is what a stranger reads 3 seconds
  // after scanning the QR code on your business card.
  pitch: "Roblox developer and technical consultant. I've shipped systems into "
       + "experiences with over 930 million combined visits — and for larger "
       + "scopes I bring in vetted programmers and lead delivery as a team.",

  // Green pill in the hero. Set to null to hide it.
  availability: "Available for contract work",

  // TODO: shown in the footer. Use a city/state or just "Remote".
  location: null,

  // Stamped by tools/refresh_stats.py and the daily CI refresh. Shown in the
  // footer so the numbers below are honestly dated rather than implied live.
  statsUpdated: "2026-08-31",
};

/* ------------------------------------------------------------
   STATS — the credibility strip under the hero pitch.
   Summed from the live Roblox API, refreshed daily by CI
   (.github/workflows/refresh-stats.yml).

   Deliberately NO "titles shipped" count. A number bigger than
   the list below invites "where are the rest?", and the honest
   answer (sold / unplayable / low traffic) is weaker than
   silence. Depth on huge titles is the stronger story.
   ------------------------------------------------------------ */
const STATS = [
  { value: "931M+", label: "Combined visits" },
  { value: "1.8K",  label: "Playing concurrently" },
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
  linkedin:  "https://www.linkedin.com/in/autumn-williams-799a31174/",
  email:     "corzigames@gmail.com",

  discord:       null,  // TODO: your Discord username, e.g. "scahrlet"
  discordServer: null,  // optional: server invite link

  x:       null,        // optional
  youtube: null,        // optional
  github:  null,        // optional
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
    body:  "Luau engineering for live games — gameplay loops, progression and "
         + "monetization systems, matchmaking, data persistence, and the "
         + "optimization and security work that keeps a game stable under real "
         + "player load.",
  },
  {
    icon:  "compass",
    title: "Roblox Onboarding for Studios & Creators",
    body:  "You already know your audience. Roblox is a different platform with "
         + "its own engine constraints, economy and player expectations. I "
         + "translate creative direction into a concrete Roblox scope, then "
         + "architect it, staff it and ship it — so you don't have to learn the "
         + "platform's hard lessons on your own budget.",
    featured: true,
  },
  {
    icon:  "spark",
    title: "LiveOps & Project Rescue",
    body:  "Taking over a live game, or one that's stalled. I've solo-run "
         + "liveops for a team for months at a stretch, and been brought onto "
         + "projects specifically to get them across the finish line.",
  },
  {
    icon:  "users",
    title: "Team Lead & Augmentation",
    body:  "Need more than one pair of hands? I've managed developer teams to "
         + "ship client projects, and for larger scopes I bring in vetted Roblox "
         + "programmers and lead delivery myself — you brief one person and get "
         + "a team, with a single point of accountability.",
  },
];

/* ============================================================
   PROJECTS
   ============================================================

   Visit counts, links and thumbnails come from the live Roblox
   API and are verified. Roles and contribution details are as
   you described them.

   FIELDS
     title / blurb / image / tags   (required)
     role    Your role, e.g. "Gameplay Programmer"
     stat    Headline number, shown in the brand gradient
     year    YOUR involvement window, not the game's launch
             year -- e.g. "2021-2022", "2026-present"
     link    URL to the experience
     featured (bool)  true = large hero card up top

   CURATION RULE
   "Shipped" means released, not successful. But this list and
   the STATS strip do different jobs: a reader judges you by the
   WEAKEST item on display, so keep this list to work that either
   clears ~1M visits or shows a skill nothing else here shows.
   Tag your own releases "Solo Shipped" vs "Contract Work" — the
   filter buttons build themselves from tags.
   ============================================================ */
const PROJECTS = [
  {
    title: "World Defenders TD",
    blurb: "Cut the crash rate from 32% to 0.05% overnight, then solo-ran "
         + "liveops for the team for several months. Built dozens of towers and "
         + "multiple new tower types, added trio and squad modes to a solo/duo "
         + "game, rewrote matchmaking, and shipped a new gamemode, new worlds "
         + "and game-wide UI alongside repeated security patches.",
    image: "assets/img/projects/world-defenders-td.webp",
    tags:  ["Roblox", "Contract Work", "LiveOps", "Optimization"],
    role:  "Gameplay & LiveOps Programmer",
    stat:  "303M+ visits",
    year:  "2021–2022",
    link:  "https://www.roblox.com/games/5732966938/World-Defenders-TD",
    featured: true,
  },
  {
    title: "Light Game",
    blurb: "A Squid Game-inspired minigame collection running 70 players to a "
         + "server. I built the win shop and the cosmetics pipeline — costumes, "
         + "trails and accessories — and developed the Tug of War minigame, plus "
         + "optimization passes, security patches, and a run of successful live "
         + "deployments.",
    image: "assets/img/projects/light-game.webp",
    tags:  ["Roblox", "Contract Work", "Gameplay Systems", "Monetization"],
    role:  "Gameplay Programmer",
    stat:  "582M+ visits",
    year:  "2022–2023",
    link:  "https://www.roblox.com/games/7645738534/Light-Game",
    featured: true,
  },
  {
    // Featured despite the smallest visit count here: it's the only project
    // that demonstrates the off-platform consulting work, which is what
    // studios new to Roblox are actually shopping for.
    title: "Escape The Labryn — Shiloh & Bros",
    blurb: "A YouTuber-owned title, stuck in development, that I was brought in "
         + "to land. I worked directly with the channel and their agents to turn "
         + "creative direction into a concrete Roblox scope, managed the "
         + "developers delivering it, finalized the core systems, and picked up "
         + "the programming myself whenever something escalated. Shipped — and "
         + "carried an established off-platform audience onto the platform with it.",
    image: "assets/img/projects/escape-the-labryn.webp",
    tags:  ["Roblox", "Consulting", "Creator Launch", "Team Lead"],
    role:  "Technical Lead & Roblox Consultant",
    stat:  "4.5M+ visits",
    year:  "2024",  // CHECK: your window — did it run into 2025?
    link:  "https://www.roblox.com/games/86053660293681/Escape-The-Labryn-Shiloh-Bros",
    featured: true,
  },
  {
    title: "Fishing Chef",
    blurb: "Brought on to get a stalled project across the finish line. Built "
         + "the onboarding flow, AFK chef NPC system, grid-placement cafe "
         + "builder, serving-with-friends, tipping, ratings and reviews, VIP "
         + "customers, stall upgrades, aquariums and new recipes — then layered "
         + "on the VFX, SFX and UI animation that make it feel finished.",
    image: "assets/img/projects/fishing-chef.webp",
    tags:  ["Roblox", "Contract Work", "Gameplay Systems", "Project Rescue"],
    role:  "Gameplay Programmer",
    stat:  "8.0M+ visits",
    year:  "2025–2026",
    link:  "https://www.roblox.com/games/88599461076137/Fishing-Chef",
    featured: false,
  },
  {
    title: "Penalty Kicks!",
    blurb: "Joined during liveops on a game that passed 33 million visits in "
         + "its first months. Built the shoes and gacha systems and converted "
         + "the game from R6 to R15, lifting revenue. Still shipping major "
         + "features and liveops fixes.",
    image: "assets/img/projects/penalty-kicks.webp",
    tags:  ["Roblox", "Contract Work", "LiveOps", "Monetization"],
    role:  "LiveOps & Systems Programmer",
    stat:  "33M+ visits",
    year:  "2026–present",
    link:  "https://www.roblox.com/games/107750563478039/Penalty-Kicks",
    featured: false,
  },
];
