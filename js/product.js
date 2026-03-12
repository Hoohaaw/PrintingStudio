/* ============================================================
   PrintForge — Product Detail Page JS
   Reads ?id=<product-id> from the URL to load the correct product.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();

  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

  const root = document.getElementById('product-root');
  const id   = new URLSearchParams(window.location.search).get('id');

  if (!id) { showError('No product specified.'); return; }

  const product = getProductById(id);
  if (!product) { showError(`Product "${id}" not found.`); return; }

  // Update page title & meta
  document.title = `${product.name} — PrintForge`;

  // Render
  root.innerHTML = buildHTML(product);

  // Wire up gallery
  initGallery(product.images);

  // Wire up quantity + add to cart
  initAddToCart(product);

  // Related products
  renderRelated(product);
});

/* ── HTML builder ─────────────────────────────────────────────── */
function buildHTML(p) {
  const price = p.price.toFixed(2);
  const inStock = p.inStock;

  const specsHTML = Object.entries(p.specs).map(([key, val]) => `
    <div class="spec-row">
      <dt>${key}</dt>
      <dd>${val}</dd>
    </div>
  `).join('');

  const thumbsHTML = p.images.map((img, i) => `
    <button class="gallery__thumb ${i === 0 ? 'active' : ''}"
            data-index="${i}"
            aria-label="View image ${i + 1}">
      <img src="${img}" alt="${p.name} — view ${i + 1}" loading="lazy">
    </button>
  `).join('');

  const slidesHTML = p.images.map(img => `
    <div class="gallery__slide">
      <img src="${img}" alt="${p.name}">
    </div>
  `).join('');

  return `
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a>
      <span>›</span>
      <a href="browse.html">Browse</a>
      <span>›</span>
      <a href="browse.html?category=${encodeURIComponent(p.category)}">${p.category}</a>
      <span>›</span>
      <span style="color:var(--clr-text);">${p.name}</span>
    </nav>

    <div class="product-detail">

      <!-- ── Left: Image gallery ─────────────────────────────── -->
      <div class="gallery" id="gallery">
        <div class="gallery__main">
          <div class="gallery__main-track" id="gallery-track">
            ${slidesHTML}
          </div>
          ${p.images.length > 1 ? `
          <button class="gallery__nav-btn gallery__nav-btn--prev" id="gallery-prev" aria-label="Previous image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>
          </button>
          <button class="gallery__nav-btn gallery__nav-btn--next" id="gallery-next" aria-label="Next image">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>
          </button>` : ''}
        </div>
        ${p.images.length > 1 ? `<div class="gallery__thumbs" id="gallery-thumbs">${thumbsHTML}</div>` : ''}
      </div>

      <!-- ── Right: Product info ────────────────────────────── -->
      <div class="product-detail__info">
        <p class="product-detail__eyebrow">${p.category}</p>
        <h1 class="product-detail__title">${p.name}</h1>
        <p class="product-detail__price">$${price}</p>

        <p class="product-detail__desc">${p.description}</p>

        <!-- Specs -->
        <div class="product-detail__specs">
          <h3>Specifications</h3>
          <dl>${specsHTML}</dl>
        </div>

        <!-- Stock badge -->
        ${inStock
          ? '<p style="color:var(--clr-success);font-weight:600;font-size:.9rem;margin-bottom:16px;">✓ In Stock — ready to ship</p>'
          : '<p style="color:var(--clr-danger);font-weight:600;font-size:.9rem;margin-bottom:16px;">✕ Currently Out of Stock</p>'
        }

        <!-- Add to cart zone -->
        ${inStock ? `
        <div class="add-to-cart-zone">
          <div class="qty-control">
            <button id="qty-dec" aria-label="Decrease quantity" disabled>−</button>
            <input type="number" id="qty-input" value="1" min="1" max="99" aria-label="Quantity">
            <button id="qty-inc" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--primary btn--lg" id="add-to-cart-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>
            Add to Cart
          </button>
        </div>
        <div class="cart-feedback" id="cart-feedback">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
          Added to cart!
          <a href="cart.html" style="color:var(--clr-accent);margin-left:8px;">View Cart →</a>
        </div>
        ` : `
        <a href="contact.html" class="btn btn--outline btn--lg">
          Notify Me When Available
        </a>
        `}

        <!-- Reassurances -->
        <div style="margin-top:24px;display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--clr-muted);">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;flex-shrink:0;color:var(--clr-success)"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
            Free returns within 14 days
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--clr-muted);">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;flex-shrink:0;color:var(--clr-success)"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
            Hand-inspected before shipping
          </div>
          <div style="display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--clr-muted);">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:16px;height:16px;flex-shrink:0;color:var(--clr-success)"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
            Ships within 3–5 business days
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ── Gallery logic ─────────────────────────────────────────────── */
function initGallery(images) {
  const track  = document.getElementById('gallery-track');
  const thumbs = document.getElementById('gallery-thumbs');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  if (!track) return;

  let current = 0;

  function goTo(index) {
    current = Math.max(0, Math.min(index, images.length - 1));
    track.style.transform = `translateX(-${current * 100}%)`;
    if (thumbs) {
      thumbs.querySelectorAll('.gallery__thumb').forEach((t, i) => {
        t.classList.toggle('active', i === current);
      });
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  if (thumbs) {
    thumbs.addEventListener('click', e => {
      const thumb = e.target.closest('.gallery__thumb');
      if (thumb) goTo(parseInt(thumb.dataset.index, 10));
    });
  }

  // Touch/swipe on main image
  const galleryMain = track.parentElement;
  let touchStartX = 0;
  galleryMain.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  galleryMain.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });
}

/* ── Quantity + Add to Cart ─────────────────────────────────────── */
function initAddToCart(product) {
  const decBtn   = document.getElementById('qty-dec');
  const incBtn   = document.getElementById('qty-inc');
  const qtyInput = document.getElementById('qty-input');
  const addBtn   = document.getElementById('add-to-cart-btn');
  const feedback = document.getElementById('cart-feedback');

  if (!addBtn) return;

  function getQty()    { return parseInt(qtyInput.value, 10) || 1; }
  function updateBtns(q) {
    decBtn.disabled = q <= 1;
    incBtn.disabled = q >= 99;
  }

  decBtn.addEventListener('click', () => {
    const q = Math.max(1, getQty() - 1);
    qtyInput.value = q;
    updateBtns(q);
  });

  incBtn.addEventListener('click', () => {
    const q = Math.min(99, getQty() + 1);
    qtyInput.value = q;
    updateBtns(q);
  });

  qtyInput.addEventListener('input', () => {
    let q = parseInt(qtyInput.value, 10);
    if (isNaN(q) || q < 1) q = 1;
    if (q > 99) q = 99;
    qtyInput.value = q;
    updateBtns(q);
  });

  addBtn.addEventListener('click', () => {
    const qty = getQty();
    Cart.add(product.id, qty);

    // Show feedback
    if (feedback) {
      feedback.classList.add('show');
      clearTimeout(feedback._timer);
      feedback._timer = setTimeout(() => feedback.classList.remove('show'), 4000);
    }
    showToast(`${qty} × ${product.name} added to cart`);
  });
}

/* ── Related Products ──────────────────────────────────────────── */
function renderRelated(current) {
  const related = PRODUCTS.filter(p => p.id !== current.id && p.category === current.category);
  // If fewer than 2 same-category, fill up with other in-stock products
  const pool = related.length >= 2 ? related : PRODUCTS.filter(p => p.id !== current.id && p.inStock);
  const picks = pool.slice(0, 4);
  if (picks.length === 0) return;

  const section = document.createElement('section');
  section.className = 'related-products';
  section.innerHTML = `
    <div class="container">
      <h2 class="related-products__title">You Might Also Like</h2>
      <div class="related-grid">
        ${picks.map(p => {
          const badges = [];
          if (p.isBestseller) badges.push('<span class="badge badge--bestseller">Bestseller</span>');
          if (p.isNew)        badges.push('<span class="badge badge--new">New</span>');
          const badgesHTML = badges.length ? `<div class="card-badges">${badges.join('')}</div>` : '';
          return `
            <a href="product.html?id=${p.id}" class="product-card">
              <div class="product-card__img">
                ${badgesHTML}
                <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
              </div>
              <div class="product-card__body">
                <span class="product-card__category">${p.category}</span>
                <h3 class="product-card__name">${p.name}</h3>
                <p class="product-card__price">$${p.price.toFixed(2)}</p>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Insert after the product-root container
  const root = document.getElementById('product-root');
  root.parentElement.insertAdjacentElement('afterend', section);
}

/* ── Error state ───────────────────────────────────────────────── */
function showError(msg) {
  const root = document.getElementById('product-root');
  if (root) {
    root.innerHTML = `
      <div style="text-align:center;padding:80px 20px;">
        <p style="color:var(--clr-danger);font-size:1.1rem;margin-bottom:20px;">${msg}</p>
        <a href="browse.html" class="btn btn--primary">Back to Browse</a>
      </div>
    `;
  }
}
