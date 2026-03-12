/* ============================================================
   PrintForge — Cookie Consent Banner
   ============================================================ */
(function () {
  const COOKIE_KEY = 'printforge_cookies_accepted';

  // Don't show if already decided
  if (localStorage.getItem(COOKIE_KEY)) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <div class="cookie-banner__inner">
      <p>
        We use cookies to keep your cart saved and remember your preferences.
        <a href="shipping.html">Learn more</a>
      </p>
      <div class="cookie-banner__btns">
        <button id="cookie-decline" class="btn btn--ghost btn--sm">Decline</button>
        <button id="cookie-accept" class="btn btn--primary btn--sm">Accept</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Animate in after a short delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => banner.classList.add('visible'));
  });

  function dismiss(accepted) {
    localStorage.setItem(COOKIE_KEY, accepted ? 'yes' : 'no');
    banner.classList.remove('visible');
    banner.addEventListener('transitionend', () => banner.remove(), { once: true });
  }

  document.getElementById('cookie-accept').addEventListener('click', () => dismiss(true));
  document.getElementById('cookie-decline').addEventListener('click', () => dismiss(false));
})();
