import { chromium } from "playwright";
import fs from "fs";

const base = "http://127.0.0.1:8000/";
const results = [];
const record = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;

const browser = await chromium.launch({ channel: "chromium" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, acceptDownloads: true });
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: "http://127.0.0.1:8000" });
const page = await context.newPage();
const consoleErrors = [];
const failedRequests = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
page.on("pageerror", (e) => consoleErrors.push("PAGEERROR: " + e.message));
page.on("requestfailed", (r) => failedRequests.push(r.url() + " " + r.failure()?.errorText));
await page.goto(base, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(2600);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

const top = (sel) => page.evaluate((s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY), sel);
const scrollY = () => page.evaluate(() => Math.round(scrollY));
const sectionTop = async (id) => (await top(`#${id}`)) - 72;

/* nav */
for (const id of ["education", "projects", "skills", "about", "blog", "contact"]) {
  const expected = await sectionTop(id);
  await page.click(`[data-testid="nav-link-${id}"]`);
  await wait(2300);
  const y = await scrollY();
  record(`nav ${id}`, near(y, expected, 2), `y=${y} expected=${expected}`);
  const scrolled = await page.evaluate(() => document.querySelector("[data-header]").classList.contains("is-scrolled"));
  record(`nav ${id} header scrolled`, scrolled);
}
/* home button from bottom */
await page.click('[data-testid="nav-home-button"]');
await wait(2300);
record("nav home button top", (await scrollY()) <= 1, `y=${await scrollY()}`);
/* hero CTA */
const contactTop = await sectionTop("contact");
await page.click('[data-testid="hero-cta-contact"]');
await wait(2300);
record("hero get in touch", near(await scrollY(), contactTop, 2), `y=${await scrollY()} expected=${contactTop}`);
/* footer back to top */
await page.evaluate(() => document.querySelector('[data-back-to-top]').scrollIntoView({ block: "center", behavior: "instant" }));
await wait(500);
await page.click("[data-back-to-top]");
await wait(2300);
record("footer back to top", (await scrollY()) <= 1, `y=${await scrollY()}`);

/* static link contracts */
const links = await page.evaluate(() => {
  const get = (sel) => document.querySelector(sel)?.getAttribute("href") || null;
  const testids = {};
  for (const el of document.querySelectorAll("[data-testid]")) {
    const id = el.getAttribute("data-testid");
    if (!(id in testids)) testids[id] = [];
    testids[id].push({ href: el.getAttribute("href"), target: el.getAttribute("target"), text: el.textContent.trim().slice(0, 80) });
  }
  return {
    socials: [
      ["github", get('[data-testid="social-github-link"]')],
      ["linkedin", get('[data-testid="social-linkedin-link"]')],
      ["x", get('[data-testid="social-x-link"]')],
      ["medium", get('[data-testid="platform-card-medium"]')],
      ["codolio", get('[data-testid="social-codolio-link"]')],
    ],
    resume: get('[data-testid="hero-cta-resume"]'),
    resumeTarget: document.querySelector('[data-testid="hero-cta-resume"]')?.getAttribute("target"),
    resumeDownload: document.querySelector('[data-testid="hero-cta-resume"]')?.getAttribute("download"),
    email: get('[data-testid="contact-email-link"]'),
    phone: get('[data-testid="contact-phone-link"]'),
    contactResume: get('[data-testid="contact-resume-link"]'),
    blog: [...document.querySelectorAll('[data-testid^="blog-article-"][href]')].map((a) => [a.getAttribute("data-testid"), a.getAttribute("href")]),
    projects: [...document.querySelectorAll('article[data-testid^="project-card-"]')].map((el) => ({
      testid: el.getAttribute("data-testid"),
      links: [...el.querySelectorAll('a[data-testid$="-live-link"], a[data-testid$="-github-link"]')].map((a) => [a.getAttribute("data-testid"), a.getAttribute("href"), a.getAttribute("target")]),
    })),
    githubMore: get('[data-testid="blog-archive-link"]'),
    year: document.querySelector("[data-year]")?.textContent,
  };
});
const expectedSocials = {
  github: "https://github.com/anooragsingh07",
  linkedin: "https://linkedin.com/in/anooragsingh",
  x: "https://x.com/code_anoorag",
  medium: "https://medium.com/@anooragsingh0007",
  codolio: "https://codolio.com/profile/Anoorag%20Singh",
};
record("social links", links.socials.every(([k, v]) => v === expectedSocials[k]), JSON.stringify(links.socials));
record("resume link", links.resume === "resume/Resume.pdf" && links.resumeTarget === "_blank" && links.resumeDownload === null, `${links.resume} / target=${links.resumeTarget} / download=${links.resumeDownload}`);
record("contact resume link", links.contactResume === "resume/Resume.pdf", String(links.contactResume));
record("email link", links.email === "mailto:anooragsingh0007@gmail.com", String(links.email));
record("phone link", links.phone === "tel:+919571375741", String(links.phone));
record("footer year", links.year === String(new Date().getFullYear()), String(links.year));
record("blog links", links.blog.length === 5 && links.blog.every(([id, href]) => href === "blog/" + id.replace("blog-article-", "") + ".html"), JSON.stringify(links.blog));
record("github more writing", links.githubMore === "https://github.com/anooragsingh07", String(links.githubMore));
record("project cards", links.projects.length === 10, `count=${links.projects.length}`);
const allProjectLinks = links.projects.flatMap((p) => p.links);
record("project links external", allProjectLinks.length >= 13 && allProjectLinks.every(([, href, target]) => /^https:\/\//.test(href) && target === "_blank"), `count=${allProjectLinks.length}`);
for (const p of links.projects) record(`project ${p.testid}`, p.links.length >= 1, p.links.map((l) => l[1]).join(" | "));

/* resume opens in a new tab (no forced download) */
try {
  let gotDownload = false;
  const onDownload = () => { gotDownload = true; };
  page.on("download", onDownload);
  const [popup] = await Promise.all([page.waitForEvent("popup", { timeout: 10000 }), page.click('[data-testid="hero-cta-resume"]')]);
  await popup.waitForLoadState("domcontentloaded", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  const popupUrl = popup.url();
  record("resume opens in new tab", popupUrl.includes("resume/Resume.pdf") && !gotDownload, `${popupUrl} download=${gotDownload}`);
  page.off("download", onDownload);
  await popup.close().catch(() => {});
} catch (e) {
  record("resume opens in new tab", false, String(e));
}

/* contact copy buttons */
await page.evaluate(() => document.getElementById("contact").scrollIntoView({ block: "start", behavior: "instant" }));
await wait(800);
for (const [kind, expected] of [["email", "anooragsingh0007@gmail.com"], ["phone", "+91 9571375741"]]) {
  const buttonSel = `[data-testid="contact-${kind}-link-copy-button"]`;
  await page.click(buttonSel);
  await wait(250);
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  const isCheck = await page.evaluate((sel) => document.querySelector(sel).innerHTML.includes("lucide-check"), buttonSel);
  record(`copy ${kind}`, copied === expected && isCheck, `copied=${copied}`);
  await wait(1900);
  const reverted = await page.evaluate((sel) => document.querySelector(sel).innerHTML.includes("lucide-copy"), buttonSel);
  record(`copy ${kind} reverts`, reverted);
}

/* theme */
await page.evaluate(() => window.scrollTo(0, 0));
await wait(500);
await page.click("[data-theme-toggle]");
await wait(800);
const darkState = await page.evaluate(() => ({
  dark: document.documentElement.classList.contains("dark"),
  stored: localStorage.getItem("as-theme"),
  darkImage: getComputedStyle(document.querySelector('[data-testid="hero-portrait-image-dark"]')).display,
  lightImage: getComputedStyle(document.querySelector('[data-testid="hero-portrait-image"]')).display,
  sun: document.querySelector("[data-theme-icon]").innerHTML.includes("lucide-sun"),
  bg: getComputedStyle(document.body).backgroundColor,
}));
record("theme dark", darkState.dark && darkState.stored === "dark" && darkState.sun && darkState.bg === "rgb(13, 13, 12)", JSON.stringify(darkState));
record("theme dark portrait", darkState.darkImage === "block" && darkState.lightImage === "none", `${darkState.darkImage}/${darkState.lightImage}`);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const persisted = await page.evaluate(() => ({
  dark: document.documentElement.classList.contains("dark"),
  sun: document.querySelector("[data-theme-icon]").innerHTML.includes("lucide-sun"),
  stored: localStorage.getItem("as-theme"),
}));
record("theme persists reload", persisted.dark && persisted.sun && persisted.stored === "dark", JSON.stringify(persisted));
await page.click("[data-theme-toggle]");
await wait(700);
record("theme back to light", await page.evaluate(() => !document.documentElement.classList.contains("dark") && localStorage.getItem("as-theme") === "light"));

/* palette */
const openPalette = async () => {
  await page.keyboard.press("Control+K");
  await wait(450);
};
await openPalette();
const paletteOpen = await page.evaluate(() => {
  const p = document.querySelector("[data-palette]");
  return {
    hidden: p.hidden,
    state: p.dataset.state,
    focus: document.activeElement?.getAttribute("data-testid"),
    selected: p.querySelector('[data-selected="true"]')?.getAttribute("data-testid"),
    items: p.querySelectorAll("[data-cmd-item]").length,
    groups: [...p.querySelectorAll("[data-cmd-group]")].map((g) => g.querySelector("[cmdk-group-heading]").textContent),
    overflow: document.body.style.overflow,
  };
});
record("palette opens", !paletteOpen.hidden && paletteOpen.state === "open" && paletteOpen.focus === "cmd-k-input" && paletteOpen.overflow === "hidden", JSON.stringify(paletteOpen));
record("palette content", paletteOpen.items === 31 && JSON.stringify(paletteOpen.groups) === JSON.stringify(["Navigation", "Actions", "Projects", "Writing", "Socials"]) && paletteOpen.selected === "cmd-nav-home", `items=${paletteOpen.items}`);
await page.keyboard.press("Tab");
await wait(150);
record("palette focus trap", (await page.evaluate(() => document.activeElement?.getAttribute("data-testid"))) === "cmd-k-input");
await page.keyboard.press("ArrowDown");
await wait(120);
const down1 = await page.evaluate(() => document.querySelector("[data-selected='true']")?.getAttribute("data-testid"));
await page.keyboard.press("ArrowUp");
await wait(120);
const up1 = await page.evaluate(() => document.querySelector("[data-selected='true']")?.getAttribute("data-testid"));
record("palette arrows", down1 === "cmd-nav-education" && up1 === "cmd-nav-home", `${down1} / ${up1}`);
await page.keyboard.type("cpu");
await wait(250);
const filter = await page.evaluate(() => ({
  visible: [...document.querySelectorAll("[data-cmd-item]")].filter((i) => !i.hidden).map((i) => i.getAttribute("data-testid")),
  groups: [...document.querySelectorAll("[data-cmd-group]")].filter((g) => !g.hidden).map((g) => g.querySelector("[cmdk-group-heading]").textContent),
  empty: !document.querySelector("[data-cmd-empty]").hidden,
}));
record("palette filter", filter.visible.includes("cmd-project-cpu-schedsim") && filter.groups.join(",") === "Projects,Writing" && !filter.empty, JSON.stringify(filter));
await page.keyboard.type("zzzz");
await wait(250);
record("palette empty", await page.evaluate(() => !document.querySelector("[data-cmd-empty]").hidden));
await page.keyboard.press("Control+A");
await page.keyboard.press("Backspace");
await wait(250);
record("palette restores", await page.evaluate(() => [...document.querySelectorAll("[data-cmd-item]")].filter((i) => !i.hidden).length === 31));
await page.keyboard.press("Escape");
await wait(350);
record("palette escape", await page.evaluate(() => document.querySelector("[data-palette]").hidden && document.body.style.overflow === ""));
/* trigger click + overlay close */
await page.click("[data-open-palette]");
await wait(400);
record("palette trigger click", await page.evaluate(() => !document.querySelector("[data-palette]").hidden));
await page.mouse.click(10, 10);
await wait(350);
record("palette overlay close", await page.evaluate(() => document.querySelector("[data-palette]").hidden));
/* palette copy email */
await openPalette();
await page.click('[data-testid="cmd-action-copy-email"]');
await wait(300);
const paletteCopied = await page.evaluate(() => navigator.clipboard.readText());
record("palette copy email", paletteCopied === "anooragsingh0007@gmail.com", paletteCopied);
/* palette theme */
await openPalette();
await page.click('[data-testid="cmd-action-theme"]');
await wait(500);
record("palette theme", await page.evaluate(() => document.documentElement.classList.contains("dark")));
await openPalette();
await page.click('[data-testid="cmd-action-theme"]');
await wait(500);
record("palette theme restore", await page.evaluate(() => !document.documentElement.classList.contains("dark")));
/* palette nav by click */
const paletteContactTop = await sectionTop("contact");
await openPalette();
await page.keyboard.type("contact");
await wait(250);
await page.keyboard.press("Enter");
await wait(2400);
record("palette nav enter", near(await scrollY(), paletteContactTop, 2), `y=${await scrollY()} expected=${paletteContactTop}`);
/* palette project opens new tab */
await page.evaluate(() => { window.__origOpen = window.open; window.__opened = []; window.open = (u, t) => { window.__opened.push([u, t]); return null; }; });
await openPalette();
await page.click('[data-testid="cmd-project-simple-ai-assistant"]');
await wait(300);
const openedProject = await page.evaluate(() => window.__opened);
record("palette project opens", openedProject.length === 1 && openedProject[0][0] === "https://github.com/anooragsingh07/Simple-AI-Assistant" && openedProject[0][1] === "_blank", JSON.stringify(openedProject));
/* palette social opens new tab */
await openPalette();
await page.click('[data-testid="cmd-social-linkedin"]');
await wait(300);
const openedSocial = await page.evaluate(() => window.__opened);
record("palette social opens", openedSocial.length === 2 && openedSocial[1][0] === "https://linkedin.com/in/anooragsingh", JSON.stringify(openedSocial[1]));
/* palette email mailto */
await openPalette();
await page.click('[data-testid="cmd-action-email"]');
await wait(300);
const openedEmail = await page.evaluate(() => window.__opened);
record("palette email mailto", openedEmail.length === 3 && openedEmail[2][0] === "mailto:anooragsingh0007@gmail.com" && openedEmail[2][1] === "_self", JSON.stringify(openedEmail[2]));
await page.evaluate(() => { window.open = window.__origOpen; });
/* palette resume download */
await openPalette();
try {
  const [download] = await Promise.all([page.waitForEvent("download", { timeout: 10000 }), page.click('[data-testid="cmd-action-resume"]')]);
  record("palette resume download", download.suggestedFilename() === "Anoorag_Singh_Resume.pdf", download.suggestedFilename());
} catch (e) {
  record("palette resume download", false, String(e));
}
/* palette blog navigation */
await openPalette();
await page.keyboard.type("mindminute");
await wait(200);
await page.click('[data-testid="cmd-blog-mind-minute"]');
await page.waitForURL("**/blog/mind-minute.html", { timeout: 10000 });
await page.waitForLoadState("networkidle");
await wait(1600);
record("palette blog navigation", page.url().endsWith("/blog/mind-minute.html") && (await page.locator("h1").innerText()).includes("MindMinute"), page.url());
/* article back to blog */
const blogExpected = await (async () => {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  return (await top("#blog")) - 72;
})();
await page.goto(base + "blog/mind-minute.html", { waitUntil: "networkidle" });
await page.waitForTimeout(1600);
await page.click('[data-testid="blog-post-back"]');
await page.waitForLoadState("networkidle");
await page.waitForTimeout(3000);
record("article all posts back", page.url().endsWith("/") && near(await scrollY(), blogExpected, 3), `url=${page.url()} y=${await scrollY()} expected=${blogExpected}`);
/* article chain */
const order = ["simulating-cpu-scheduling", "why-i-love-cpp", "understanding-cpu-scheduling", "mind-minute", "learning-finance-through-code"];
for (let i = 0; i < order.length; i++) {
  const slug = order[i];
  await page.goto(`${base}blog/${slug}.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  const info = await page.evaluate(() => ({
    testid: document.querySelector("main")?.getAttribute("data-testid"),
    h1: document.querySelector("h1")?.textContent,
    next: document.querySelector('[data-testid="blog-post-next"]')?.getAttribute("href"),
    nextTitle: document.querySelector('[data-testid="blog-post-next"] .font-display')?.textContent,
    links: [...document.querySelectorAll('[data-testid^="blog-post-link-"]')].map((a) => [a.getAttribute("data-testid"), a.getAttribute("href")]),
    resources: [...document.querySelectorAll('[data-testid="blog-post-resources"] span')].map((s) => s.textContent),
    detail: document.querySelector('[data-testid="blog-post-detail"]')?.innerText.replace(/\n/g, " | "),
    meta: document.querySelector('[data-testid="blog-post-meta"]')?.innerText.replace(/\n/g, " "),
  }));
  const expectedNext = order[(i + 1) % order.length];
  const ok = info.testid === "blog-post-page" && info.next === `${expectedNext}.html` && info.resources.length > 0 && !page.url().includes("mindminute");
  record(`article ${slug}`, ok, JSON.stringify(info).slice(0, 350));
}
/* article theme + palette + footer */
await page.goto(base + "blog/simulating-cpu-scheduling.html", { waitUntil: "networkidle" });
await page.waitForTimeout(1600);
await page.click("[data-theme-toggle]");
await wait(500);
record("article theme toggle", await page.evaluate(() => document.documentElement.classList.contains("dark")));
await page.click("[data-theme-toggle]");
await wait(400);
await page.keyboard.press("Control+K");
await wait(400);
record("article palette opens", await page.evaluate(() => !document.querySelector("[data-palette]").hidden));
await page.click('[data-testid="cmd-blog-why-i-love-cpp"]');
await page.waitForLoadState("networkidle");
await wait(1000);
record("article palette post nav", page.url().endsWith("/blog/why-i-love-cpp.html"), page.url());
await page.evaluate(() => document.querySelector("[data-back-to-top]").scrollIntoView({ block: "center" }));
await wait(300);
await page.click("[data-back-to-top]");
await wait(1800);
record("article back to top", (await scrollY()) <= 1, `y=${await scrollY()}`);

/* mobile */
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
const mobile = await page.evaluate(() => ({
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  navVisible: getComputedStyle(document.querySelector("header nav")).display !== "none",
  nameVisible: getComputedStyle(document.querySelector('[data-testid="nav-home-button"] .mono-label')).display !== "none",
  h1: document.querySelector("h1")?.getBoundingClientRect().right <= 390,
}));
record("mobile no overflow", !mobile.overflow, JSON.stringify(mobile));
record("mobile nav hidden", !mobile.navVisible && !mobile.nameVisible);
await page.keyboard.press("Control+K");
await wait(450);
const mobilePalette = await page.evaluate(() => {
  const r = document.querySelector("[data-palette]").getBoundingClientRect();
  return { left: r.left, right: r.right, width: r.width, fits: r.left >= 0 && r.right <= 390 };
});
record("mobile palette fits", mobilePalette.fits, JSON.stringify(mobilePalette));
await page.keyboard.press("Escape");
await wait(300);
await page.goto(base + "blog/simulating-cpu-scheduling.html", { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
record("mobile article no overflow", await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));

/* reveal sweep back at desktop */
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base, { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
const height = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < height; y += 400) {
  await page.evaluate((v) => window.scrollTo(0, v), y);
  await page.waitForTimeout(40);
}
await page.waitForTimeout(600);
const reveals = await page.evaluate(() => ({ total: document.querySelectorAll("[data-reveal]").length, visible: document.querySelectorAll("[data-reveal].is-visible").length }));
record("reveals all visible", reveals.total === 37 && reveals.visible === 37, JSON.stringify(reveals));

record("console errors", consoleErrors.length === 0, consoleErrors.join(" | "));
record("failed requests", failedRequests.length === 0, failedRequests.join(" | "));

const failed = results.filter((r) => !r.ok);
console.log("\nSUMMARY", `${results.length - failed.length}/${results.length} passed`);
if (failed.length) console.log("FAILED:", JSON.stringify(failed, null, 2));
fs.writeFileSync(new URL("./interaction-results.json", import.meta.url), JSON.stringify({ results, consoleErrors, failedRequests }, null, 2));
await browser.close();
