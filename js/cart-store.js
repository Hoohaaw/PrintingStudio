/* ============================================================
   PrintForge — Cart Store
   Manages cart state in localStorage.
   Depends on: data.js (PRODUCTS must be loaded first)
   ============================================================ */

const Cart = (() => {
  const STORAGE_KEY = 'printforge_cart';

  /* ── Internal helpers ─────────────────────────────────────── */

  function _read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function _write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    _refreshBadge();
    _dispatchChange();
  }

  function _refreshBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const n = count();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
  }

  function _dispatchChange() {
    window.dispatchEvent(new CustomEvent('cart:change'));
  }

  /* ── Public API ───────────────────────────────────────────── */

  /** Return a copy of the current cart items array */
  function get() {
    return _read();
  }

  /**
   * Add qty units of a product to the cart.
   * If already in cart, increments existing quantity.
   */
  function add(productId, qty = 1) {
    if (qty < 1) return;
    const product = getProductById(productId);
    if (!product) { console.warn(`Cart.add: unknown product "${productId}"`); return; }

    const items = _read();
    const existing = items.find(i => i.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id:    productId,
        name:  product.name,
        price: product.price,
        image: product.images[0],
        qty,
      });
    }
    _write(items);
  }

  /** Remove a product from the cart entirely */
  function remove(productId) {
    _write(_read().filter(i => i.id !== productId));
  }

  /** Set exact quantity for a product (removes if qty ≤ 0) */
  function setQty(productId, qty) {
    if (qty <= 0) { remove(productId); return; }
    const items = _read();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = qty; _write(items); }
  }

  /** Clear all items */
  function clear() {
    _write([]);
  }

  /** Total item count (sum of all quantities) */
  function count() {
    return _read().reduce((s, i) => s + i.qty, 0);
  }

  /** Total price */
  function total() {
    return _read().reduce((s, i) => s + i.price * i.qty, 0);
  }

  /** Call once per page to sync the badge on load */
  function init() {
    _refreshBadge();
  }

  return { get, add, remove, setQty, clear, count, total, init };
})();

/* ── Toast helper (shared across pages) ─────────────────────── */
function showToast(message, duration = 2800) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}
