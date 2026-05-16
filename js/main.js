// ── TESTIMONIAL STACKED CAROUSEL ──────────────────────────────
(function () {
  const stack = document.getElementById('tc-stack');
  if (!stack) return;

  const cards  = Array.from(stack.querySelectorAll('.tc-card'));
  const dotsEl = document.getElementById('tc-dots');
  const total  = cards.length;
  let current  = 0;
  let dragging = false;
  let startX   = 0;
  let dragX    = 0;

  // Build dots to match card count
  if (dotsEl && total > 1) {
    dotsEl.innerHTML = cards.map((_, i) =>
      `<span class="tc-dot${i === 0 ? ' active' : ''}"></span>`
    ).join('');
  }

  function setPositions() {
    cards.forEach((card, i) => {
      const pos = (i - current + total) % total;
      card.dataset.pos = pos < 3 ? pos : 'hidden';
      if (pos >= 3) card.dataset.pos = '2'; // collapse remaining behind back
    });
    if (dotsEl) {
      dotsEl.querySelectorAll('.tc-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }
  }

  function advance(dir) {
    const front = cards[current];
    front.dataset.pos = dir === 'left' ? 'out-left' : 'out-right';

    setTimeout(() => {
      front.dataset.pos = '2'; // reset to back of stack silently
      current = (current + 1) % total;
      setPositions();
    }, 400);
  }

  // Arrow button handlers (global so onclick= works)
  window.tcNext = () => advance('left');
  window.tcPrev = () => advance('right');

  // Drag / swipe on front card
  function getFrontCard() { return cards[current]; }

  function onPointerDown(e) {
    if (e.target.closest('.tc-arrow')) return;
    dragging = true;
    startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragX = 0;
    getFrontCard().style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragX = x - startX;
    const rotate = dragX / 18;
    getFrontCard().style.transform = `scale(1) translateX(${dragX}px) rotate(${rotate}deg)`;
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    const card = getFrontCard();
    card.style.transition = '';
    card.style.transform  = '';

    if (Math.abs(dragX) > 90) {
      advance(dragX < 0 ? 'left' : 'right');
    } else {
      // snap back
      card.dataset.pos = '0';
    }
    dragX = 0;
  }

  stack.addEventListener('mousedown',   onPointerDown);
  stack.addEventListener('touchstart',  onPointerDown, { passive: true });
  window.addEventListener('mousemove',  onPointerMove);
  window.addEventListener('touchmove',  onPointerMove, { passive: true });
  window.addEventListener('mouseup',    onPointerUp);
  window.addEventListener('touchend',   onPointerUp);

  // Init
  setPositions();
})();

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hero parallax / load
const hero = document.getElementById('hero');
if (hero) {
  hero.classList.add('loaded');
  window.addEventListener('scroll', () => {
    const bg = hero.querySelector('.hero-bg');
    if (bg) bg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.portfolio-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img').src;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

function closeLightbox() {
  lightbox?.classList.remove('open');
  document.body.style.overflow = '';
}

// Mobile nav
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile-menu');
const mobileClose = document.querySelector('.nav-mobile-close');

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileClose?.addEventListener('click', closeMobileNav);
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

function closeMobileNav() {
  mobileMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── MULTI-STEP LEAD FORM ───────────────────────────────────────
// 3-step form: project type → optional description → contact info.
// Submissions email tim@rockcitylighting.com and log to Google Sheet.
// Handled by the Google Apps Script — see Rock City Lighting Form in Drive.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNarhgPjLV86aeos486Vhkb6Uf-yJ2KsbtyZLYna8QGY1qxKcuyfN4k4720kM6n67uoQ/exec';

// ── MULTI-STEP FORM NAVIGATION ─────────────────────────────────
let _lfCurrentStep = 1;

function lfUpdateDots(step) {
  const dots = document.getElementById('lf-dots');
  if (dots) dots.dataset.step = step;
}

// Core step switch — dead simple, no inline styles, no animationend callbacks.
// CSS handles display via .lf-panel { display:none } / .lf-panel.active { display:block }.
// Animation is a CSS @keyframes on .active, direction set via .lf-going-back.
function showStep(step, direction) {
  const panels = document.querySelectorAll('.lf-panel');
  panels.forEach(p => {
    p.classList.remove('active', 'lf-going-back');
    // Ensure no stale inline display style interferes
    p.style.display = '';
  });
  const target = document.getElementById('step-' + step);
  if (!target) return;
  if (direction === 'back') target.classList.add('lf-going-back');
  target.classList.add('active');
  _lfCurrentStep = step;
  lfUpdateDots(step);
}

function formNext(currentStep) {
  if (currentStep === 1) {
    const grid     = document.getElementById('project-type-grid');
    const selected = grid && grid.querySelector('input[type="radio"]:checked');
    if (!selected) {
      grid.classList.remove('needs-selection');
      // Tiny timeout so removing+re-adding triggers the shake
      setTimeout(() => {
        grid.classList.add('needs-selection');
        grid.addEventListener('animationend', function h() {
          grid.classList.remove('needs-selection');
          grid.removeEventListener('animationend', h);
        });
      }, 10);
      return;
    }
  }
  showStep(currentStep + 1, 'forward');
}

function formBack(currentStep) {
  showStep(currentStep - 1, 'back');
}

// Init
showStep(1);

// Lead form submission
document.getElementById('lead-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Collect the radio value from the named group
  const projectInput = form.querySelector('input[name="project"]:checked');

  const payload = {
    name:        form.name.value,
    phone:       form.phone.value,
    email:       form.email.value,
    project:     projectInput ? projectInput.value : '',
    description: form.description?.value || '',
    timing:      form.timing?.value || '',
  };

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify(payload),
    });
    btn.textContent = "Sent! We'll be in touch soon.";
    btn.style.opacity = '0.7';
    form.reset();
    showStep(1);
    setTimeout(() => {
      btn.textContent  = 'Request a Consultation';
      btn.disabled     = false;
      btn.style.opacity = '';
    }, 5000);
  } catch {
    btn.textContent = 'Something went wrong — please call us.';
    btn.disabled = false;
  }
});
