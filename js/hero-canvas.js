/* ============================================================
   PrintForge — Hero Canvas Animation
   Dark futuristic particle network + rotating geometric shapes
   with parallax scroll effect.
   ============================================================ */

(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CFG = {
    particleCount : 72,
    connectDist   : 145,
    bg            : '#0a0a12',
    colors        : ['#ff7a1e', '#ffb347', '#ff5500', '#ffcc55', '#e06010'],
    particleSpeed : reducedMotion ? 0 : 1,
  };

  let W = 0, H = 0;
  let particles = [];
  let shapes    = [];
  let raf;

  /* ── Resize ─────────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    shapes    = buildShapes();
    particles = buildParticles();
  }

  /* ── Large wireframe polygon shapes ─────────────────────────── */
  function buildShapes() {
    return [
      { cx: W * 0.10, cy: H * 0.30, r: Math.min(W, H) * 0.18, rot: 0,            drot:  0.0016, sides: 6, alpha: 0.07 },
      { cx: W * 0.90, cy: H * 0.60, r: Math.min(W, H) * 0.22, rot: Math.PI / 6,  drot: -0.0011, sides: 6, alpha: 0.06 },
      { cx: W * 0.58, cy: H * 0.92, r: Math.min(W, H) * 0.09, rot: 0,            drot:  0.0024, sides: 3, alpha: 0.09 },
      { cx: W * 0.28, cy: H * 0.08, r: Math.min(W, H) * 0.07, rot: Math.PI / 4,  drot: -0.0019, sides: 4, alpha: 0.08 },
      { cx: W * 0.72, cy: H * 0.12, r: Math.min(W, H) * 0.06, rot: Math.PI / 3,  drot:  0.0022, sides: 6, alpha: 0.06 },
    ];
  }

  /* ── Particles ───────────────────────────────────────────────── */
  function buildParticles() {
    return Array.from({ length: CFG.particleCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const spd   = (Math.random() * 0.25 + 0.08) * CFG.particleSpeed;
      return {
        x     : Math.random() * W,
        y     : Math.random() * H,
        vx    : Math.cos(angle) * spd,
        vy    : Math.sin(angle) * spd,
        r     : Math.random() * 1.4 + 0.7,
        color : CFG.colors[Math.floor(Math.random() * CFG.colors.length)],
        alpha : Math.random() * 0.35 + 0.45,
      };
    });
  }

  /* ── Draw a regular polygon ──────────────────────────────────── */
  function polygon(cx, cy, r, sides, rotation) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 / sides) * i + rotation;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  /* ── Animation frame ─────────────────────────────────────────── */
  function frame() {
    ctx.clearRect(0, 0, W, H);

    /* Background fill */
    ctx.fillStyle = CFG.bg;
    ctx.fillRect(0, 0, W, H);

    /* Subtle dot grid */
    const step = 58;
    ctx.fillStyle = 'rgba(255,122,30,0.032)';
    for (let x = step / 2; x < W; x += step) {
      for (let y = step / 2; y < H; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 0.75, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* Large wireframe shapes */
    shapes.forEach(s => {
      if (!reducedMotion) s.rot += s.drot;

      /* Outer ring */
      polygon(s.cx, s.cy, s.r, s.sides, s.rot);
      ctx.strokeStyle = `rgba(255,122,30,${s.alpha})`;
      ctx.lineWidth   = 1;
      ctx.stroke();

      /* Inner ring (counter-rotates slightly) */
      polygon(s.cx, s.cy, s.r * 0.52, s.sides, -s.rot * 1.4);
      ctx.strokeStyle = `rgba(255,165,60,${s.alpha * 0.55})`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();

      /* Centre dot */
      ctx.beginPath();
      ctx.arc(s.cx, s.cy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,80,${s.alpha * 1.4})`;
      ctx.fill();
    });

    /* Move particles */
    if (!reducedMotion) {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0)  p.x += W;
        if (p.x > W)  p.x -= W;
        if (p.y < 0)  p.y += H;
        if (p.y > H)  p.y -= H;
      });
    }

    /* Draw connections (O(n²) but n=72 is fine) */
    const thresh2 = CFG.connectDist * CFG.connectDist;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < thresh2) {
          const t = 1 - Math.sqrt(d2) / CFG.connectDist;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255,122,30,${(t * t) * 0.28})`;
          ctx.lineWidth   = t * 0.9;
          ctx.stroke();
        }
      }
    }

    /* Draw particles */
    particles.forEach(p => {
      /* Soft glow halo */
      const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      grd.addColorStop(0, p.color + '30');  /* ~19% opacity hex */
      grd.addColorStop(1, p.color + '00');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      /* Core dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    raf = requestAnimationFrame(frame);
  }

  /* ── Parallax on scroll ──────────────────────────────────────── */
  function initParallax() {
    const hero = document.getElementById('hero-carousel');
    if (!hero) return;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < hero.offsetHeight + 200) {
        canvas.style.transform = `translateY(${y * 0.30}px)`;
      }
    }, { passive: true });
  }

  /* ── Bootstrap ───────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    resize();
    frame();
  });

  resize();
  frame();
  if (!reducedMotion) initParallax();
})();
