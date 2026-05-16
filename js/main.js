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

// ── LEAD FORM ─────────────────────────────────────────────────
// Submissions email tim@rockcitylighting.com and log to Google Sheet.
// Handled by the Google Apps Script — see Rock City Lighting Form in Drive.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwNarhgPjLV86aeos486Vhkb6Uf-yJ2KsbtyZLYna8QGY1qxKcuyfN4k4720kM6n67uoQ/exec';

document.querySelector('.contact-form form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const payload = {
    name:    form.name.value,
    phone:   form.phone.value,
    email:   form.email.value,
    address: form.address.value,
    project: form.project.value,
    time:    form.timing.value,
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
    setTimeout(() => {
      btn.textContent  = 'Send My Request';
      btn.disabled     = false;
      btn.style.opacity = '';
    }, 5000);
  } catch {
    btn.textContent = 'Something went wrong — please call us.';
    btn.disabled = false;
  }
});
