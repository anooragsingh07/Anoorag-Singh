const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const site = path.resolve(__dirname, "..");
const src = fs.readFileSync(path.join(__dirname, "ref", "page.html"), "utf8");
const $ = cheerio.load(src, { decodeEntities: false });

/* Canonical production origin (custom domain on GitHub Pages). */
const SITE_URL = "https://anoorag.tech";
const SITE_UPDATED = "2026-11-13";

/* ---------- header ---------- */
const header = $("header").first();
header.removeAttr("style");
header.attr("data-header", "");
header.find('[data-testid="theme-toggle-button"]').attr("data-theme-toggle", "").find("span").removeAttr("style").attr("data-theme-icon", "");
header.find('[data-testid="cmd-k-trigger-button"]').attr("data-open-palette", "");

/* ---------- main ---------- */
const main = $("main").first();

// hero line reveals
main.find("span.block.will-change-transform").each((i, el) => {
  $(el).removeAttr("style").attr("data-line", String(i));
});

// hero entrance groups
main.find("#home div.mt-10").first().removeAttr("style").attr("data-hero", "cta");
main.find('[data-testid="hero-platform-cards"]').removeAttr("style").attr("data-hero", "cards");
const portraitColumn = main.find('[data-testid="hero-portrait-card"]').parent();
portraitColumn.removeAttr("style").attr("data-hero", "portrait");
const portraitCard = main.find('[data-testid="hero-portrait-card"]');
portraitCard.removeAttr("style").attr("data-tilt", "");

// wrap portrait card in a parallax layer
portraitColumn.append('<div data-parallax></div>');
const parallax = portraitColumn.children("[data-parallax]");
parallax.append(portraitCard);

portraitCard.children("div.relative").first().attr("data-float", "");
main.find('[data-testid="hero-scroll-hint"]').removeAttr("style").attr("data-hero", "scroll");

// about image parallax
main.find('[data-testid="about-image"]').removeAttr("style").attr("data-about-image", "");

/* ---------- reveal wrappers ---------- */
const sectionDelays = {
  education: [0, 0, 0.08, 0.16],
  projects: (i) => (i === 0 ? 0 : ((i - 1) % 3) * 0.08),
  skills: (i) => (i === 0 ? 0 : (i - 1) * 0.1),
  about: [0, 0, 0.1, 0.15, 0.2, 0.15],
  blog: [0, 0, 0.06, 0.12, 0.18, 0.24, 0.1],
  contact: [0, 0, 0.1],
};
for (const [id, rule] of Object.entries(sectionDelays)) {
  const section = main.find(`#${id}`).first();
  const wrappers = section
    .find("*")
    .filter((i, el) => ($(el).attr("style") || "").replace(/\s+/g, " ").trim() === "opacity: 1; transform: none;")
    .toArray();
  wrappers.forEach((el, i) => {
    const delay = typeof rule === "function" ? rule(i) : rule[i] ?? 0;
    $(el).removeAttr("style").attr("data-reveal", "").attr("style", `--reveal-delay: ${delay}s`);
  });
}

// clean any other runtime inline styles inside main
main.find("[style]").each((i, el) => {
  const v = $(el).attr("style") || "";
  if (!v.includes("--reveal-delay") && !v.includes("will-change: transform")) $(el).removeAttr("style");
});

