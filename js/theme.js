/* ============================================================
   PrintForge — Theme Toggle (light / dark)
   Reads/writes 'printforge_theme' in localStorage.
   Falls back to OS preference if no saved value.
   ============================================================ */

const THEME_KEY = 'printforge_theme';

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return 'light'; // default for new visitors
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
  updateToggleBtn();
}

function updateToggleBtn() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  btn.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  btn.innerHTML = isDark ? ICON_SUN : ICON_MOON;
}

const ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"/></svg>`;
const ICON_SUN  = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"/></svg>`;

document.addEventListener('DOMContentLoaded', () => {
  // Inject button into navbar (before cart button)
  const actions = document.querySelector('.navbar__actions');
  if (actions && !document.getElementById('theme-toggle')) {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle-btn';
    btn.addEventListener('click', toggleTheme);
    actions.insertBefore(btn, actions.firstChild);
  }

  // Ensure theme is applied and button reflects current state
  applyTheme(getPreferredTheme());
  updateToggleBtn();
});
