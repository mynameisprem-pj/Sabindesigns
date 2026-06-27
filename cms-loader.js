/* ============================================================
   cms-loader.js  —  Sabin Designs CMS
   Fetches /content/data.json and hydrates every section.
   The hero marquee rows are rebuilt from the same thumbnails
   array used by the My Work section, keeping them in sync.
   ============================================================ */

(async function () {
  let data;
  try {
    const res = await fetch('/content/data.json');
    if (!res.ok) throw new Error('data.json not found');
    data = await res.json();
  } catch (e) {
    console.warn('[CMS] Could not load content/data.json — using static HTML fallback.', e);
    return;
  }

  /* ── helpers ── */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const SOCIAL_ICON = { instagram: 'icon-instagram', tiktok: 'icon-tiktok', facebook: 'icon-facebook', twitter: 'icon-twitter', youtube: 'icon-youtube', linkedin: 'icon-linkedin' };

  /* ── 0. SITE LOGO (nav, splash, footer) ── */
  const site = data.site;
  if (site && site.logo) {
    // nav logo
    const navLogo = $(".nav .logo img");
    if (navLogo) { navLogo.src = site.logo; navLogo.alt = site.logo_alt || ""; }
    // splash screen
    const splash = $("#splashScreen img");
    if (splash) { splash.src = site.logo; splash.alt = site.logo_alt || ""; }
    // footer logo
    const footLogo = $(".footer-inner .logo img");
    if (footLogo) { footLogo.src = site.logo; footLogo.alt = site.logo_alt || ""; }
    // favicon
    const favicon = document.querySelector("link[rel~=icon]");
    if (favicon) favicon.href = site.logo;
  }

  /* ── 1. HERO text ── */
  const h = data.hero;
  if (h) {
    const hl = $('.hero-line');
    if (hl) hl.innerHTML = `<span class="hero-yellow">${h.headline}</span>`;

    const sub = $('.hero-sub');
    if (sub) sub.textContent = h.subtext;

    const [p, s] = $$('.hero-actions .btn');
    if (p) { p.textContent = h.cta_primary_label;   p.href = h.cta_primary_href; }
    if (s) { s.textContent = h.cta_secondary_label; s.href = h.cta_secondary_href; }

    const cl = $('.hero-clients-label');
    if (cl) cl.textContent = h.clients_label;
  }

  /* ── 2. HERO marquee (rebuilt from thumbnails) ── */
  const thumbs = data.thumbnails || [];
  if (thumbs.length) {
    const rowA = $('.hero-row--a .hero-row-track');
    const rowB = $('.hero-row--b .hero-row-track');
    const rowC = $('.hero-row--c .hero-row-track');

    function buildHeroCards(arr) {
      // duplicate set for seamless CSS loop
      return [...arr, ...arr].map(t =>
        `<div class="hero-card"><img src="${t.url}" alt="" loading="lazy"></div>`
      ).join('');
    }

    // split thumbs evenly into 3 rows
    const third = Math.ceil(thumbs.length / 3);
    const sliceA = thumbs.slice(0, third);
    const sliceB = thumbs.slice(third, third * 2);
    const sliceC = thumbs.slice(third * 2);

    if (rowA) rowA.innerHTML = buildHeroCards(sliceA);
    if (rowB) rowB.innerHTML = buildHeroCards(sliceB);
    if (rowC) rowC.innerHTML = buildHeroCards(sliceC);
  }

  /* ── 3. CLIENT logos marquee ── */
  const clients = data.clients || [];
  if (clients.length) {
    const track = $('.client-track');
    if (track) {
      track.innerHTML = [
        ...clients.map(c => `<img src="${c.url}" alt="${c.alt}" loading="lazy">`),
        ...clients.map(c => `<img src="${c.url}" alt="" loading="lazy">`)
      ].join('');
    }
  }

  /* ── 4. MY WORK tiles (+ re-bind lightbox) ── */
  if (thumbs.length) {
    const fwdTrack = $('.reel-row--fwd .reel-track');
    const revTrack = $('.reel-row--rev .reel-track');

    const half = Math.ceil(thumbs.length / 2);
    const fwdThumbs = thumbs.slice(0, half);
    const revThumbs = thumbs.slice(half);

    function buildTiles(arr) {
      return [...arr, ...arr].map(t =>
        `<button class="tile-frame" data-img="${t.url}" data-alt="${t.alt}">
          <img src="${t.url}" alt="" loading="lazy">
        </button>`
      ).join('');
    }

    if (fwdTrack) fwdTrack.innerHTML = buildTiles(fwdThumbs);
    if (revTrack) revTrack.innerHTML = buildTiles(revThumbs);

    // Re-bind lightbox clicks after DOM update
    const lightbox    = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    $$('.tile-frame[data-img]').forEach(btn => {
      btn.addEventListener('click', () => {
        lightboxImg.src = btn.dataset.img;
        lightboxImg.alt = btn.dataset.alt || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('lightboxClose').focus();
      });
    });

    // Re-run scroll reveal on new tiles
    if ('IntersectionObserver' in window) {
      $$('.tile-frame').forEach(el => {
        el.classList.add('reveal');
        io_global && io_global.observe(el);
      });
    }
  }

  /* ── 5. ABOUT ── */
  const ab = data.about;
  if (ab) {
    const portrait = $('.about-portrait img');
    if (portrait) { portrait.src = ab.portrait; portrait.alt = 'Portrait'; }

    const bio = $('.about-text');
    if (bio) bio.textContent = ab.bio;

    const statEls = $$('.about-stats .stat');
    (ab.stats || []).forEach((s, i) => {
      if (!statEls[i]) return;
      const num   = statEls[i].querySelector('.stat-num');
      const label = statEls[i].querySelector('.stat-label');
      if (num)   num.textContent   = s.num;
      if (label) label.textContent = s.label;
    });
  }

  /* ── 6. TESTIMONIALS ── */
  const testis = data.testimonials || [];
  if (testis.length) {
    const grid = $('.testi-grid');
    if (grid) {
      grid.innerHTML = testis.map(t => `
        <div class="testi-card">
          <div class="testi-logo"><img src="${t.logo}" alt="${t.alt || ''}"></div>
          <p class="testi-quote">"${t.quote}"</p>
          <div class="testi-stars">${'★'.repeat(t.stars || 5)}</div>
        </div>`).join('');
    }
  }

  /* ── 7. CONTACT ── */
  const ct = data.contact;
  if (ct) {
    const eye = $('.contact .eyebrow');
    if (eye) eye.textContent = ct.eyebrow;

    const title = $('.contact-title');
    if (title) {
      const parts = ct.headline.split('perform?');
      title.innerHTML = parts[0] + '<span class="hero-yellow">perform?</span>' + (parts[1] || '');
    }

    const sub = $('.contact-sub');
    if (sub) sub.textContent = ct.subtext;

    const waBtn = $('.btn-whatsapp');
    if (waBtn && ct.whatsapp_number) {
      const msg  = encodeURIComponent(ct.whatsapp_prefill || '');
      waBtn.href = `https://wa.me/${ct.whatsapp_number}?text=${msg}`;
    }

    const socials = ct.socials || [];
    const row = $('.social-row');
    if (row && socials.length) {
      row.innerHTML = socials.map(s => `
        <a href="${s.url}" class="social-link" aria-label="${s.label}" target="_blank" rel="noopener">
          <i class="${SOCIAL_ICON[s.platform] || 'icon-link'}"></i>
          <span>${s.label}</span>
        </a>`).join('');
    }
  }

  /* ── 8. FOOTER ── */
  const ft = data.footer;
  if (ft) {
    const fp = $('.footer-inner p');
    if (fp) {
      const yr = document.getElementById('year');
      const yearVal = yr ? yr.textContent : new Date().getFullYear();
      fp.innerHTML = `&copy; <span id="year">${yearVal}</span> Sabin Designs. ${ft.tagline}`;
    }
  }

  document.dispatchEvent(new CustomEvent('cms:ready'));
})();

// Expose IO globally so cms-loader can hook into it after dynamic render
let io_global = null;
document.addEventListener('DOMContentLoaded', () => {
  const toReveal = document.querySelectorAll('.tile, .service, .stat, .section-head');
  if ('IntersectionObserver' in window) {
    io_global = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io_global.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
  }
});
