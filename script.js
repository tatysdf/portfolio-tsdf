
// Script minimaliste, clean, et utile
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Barre de progression de scroll
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
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
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  // 2) Marquer les éléments à révéler (sans modifier ton HTML)
  const toRevealSelectors = [
    '.about h1',
    '.about p',
    '.social-media li',
    '.project-item',
    '.certification-item'
  ];
  const toReveal = document.querySelectorAll(toRevealSelectors.join(','));
  toReveal.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger léger
    el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
  });

  // 3) Révélation au scroll (IntersectionObserver)
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    toReveal.forEach(el => io.observe(el));
  } else {
    // Fallback : tout visible
    toReveal.forEach(el => el.classList.add('in-view'));
  }

  // 4) Micro-parallaxe (très subtil) sur le H1 de la section "about"
  const aboutTitle = document.querySelector('.about h1');
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
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 5) Améliorations légères :
  // - Lazy-load sur toutes les images si non défini
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    // Ajout d'un alt par défaut s'il manque (bonne pratique)
    if (!img.alt || img.alt.trim() === '') {
      img.alt = 'Illustration';
    }
  });

  // 6) Interactions : hover "active" sur les icônes sociales au focus/keyboard
  document.querySelectorAll('.social-media a').forEach(a => {
    a.addEventListener('focus', () => a.classList.add('keyboard'));
    a.addEventListener('blur', () => a.classList.remove('keyboard'));
  });
});
