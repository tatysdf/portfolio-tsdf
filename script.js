// Script minimaliste, clean, et utile
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1) Barre de progression de scroll
  const bar = document.createElement("div");
  bar.id = "scroll-progress";
  document.body.appendChild(bar);

  let ticking = false;
  const updateProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${percent}%`;
    ticking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );
  updateProgress();

  // 2) Marquer les éléments à révéler (sans modifier ton HTML)
  const toRevealSelectors = [
    ".about h1",
    ".about p",
    ".social-media li",
    ".project-item",
    ".certification-item",
  ];
  const toReveal = document.querySelectorAll(toRevealSelectors.join(","));
  toReveal.forEach((el, i) => {
    el.classList.add("reveal");
    // Stagger léger
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
  });

  // 3) Révélation au scroll (IntersectionObserver)
  if (!prefersReduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    toReveal.forEach((el) => io.observe(el));
  } else {
    // Fallback : tout visible
    toReveal.forEach((el) => el.classList.add("in-view"));
  }

  // 4) Micro-parallaxe (très subtil) sur le H1 de la section "about"
  const aboutTitle = document.querySelector(".about h1");
  if (aboutTitle && !prefersReduced) {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY || document.documentElement.scrollTop;
        // Déplacement maximum de 8px pour rester discret
        const translate = Math.max(-8, Math.min(8, y * 0.04));
        aboutTitle.style.transform = `translateY(${translate}px)`;
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 5) Améliorations légères :
  // - Lazy-load sur toutes les images si non défini
  document.querySelectorAll("img").forEach((img) => {
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    // Ajout d'un alt par défaut s'il manque (bonne pratique)
    if (!img.alt || img.alt.trim() === "") {
      img.alt = "Illustration";
    }
  });

  // 6) Interactions : hover "active" sur les icônes sociales au focus/keyboard
  document.querySelectorAll(".social-media a").forEach((a) => {
    a.addEventListener("focus", () => a.classList.add("keyboard"));
    a.addEventListener("blur", () => a.classList.remove("keyboard"));
  });
});

// ===== Année dynamique dans le footer =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Reveal on scroll (performant) =====
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target); // unhook pour perf
      }
    }
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ===== Skeleton: retirer la classe 'progressive' une fois l'image chargée =====
document.querySelectorAll("img.progressive").forEach((img) => {
  const done = () => img.classList.remove("progressive");
  if (img.complete) {
    done();
  } else {
    img.addEventListener("load", done);
    img.addEventListener("error", done);
  }
});

// ===== Barre de progression de scroll =====
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
  progressBar.style.width = `${pct}%`;
};
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
document.addEventListener("DOMContentLoaded", updateScrollProgress);

// ===== Smooth scroll (optionnel pour ancres internes) =====
document.documentElement.style.scrollBehavior = "smooth";

// ===== Dark mode toggle =====
const toggleBtn = document.getElementById("theme-toggle");
const rootEl = document.documentElement; // applique .theme-dark au <html>

const applyTheme = (isDark) => {
  rootEl.classList.toggle("theme-dark", isDark);
  toggleBtn.setAttribute("aria-pressed", String(isDark));
  toggleBtn.innerHTML = isDark
    ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
};

// Init: respecte le système
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(prefersDark);

// Toggle au clic
toggleBtn.addEventListener("click", () => {
  const nowDark = !rootEl.classList.contains("theme-dark");
  applyTheme(nowDark);
});

