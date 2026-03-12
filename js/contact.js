/* ============================================================
   PrintForge — Contact Page JS

   EMAIL SETUP (choose one):

   ── Option A: EmailJS (no server required) ──────────────────
   1. npm install (or add via CDN) emailjs-com
   2. Uncomment the EmailJS <script> block in contact.html
   3. Fill in your credentials below:

   const EMAILJS_SERVICE_ID  = 'TODO_SERVICE_ID';   // e.g. 'service_abc123'
   const EMAILJS_TEMPLATE_ID = 'TODO_TEMPLATE_ID';  // e.g. 'template_xyz789'
   const EMAILJS_PUBLIC_KEY  = 'TODO_PUBLIC_KEY';    // e.g. 'user_AbcDefGhiJkl'

   ── Option B: Formspree ─────────────────────────────────────
   Change the <form> action in contact.html to your Formspree endpoint
   and remove the JS form handler below. Formspree handles submission.

   ── Option C: Your own backend ──────────────────────────────
   Replace the sendEmail() function body with a fetch() to your API.
   ============================================================ */

// ── EmailJS credentials (fill in when ready) ────────────────
const EMAILJS_SERVICE_ID  = 'TODO_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'TODO_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'TODO_PUBLIC_KEY';

// ── Set to true once EmailJS is configured ──────────────────
const EMAIL_CONFIGURED = false;

// ────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();

  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('mobile-nav');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

  const form      = document.getElementById('contact-form');
  const statusEl  = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic validation
    const firstName = form.first_name.value.trim();
    const lastName  = form.last_name.value.trim();
    const email     = form.from_email.value.trim();
    const subject   = form.subject.value;
    const message   = form.message.value.trim();

    if (!firstName || !lastName || !email || !subject || !message) {
      showStatus('error', 'Please fill in all required fields.');
      return;
    }
    if (!isValidEmail(email)) {
      showStatus('error', 'Please enter a valid email address.');
      return;
    }

    // Disable button & show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    clearStatus();

    try {
      await sendEmail({ firstName, lastName, email, subject, message });
      showStatus('success', "Thanks for your message! We'll be in touch within 24 hours.");
      form.reset();
    } catch (err) {
      console.error('Contact form error:', err);
      showStatus('error', 'Something went wrong. Please email us directly or try again later.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:18px;height:18px"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/></svg>
        Send Message`;
    }
  });

  /* ── Send helpers ─────────────────────────────────────────── */

  async function sendEmail({ firstName, lastName, email, subject, message }) {
    if (!EMAIL_CONFIGURED) {
      // Demo mode: simulate a delay and succeed
      // Remove this block once EMAIL_CONFIGURED = true
      await new Promise(r => setTimeout(r, 1200));
      return;
    }

    // EmailJS send
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS SDK not loaded. Add the <script> tag to contact.html.');
    }
    const params = {
      from_name: `${firstName} ${lastName}`,
      from_email: email,
      subject,
      message,
    };
    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY);
    if (response.status !== 200) throw new Error(`EmailJS returned status ${response.status}`);
  }

  /* ── UI helpers ───────────────────────────────────────────── */

  function showStatus(type, text) {
    statusEl.className = `form-status ${type}`;
    statusEl.textContent = text;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function clearStatus() {
    statusEl.className = 'form-status';
    statusEl.textContent = '';
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