/* ---------- local paths ---------- */
main.find("a[href^='/blog/']").each((i, el) => {
  const href = $(el).attr("href");
  const slug = href.replace(/^\/blog\//, "").replace(/\/$/, "");
  $(el).attr("href", `blog/${slug}.html`);
});
main.find("a[href='/assets/Anoorag_Singh.pdf']").attr("href", "resume/Resume.pdf");
// "View Resume" opens the PDF in a new tab (target=_blank) instead of
// forcing a download; the download attribute would override target on
// same-origin URLs. The palette's "Download Resume" action still downloads.
main.find('a[href="resume/Resume.pdf"]').removeAttr("download");
// ShopKart's Railway deployment is offline; point its live-demo action at the
// working GitHub repository so the card never leads to a 404.
main
  .find('[data-testid="project-card-shopkart-live-link"]')
  .attr("href", "https://github.com/anooragsingh07/Assignment-SDE");
main.find("img[src^='/assets/']").each((i, el) => {
  const src = $(el).attr("src");
  const local = src.indexOf("/assets/astronaut_avatar") === 0 ? src.slice("/assets/".length) : src.replace(/^\/assets\//, "assets/");
  // Serve the optimized WebP builds of the avatars (1074 KB -> 91 KB,
  // 369 KB -> 95 KB at quality 97, visually identical to the PNG/JPEG).
  $(el).attr("src", local.replace(/astronaut_avatar(_dark)?\.png$/, "astronaut_avatar$1.webp"));
});

/* ---------- contact socials: app logos ---------- */
// Give each contact social card the same circular logo badge the hero
// platform cards use (GitHub / LinkedIn / X / Codolio), cloned from the
// platform cards so the icons and hover states stay identical.
const circleClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 group-hover:border-accent-blue/50 group-hover:text-accent-blue";
const platformIcon = (id) => {
  const node = main.find(`[data-testid="${id}"] > span`).first().get(0);
  return node ? $.html(node) : null;
};
// The X card already carries the X mark as its trailing glyph; reuse it.
const xMark = main.find('[data-testid="social-x-link"] > span').last().find("svg").first().get(0);
const contactIcons = {
  github: platformIcon("platform-card-github"),
  linkedin: platformIcon("platform-card-linkedin"),
  codolio: platformIcon("platform-card-codolio"),
  x: `<span class="${circleClass}">${xMark ? $.html(xMark) : ""}</span>`,
};
main.find('a[data-testid^="social-"][data-testid$="-link"]').each((_, el) => {
  const key = ($(el).attr("data-testid") || "").replace(/^social-/, "").replace(/-link$/, "");
  const badge = contactIcons[key];
  if (!badge) return;
  const text = $(el).children().first();
  const lines = text.children();
  // Hybrid text handling: the text column shrinks below its min-content so
  // the badge + arrow always fit; names ellipsize as a safety net (they
  // always fit anyway). Single-word handles (anooragsingh07, @code_anoorag)
  // must ellipsize on narrow cards. Codolio's handle has spaces: keep the
  // reference's natural wrap on phones (same card rhythm and page heights)
  // and only ellipsize from sm up.
  text.addClass("min-w-0");
  lines.eq(0).addClass("truncate");
  lines.eq(1).addClass(key === "codolio" ? "sm:truncate" : "truncate");
  const textHtml = $.html(text.get(0));
  text.replaceWith(`<span class="flex min-w-0 items-center gap-3">${badge}${textHtml}</span>`);
});

// The reference gives the X card an X mark as its trailing "open" glyph
// while the other three cards use the ↗ arrow — normalize it to match.
// (The circular badge on the left keeps the X logo, as designed.)
const openArrow =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-4 w-4" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>';
main.find('[data-testid="social-x-link"]').children().last().html(openArrow);

/* ---------- footer ---------- */
const footer = $("footer").first();
footer.find('[data-testid="footer-back-to-top"]').attr("data-back-to-top", "");

let headerHtml = $.html(header);
const mainHtml = $.html(main);
const footerHtml = $.html(footer).replace(
  /© 2026 Anoorag Singh/,
  '© <span data-year>2026</span> Anoorag Singh',
);

/* ---------- icons ---------- */
const icons = {
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-linkedin h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>`,
  medium: `<svg viewBox="0 0 24 24" fill="currentColor" class="h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"></path></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`,
  file: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`,
  arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-3.5 w-3.5 text-accent-blue" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>`,
};

// initial theme icon markup (both icons; CSS shows the correct one before JS runs)
header.find('[data-theme-icon]').html(
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-4 w-4 theme-icon-moon" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>` +
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-4 w-4 theme-icon-sun" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`,
);
headerHtml = $.html(header);

const navItems = [
  ["home", "Home"], ["education", "Education"], ["projects", "Projects"], ["skills", "Skills"],
  ["about", "About"], ["blog", "Blog"], ["contact", "Contact"],
];
const projects = [
  ["simple-ai-assistant", "Simple AI Assistant", null, "https://github.com/anooragsingh07/Simple-AI-Assistant"],
  ["dispensary-management-system", "Campus Care", null, "https://github.com/anooragsingh07/Dispensary-Management-System"],
  ["flights", "Flights", null, "https://github.com/anooragsingh07/Flights"],
  ["car-dealership-inventory-system", "Car Dealership Inventory", "https://car-dealership-inventory-system-jk1.vercel.app", "https://github.com/anooragsingh07/Car-Dealership-Inventory-System"],
  ["cpu-schedsim", "CPU-SchedSim", "https://anooragsingh07.github.io/CPU-SchedSim--CPU-Scheduling-Simulator-/", "https://github.com/anooragsingh07/CPU-SchedSim--CPU-Scheduling-Simulator-"],
  ["shopkart", "ShopKart", null, "https://github.com/anooragsingh07/Assignment-SDE"],
  ["smart-shelf", "SmartShelf", "https://anooragsingh07.github.io/Smart-Shelf/", "https://github.com/anooragsingh07/Smart-Shelf"],
  ["mind-minute", "Mind Minute", "https://anooragsingh07.github.io/Mind-Minute/", "https://github.com/anooragsingh07/Mind-Minute"],
  ["student-finance-tracker", "Student Finance Tracker", "https://anooragsingh07.github.io/Student-Finance-Tracker/", "https://github.com/anooragsingh07/Student-Finance-Tracker/"],
  ["landing-pages", "Interactive Landing Pages", "https://anooragsingh07.github.io/Login-Page-using-Tailwind/", "https://github.com/anooragsingh07/Login-Page-using-Tailwind"],
];
const posts = [
  ["simulating-cpu-scheduling", "Simulating CPU Scheduling Algorithms with C++"],
  ["why-i-love-cpp", "Why I Love Coding in C++"],
  ["understanding-cpu-scheduling", "Understanding CPU Scheduling: FCFS, SJF, RR and Priority"],
  ["mind-minute", "MindMinute — One Minute to Mindfulness"],
  ["learning-finance-through-code", "Learning Finance Through Code — Student Finance Tracker"],
];
const postContent = {
  "simulating-cpu-scheduling": {
    date: "Jun 10, 2024",
    readTime: "8 min read",
    intro:
      "Understanding Operating Systems became much easier after I built CPU-SchedSim, a C++-based simulator for analyzing the behavior of different CPU scheduling algorithms. These are vital for efficient process management in modern OSes.",
    detail: { label: "Algorithms implemented", text: "FCFS, SJF, Round-Robin, Priority Scheduling" },
    reflection:
      "This project helped me deeply understand how scheduling decisions affect CPU utilization and system responsiveness.",
    resources: ["GeeksforGeeks", "TutorialsPoint", "cplusplus.com"],
    links: [
      { label: "GitHub", url: "https://github.com/anooragsingh07/CPU-SchedSim--CPU-Scheduling-Simulator-" },
      { label: "Live Demo", url: "https://anooragsingh07.github.io/CPU-SchedSim--CPU-Scheduling-Simulator-/" },
    ],
  },
  "why-i-love-cpp": {
    date: "May 28, 2024",
    readTime: "5 min read",
    intro:
      "C++ was the language that introduced me to real programming logic. I've used it for building simulations, solving problems, and learning core computer science concepts.",
    detail: { label: "Why C++ stands out", text: "Memory management, low-level operations, DSA, OOP" },
    reflection:
      "C++ also helped me in creating realistic simulators like CPU-SchedSim by providing control over thread-level behavior and CPU logic.",
    resources: ["Codecademy", "The Cherno", "GeeksforGeeks"],
    links: [],
  },
  "understanding-cpu-scheduling": {
    date: "May 15, 2024",
    readTime: "7 min read",
    intro:
      "CPU scheduling decides the order in which processes run, which directly affects performance. Let's simplify the 4 major scheduling algorithms: FCFS, SJF, Round-Robin, Priority Scheduling.",
    detail: {
      label: "Metrics measured in CPU-SchedSim",
      text: "Average turnaround time, waiting time, CPU utilization — all simulated in C++",
    },
    reflection:
      "In my CPU-SchedSim project, I simulated all of these to compare how each algorithm trades fairness against efficiency in real workloads.",
    resources: ["Neso Academy", "GeeksforGeeks"],
    links: [],
  },
  "mind-minute": {
    date: "Apr 30, 2024",
    readTime: "4 min read",
    intro:
      "As students or developers, it's easy to forget to take care of our mental health. That's why I built MindMinute, a web app focused on 1-minute mindfulness breaks, using only HTML, CSS, and JavaScript.",
    detail: { label: "Features", text: "Breathing/stretching exercises, meditation prompts, animated timers, offline support" },
    reflection: "This project taught me the value of building lightweight, accessible tools with minimal dependencies.",
    resources: ["MDN", "Mindfulness Techniques"],
    links: [
      { label: "GitHub", url: "https://github.com/anooragsingh07/Mind-Minute" },
      { label: "Live Demo", url: "https://anooragsingh07.github.io/Mind-Minute/" },
    ],
  },
  "learning-finance-through-code": {
    date: "Apr 10, 2024",
    readTime: "6 min read",
    intro:
      "Managing personal expenses can be tough for students. I solved this with the Student Finance Tracker, a smart, student-friendly budgeting tool built using HTML, CSS, JavaScript, and Chart.js.",
    detail: { label: "Features", text: "Add/delete/filter transactions, category breakdown, responsive charts, offline support" },
    reflection: "This project helped me master DOM manipulation, event handling, and working with Chart.js.",
    resources: ["Chart.js", "MDN", "NerdWallet"],
    links: [
      { label: "GitHub", url: "https://github.com/anooragsingh07/Student-Finance-Tracker/" },
      { label: "Live Demo", url: "https://anooragsingh07.github.io/Student-Finance-Tracker/" },
    ],
  },
};
const socials = [
  ["GitHub", "anooragsingh07", "https://github.com/anooragsingh07", icons.github],
  ["LinkedIn", "anooragsingh", "https://linkedin.com/in/anooragsingh", icons.linkedin],
  ["X", "@code_anoorag", "https://x.com/code_anoorag", icons.x],
  ["Medium", "@anooragsingh0007", "https://medium.com/@anooragsingh0007", icons.medium],
  ["Codolio", "@Anoorag Singh", "https://codolio.com/profile/Anoorag%20Singh", icons.arrowUpRight],
];
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const item = (testid, icon, label, value, action, extra = "") => {
  const text = `${label}${value ? " — " + value : ""}`;
  return `<div data-cmd-item data-testid="${testid}" role="option" aria-selected="false" data-selected="false" data-value="${esc(text.replace(/<[^>]*>/g, ""))}" class="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground/90 data-[selected=true]:bg-foreground data-[selected=true]:text-background transition-colors" data-action="${action}"${extra}>${icon}${text}</div>`;
};
const group = (title, items) =>
  `<div data-cmd-group class="text-muted-foreground [&amp;_[cmdk-group-heading]]:mono-label [&amp;_[cmdk-group-heading]]:px-4 [&amp;_[cmdk-group-heading]]:pt-4 [&amp;_[cmdk-group-heading]]:pb-2"><div cmdk-group-heading aria-hidden="true">${title}</div>${items.join("")}</div>`;

const navGroup = group("Navigation", navItems.map(([id, label]) => item(`cmd-nav-${id}`, icons.arrowRight, label, "", `nav:${id}`)));
const actionsGroup = group("Actions", [
  item("cmd-action-theme", `<span data-cmd-theme-icon>${icons.moon}</span>`, `Switch to <span data-cmd-theme-word>dark</span> mode`, "", "theme"),
  item("cmd-action-email", icons.mail, "Email me — anooragsingh0007@gmail.com", "", "email"),
  item("cmd-action-copy-email", icons.copy, "Copy email address", "", "copy-email"),
  item("cmd-action-resume", icons.file, "Download Resume (PDF)", "", "resume"),
]);
const projectGroup = group("Projects", projects.map(([id, title, live, gh]) => item(`cmd-project-${id}`, icons.arrowUpRight, title, "", `project:${live || gh}`)));
const writingGroup = group("Writing", posts.map(([id, title]) => item(`cmd-blog-${id}`, icons.book, title, "", `post:${id}`)));
const socialGroup = group("Socials", socials.map(([name, handle, url, icon]) => item(`cmd-social-${name.toLowerCase()}`, icon, name, handle, `social:${url}`)));

const palette = `
<div data-palette-overlay data-state="closed" hidden class="fixed inset-0 z-[80] bg-foreground/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0"></div>
<div data-palette role="dialog" aria-modal="true" aria-labelledby="cmd-k-title" data-state="closed" hidden data-testid="cmd-k-palette" class="fixed left-1/2 top-[18%] z-[90] w-[calc(100vw-2.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl border border-white/50 bg-card/75 shadow-[0_40px_90px_-20px_rgb(18_18_16/0.45)] backdrop-blur-2xl dark:border-white/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200">
  <h2 id="cmd-k-title" class="sr-only">Command palette</h2>
  <div class="flex flex-col">
    <div class="flex items-center gap-3 border-b border-white/40 px-5 dark:border-white/10">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-4 w-4 rotate-90 text-muted-foreground" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
      <input data-cmd-input data-testid="cmd-k-input" placeholder="Search sections, projects, actions…" class="w-full bg-transparent py-5 text-base outline-none placeholder:text-muted-foreground/70" autocomplete="off" autocorrect="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="cmd-k-list" aria-autocomplete="list" aria-labelledby="cmd-k-title" type="text" />
      <kbd class="mono-label hidden sm:block rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground">ESC</kbd>
    </div>
    <div id="cmd-k-list" data-cmd-list data-lenis-prevent="true" class="palette-scroll max-h-[52vh] overflow-y-auto p-2.5" role="listbox" aria-label="Suggestions">
      <div data-cmd-empty class="py-10 text-center text-sm text-muted-foreground" hidden>No results found.</div>
      ${navGroup}
      ${actionsGroup}
      ${projectGroup}
      ${writingGroup}
      ${socialGroup}
    </div>
  </div>
</div>`;

const articleIcons = {
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>`,
  quote: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-quote h-5 w-5 shrink-0 text-accent-blue -scale-x-100" aria-hidden="true"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github h-4 w-4" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`,
  arrowUpRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-blue" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`,
};

function articleMarkup(post, next) {
  const content = postContent[post[0]];
  const details = content.detail
    ? `<div class="my-10 rounded-2xl border border-white/40 bg-card/60 p-6 backdrop-blur-xl dark:border-white/10" data-testid="blog-post-detail"><p class="mono-label text-accent-blue">${esc(content.detail.label)}</p><p class="mt-3 font-display text-lg md:text-xl leading-relaxed">${esc(content.detail.text)}</p></div>`
    : "";
  const resources = content.resources.length
    ? `<div class="mt-12" data-testid="blog-post-resources"><p class="mono-label text-muted-foreground">Resources</p><div class="mt-4 flex flex-wrap gap-2">${content.resources.map((resource) => `<span class="rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide">${esc(resource)}</span>`).join("")}</div></div>`
    : "";
  const links = content.links.length
    ? `<div class="mt-10 flex flex-wrap gap-4" data-testid="blog-post-links">${content.links.map((link) => `<a data-testid="blog-post-link-${link.label.toLowerCase().replace(/\s+/g, "-")}" href="${link.url}" target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 hover:scale-[1.03]">${link.label === "GitHub" ? articleIcons.github : ""}${esc(link.label)}${articleIcons.arrowUpRight}</a>`).join("")}</div>`
    : "";
  return `<main data-testid="blog-post-page"><article class="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40"><div data-article>
<button data-testid="blog-post-back" data-blog-back class="group inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">${articleIcons.arrowLeft}All posts</button>
<p class="mono-label mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground" data-testid="blog-post-meta"><span class="text-accent-blue">${content.date}</span><span aria-hidden="true">·</span><span>${content.readTime}</span><span aria-hidden="true">·</span><span>anoorag singh.techblog</span></p>
<h1 class="mt-6 font-display text-4xl md:text-6xl font-normal leading-[1.08] tracking-[-0.02em]" data-testid="blog-post-title">${esc(post[1])}</h1>
<div class="mt-10 border-t border-border pt-10" data-testid="blog-post-body">
<p class="text-lg md:text-xl leading-relaxed text-foreground/90">${esc(content.intro)}</p>
${details}
<div class="flex gap-4">${articleIcons.quote}<p class="text-base md:text-lg leading-relaxed text-muted-foreground">${esc(content.reflection)}</p></div>
${resources}
${links}
</div>
<a data-testid="blog-post-next" class="group mt-16 flex items-center justify-between gap-6 rounded-3xl border border-border bg-card/60 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-foreground/40 md:p-9" href="${next[0]}.html"><span class="min-w-0"><span class="mono-label text-muted-foreground">Read next</span><span class="mt-2 block truncate font-display text-xl md:text-2xl">${esc(next[1])}</span></span>${articleIcons.arrowRight}</a>
</div></article></main>`;
}

const articleDates = {
  "simulating-cpu-scheduling": "2024-06-10",
  "why-i-love-cpp": "2024-05-28",
  "understanding-cpu-scheduling": "2024-05-15",
  "mind-minute": "2024-04-30",
  "learning-finance-through-code": "2024-04-10",
};

const articleHead = (post) => {
  const slug = post[0];
  const title = post[1];
  const intro = postContent[slug].intro;
  const desc = intro.length > 155 ? intro.slice(0, 152).trimEnd() + "…" : intro;
  const url = `${SITE_URL}/blog/${slug}.html`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#FAF8F5">
  <meta name="description" content="${esc(desc)}">
  <title>${esc(title)} · Anoorag Singh</title>
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Anoorag Singh">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE_URL}/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${SITE_URL}/og-image.jpg">
  <meta property="article:published_time" content="${articleDates[slug]}">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BlogPosting","headline":${JSON.stringify(title)},"description":${JSON.stringify(desc)},"datePublished":"${articleDates[slug]}","author":{"@type":"Person","name":"Anoorag Singh","url":"${SITE_URL}/"},"url":"${url}","image":"${SITE_URL}/og-image.jpg"}</script>
  <link rel="icon" type="image/png" href="../favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/site.css">
  <link rel="stylesheet" href="../assets/site-extra.css">
  <script>try{var t=localStorage.getItem("as-theme");"dark"===t&&document.documentElement.classList.add("dark")}catch(e){}</script>
</head>`;
};

const articleBody = (contentHtml) => `<body>
  <div id="root">
    <div class="relative min-h-screen bg-background text-foreground antialiased" data-testid="portfolio-app">
      <div class="noise-overlay" aria-hidden="true"></div>
      ${headerHtml}
      ${contentHtml}
      ${footerHtml}
      ${palette}
    </div>
  </div>
  <script src="../assets/lenis.min.js" defer></script>
  <script src="../assets/site.js" defer></script>
</body>
</html>
`;

const page = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#FAF8F5">
  <meta name="description" content="Anoorag Singh — aspiring software developer, B.Tech IT student and sprinter. Projects, skills, writing and contact.">
  <title>Anoorag Singh — Portfolio</title>
  <link rel="canonical" href="${SITE_URL}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Anoorag Singh">
  <meta property="og:title" content="Anoorag Singh — Portfolio">
  <meta property="og:description" content="Anoorag Singh — aspiring software developer, B.Tech IT student and sprinter. Projects, skills, writing and contact.">
  <meta property="og:url" content="${SITE_URL}/">
  <meta property="og:image" content="${SITE_URL}/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Anoorag Singh — Portfolio">
  <meta name="twitter:description" content="Anoorag Singh — aspiring software developer, B.Tech IT student and sprinter. Projects, skills, writing and contact.">
  <meta name="twitter:image" content="${SITE_URL}/og-image.jpg">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Anoorag Singh","url":"${SITE_URL}/","image":"${SITE_URL}/og-image.jpg","jobTitle":"Software Developer","sameAs":["https://github.com/anooragsingh07","https://linkedin.com/in/anooragsingh","https://x.com/code_anoorag","https://medium.com/@anooragsingh0007","https://codolio.com/profile/Anoorag%20Singh"]}</script>
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/site.css">
  <link rel="stylesheet" href="assets/site-extra.css">
  <script>try{var t=localStorage.getItem("as-theme");"dark"===t&&document.documentElement.classList.add("dark")}catch(e){}</script>
</head>
<body>
  <div id="root">
    <div class="relative min-h-screen bg-background text-foreground antialiased" data-testid="portfolio-app">
      <div class="noise-overlay" aria-hidden="true"></div>
      ${headerHtml}
      ${mainHtml}
      ${footerHtml}
      ${palette}
    </div>
  </div>
  <script src="assets/lenis.min.js" defer></script>
  <script src="assets/site.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(site, "index.html"), page, "utf8");
console.log("written", page.length);

posts.forEach((post, index) => {
  const next = posts[(index + 1) % posts.length];
  const articlePage = articleHead(post) + articleBody(articleMarkup(post, next));
  fs.writeFileSync(path.join(site, "blog", `${post[0]}.html`), articlePage, "utf8");
  console.log("written blog/" + post[0] + ".html", articlePage.length);
});

/* ---------- crawler files ---------- */
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(site, "robots.txt"), robots, "utf8");

const sitemapUrls = [
  { loc: `${SITE_URL}/`, lastmod: SITE_UPDATED },
  ...posts.map((post) => ({ loc: `${SITE_URL}/blog/${post[0]}.html`, lastmod: articleDates[post[0]] })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`)
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(site, "sitemap.xml"), sitemap, "utf8");
console.log("written robots.txt + sitemap.xml");
