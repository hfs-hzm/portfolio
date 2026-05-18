/* ═══════════════════════════════════════════════════════
   main.js — Mohammed Hazeem Hafsa Portfolio
   ═══════════════════════════════════════════════════════ */

/* ── CUSTOM CURSOR ──────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 5}px, ${my - 5}px)`;
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .tag-pill, .fbtn, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '56px';
    ring.style.height = '56px';
    ring.style.opacity = '0.8';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '36px';
    ring.style.height = '36px';
    ring.style.opacity = '0.5';
  });
});

/* ── PARTICLE CANVAS ────────────────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 1.5 + 0.3;
    this.vx    = (Math.random() - 0.5) * 0.3;
    this.vy    = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.7 ? '0,229,204' : '255,255,255';
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,229,204,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

(function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(loop);
})();

/* ── SCROLL PROGRESS ────────────────────────────────────── */
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  bar.style.width = pct + '%';
});

/* ── NAV SCROLL STATE ───────────────────────────────────── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── TYPEWRITER ─────────────────────────────────────────── */
const roles  = ['Software Developer', 'ML Engineer', 'NLP Researcher', 'Full-Stack Dev', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const word = roles[ri];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, deleting ? 60 : 100);
}
setTimeout(type, 1500);

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const reveals  = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(r => observer.observe(r));

/* ── SKILL BAR ANIMATION ────────────────────────────────── */
const fills    = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
fills.forEach(f => skillObs.observe(f));

/* ── ANIMATED STAT COUNTERS ─────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObs  = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    let current  = 0;
    const step   = Math.max(1, Math.floor(target / 40));

    const tick = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(tick); }
      el.textContent = current + suffix;
    }, 40);

    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(s => statObs.observe(s));

/* ── PROJECT FILTER ─────────────────────────────────────── */
function filterProjects(cat, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('.proj-card').forEach(card => {
    const matches = cat === 'all' || card.dataset.cat === cat;
    if (matches) {
      card.style.display = '';
      requestAnimationFrame(() => card.classList.remove('hidden'));
    } else {
      card.classList.add('hidden');
      setTimeout(() => {
        if (card.classList.contains('hidden')) card.style.display = 'none';
      }, 400);
    }
  });
}

/* ── TOAST NOTIFICATION ─────────────────────────────────── */
function showToast(msg, isErr = false) {
  const root  = document.getElementById('toast-root');
  const toast = document.createElement('div');
  toast.className = 'toast' + (isErr ? ' err' : '');
  toast.textContent = msg;
  root.innerHTML = '';
  root.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
}

/* ── COPY EMAIL TO CLIPBOARD ────────────────────────────── */
function copyEmail(email) {
  navigator.clipboard.writeText(email)
    .then(() => showToast('Email copied to clipboard ✓'))
    .catch(() => showToast('Could not copy — use: ' + email, true));
}

/* ── IMAGE SLIDERS ──────────────────────────────────────── */
document.querySelectorAll('[data-slider]').forEach(panel => {
  const slidesTrack = panel.querySelector('.slides');
  const slideEls    = panel.querySelectorAll('.slide');
  const dotsWrap    = panel.querySelector('.slide-dots');
  const btnPrev     = panel.querySelector('.slide-btn.prev');
  const btnNext     = panel.querySelector('.slide-btn.next');
  const total       = slideEls.length;
  let current       = 0;

  /* Hide arrows if only one screenshot */
  if (total <= 1) {
    btnPrev.style.display = 'none';
    btnNext.style.display = 'none';
  }

  /* Build dot indicators */
  slideEls.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'slide-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    slidesTrack.style.transform = `translateX(-${current * 100}%)`;
    panel.querySelectorAll('.slide-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  /* Touch / swipe support */
  let touchStartX = 0;
  panel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  panel.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });

  /* Mouse drag support */
  let mouseStartX = 0, dragging = false;
  panel.addEventListener('mousedown',  e => { mouseStartX = e.clientX; dragging = true; });
  panel.addEventListener('mouseup',    e => {
    if (!dragging) return; dragging = false;
    const dx = e.clientX - mouseStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  });
  panel.addEventListener('mouseleave', () => { dragging = false; });
});