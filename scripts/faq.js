/* AIGuidebook — faq.js
   Håndterer sjekkliste med localStorage-persistering.
   FAQ bruker native <details>/<summary> og trenger ikke JS.
*/
'use strict';

const STORAGE_KEY = 'aiguidebook_checklist';

/* ---- Sjekkliste ---- */
(function () {
  const items = document.querySelectorAll('.checklist-item');
  if (!items.length) return;

  /* Les lagret tilstand */
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (_) {}

  /* Oppdater visuell tilstand */
  function updateItem(item) {
    const cb = item.querySelector('input[type="checkbox"]');
    if (!cb) return;
    item.classList.toggle('checked', cb.checked);
  }

  /* Oppdater progresjon */
  function updateProgress() {
    const total   = items.length;
    const checked = [...items].filter(i => i.querySelector('input')?.checked).length;
    const pct     = total ? Math.round((checked / total) * 100) : 0;

    const bar    = document.querySelector('.progress-bar');
    const status = document.querySelector('.checklist-status');

    if (bar) bar.style.width = pct + '%';
    if (status) {
      if (checked === total) {
        status.textContent = '✅ Alt er krysset av – bra jobbet!';
        status.style.color = 'var(--success)';
        status.style.fontWeight = '600';
      } else {
        status.textContent = checked + ' av ' + total + ' punkter fullført';
        status.style.color = '';
        status.style.fontWeight = '';
      }
    }
  }

  /* Lagre tilstand */
  function persist() {
    const state = {};
    items.forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (cb) state[cb.id] = cb.checked;
    });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  /* Initialiser */
  items.forEach(item => {
    const cb = item.querySelector('input[type="checkbox"]');
    if (!cb) return;

    /* Gjenopprett lagret tilstand */
    if (saved[cb.id] !== undefined) cb.checked = saved[cb.id];
    updateItem(item);

    /* Klikk på hele raden */
    item.addEventListener('click', (e) => {
      if (e.target !== cb) cb.checked = !cb.checked;
      updateItem(item);
      updateProgress();
      persist();
    });

    /* Forhindre dobbelklikk-toggle */
    cb.addEventListener('click', (e) => e.stopPropagation());
    cb.addEventListener('change', () => {
      updateItem(item);
      updateProgress();
      persist();
    });
  });

  updateProgress();

  /* Tilbakestill-knapp */
  const resetBtn = document.querySelector('.checklist-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      items.forEach(item => {
        const cb = item.querySelector('input[type="checkbox"]');
        if (cb) cb.checked = false;
        updateItem(item);
      });
      updateProgress();
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    });
  }
})();
