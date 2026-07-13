/* ============================================================
   Shared header + footer injection, nav behavior, reveals
   ============================================================ */
(function () {
  var NAV_LINKS = [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Our Services", href: "services.html" },
    { label: "Conferences & Events", href: "conferences.html" },
    { label: "Training Programs", href: "training.html" },
    { label: "Publications", href: "publications.html" },
    { label: "Editorial Board", href: "editorial-board.html" },
    { label: "Journals", href: "https://journal.lifelineemed.com/", external: true },
    { label: "Contact", href: "contact.html" }
  ];

  var page = (location.pathname.split("/").pop() || "index.html");
  if (page === "") page = "index.html";

  function isActive(l) {
    if (l.href.split("#")[0] === page) return true;
    return !!(l.children && l.children.some(function (c) { return c.href.split("#")[0] === page; }));
  }

  function linkHtml(l, cls) {
    var active = isActive(l) ? " active" : "";
    var ext = l.external ? ' target="_blank" rel="noopener"' : "";
    return '<a class="' + (cls || "") + active + '" href="' + l.href + '"' + ext + ">" + l.label + "</a>";
  }

  function navItemHtml(l) {
    if (!l.children) return "<li>" + linkHtml(l) + "</li>";
    var caret = '<svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m6 9 6 6 6-6"/></svg>';
    var sub = '<ul class="nav__sub">' + l.children.map(function (c) {
      return "<li>" + linkHtml(c) + "</li>";
    }).join("") + "</ul>";
    var active = isActive(l) ? " active" : "";
    return '<li class="has-sub"><a class="' + active + '" href="' + l.href + '">' + l.label + caret + "</a>" + sub + "</li>";
  }

  var logoSvg =
    '<img src="assets/logo.png?v=1" alt="Lifeline Emed logo" width="46" height="46" />';

  /* ---------- NAV ---------- */
  var navHtml =
    '<nav class="nav" id="siteNav"><div class="nav__inner">' +
      '<a class="brand" href="index.html"><span class="brand__mark">' + logoSvg + '</span>' +
        '<span class="brand__name"><b>Lifeline Emed</b><span>Companies</span></span></a>' +
      '<ul class="nav__links">' + NAV_LINKS.filter(function (l) { return l.href !== "index.html"; }).map(navItemHtml).join("") + "</ul>" +
      '<div class="nav__actions">' +
        '<a class="btn btn--gold" href="contact.html">Submit Manuscript</a>' +
        '<button class="nav__burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      "</div>" +
    "</div></nav>" +
    '<div class="nav__drawer" id="drawer"><ul>' +
      NAV_LINKS.map(function (l) {
        var out = "<li>" + linkHtml(l) + "</li>";
        if (l.children) {
          out += l.children.map(function (c) { return '<li class="drawer-sub">' + linkHtml(c) + "</li>"; }).join("");
        }
        return out;
      }).join("") +
      '<a class="btn btn--gold" href="contact.html">Submit Manuscript</a>' +
    "</ul></div>";

  /* ---------- FOOTER ---------- */
  var footerHtml =
    '<footer class="footer"><div class="container">' +
      '<div class="footer__top">' +
        '<div class="footer__brand">' +
          '<a class="brand" href="index.html"><span class="brand__mark">' + logoSvg + '</span>' +
            '<span class="brand__name"><b>Lifeline Emed</b><span>Companies</span></span></a>' +
          "<p>A US-based organization advancing scholarly publishing, healthcare innovation, scientific research, education, and international collaboration.</p>" +
          '<div class="contacts">' +
            '<a href="mailto:info@lifelineemed.com">info@lifelineemed.com</a>' +
            "<span>910 Bergen Avenue, Suite 209,<br>Jersey City, NJ 07306</span>" +
          "</div>" +
        "</div>" +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="about.html">About Us</a></li>' +
          '<li><a href="services.html">Our Services</a></li>' +
          '<li><a href="conferences.html">Conferences &amp; Events</a></li>' +
          '<li><a href="training.html">Training Programs</a></li>' +
        "</ul></div>" +
        '<div><h4>Publishing</h4><ul>' +
          '<li><a href="publications.html">Publications</a></li>' +
          '<li><a href="https://journal.lifelineemed.com/" target="_blank" rel="noopener">Journals (AJRI)</a></li>' +
          '<li><a href="research-areas.html">Research Areas</a></li>' +
          '<li><a href="editorial-board.html">Editorial Board</a></li>' +
          '<li><a href="https://journal.lifelineemed.com/" target="_blank" rel="noopener">Author Guidelines</a></li>' +
          '<li><a href="contact.html">Submit Manuscript</a></li>' +
        "</ul></div>" +
        '<div><h4>Legal</h4><ul>' +
          '<li><a href="privacy-policy.html">Privacy Policy</a></li>' +
          '<li><a href="terms-of-service.html">Terms of Service</a></li>' +
          '<li><a href="cookie-policy.html">Cookie Policy</a></li>' +
          '<li><a href="disclaimer.html">Disclaimer</a></li>' +
          '<li><a href="accessibility-statement.html">Accessibility</a></li>' +
        "</ul></div>" +
      "</div>" +
      '<div class="footer__bottom">' +
        "<p>© 2026 Lifeline Emed Companies LLC. All Rights Reserved.</p>" +
        '<span class="tagline">Research · Innovation · Education · Global Collaboration</span>' +
      "</div>" +
    "</div></footer>";

  var navMount = document.getElementById("site-nav");
  var footMount = document.getElementById("site-footer");
  if (navMount) navMount.outerHTML = navHtml;
  if (footMount) footMount.outerHTML = footerHtml;

  /* ---------- Behavior ---------- */
  var nav = document.getElementById("siteNav");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scroll progress bar */
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  /* fixed full-page hero background — content scrolls over it.
     Home uses the default image; other pages declare theirs via
     <body data-fixed-bg="assets/heroes/<page>.jpg">. */
  var fixedSrc = document.body.getAttribute("data-fixed-bg");
  if (document.body.classList.contains("has-hero") || fixedSrc) {
    document.body.classList.add("has-hero");
    var fixedBg = document.createElement("div");
    fixedBg.className = "hero-fixed-bg";
    if (fixedSrc) fixedBg.style.backgroundImage = "url('" + fixedSrc + "')";
    document.body.insertBefore(fixedBg, document.body.firstChild);
  }

  /* parallax target */
  var heroPhoto = document.querySelector(".hero--dark .hero__photo");

  /* unified scroll handler — driven by native scroll OR Locomotive */
  function applyScroll(y, limit) {
    if (nav) nav.classList.toggle("scrolled", y > 20);
    var max = limit || (document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = (max > 0 ? Math.min(100, (y / max) * 100) : 0) + "%";
    if (heroPhoto && !reduceMotion) {
      heroPhoto.style.transform = "translate3d(0," + (y * 0.18) + "px,0) scale(1.12)";
    }
  }
  var nativeScroll = function () { applyScroll(window.scrollY); };
  window.addEventListener("scroll", nativeScroll, { passive: true });
  applyScroll(0);

  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") drawer.classList.remove("open");
    });
  }

  /* reveal on scroll (with stagger inside groups) */
  document.querySelectorAll(".grid, .steps, .stats, .hero__stats").forEach(function (group) {
    var items = group.querySelectorAll(".reveal");
    items.forEach(function (it, i) { it.style.transitionDelay = (i % 6) * 80 + "ms"; });
  });
  /* Scroll-driven reveal — robust (no IntersectionObserver viewport dependency).
     Reveals each element once its top enters the lower part of the viewport. */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  function revealCheck() {
    var vh = window.innerHeight || document.documentElement.clientHeight || 800;
    for (var i = reveals.length - 1; i >= 0; i--) {
      if (reveals[i].getBoundingClientRect().top < vh * 0.92) {
        reveals[i].classList.add("in");
        reveals.splice(i, 1);
      }
    }
  }
  window.addEventListener("scroll", revealCheck, { passive: true });
  window.addEventListener("resize", revealCheck, { passive: true });
  window.addEventListener("load", revealCheck);
  revealCheck();

  /* Native scroll only (like the AJRI journal site) — the sticky nav then
     spans the content width, so the island never shifts against the scrollbar.
     Fixed background, reveals, progress bar and parallax all run on native scroll. */

  /* contact / auth form demo handlers */
  document.querySelectorAll("form[data-demo]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = f.querySelector("[data-msg]");
      if (msg) { msg.style.display = "block"; }
      f.reset();
    });
  });
})();
