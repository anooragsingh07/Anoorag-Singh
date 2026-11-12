import { chromium } from "playwright";

const base = "http://127.0.0.1:8000/";
const paths = ["", "blog/simulating-cpu-scheduling.html", "blog/why-i-love-cpp.html", "blog/understanding-cpu-scheduling.html", "blog/mind-minute.html", "blog/learning-finance-through-code.html"];
const viewports = [[1920, 1080], [1440, 900], [1366, 768], [1024, 768], [768, 1024], [390, 844], [375, 812]];
const browser = await chromium.launch({ channel: "chromium" });
let pass = 0;
let fail = 0;
for (const [w, h] of viewports) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("requestfailed", (r) => errors.push("REQFAIL: " + r.url()));
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForTimeout(900);
    const info = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
      sh: document.documentElement.scrollHeight,
    }));
    const ok = info.sw <= info.cw;
    if (ok) pass++; else fail++;
    console.log(`${w}x${h} ${p || "index.html"} overflow=${!ok} sw=${info.sw} cw=${info.cw} sh=${info.sh}`);
  }
  if (errors.length) console.log(`ERRORS ${w}x${h}`, errors);
  await page.close();
}
console.log("PASS", pass, "FAIL", fail);
await browser.close();
