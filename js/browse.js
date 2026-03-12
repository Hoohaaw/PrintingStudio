/* ============================================================
   PrintForge — Browse Page JS
   ============================================================ */

/* Category metadata for the animated hero banner */
const CATEGORY_META = {
  'All'        : { title: 'Browse All Prints',    sub: 'Explore our full catalogue — click any product to see details.' },
  'Figurines'  : { title: 'Figurines',            sub: 'Finely detailed prints at 0.1 mm — from dragons to characters.' },
  'Functional' : { title: 'Functional Parts',     sub: 'Practical 3D printed items for home, office and everyday use.' },
  'Decorative' : { title: 'Decorative Pieces',    sub: 'Eye-catching prints that make any room feel unique.' },
  'Toys'       : { title: 'Toys & Fidgets',       sub: 'Playful, articulated and fun prints for all ages.' },
  'Games'      : { title: 'Tabletop & Games',     sub: 'Dice towers, terrain, miniatures and more for gamers.' },
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();

  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

  // Read initial category from URL (e.g. browse.html?category=Figurines)
  const params       = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'All';
  let searchQuery    = '';
  let sortMode       = 'default';

  buildFilterBar();
  bindSearch();
  bindSort();
  updateHero(activeCategory);
  render();

  /* ── Hero text update ────────────────────────────────────── */
  function updateHero(category) {
    const meta    = CATEGORY_META[category] || { title: category, sub: `Showing all ${category} prints.` };
    const textEl  = document.getElementById('browse-hero-text');
    const titleEl = document.getElementById('browse-hero-title');
    const subEl   = document.getElementById('browse-hero-sub');
    if (!textEl || !titleEl || !subEl) return;

    textEl.classList.add('updating');
    setTimeout(() => {
      titleEl.textContent = meta.title;
      subEl.textContent   = meta.sub;
      textEl.classList.remove('updating');
    }, 200);
  }

  /* ── Filter bar ──────────────────────────────────────────── */
  function buildFilterBar() {
    const bar = document.getElementById('filter-bar');
    if (!bar) return;
    const categories = getCategories();
    bar.innerHTML = categories.map(cat => `
      <button class="filter-chip ${cat === activeCategory ? 'active' : ''}"
              data-category="${cat}">
        ${cat}
      </button>
    `).join('');
    bar.addEventListener('click', e => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      activeCategory = chip.dataset.category;
      bar.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c === chip));
      updateHero(activeCategory);
      render();
    });
  }

  /* ── Search ──────────────────────────────────────────────── */
  function bindSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery = input.value.trim().toLowerCase();
      render();
    });
  }

  /* ── Sort ────────────────────────────────────────────────── */
  function bindSort() {
    const sel = document.getElementById('sort-select');
    if (!sel) return;
    sel.addEventListener('change', () => {
      sortMode = sel.value;
      render();
    });
  }

  /* ── Render ──────────────────────────────────────────────── */
  function render() {
    const grid  = document.getElementById('product-grid');
    const count = document.getElementById('results-count');
    if (!grid) return;

    // Filter
    let items = PRODUCTS.filter(p => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery);
      return matchCat && matchSearch;
    });

    // Sort
    if (sortMode === 'price-asc')  items = [...items].sort((a, b) => a.price - b.price);
    if (sortMode === 'price-desc') items = [...items].sort((a, b) => b.price - a.price);
    if (sortMode === 'name-asc')   items = [...items].sort((a, b) => a.name.localeCompare(b.name));

    // Count
    if (count) {
      count.textContent = items.length === 0
        ? 'No products found'
        : `Showing ${items.length} product${items.length !== 1 ? 's' : ''}`;
    }

    // Render cards
    if (items.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/></svg>
          <p>No prints match your search. Try a different term or category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = items.map((p, i) => browseCardHTML(p, i)).join('');
    initRevealCards();
  }

  /* ── Browse Card HTML ────────────────────────────────────── */
  function browseCardHTML(product, index) {
    const price     = product.price.toFixed(2);
    const desc      = product.description || '';
    const shortDesc = desc.length > 110 ? desc.slice(0, 108) + '\u2026' : desc;

    let topBadge = '';
    if (!product.inStock) {
      topBadge = `<span class="browse-card__oos-label">Out of Stock</span>`;
    } else if (product.isBestseller) {
      topBadge = `<span class="showcase-card__badge showcase-card__badge--bestseller">Bestseller</span>`;
    } else if (product.isNew) {
      topBadge = `<span class="showcase-card__badge showcase-card__badge--new">New</span>`;
    }

    return `
      <a href="product.html?id=${product.id}"
         class="browse-card${!product.inStock ? ' browse-card--oos' : ''} reveal-card"
         style="transition-delay:${(index % 3) * 0.08}s">
        <div class="browse-card__img">
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
          <div class="browse-card__overlay">
            <span class="browse-card__cat">${product.category}</span>
            <h3 class="browse-card__name">${product.name}</h3>
            <p class="browse-card__desc">${shortDesc}</p>
            <span class="browse-card__price">$${price}</span>
          </div>
          ${topBadge}
        </div>
      </a>
    `;
  }

  /* ── Scroll reveal ───────────────────────────────────────── */
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
    }, { threshold: 0.08 });

    cards.forEach(c => observer.observe(c));
  }
});
