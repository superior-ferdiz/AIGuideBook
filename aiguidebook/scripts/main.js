/* AIGuidebook — main.js */
'use strict';

/* ---- Hamburger-meny ---- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
  });

  /* Lukk ved klikk utenfor */
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* Lukk ved Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });
})();

/* ---- Aktiv lenke ---- */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const name = href.split('/').pop().split('#')[0];
    const current = path.split('/').pop();
    if ((name === current) || (current === '' && href.endsWith('index.html'))) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
})();

/* ---- Smooth scroll for ankerpeker ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
