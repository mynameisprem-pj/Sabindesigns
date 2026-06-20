/* ── Page loader ── */
const pageLoader = document.getElementById('pageLoader');
if (pageLoader) {
  requestAnimationFrame(() => pageLoader.classList.add('start'));
  window.addEventListener('load', () => {
    pageLoader.classList.add('done');
    setTimeout(() => pageLoader.remove(), 500);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

/* ── Scrolled nav ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile nav drawer ── */
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');

function closeDrawer() {
  navDrawer.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function openDrawer() {
  navDrawer.classList.add('open');
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

if (navToggle && navDrawer) {
  navToggle.setAttribute('aria-expanded', 'false');

  navToggle.addEventListener('click', () => {
    const isOpen = navDrawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  // Close when a drawer link is clicked
  navDrawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navDrawer.classList.contains('open') &&
        !navDrawer.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeDrawer();
    }
  });
}

/* ── Lightbox ── */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImg.src = ''; }, 300);
}

document.querySelectorAll('.tile-frame[data-img]').forEach(btn => {
  btn.addEventListener('click', () => {
    openLightbox(btn.dataset.img, btn.dataset.alt);
  });
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

/* ── Scroll reveal ── */
const toReveal = document.querySelectorAll('.tile, .service, .stat, .section-head');

if ('IntersectionObserver' in window) {
  toReveal.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  toReveal.forEach(el => io.observe(el));

  // Fallback: reveal everything after 4s in case observer misfires
  setTimeout(() => {
    toReveal.forEach(el => el.classList.add('in'));
  }, 4000);
}