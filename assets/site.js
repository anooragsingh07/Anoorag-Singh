/* ==========================================================================
   Interaction layer for the reference-faithful static replica.
   - Lenis smooth scrolling (lerp 0.09, smoothWheel)
   - header scrolled state, nav scrolling
   - scroll reveals (once, amount 0.15)
   - hero portrait parallax, tilt spring and about image parallax
   - theme persistence + icon entrance
   - command palette (Ctrl/Cmd+K) with filtering, keyboard nav and actions
   - contact copy feedback, back to top, dynamic year
   ========================================================================== */

(function () {
  "use strict";

  var documentElement = document.documentElement;
  documentElement.classList.add("js");

  var EASE = [0.22, 1, 0.36, 1];
  var EMAIL = "anooragsingh0007@gmail.com";
  var BLOG_PAGE = /[\\/]blog[\\/]/.test(window.location.pathname);
  var BASE = BLOG_PAGE ? "../" : "";
  var RESUME_URL = BASE + "resume/Resume.pdf";

  var SUN_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun h-4 w-4" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  var MOON_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon h-4 w-4" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';
  var CHECK_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check h-4 w-4 text-emerald-500" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  /* ------------------------------------------------------------------ Lenis */
  var lenis = null;
  if (typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    var raf = function (time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };
    window.requestAnimationFrame(raf);
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* Returning from an article: mirror the reference, which lands on the
     homepage and smooth-scrolls to the writing section after 150ms. */
  var pendingScrollTarget = null;
  try {
    pendingScrollTarget = sessionStorage.getItem("as-scroll-target");
    if (pendingScrollTarget) sessionStorage.removeItem("as-scroll-target");
  } catch (error) {
    /* storage can be unavailable */
  }
  if (pendingScrollTarget) {
    window.setTimeout(function () {
      scrollToId(pendingScrollTarget);
    }, 150);
  }

  /* ------------------------------------------------------- header behaviour */
  var header = document.querySelector("[data-header]");
  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  if (lenis) lenis.on("scroll", updateHeader);
  updateHeader();

  var homeButton = document.querySelector('[data-testid="nav-home-button"]');
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      scrollToId("home");
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('header nav button[data-testid^="nav-link-"]'),
    function (button) {
      button.addEventListener("click", function () {
        scrollToId(button.getAttribute("data-testid").replace("nav-link-", ""));
      });
    },
  );

  var contactCta = document.querySelector('[data-testid="hero-cta-contact"]');
  if (contactCta) {
    contactCta.addEventListener("click", function () {
      scrollToId("contact");
    });
  }

  var backToTop = document.querySelector("[data-back-to-top]");
  if (backToTop) backToTop.addEventListener("click", scrollToTop);

  var blogBack = document.querySelector("[data-blog-back]");
  if (blogBack) {
    blogBack.addEventListener("click", function () {
      try {
        sessionStorage.setItem("as-scroll-target", "blog");
      } catch (error) {
        /* storage can be unavailable */
      }
      window.location.href = BLOG_PAGE ? "../" : "index.html";
    });
  }

  /* --------------------------------------------------------- scroll reveals */
  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.15) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );
    Array.prototype.forEach.call(revealItems, function (el) {
      revealObserver.observe(el);
    });
  } else {
    Array.prototype.forEach.call(revealItems, function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Remove the entrance animation after it finishes: keeping a filled
     transform animation alive promotes the text to a composited layer and
     changes its antialiasing relative to the reference. */
  var articleRoot = document.querySelector("[data-article]");
  if (articleRoot) {
    articleRoot.addEventListener(
      "animationend",
      function (event) {
        if (event.animationName === "article-in") articleRoot.style.animation = "none";
      },
      { once: true },
    );
  }

  /* ------------------------------------------- hero + about parallax layers */
  var heroParallax = document.querySelector("[data-parallax]");
  var aboutImage = document.querySelector("[data-about-image]");
  var aboutFrame = document.querySelector('[data-testid="about-image-frame"]');
  var parallaxQueued = false;

  function applyParallax() {
    parallaxQueued = false;

    if (heroParallax) {
      var progress = Math.max(0, Math.min(window.scrollY, 700)) / 700;
      heroParallax.style.transform = "translateY(" + progress * 70 + "px)";
    }

    if (aboutImage && aboutFrame) {
      var rect = aboutFrame.getBoundingClientRect();
      var viewport = window.innerHeight || documentElement.clientHeight;
      var p = (viewport - rect.top) / (viewport + rect.height);
      p = Math.max(0, Math.min(1, p));
      var offset = -8 + 16 * p;
      aboutImage.style.transform = "translateY(" + offset + "%)";
    }
  }

  function scheduleParallax() {
    if (parallaxQueued) return;
    parallaxQueued = true;
    window.requestAnimationFrame(applyParallax);
  }

  window.addEventListener("scroll", scheduleParallax, { passive: true });
  window.addEventListener("resize", scheduleParallax);
  if (lenis) lenis.on("scroll", scheduleParallax);
  applyParallax();

  /* ------------------------------------------------- portrait tilt (spring) */
  var tilt = document.querySelector("[data-tilt]");
  if (tilt) {
    var targetX = 0; // rotateY target (degrees)
    var targetY = 0; // rotateX target (degrees)
    var rotX = 0;
    var rotY = 0;
    var velX = 0;
    var velY = 0;
    var lastTime = 0;
    var STIFFNESS = 140;
    var DAMPING = 18;

    var tiltFrame = function (time) {
      if (!lastTime) lastTime = time;
      var dt = Math.min((time - lastTime) / 1000, 1 / 30);
      lastTime = time;

      velX += (STIFFNESS * (targetX - rotX) - DAMPING * velX) * dt;
      velY += (STIFFNESS * (targetY - rotY) - DAMPING * velY) * dt;
      rotX += velX * dt;
      rotY += velY * dt;

      tilt.style.transform =
        "perspective(900px) rotateX(" + rotX.toFixed(3) + "deg) rotateY(" + rotY.toFixed(3) + "deg)";

      window.requestAnimationFrame(tiltFrame);
    };
    window.requestAnimationFrame(tiltFrame);

    tilt.addEventListener("mousemove", function (event) {
      var rect = tilt.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 14;
      targetY = -y * 14;
    });

    tilt.addEventListener("mouseleave", function () {
      targetX = 0;
      targetY = 0;
    });
  }

  /* ------------------------------------------------------------------ theme */
  var themeIcon = document.querySelector("[data-theme-icon]");
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var paletteThemeWord = null;
  var paletteThemeIcon = null;
  var paletteThemeItem = null;

  function isDark() {
    return documentElement.classList.contains("dark");
  }

  function refreshThemeUi() {
    var dark = isDark();
    if (paletteThemeWord) paletteThemeWord.textContent = dark ? "light" : "dark";
    if (paletteThemeIcon) {
      paletteThemeIcon.innerHTML = dark
        ? SUN_ICON.replace("h-4 w-4", "h-3.5 w-3.5 text-accent-blue")
        : MOON_ICON.replace("h-4 w-4", "h-3.5 w-3.5 text-accent-blue");
    }
    if (paletteThemeItem) {
      paletteThemeItem.setAttribute("data-value", "Switch to " + (dark ? "light" : "dark") + " mode");
    }
  }

  function applyTheme() {
    documentElement.classList.toggle("dark", isDark());
    try {
      localStorage.setItem("as-theme", isDark() ? "dark" : "light");
    } catch (error) {
      /* storage can be unavailable; the class still applies for this page */
    }
    refreshThemeUi();
  }

  function renderThemeIcon(animate) {
    if (!themeIcon) return;
    themeIcon.innerHTML = isDark() ? SUN_ICON : MOON_ICON;
    if (animate) {
      themeIcon.classList.remove("theme-icon-anim");
      void themeIcon.offsetWidth;
      themeIcon.classList.add("theme-icon-anim");
    }
  }

  function toggleTheme() {
    documentElement.classList.toggle("dark");
    applyTheme();
    renderThemeIcon(true);
  }

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  renderThemeIcon(false);

  /* ------------------------------------------------------- command palette */
  var palette = document.querySelector("[data-palette]");
  var paletteOverlay = document.querySelector("[data-palette-overlay]");
  var paletteInput = document.querySelector("[data-cmd-input]");
  var paletteList = document.querySelector("[data-cmd-list]");
  var paletteEmpty = document.querySelector("[data-cmd-empty]");
  var paletteItems = palette ? Array.prototype.slice.call(palette.querySelectorAll("[data-cmd-item]")) : [];
  var paletteGroups = palette ? Array.prototype.slice.call(palette.querySelectorAll("[data-cmd-group]")) : [];
  var selectedItem = null;
  var paletteOpen = false;
  var lastFocused = null;
  var previousBodyOverflow = "";
  var previousBodyPadding = "";

  if (palette) {
    paletteThemeWord = palette.querySelector("[data-cmd-theme-word]");
    paletteThemeIcon = palette.querySelector("[data-cmd-theme-icon]");
    paletteThemeItem = palette.querySelector('[data-testid="cmd-action-theme"]');
  }

  function visiblePaletteItems() {
    return paletteItems.filter(function (item) {
      return !item.hasAttribute("hidden");
    });
  }

  function setSelected(item, scrollIntoView) {
    paletteItems.forEach(function (candidate) {
      var selected = candidate === item;
      candidate.setAttribute("data-selected", selected ? "true" : "false");
      candidate.setAttribute("aria-selected", selected ? "true" : "false");
    });
    selectedItem = item || null;
    if (item && scrollIntoView) item.scrollIntoView({ block: "nearest" });
  }

  function matchesQuery(value, query) {
    if (!query) return true;
    if (value.indexOf(query) !== -1) return true;
    var position = 0;
    for (var i = 0; i < query.length; i += 1) {
      position = value.indexOf(query[i], position);
      if (position === -1) return false;
      position += 1;
    }
    return true;
  }

  function filterPalette() {
    var query = (paletteInput.value || "").trim().toLowerCase();

    paletteItems.forEach(function (item) {
      var value = (item.getAttribute("data-value") || "").toLowerCase();
      item.toggleAttribute("hidden", !matchesQuery(value, query));
    });

    paletteGroups.forEach(function (group) {
      var hasVisible = group.querySelector("[data-cmd-item]:not([hidden])");
      group.toggleAttribute("hidden", !hasVisible);
    });

    var visible = visiblePaletteItems();
    if (paletteEmpty) paletteEmpty.toggleAttribute("hidden", visible.length > 0);
    setSelected(visible.length ? visible[0] : null, false);
  }

  function openPalette() {
    if (!palette || paletteOpen) return;
    paletteOpen = true;
    lastFocused = document.activeElement;
    refreshThemeUi();

    paletteInput.value = "";
    filterPalette();

    palette.removeAttribute("hidden");
    if (paletteOverlay) paletteOverlay.removeAttribute("hidden");
    palette.setAttribute("data-state", "open");
    if (paletteOverlay) paletteOverlay.setAttribute("data-state", "open");
    paletteInput.setAttribute("aria-expanded", "true");

    previousBodyOverflow = document.body.style.overflow;
    previousBodyPadding = document.body.style.paddingRight;
    var scrollbar = window.innerWidth - documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = scrollbar + "px";
    if (lenis) lenis.stop();

    window.requestAnimationFrame(function () {
      paletteInput.focus();
    });
  }

  function closePalette() {
    if (!palette || !paletteOpen) return;
    paletteOpen = false;
    palette.setAttribute("data-state", "closed");
    if (paletteOverlay) paletteOverlay.setAttribute("data-state", "closed");
    palette.setAttribute("hidden", "");
    if (paletteOverlay) paletteOverlay.setAttribute("hidden", "");
    paletteInput.setAttribute("aria-expanded", "false");

    document.body.style.overflow = previousBodyOverflow;
    document.body.style.paddingRight = previousBodyPadding;
    if (lenis) lenis.start();

    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    lastFocused = null;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch (error) {
      /* ignore copy failures like the reference */
    }
    document.body.removeChild(area);
  }

  function runPaletteAction(action) {
    if (!action) return;

    if (action.indexOf("nav:") === 0) {
      var id = action.slice(4);
      if (id === "home") scrollToTop();
      else scrollToId(id);
      return;
    }

    if (action.indexOf("project:") === 0) {
      window.open(action.slice(8), "_blank");
      return;
    }

    if (action.indexOf("social:") === 0) {
      window.open(action.slice(7), "_blank");
      return;
    }

    if (action.indexOf("post:") === 0) {
      var slug = action.slice(5);
      window.location.href = BLOG_PAGE ? slug + ".html" : "blog/" + slug + ".html";
      return;
    }

    if (action === "theme") {
      toggleTheme();
      return;
    }

    if (action === "email") {
      window.open("mailto:" + EMAIL, "_self");
      return;
    }

    if (action === "copy-email") {
      copyText(EMAIL);
      return;
    }

    if (action === "resume") {
      var link = document.createElement("a");
      link.href = RESUME_URL;
      link.download = "Anoorag_Singh_Resume.pdf";
      link.click();
    }
  }

  function activatePaletteItem(item) {
    if (!item) return;
    var action = item.getAttribute("data-action");
    closePalette();
    window.setTimeout(function () {
      runPaletteAction(action);
    }, 60);
  }

  if (palette) {
    var paletteTrigger = document.querySelector("[data-open-palette]");
    if (paletteTrigger) paletteTrigger.addEventListener("click", openPalette);

    if (paletteOverlay) paletteOverlay.addEventListener("click", closePalette);

    paletteInput.addEventListener("input", filterPalette);

    paletteInput.addEventListener("keydown", function (event) {
      if (event.key === "Tab") {
        event.preventDefault();
        paletteInput.focus();
      }
    });

    paletteList.addEventListener("click", function (event) {
      var item = event.target.closest("[data-cmd-item]");
      if (item) activatePaletteItem(item);
    });

    paletteList.addEventListener("mouseover", function (event) {
      var item = event.target.closest("[data-cmd-item]");
      if (item && item !== selectedItem) setSelected(item, false);
    });

    document.addEventListener("keydown", function (event) {
      var key = event.key;
      var modifier = event.ctrlKey || event.metaKey;

      if (modifier && key.toLowerCase() === "k") {
        event.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
        return;
      }

      if (!paletteOpen) return;

      if (key === "Escape") {
        event.preventDefault();
        closePalette();
        return;
      }

      if (key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        var visible = visiblePaletteItems();
        if (!visible.length) return;
        var index = visible.indexOf(selectedItem);
        var direction = key === "ArrowDown" ? 1 : -1;
        var next = index === -1 ? 0 : (index + direction + visible.length) % visible.length;
        setSelected(visible[next], true);
        return;
      }

      if (key === "Enter") {
        event.preventDefault();
        activatePaletteItem(selectedItem);
      }
    });
  }

  /* ------------------------------------------------- contact copy feedback */
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-testid$="-copy-button"]'),
    function (button) {
      var row = button.closest('[data-testid$="-row"]');
      var valueNode = row ? row.querySelector("a .truncate") : null;
      var value = valueNode ? valueNode.textContent.trim() : "";
      var originalIcon = button.innerHTML;
      var resetTimer = null;

      button.addEventListener("click", function () {
        copyText(value);
        button.innerHTML = CHECK_ICON;
        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(function () {
          button.innerHTML = originalIcon;
        }, 1800);
      });
    },
  );

  /* -------------------------------------------------------------- footer year */
  var yearNode = document.querySelector("[data-year]");
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();
