document.documentElement.style.scrollBehavior = "smooth";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.alt || img.alt.trim() === "") {
      img.alt = "Illustration";
    }
  });
});

// BARRE DE PROGRESSION DE SCROLL

const progressBar = document.getElementById("scroll-progress");

const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );

  const winHeight = window.innerHeight;
  const total = docHeight - winHeight;
  const pct = total > 0 ? (scrollTop / total) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = `${pct}%`;
  }
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
document.addEventListener("DOMContentLoaded", updateScrollProgress);

// REVEAL AU SCROLL

document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const toReveal = document.querySelectorAll(
    ".about, .about h1, .about p, .project-item, .certification-item, .skills, .projects, .certif, .contact"
  );

  toReveal.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
  });

  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -5% 0px",
        threshold: 0.05,
      }
    );

    toReveal.forEach((el) => revealObserver.observe(el));
  } else {
    // Si l’utilisateur préfère réduire les animations → tout apparaît
    toReveal.forEach((el) => el.classList.add("in-view"));
  }
});

// PARALLAX LÉGER SUR TITRE ABOUT

document.addEventListener("DOMContentLoaded", () => {
  const aboutTitle = document.querySelector(".about h2");

  if (!aboutTitle) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReduced) {
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        const translate = Math.max(-8, Math.min(8, y * 0.04));
        aboutTitle.style.transform = `translateY(${translate}px)`;
        rafId = null;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }
});

// THEME TOGGLE (CLAIR / SOMBRE)

const toggleBtn = document.getElementById("theme-toggle");
const rootEl = document.documentElement;

const applyTheme = (isDark) => {
  rootEl.classList.toggle("theme-dark", isDark);
  toggleBtn.setAttribute("aria-pressed", String(isDark));

  toggleBtn.innerHTML = isDark
    ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
};

const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(prefersDark);

toggleBtn.addEventListener("click", () => {
  const nowDark = !rootEl.classList.contains("theme-dark");
  applyTheme(nowDark);
});

// MODALE CV

document.addEventListener("DOMContentLoaded", () => {
  const openCvBtn = document.getElementById("open-cv");
  const cvModal = document.getElementById("cv-modal");
  const closeModal = document.querySelector(".modal-close");

  if (!openCvBtn || !cvModal || !closeModal) return;

  openCvBtn.addEventListener("click", () => {
    cvModal.classList.add("active");
    cvModal.setAttribute("aria-hidden", "false");
  });

  closeModal.addEventListener("click", () => {
    cvModal.classList.remove("active");
    cvModal.setAttribute("aria-hidden", "true");
  });

  cvModal.addEventListener("click", (e) => {
    if (e.target === cvModal) {
      cvModal.classList.remove("active");
      cvModal.setAttribute("aria-hidden", "true");
    }
  });
});

// BOUTON RETOUR EN HAUT

const scrollTopBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// MENU HAMBURGER (MOBILE)

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger-toggle");
  const nav = document.querySelector(".main-nav");

  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("active");

    const expanded = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("active")) {
        nav.classList.remove("active");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });
});

// ANNÉE DANS LE FOOTER

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
