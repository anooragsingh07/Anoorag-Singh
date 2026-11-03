(() => {
  'use strict';

  // Edit this object to keep the widget current. Project details are intentionally placeholders.
  const developerConfig = {
    name: 'Anoorag Singh',
    role: 'Software Developer',
    availability: 'available',
    availabilityText: 'Open to good opportunities',
    availabilityItems: ['Open to good opportunities'],
    currentProject: {
      title: 'Add your current project',
      description: 'Update this with a project you are currently working on.',
      url: ''
    },
    technologies: ['C++', 'Python', 'JavaScript', 'Node.js', 'Express', 'PostgreSQL'],
    github: { username: 'anooragsingh07', enabled: true }
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const safeUrl = (value) => {
    try { const url = new URL(value, document.baseURI); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };

  const profileUrl = `https://github.com/${encodeURIComponent(developerConfig.github.username)}`;
  const root = document.createElement('aside');
  root.className = 'developer-status';
  root.dataset.availability = developerConfig.availability;
  root.setAttribute('aria-label', 'Developer status');
  const availability = developerConfig.availabilityItems.length
    ? developerConfig.availabilityItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')
    : '<li>Update availability details in developer-status.js.</li>';
  const projectUrl = developerConfig.currentProject.url ? safeUrl(developerConfig.currentProject.url) : '';
  root.innerHTML = `
    <section class="developer-status-card" id="developer-status-card" aria-label="Developer status details" aria-hidden="true" inert>
      <header class="developer-status-header">
        <div><span class="developer-status-eyebrow">CURRENT STATUS</span><h2>${escapeHtml(developerConfig.name)}</h2><p>${escapeHtml(developerConfig.role)}</p></div>
        <button class="developer-status-close" type="button" aria-label="Close developer status">×</button>
      </header>
      <div class="developer-status-section"><h3>Availability</h3><ul>${availability}</ul></div>
      <div class="developer-status-section"><h3>Currently working on</h3><h4>${escapeHtml(developerConfig.currentProject.title)}</h4><p>${escapeHtml(developerConfig.currentProject.description)}</p>${projectUrl ? `<a class="developer-status-link" href="${escapeHtml(projectUrl)}" target="_blank" rel="noopener noreferrer">View project ↗</a>` : ''}</div>
      <div class="developer-status-section"><h3>Technologies</h3><div class="developer-status-tags">${developerConfig.technologies.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div></div>
      <div class="developer-status-section developer-status-github"><h3>GitHub activity</h3><p class="developer-status-github-result" aria-live="polite">${developerConfig.github.enabled ? 'Checking public repository information…' : 'GitHub activity is disabled.'}</p><a class="developer-status-link" href="${profileUrl}" target="_blank" rel="noopener noreferrer">@${escapeHtml(developerConfig.github.username)} on GitHub ↗</a><small>Public repository metadata only; this does not represent all coding activity.</small></div>
    </section>
    <button class="developer-status-toggle" type="button" aria-expanded="false" aria-controls="developer-status-card"><span class="developer-status-dot" aria-hidden="true"></span><span>${escapeHtml(developerConfig.availabilityText)}</span><span class="developer-status-chevron" aria-hidden="true">↗</span></button>`;
  document.body.append(root);

  const toggle = root.querySelector('.developer-status-toggle');
  const card = root.querySelector('.developer-status-card');
  const closeButton = root.querySelector('.developer-status-close');
  const githubResult = root.querySelector('.developer-status-github-result');
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    card.setAttribute('aria-hidden', String(!open));
    card.inert = !open;
    root.classList.toggle('is-open', open);
    if (open) closeButton.focus();
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  closeButton.addEventListener('click', () => { setOpen(false); toggle.focus(); });
  document.addEventListener('pointerdown', (event) => { if (!root.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });

  if (!developerConfig.github.enabled || !developerConfig.github.username) return;
  const cacheKey = `developer-status:github:${developerConfig.github.username}`;
  const cacheDuration = 30 * 60 * 1000;
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch { /* Storage may be unavailable. */ }
  const renderRepository = (repository, note = '') => {
    if (!repository) {
      githubResult.textContent = 'No public repositories are available to display yet.';
      return;
    }
    const name = document.createElement('a');
    name.className = 'developer-status-link';
    name.href = safeUrl(repository.html_url) || profileUrl;
    name.target = '_blank'; name.rel = 'noopener noreferrer';
    name.textContent = repository.name || 'Public repository';
    const description = document.createElement('span');
    description.className = 'developer-status-repo-description';
    description.textContent = repository.description || 'No public description provided.';
    const meta = document.createElement('span');
    meta.className = 'developer-status-repo-meta';
    meta.textContent = repository.updated_at ? `Repository metadata updated ${new Date(repository.updated_at).toLocaleDateString()}` : 'Public repository';
    githubResult.replaceChildren(name, description, meta);
    if (note) { const cachedNote = document.createElement('small'); cachedNote.textContent = note; githubResult.append(cachedNote); }
  };
  if (cached?.savedAt && Date.now() - cached.savedAt < cacheDuration) renderRepository(cached.repository);
  else if (cached?.repository) renderRepository(cached.repository, 'Showing saved public repository information while refreshing.');

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  fetch(`https://api.github.com/users/${encodeURIComponent(developerConfig.github.username)}/repos?type=owner&sort=updated&per_page=1`, {
    headers: { Accept: 'application/vnd.github+json' }, signal: controller.signal
  }).then(async (response) => {
    if (!response.ok) throw new Error(response.status === 403 || response.status === 429 ? 'rate-limit' : 'request-failed');
    const repositories = await response.json();
    const repository = Array.isArray(repositories) ? repositories[0] || null : null;
    try { localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), repository })); } catch { /* Cache is optional. */ }
    renderRepository(repository);
  }).catch(() => {
    if (cached?.repository) renderRepository(cached.repository, 'Could not refresh GitHub information. Showing saved data.');
    else githubResult.textContent = 'Public repository information is currently unavailable. Visit the GitHub profile to explore.';
  }).finally(() => window.clearTimeout(timeout));
})();
