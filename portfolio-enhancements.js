(() => {
  const projectKinds = {
    assistant: { wash: '#171b36', accent: '#a89aff', glow: '#5de0bd', label: 'LOCAL AI · PYTHON' },
    campus: { wash: '#e7efe8', accent: '#557b67', glow: '#c1d6a7', label: 'CAMPUS CARE · DISPENSARY' },
    flights: { wash: '#101d32', accent: '#70c6ff', glow: '#b7e3ff', label: 'FLIGHTS · BOOKING API' },
    dealership: { wash: '#eee9e0', accent: '#aa714a', glow: '#e8c8a8', label: 'DEALERSHIP · INVENTORY' },
    shopkart: { wash: '#252047', accent: '#aa9bff', glow: '#ffcf9d', label: 'SHOPKART · E-COMMERCE' },
    shelves: { wash: '#e9eee2', accent: '#71805a', glow: '#c0d398', label: 'SMARTSHELF · PANTRY' },
    scheduling: { wash: '#202837', accent: '#89b5e9', glow: '#d1a7fb', label: 'CPU-SCHEDSIM · C++' },
    mindfulness: { wash: '#e9eee8', accent: '#6e9982', glow: '#c3d8c6', label: 'MIND MINUTE · PAUSE' },
    finance: { wash: '#e8edf0', accent: '#567d88', glow: '#a6d3c1', label: 'FINANCE TRACKER · DATA' },
    landing: { wash: '#eee9e4', accent: '#997e68', glow: '#d9c2a9', label: 'LANDING PAGES · UI' }
  };

  const recentProjects = [
    {
      kind: 'assistant', title: 'Simple AI Assistant',
      subtitle: 'Local-LLM assistant with Python tool calling',
      description: 'My latest build — a basic AI assistant running a locally-hosted language model, with Python tool calling through a function-name-to-function mapping, an execution loop that feeds tool results back to the model, and error handling for reliable runs.',
      tags: ['Python', 'Local LLM', 'Tool Calling'],
      github: 'https://github.com/anooragsingh07/Simple-AI-Assistant', date: 'OCT 2026'
    },
    {
      kind: 'campus', title: 'Campus Care',
      subtitle: 'College health-centre portal · Full stack',
      description: 'Full-stack portal for the college dispensary — patients track visit history, doctors record consultations, staff manage medicine stock, admins manage accounts. React 19 + Express 5, JWT in HTTP-only cookies, PostgreSQL.',
      tags: ['React 19', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
      github: 'https://github.com/anooragsingh07/Dispensary-Management-System', date: 'OCT 2026'
    },
    {
      kind: 'flights', title: 'Flights',
      subtitle: 'Flight-management backend service',
      description: 'A Node.js flight & city API service with layered architecture — repositories, services, middlewares, migrations and seeders on a Sequelize ORM setup.',
      tags: ['Node.js', 'Express', 'Sequelize'],
      github: 'https://github.com/anooragsingh07/Flights', date: 'OCT 2026'
    },
    {
      kind: 'dealership', title: 'Car Dealership Inventory',
      subtitle: 'TDD-built inventory & commerce platform',
      description: 'Full-stack dealership system built with Test-Driven Development — RESTful CRUD APIs on PostgreSQL, JWT auth with role-based authorization, a Jest-tested backend, and a React SPA to browse, search and purchase vehicles.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'JWT', 'Jest'],
      github: 'https://github.com/anooragsingh07/Car-Dealership-Inventory-System',
      live: 'https://car-dealership-inventory-system-jk1.vercel.app/', date: 'AUG 2026'
    },
    {
      kind: 'scheduling', title: 'CPU-SchedSim',
      subtitle: 'CPU scheduling simulator in C++',
      description: 'A C++ simulator built on OOP and the STL — FCFS, SJF, Round-Robin and Priority scheduling with waiting, turnaround and response-time metrics, plus context switching, preemption and configurable time slices.',
      tags: ['C++', 'STL', 'OOP', 'Algorithms'],
      github: 'https://github.com/anooragsingh07/CPU-SchedSim--CPU-Scheduling-Simulator-',
      live: 'https://anooragsingh07.github.io/CPU-SchedSim--CPU-Scheduling-Simulator-/', date: 'MAY 2026'
    },
    {
      kind: 'shopkart', title: 'ShopKart',
      subtitle: 'Full-stack e-commerce store',
      description: 'Minimal full-stack e-commerce app — product, cart and order APIs with a React (Vite) frontend served from Node.js, Express and MySQL.',
      tags: ['React', 'Node.js', 'Express', 'MySQL'],
      github: 'https://github.com/anooragsingh07/Assignment-SDE',
      live: 'https://frontend-production-c204.up.railway.app/', date: 'APR 2026'
    },
    {
      kind: 'shelves', title: 'SmartShelf',
      subtitle: 'Kitchen inventory, in the browser',
      description: 'A browser-based kitchen inventory tool with localStorage persistence, automated expiry alerts, and a downloadable shopping list. Light/dark mode, real-time filtering, no login required.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/anooragsingh07/Smart-Shelf',
      live: 'https://anooragsingh07.github.io/Smart-Shelf/', date: 'MAY 2025'
    },
    {
      kind: 'mindfulness', title: 'Mind Minute',
      subtitle: 'One-minute wellness breaks',
      description: 'A lightweight wellness web app for 1-minute stress relief — guided breathing, yoga and mindfulness exercises with CSS-animated timers. Fully responsive, no backend.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/anooragsingh07/Mind-Minute',
      live: 'https://anooragsingh07.github.io/Mind-Minute/', date: 'MAY 2025'
    },
    {
      kind: 'finance', title: 'Student Finance Tracker',
      subtitle: 'Budgets with real-time insight',
      description: 'A student-focused finance tracker with real-time dashboards and budget insights built on Chart.js — transaction management, category filters and offline localStorage persistence.',
      tags: ['JavaScript', 'Chart.js', 'localStorage'],
      github: 'https://github.com/anooragsingh07/Student-Finance-Tracker/',
      live: 'https://anooragsingh07.github.io/Student-Finance-Tracker/', date: 'MAY 2025'
    },
    {
      kind: 'landing', title: 'Interactive Landing Pages',
      subtitle: 'Responsive UI, refined',
      description: 'Designed and developed interactive landing pages with HTML, Tailwind CSS and Bootstrap — smooth, responsive interfaces built for the first impression.',
      tags: ['HTML', 'Tailwind CSS', 'Bootstrap'],
      github: 'https://github.com/anooragsingh07/Login-Page-using-Tailwind',
      live: 'https://anooragsingh07.github.io/Login-Page-using-Tailwind/', date: 'NOV 2024'
    }
  ];

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  function projectArtwork(kind, title) {
    const palette = projectKinds[kind] || projectKinds.landing;
    const safeTitle = escapeHTML(title);
    const layout = {
      assistant: '<rect x="72" y="132" width="350" height="196" rx="18" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".16"/><circle cx="108" cy="169" r="9" fill="' + palette.glow + '"/><rect x="133" y="160" width="176" height="16" rx="8" fill="#fff" fill-opacity=".65"/><rect x="100" y="204" width="258" height="54" rx="14" fill="#fff" fill-opacity=".1"/><rect x="190" y="270" width="204" height="38" rx="14" fill="' + palette.accent + '" fill-opacity=".82"/><path d="M550 152h173M550 177h126M550 202h155M550 253h147M550 278h104" stroke="#fff" stroke-opacity=".52" stroke-width="8" stroke-linecap="round"/>',
      campus: '<rect x="68" y="120" width="684" height="250" rx="18" fill="#fff" fill-opacity=".72"/><rect x="68" y="120" width="684" height="42" rx="18" fill="#fff" fill-opacity=".8"/><circle cx="94" cy="141" r="5" fill="' + palette.accent + '"/><circle cx="111" cy="141" r="5" fill="' + palette.glow + '"/><rect x="102" y="189" width="169" height="143" rx="14" fill="' + palette.glow + '" fill-opacity=".65"/><path d="M126 294v-48h20v48m21 0v-76h20v76m21 0v-58h20v58" stroke="' + palette.accent + '" stroke-width="10" stroke-linecap="round"/><rect x="300" y="190" width="416" height="34" rx="10" fill="' + palette.accent + '" fill-opacity=".14"/><rect x="300" y="246" width="354" height="16" rx="8" fill="' + palette.accent + '" fill-opacity=".28"/><rect x="300" y="278" width="268" height="16" rx="8" fill="' + palette.accent + '" fill-opacity=".2"/><rect x="300" y="310" width="318" height="16" rx="8" fill="' + palette.accent + '" fill-opacity=".14"/>',
      flights: '<path d="M92 222h286M442 222h280" stroke="#fff" stroke-opacity=".2" stroke-width="2" stroke-dasharray="8 10"/><circle cx="382" cy="222" r="12" fill="' + palette.glow + '"/><path d="m382 182 14 40-14 40-14-40z" fill="' + palette.accent + '"/><rect x="76" y="123" width="254" height="78" rx="14" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".14"/><rect x="486" y="243" width="254" height="78" rx="14" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".14"/><text x="102" y="158" fill="#fff" fill-opacity=".55" font-size="13" font-family="monospace">FROM</text><text x="102" y="185" fill="#fff" font-size="20" font-family="sans-serif">DEL · Delhi</text><text x="514" y="279" fill="#fff" fill-opacity=".55" font-size="13" font-family="monospace">TO</text><text x="514" y="306" fill="#fff" font-size="20" font-family="sans-serif">BOM · Mumbai</text>',
      dealership: '<rect x="72" y="118" width="676" height="252" rx="18" fill="#fff" fill-opacity=".76"/><rect x="98" y="148" width="162" height="96" rx="13" fill="' + palette.glow + '"/><path d="M119 214 134 185h93l19 29v16H119z" fill="' + palette.accent + '"/><circle cx="144" cy="231" r="11" fill="#fff"/><circle cx="219" cy="231" r="11" fill="#fff"/><rect x="287" y="152" width="421" height="19" rx="9" fill="' + palette.accent + '" fill-opacity=".34"/><rect x="287" y="186" width="334" height="13" rx="6" fill="' + palette.accent + '" fill-opacity=".19"/><rect x="287" y="211" width="371" height="13" rx="6" fill="' + palette.accent + '" fill-opacity=".13"/><rect x="98" y="270" width="610" height="68" rx="11" fill="' + palette.glow + '" fill-opacity=".42"/><path d="M119 303h68m22 0h94m26 0h104m23 0h93m24 0h70" stroke="' + palette.accent + '" stroke-opacity=".5" stroke-width="8" stroke-linecap="round"/>',
      shopkart: '<rect x="73" y="122" width="674" height="252" rx="18" fill="#fff" fill-opacity=".09" stroke="#fff" stroke-opacity=".16"/><rect x="95" y="144" width="630" height="31" rx="9" fill="#fff" fill-opacity=".12"/><circle cx="111" cy="159" r="5" fill="' + palette.glow + '"/><rect x="565" y="154" width="118" height="10" rx="5" fill="#fff" fill-opacity=".35"/><rect x="96" y="196" width="184" height="144" rx="13" fill="' + palette.glow + '" fill-opacity=".84"/><rect x="298" y="196" width="184" height="144" rx="13" fill="' + palette.accent + '" fill-opacity=".75"/><rect x="500" y="196" width="224" height="144" rx="13" fill="' + palette.glow + '" fill-opacity=".38"/><circle cx="188" cy="257" r="35" fill="#fff" fill-opacity=".53"/><path d="M166 270h45l-5 30h-34zm8-18h38l-5-16h-38z" fill="' + palette.accent + '"/><path d="M338 284h103m-91-18h76m-62-22h47" stroke="#fff" stroke-opacity=".76" stroke-width="8" stroke-linecap="round"/><rect x="523" y="218" width="80" height="66" rx="10" fill="#fff" fill-opacity=".7"/><path d="M642 260h51m-24-24v48" stroke="#fff" stroke-opacity=".8" stroke-width="8" stroke-linecap="round"/>',
      shelves: '<rect x="75" y="118" width="670" height="258" rx="18" fill="#fff" fill-opacity=".78"/><path d="M112 161h566M112 227h566M112 293h566" stroke="' + palette.accent + '" stroke-opacity=".18" stroke-width="3"/><path d="M158 137h44v24h-44zm72-5h50v29h-50zm91 12h38v17h-38zm128-7h48v24h-48zm84-6h60v30h-60z" fill="' + palette.accent + '" fill-opacity=".8"/><path d="M142 180h21v45h-21zm68-8h32v53h-32zm79 11h26v42h-26zm88-4h40v46h-40zm108-5h30v51h-30zm80 8h38v43h-38z" fill="' + palette.glow + '"/><rect x="112" y="321" width="164" height="27" rx="9" fill="' + palette.accent + '" fill-opacity=".18"/><rect x="292" y="321" width="194" height="27" rx="9" fill="' + palette.accent + '" fill-opacity=".1"/>',
      scheduling: '<rect x="82" y="123" width="656" height="246" rx="18" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".15"/><path d="M128 174h548M128 225h548M128 276h548M128 327h548" stroke="#fff" stroke-opacity=".16" stroke-width="2"/><path d="M144 151v195" stroke="#fff" stroke-opacity=".18" stroke-width="2"/><rect x="158" y="157" width="145" height="33" rx="8" fill="' + palette.accent + '"/><rect x="303" y="208" width="204" height="33" rx="8" fill="' + palette.glow + '"/><rect x="230" y="259" width="221" height="33" rx="8" fill="' + palette.accent + '" fill-opacity=".72"/><rect x="507" y="310" width="142" height="33" rx="8" fill="' + palette.glow + '" fill-opacity=".72"/>',
      mindfulness: '<circle cx="410" cy="246" r="109" fill="' + palette.glow + '" fill-opacity=".42"/><circle cx="410" cy="246" r="78" fill="none" stroke="' + palette.accent + '" stroke-opacity=".52" stroke-width="3" stroke-dasharray="310 180" transform="rotate(-90 410 246)"/><circle cx="410" cy="246" r="54" fill="#fff" fill-opacity=".64"/><path d="M410 216v33l22 14" stroke="' + palette.accent + '" stroke-width="5" stroke-linecap="round"/><path d="M170 169c22-26 54-28 78 0m-77 147c22 26 54 28 78 0m349-147c22-26 54-28 78 0m-77 147c22 26 54 28 78 0" fill="none" stroke="' + palette.accent + '" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>',
      finance: '<rect x="76" y="122" width="668" height="252" rx="18" fill="#fff" fill-opacity=".78"/><rect x="101" y="148" width="190" height="80" rx="13" fill="' + palette.glow + '" fill-opacity=".54"/><rect x="309" y="148" width="190" height="80" rx="13" fill="' + palette.accent + '" fill-opacity=".12"/><rect x="517" y="148" width="201" height="80" rx="13" fill="' + palette.glow + '" fill-opacity=".33"/><path d="M116 328 185 284l58 18 74-68 63 29 68-53 64 16 72-46" fill="none" stroke="' + palette.accent + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M116 328 185 284l58 18 74-68 63 29 68-53 64 16 72-46v108H116z" fill="' + palette.glow + '" fill-opacity=".25"/>',
      landing: '<rect x="91" y="116" width="638" height="263" rx="19" fill="#fff" fill-opacity=".76"/><rect x="91" y="116" width="638" height="39" rx="19" fill="#fff" fill-opacity=".82"/><circle cx="116" cy="136" r="5" fill="' + palette.accent + '"/><circle cx="134" cy="136" r="5" fill="' + palette.glow + '"/><rect x="130" y="190" width="261" height="19" rx="9" fill="' + palette.accent + '" fill-opacity=".52"/><rect x="130" y="224" width="219" height="12" rx="6" fill="' + palette.accent + '" fill-opacity=".22"/><rect x="130" y="249" width="238" height="12" rx="6" fill="' + palette.accent + '" fill-opacity=".15"/><rect x="130" y="285" width="96" height="32" rx="10" fill="' + palette.accent + '"/><rect x="451" y="182" width="226" height="150" rx="15" fill="' + palette.glow + '" fill-opacity=".74"/><circle cx="563" cy="257" r="40" fill="#fff" fill-opacity=".66"/><path d="M542 259h42m-21-21v42" stroke="' + palette.accent + '" stroke-width="7" stroke-linecap="round"/>'
    }[kind] || '';

    return '<div class="project-cover" aria-hidden="true"><svg viewBox="0 0 820 430" role="presentation" focusable="false"><defs><linearGradient id="cover-' + kind + '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + palette.wash + '"/><stop offset="1" stop-color="' + palette.glow + '" stop-opacity=".68"/></linearGradient></defs><rect width="820" height="430" fill="url(#cover-' + kind + ')"/><circle cx="740" cy="50" r="162" fill="' + palette.glow + '" opacity=".18"/><circle cx="59" cy="404" r="170" fill="' + palette.accent + '" opacity=".12"/><rect x="35" y="30" width="750" height="370" rx="25" fill="' + palette.wash + '" fill-opacity=".16" stroke="#fff" stroke-opacity=".34"/><circle cx="63" cy="58" r="5" fill="' + palette.accent + '"/><circle cx="82" cy="58" r="5" fill="' + palette.glow + '"/><circle cx="101" cy="58" r="5" fill="#fff" fill-opacity=".75"/><text x="135" y="63" fill="#fff" fill-opacity=".8" font-size="13" font-family="monospace" letter-spacing="2">' + palette.label + '</text>' + layout + '<text x="44" y="393" fill="' + (['assistant', 'flights', 'scheduling', 'shopkart'].includes(kind) ? '#fff' : '#24322b') + '" fill-opacity=".84" font-size="18" font-family="sans-serif">' + safeTitle + '</text></svg></div>';
  }

  function makeProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card project-card-featured project-card-editorial';
    card.dataset.projectKind = project.kind;
    card.dataset.projectId = project.kind;
    card.dataset.projectTitle = project.title;
    const primaryLink = project.live || project.github;
    const arrow = primaryLink
      ? '<a class="project-open" href="' + escapeHTML(primaryLink) + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + escapeHTML(project.title) + '">↗</a>'
      : '<span class="project-open" aria-hidden="true">↗</span>';
    const footerLinks = [
      project.live && '<a href="' + escapeHTML(project.live) + '" target="_blank" rel="noopener noreferrer">↗ &nbsp; Live demo</a>',
      project.github && '<a href="' + escapeHTML(project.github) + '" target="_blank" rel="noopener noreferrer">⌘ &nbsp; Code</a>'
    ].filter(Boolean).join('');
    card.innerHTML =
      '<div class="project-meta"><span class="project-number"></span><span class="project-latest">Latest</span>' + arrow + '</div>' +
      '<div class="project-header"><span class="project-title">' + escapeHTML(project.title) + '</span></div>' +
      '<p class="project-kicker">' + escapeHTML(project.subtitle || '') + '</p>' +
      '<div class="project-desc">' + escapeHTML(project.description) + '</div>' +
      '<div class="project-badges">' + project.tags.map((tag) => '<span>' + escapeHTML(tag) + '</span>').join('') + '</div>' +
      '<div class="project-footer"><div class="project-footer-links">' + footerLinks + '</div><span>' + escapeHTML(project.date || '') + '</span></div>';
    return card;
  }

  function addProjectCovers() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    if (projectsGrid.dataset.editorialProjectsReady === 'true') return;
    const newProjects = recentProjects.map(makeProjectCard);
    projectsGrid.replaceChildren(...newProjects);
    projectsGrid.dataset.editorialProjectsReady = 'true';

    projectsGrid.querySelectorAll('.project-card').forEach((card, index) => {
      card.classList.add('project-card-editorial');
      const number = String(index + 1).padStart(2, '0');
      const numberNode = card.querySelector('.project-number');
      if (numberNode) numberNode.textContent = number;
      const heading = card.querySelector('.project-title');
      const cardTitle = heading?.textContent.trim() || card.dataset.projectTitle || 'Project';
      card.dataset.projectTitle = cardTitle;
      card.dataset.projectTitle = cardTitle;
      card.id = 'project-' + cardTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const latest = card.querySelector('.project-latest');
      if (latest) latest.hidden = index !== 0;
      card.querySelectorAll('.project-cover').forEach((cover) => cover.remove());
    });
  }

  function syncPortraits(theme) {
    document.querySelectorAll('img[data-dark-src]').forEach((image) => {
      const light = image.dataset.lightSrc || image.getAttribute('src');
      if (!image.dataset.lightSrc) image.dataset.lightSrc = light;
      const next = theme === 'dark' ? image.dataset.darkSrc : light;
      if (next && image.getAttribute('src') !== next) image.setAttribute('src', next);
    });
  }

  function initializeArticles() {
    if (!document.body.classList.contains('article-page')) return;
    const articleNav = document.querySelector('.article-nav');
    if (articleNav && articleNav.dataset.editorialNav !== 'true') {
      articleNav.id = 'site-nav';
      articleNav.innerHTML = '<a class="brand-name" href="../index.html#home"><span class="brand-monogram">AƧ</span><span>ANOORAG SINGH</span></a>' +
        '<div class="article-nav-links"><a href="../index.html#education">Education</a><a href="../index.html#projects">Projects</a><a href="../index.html#skills">Skills</a><a href="../index.html#about">About</a><a href="../index.html#blog">Blog</a><a href="../index.html#contact">Contact</a></div>' +
        '<div class="article-nav-tools"><button class="kbd-hint nav-cmd-open" type="button" aria-label="Open command palette"><span class="kbd-hint-text">⌘ CTRL K</span></button><button class="theme-toggle" type="button" aria-label="Toggle dark mode"><span class="theme-icon">◐</span></button></div>';
      articleNav.dataset.editorialNav = 'true';
    }
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem('theme');
    const initial = saved || (media.matches ? 'dark' : 'light');
    root.setAttribute('data-theme', initial);
    const updateThemeIcon = () => {
      const iconText = root.getAttribute('data-theme') === 'dark' ? '☼' : '◐';
      document.querySelectorAll('.theme-icon').forEach((icon) => { icon.textContent = iconText; });
    };
    updateThemeIcon();
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.addEventListener('click', () => {
        const current = root.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon();
      });
    });

    const articleHeader = document.querySelector('.article-header');
    if (articleHeader && articleHeader.dataset.editorialHeader !== 'true') {
      const kicker = articleHeader.querySelector('.article-kicker');
      const title = articleHeader.querySelector('h1');
      const date = articleHeader.querySelector('.article-meta');
      const lede = articleHeader.querySelector('.article-lede');
      const postBack = document.createElement('a');
      postBack.className = 'post-back-link';
      postBack.href = '../index.html#blog';
      postBack.textContent = '← All posts';
      articleHeader.prepend(postBack);
      if (kicker && date) {
        const match = date.textContent.trim().match(/^([A-Za-z]+)\s+(\d+),\s*(\d+)\s*[·•]\s*(\d+)\s*min\s*read$/i);
        if (match) {
          const months = { January:'JAN', February:'FEB', March:'MAR', April:'APR', May:'MAY', June:'JUN', July:'JUL', August:'AUG', September:'SEP', October:'OCT', November:'NOV', December:'DEC' };
          kicker.textContent = months[match[1]] + ' ' + match[2] + ', ' + match[3] + ' · ' + match[4] + ' MIN READ · ANOORAG SINGH.TECHBLOG';
        }
        date.remove();
      }

      const slug = window.location.pathname.split('/').pop();
      const editorialPosts = {
        'simulating-cpu-scheduling.html': {
          lede: 'Understanding Operating Systems became much easier after I built CPU-SchedSim, a C++-based simulator for analyzing the behavior of different CPU scheduling algorithms. These are vital for efficient process management in modern OSes.',
          label: 'Algorithms implemented',
          detail: 'FCFS, SJF, Round-Robin, Priority Scheduling',
          quote: 'This project helped me deeply understand how scheduling decisions affect CPU utilization and system responsiveness.',
          resources: [['GeeksforGeeks','https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-in-operating-systems/'],['TutorialsPoint','https://www.tutorialspoint.com/operating_system/os_process_scheduling.htm'],['cplusplus.com','https://cplusplus.com/']]
        },
        'why-i-love-cpp.html': {
          lede: 'C++ was the language that introduced me to real programming logic. I’ve used it for building simulations, solving problems, and learning core computer science concepts.',
          label: 'Why C++ stands out',
          detail: 'Memory management, low-level operations, DSA, OOP',
          quote: 'C++ also helped me in creating realistic simulators like CPU-SchedSim by providing control over thread-level behavior and CPU logic.',
          resources: [['Codecademy','https://www.codecademy.com/learn/learn-c-plus-plus'],['The Cherno','https://www.youtube.com/@TheCherno'],['GeeksforGeeks','https://www.geeksforgeeks.org/c-plus-plus/']]
        }
      };
      const editorial = editorialPosts[slug];
      if (editorial && lede) {
        lede.textContent = editorial.lede;
        const body = document.querySelector('.article-body');
        if (body) body.innerHTML = '<aside class="article-insight"><span>' + escapeHTML(editorial.label) + '</span><strong>' + escapeHTML(editorial.detail) + '</strong></aside>' +
          '<blockquote class="article-pullquote">' + escapeHTML(editorial.quote) + '</blockquote>' +
          '<section class="article-resources"><h2>Resources</h2><div>' + editorial.resources.map(([name,url]) => '<a href="' + escapeHTML(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(name) + '</a>').join('') + '</div></section>';
      }
      articleHeader.dataset.editorialHeader = 'true';
    }

    const overlay = document.createElement('div');
    overlay.id = 'cmd-palette-overlay';
    overlay.tabIndex = -1;
    overlay.style.display = 'none';
    overlay.innerHTML = '<div id="cmd-palette-modal" role="dialog" aria-modal="true" aria-label="Quick navigation"><div class="cmd-search-wrapper"><input id="cmd-palette-input" type="text" placeholder="Type a command or search…" aria-label="Command search" autocomplete="off"></div><div class="cmd-section"><div class="cmd-section-title">Navigate</div><div class="cmd-list"><a class="cmd-item" href="../index.html#home">Portfolio home</a><a class="cmd-item" href="../index.html#projects">Projects</a><a class="cmd-item" href="../blog.html">All writing</a><a class="cmd-item" href="../index.html#contact">Contact</a></div></div><hr class="cmd-divider"><div class="cmd-section"><div class="cmd-section-title">Profiles</div><div class="cmd-list"><a class="cmd-item" target="_blank" rel="noopener noreferrer" href="https://github.com/anooragsingh07">GitHub</a><a class="cmd-item" target="_blank" rel="noopener noreferrer" href="https://medium.com/@anooragsingh0007">Medium</a><a class="cmd-item" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/anooragsingh/">LinkedIn</a></div></div><hr class="cmd-divider"><div class="cmd-section"><div class="cmd-section-title">Theme</div><div class="cmd-list"><button class="cmd-item" data-theme-command="light">Light mode</button><button class="cmd-item" data-theme-command="dark">Dark mode</button><button class="cmd-item" data-theme-command="system">System default</button></div></div></div>';
    document.body.append(overlay);
    const input = overlay.querySelector('#cmd-palette-input');
    const open = () => { overlay.style.display = 'flex'; input.value = ''; input.focus(); document.body.style.overflow = 'hidden'; };
    const close = () => { overlay.style.display = 'none'; document.body.style.overflow = ''; };
    document.querySelectorAll('.nav-cmd-open').forEach((button) => button.addEventListener('click', open));
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); overlay.style.display === 'flex' ? close() : open(); }
      if (event.key === 'Escape' && overlay.style.display === 'flex') close();
    });
    overlay.addEventListener('click', (event) => { if (event.target === overlay) close(); });
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      overlay.querySelectorAll('.cmd-item').forEach((item) => { item.style.display = item.textContent.toLowerCase().includes(query) ? '' : 'none'; });
    });
    overlay.querySelectorAll('[data-theme-command]').forEach((button) => button.addEventListener('click', () => {
      const mode = button.dataset.themeCommand;
      const next = mode === 'system' ? (media.matches ? 'dark' : 'light') : mode;
      root.setAttribute('data-theme', next);
      if (mode === 'system') localStorage.removeItem('theme'); else localStorage.setItem('theme', next);
      updateThemeIcon();
      close();
    }));
  }

  function initializeReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.education-grid .card, .projects-grid .project-card, .skill-group, .about-section, .writing-card, .contact-card, .article-header, .article-body');
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    targets.forEach((target, index) => {
      target.classList.add('reveal');
      target.style.transitionDelay = Math.min(index % 5, 4) * 55 + 'ms';
      observer.observe(target);
    });
  }

  function formatEducationRows() {
    const rows = document.querySelectorAll('.education-grid .card');
    rows.forEach((row, index) => {
      if (row.classList.contains('education-row')) return;
      const title = row.querySelector('.card-title')?.textContent.trim() || '';
      const location = row.querySelector('.card-meta')?.textContent.trim() || '';
      const date = row.querySelector('.card-date')?.textContent.trim() || '';
      const items = Array.from(row.querySelectorAll('li')).map((item) => item.textContent.trim());
      const result = items.find((item) => /\d+(?:\.\d+)?%|CGPA/i.test(item)) || '';
      const program = items.find((item) => item !== result) || '';
      const resultType = /CGPA/i.test(result) ? 'Undergraduate' : 'Percentage';
      const score = result.replace(/^CGPA:\s*/i, '').replace(/\s*\/\s*10$/, '').replace(/\s*%+$/, '');
      row.classList.add('education-row');
      row.innerHTML = '<span class="education-number">' + String(index + 1).padStart(2, '0') + '</span>' +
        '<div class="education-school"><h3>' + escapeHTML(title) + '</h3><p>' + escapeHTML(program) + '</p></div>' +
        '<div class="education-detail"><span>' + escapeHTML(date.replace(/\s*-\s*/g, ' — ')) + '</span><span>' + escapeHTML(location) + '</span></div>' +
        '<div class="education-score"><strong>' + escapeHTML(score) + (resultType === 'Percentage' ? '%' : '') + '</strong><span>' + resultType + '</span></div>';
    });
  }

  function renderEditorialSkills() {
    const grid = document.querySelector('.skills-grid');
    if (!grid || grid.dataset.editorialSkillsReady === 'true') return;
    const groups = [
      ['Languages & Core', ['C++', 'Python', 'JavaScript', 'C', 'HTML', 'CSS']],
      ['CS Foundations', ['Data Structures & Algorithms', 'Object-Oriented Programming', 'DBMS', 'Operating Systems', 'Computer Networks']],
      ['Backend & Data', ['Node.js', 'Express', 'PostgreSQL', 'SQL', 'REST APIs']],
      ['AI Engineering', ['Local LLM Integration', 'Python Tool Calling', 'AI App Development']],
      ['Tools & Practices', ['Git', 'GitHub', 'Jest', 'TDD', 'SOLID Principles', 'VS Code']]
    ];
    grid.innerHTML = groups.map(([title, items]) => '<section class="skill-group"><h3>' + escapeHTML(title) + '</h3><ul class="skill-editorial-list">' + items.map((item) => '<li>' + escapeHTML(item) + '</li>').join('') + '</ul></section>').join('');
    grid.dataset.editorialSkillsReady = 'true';
  }

  function renderEditorialAbout() {
    const section = document.querySelector('.about-section');
    if (!section || section.dataset.editorialAboutReady === 'true') return;
    section.innerHTML =
      '<div class="about-editorial-copy">' +
        '<p class="about-subtitle">B.Tech Student · Technology &amp; Code</p>' +
        '<h3 class="about-display-heading">Sprinting through code with <em>speed, focus</em> and dedication.</h3>' +
        '<p class="about-intro">Hey, I’m Anoorag Singh, a B.Tech student passionate about technology, coding, and turning ideas into reality. I love learning new things, solving problems, and building projects that make a difference.</p>' +
        '<figure class="about-quote"><span aria-hidden="true">❝</span><blockquote>“A little progress every day adds up to big results.”</blockquote></figure>' +
        '<div class="about-highlights"><span>Technology</span><span>Problem Solving</span><span>Project Building</span></div>' +
      '</div>' +
      '<figure class="about-scene"><img src="https://images.unsplash.com/photo-1791362795878-e4a57c940a3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzV8MHwxfHNlYXJjaHwzfHxtaW5pbWFsJTIwYXRobGV0aWMlMjBzcHJpbnRlciUyMHNpbGhvdWV0JTIwcG9ydHJhaXQlMjBlZGl0b3JpYWx8ZW58MHx8fHwxNzkzMzY0MDg1fDA&ixlib=rb-4.1.0&q=85" alt="Sprinter silhouette — the track" loading="lazy"><figcaption><span>Beyond code</span><strong>Track, badminton &amp; late-night builds</strong></figcaption></figure>';
    section.dataset.editorialAboutReady = 'true';
  }

  function formatContactSection() {
    const grid = document.querySelector('.contact-grid');
    if (!grid || grid.dataset.editorialContactReady === 'true') return;
    const socials = [
      ['GitHub', 'ANOORAGSINGH07', 'https://github.com/anooragsingh07'],
      ['LinkedIn', 'ANOORAGSINGH', 'https://linkedin.com/in/anooragsingh'],
      ['X', '@CODE_ANOORAG', 'https://x.com/code_anoorag'],
      ['Codolio', '@ANOORAG SINGH', 'https://codolio.com/profile/Anoorag%20Singh'],
      ['View Resume', 'PDF · B.TECH IT', 'resume/Resume.pdf']
    ].map(([name, handle, url]) => '<a class="contact-social-card" href="' + escapeHTML(url) + '"' + (url.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '') + '><span class="contact-card-label">' + escapeHTML(name) + '</span><strong>' + escapeHTML(handle) + '</strong><span class="contact-social-arrow" aria-hidden="true">' + (name === 'X' ? '𝕏' : '↗') + '</span></a>').join('');
    grid.innerHTML = '<div class="contact-copy-list">' +
      '<div class="contact-copy-row"><span class="contact-copy-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></span><span class="contact-copy-content"><span class="contact-card-label">Email</span><a href="mailto:anooragsingh0007@gmail.com">anooragsingh0007@gmail.com</a></span><button type="button" class="copy-contact-button" data-copy-value="anooragsingh0007@gmail.com" aria-label="Copy email address"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg></button></div>' +
      '<div class="contact-copy-row"><span class="contact-copy-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92z"/></svg></span><span class="contact-copy-content"><span class="contact-card-label">Mobile</span><a href="tel:+919571375741">+91 9571375741</a></span><button type="button" class="copy-contact-button" data-copy-value="+91 9571375741" aria-label="Copy phone number"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg></button></div>' +
      '</div><div class="contact-social-grid">' + socials + '</div>';
    grid.dataset.editorialContactReady = 'true';
    grid.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-copy-value]');
      if (!button) return;
      try {
        await navigator.clipboard.writeText(button.dataset.copyValue);
        button.textContent = '✓';
        button.setAttribute('aria-label', 'Copied');
        window.setTimeout(() => {
          button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg>';
          button.setAttribute('aria-label', 'Copy contact detail');
        }, 1200);
      } catch (error) {
        button.textContent = 'Copy failed';
      }
    });
  }

  document.querySelectorAll('.cmd-item[data-command-url]').forEach((button) => {
    button.addEventListener('click', () => {
      const url = button.dataset.commandUrl;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  const resumeCommand = document.querySelector('.cmd-item[data-cmd="resume"]');
  const resumeUrl = new URL('resume/Resume.pdf', document.baseURI).href;
  const driveResumeUrl = 'https://drive.google.com/file/d/1fy1ooRq2N0MumUDey2i94Euzf1jqUWWL/view';
  const resumeDialog = document.createElement('div');
  resumeDialog.className = 'resume-viewer-overlay';
  resumeDialog.innerHTML = '<section class="resume-viewer" role="dialog" aria-modal="true" aria-labelledby="resume-viewer-title"><header class="resume-viewer-header"><h2 id="resume-viewer-title">Resume</h2><div class="resume-viewer-actions"><a class="resume-viewer-action" href="' + resumeUrl + '" download="Anoorag-Singh-Resume.pdf">Download</a><a class="resume-viewer-action" href="' + driveResumeUrl + '" target="_blank" rel="noopener noreferrer">Open in Drive</a><button class="resume-viewer-close" type="button" aria-label="Close resume">×</button></div></header><iframe title="Anoorag Singh resume" src="' + resumeUrl + '"></iframe></section>';
  document.body.append(resumeDialog);
  const closeResume = () => { resumeDialog.classList.remove('is-open'); document.body.style.overflow = ''; };
  document.querySelector('.resume-download-btn')?.addEventListener('click', (event) => {
    event.preventDefault(); resumeDialog.classList.add('is-open'); document.body.style.overflow = 'hidden';
    resumeDialog.querySelector('.resume-viewer-close').focus();
  });
  resumeDialog.querySelector('.resume-viewer-close').addEventListener('click', closeResume);
  resumeDialog.addEventListener('click', (event) => { if (event.target === resumeDialog) closeResume(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && resumeDialog.classList.contains('is-open')) closeResume(); });
  resumeCommand?.addEventListener('click', () => { closeResume(); document.querySelector('.resume-download-btn')?.click(); });

  const siteNav = document.getElementById('site-nav');
  const syncNavGlass = () => siteNav?.classList.toggle('is-scrolled', window.scrollY > 18);
  window.addEventListener('scroll', syncNavGlass, { passive: true });
  syncNavGlass();
  const heroTicker = document.querySelector('.skills-marquee');
  const scrollCue = document.querySelector('.scroll-cue');
  if (heroTicker && scrollCue) scrollCue.insertAdjacentElement('afterend', heroTicker);
  document.querySelector('.back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  addProjectCovers();
  formatEducationRows();
  renderEditorialSkills();
  renderEditorialAbout();
  formatContactSection();
  syncPortraits(document.documentElement.getAttribute('data-theme') || 'light');
  new MutationObserver(() => syncPortraits(document.documentElement.getAttribute('data-theme') || 'light'))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  initializeArticles();
  initializeReveals();
})();
