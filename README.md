# Anoorag Singh — Portfolio

This is the personal portfolio website of Anoorag Singh, showcasing projects, skills, education, writing, and contact information.

## Features
- Responsive editorial portfolio with light and dark themes
- Interactive profile cards, project previews, and a Ctrl/Cmd+K command palette
- Résumé that opens in a new browser tab (`resume/Resume.pdf`)
- Five full article pages and a writing archive
- Static HTML, CSS, and JavaScript; no framework, no client-side build step

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/anooragsingh07/Anoorag-Singh.git
   ```
2. **Navigate to the project folder:**
   ```bash
   cd Anoorag-Singh
   ```
3. **Open `index.html` in your browser** or use a local server:
   ```bash
   python -m http.server 8000
   ```
   Then visit [http://localhost:8000](http://localhost:8000)

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html`, `blog/*.html` | Generated pages — **do not hand-edit**; regenerate instead |
| `assets/` | `site.css`, `site.js`, `site-extra.css`, Lenis smooth-scroll |
| `tools/build.cjs` | Generator: rebuilds the homepage and all five articles from `tools/ref/page.html`, plus `robots.txt` and `sitemap.xml` |
| `tools/seo-check.cjs` | Fast metadata assertions (canonical, Open Graph, JSON-LD, sitemap) |
| `tests/overflow.mjs` | Layout regression: no horizontal overflow at 7 viewports, page-height canary |
| `tests/interactions.mjs` | 80-check interaction suite (nav, links, palette, theme, articles, mobile) |
| `resume/Resume.pdf` | Résumé served by the site |

### Regenerating the pages

```bash
npm install
npm run build   # = node tools/build.cjs
```

### Running the regression suites

```bash
npm install
npx playwright install chromium
python -m http.server 8000 &   # serve the site on :8000
npm test                        # overflow + interaction suites
node tools/seo-check.cjs        # SEO metadata checks
```

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` **tests first, then deploys**: every push to `main` runs the build-freshness check, the SEO checks, the overflow suite, and the 80-check interaction suite; only if all of them pass does the site deploy. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**, then set **Custom domain** to `anoorag.tech`. The repository already has a root `CNAME` file; GitHub Pages requires the custom domain to be configured in settings for an Actions deployment.

SEO basics are wired into the generator: canonical URL, Open Graph / Twitter card tags, `Person` + `BlogPosting` JSON-LD, `robots.txt`, and `sitemap.xml`, all pointing at `https://anoorag.tech`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
