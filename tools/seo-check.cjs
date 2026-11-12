const fs = require("fs");
const idx = fs.readFileSync("index.html", "utf8");
const art = fs.readFileSync("blog/simulating-cpu-scheduling.html", "utf8");
const t = art.match(/<title>([^<]*)<\/title>/)[1];
const checks = {
  "index em-dash in title": idx.includes("Anoorag Singh \u2014 Portfolio"),
  "index canonical": idx.includes('rel="canonical" href="https://anoorag.tech/"'),
  "index og:image absolute": idx.includes('content="https://anoorag.tech/og-image.jpg"'),
  "index favicon.png": idx.includes('href="favicon.png"'),
  "index Person JSON-LD parses": !!JSON.parse(idx.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)[1]).name,
  "index webp imgs (2)": (idx.match(/astronaut_avatar(_dark)?\.webp/g) || []).length === 2,
  "index no png avatar refs": !idx.includes('astronaut_avatar.png"'),
  "article title unique": t.includes("\u00b7") && t.includes("Simulating CPU Scheduling"),
  "article canonical": art.includes('rel="canonical" href="https://anoorag.tech/blog/simulating-cpu-scheduling.html"'),
  "article og:type article": art.includes('property="og:type" content="article"'),
  "article BlogPosting parses": JSON.parse(art.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)[1]).datePublished === "2024-06-10",
  "article favicon ../favicon.png": art.includes('href="../favicon.png"'),
  "article description is intro": art.includes('name="description" content="Understanding Operating Systems'),
  "robots has sitemap": fs.readFileSync("robots.txt", "utf8").includes("Sitemap: https://anoorag.tech/sitemap.xml"),
  "sitemap has 6 urls": (fs.readFileSync("sitemap.xml", "utf8").match(/<url>/g) || []).length === 6,
  "sitemap valid xml head": fs.readFileSync("sitemap.xml", "utf8").startsWith("<?xml"),
};
let pass = 0;
let fail = 0;
for (const [k, v] of Object.entries(checks)) {
  console.log((v ? "PASS " : "FAIL ") + k);
  v ? pass++ : fail++;
}
console.log(`SUMMARY ${pass}/${pass + fail}`);
process.exit(fail ? 1 : 0);
