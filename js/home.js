/* ============================================================
   PrintForge — Home Page JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initHamburger();
  initHeroCarousel();
  renderFeaturedProducts();
});

/* ── Hamburger ───────────────────────────────────────────────── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

/* ── Hero Carousel ───────────────────────────────────────────── */
function initHeroCarousel() {
  const track   = document.getElementById('hero-track');
  const dotsEl  = document.getElementById('hero-dots');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  if (!track) return;

  const slides = track.querySelectorAll('.hero-slide');
  const total  = slides.length;
  let current  = 0;
  let timer    = null;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function getDots() { return dotsEl.querySelectorAll('.hero-dot'); }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    getDots().forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); startAuto(); });

  // Pause on hover
  const carousel = document.getElementById('hero-carousel');
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Touch/swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startAuto(); }
  });

  // Keyboard
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); startAuto(); }
  });

  startAuto();
}

/* ── Featured Showcase ───────────────────────────────────────── */
function renderFeaturedProducts() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  const [spotlight, ...rest] = getFeaturedProducts().slice(0, 3);
  if (!spotlight) return;

  grid.innerHTML = `
    ${showcaseCardHTML(spotlight, true)}
    <div class="showcase-sidebar">
      ${rest.map(p => showcaseCardHTML(p, false)).join('')}
    </div>
  `;

  // Stagger the reveal delay per card
  grid.querySelectorAll('.reveal-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.13}s`;
  });

  initRevealCards();
}

function showcaseCardHTML(product, isSpotlight) {
  const price     = product.price.toFixed(2);
  const desc      = product.description || '';
  const shortDesc = desc.length > 130 ? desc.slice(0, 128) + '\u2026' : desc;

  let badge = '';
  if (product.isBestseller) {
    badge = `<span class="showcase-card__badge showcase-card__badge--bestseller">Bestseller</span>`;
  } else if (product.isNew) {
    badge = `<span class="showcase-card__badge showcase-card__badge--new">New</span>`;
  }

  return `
    <a href="product.html?id=${product.id}"
       class="showcase-card${isSpotlight ? ' showcase-card--spotlight' : ''} reveal-card">
      <div class="showcase-card__img">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        <div class="showcase-card__overlay">
          <span class="showcase-card__cat">${product.category}</span>
          <h3 class="showcase-card__name">${product.name}</h3>
          <p class="showcase-card__desc">${shortDesc}</p>
          <span class="showcase-card__price">$${price}</span>
        </div>
        ${badge}
        <span class="showcase-card__arrow" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
               stroke-width="2.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"/>
          </svg>
        </span>
      </div>
    </a>
  `;
}

function initRevealCards() {
  const cards = document.querySelectorAll('.reveal-card');
  if (!cards.length) return;

  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(c => observer.observe(c));
}
