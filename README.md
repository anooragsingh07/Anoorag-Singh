# Anoorag Singh — Portfolio

This is the personal portfolio website of Anoorag Singh, showcasing projects, skills, education, and contact information.

## Features
- Responsive editorial portfolio with light and dark themes
- Interactive profile cards, project previews, and a Ctrl+K command palette
- On-page résumé viewer with download and Google Drive options
- Floating developer status widget with optional public GitHub repository metadata
- Five full article pages and a writing archive
- Static HTML, CSS, and JavaScript; no framework build step

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

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` deploys the repository root when changes are pushed to `main`. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**, then set **Custom domain** to `anoorag.tech`. The repository already has a root `CNAME` file; GitHub Pages requires the custom domain to be configured in settings for an Actions deployment.

The published site uses the files at the root directly, including `index.html`, `blog.html`, the `blog/` article pages, `portfolio-enhancements.css`, `portfolio-enhancements.js`, the résumé PDF, and the avatar images. There is no install or build command.

## Developer status widget

The widget is implemented in `developer-status.js` and `developer-status.css` and is included on the home page, writing archive, and article pages. Edit the `developerConfig` object near the top of `developer-status.js` to update your name, role, availability, current project, technologies, or GitHub username. The current project fields are placeholders until you add the project you are actively working on. GitHub requests use the public REST API without a token; the widget caches the latest public repository metadata in local storage for 30 minutes and shows a profile link if the API is disabled or unavailable. Repository update dates are metadata only and do not represent all coding activity.

For local viewing, open `index.html` in a browser or run:

```bash
python -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
