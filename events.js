/* Event material: progressive filtering and an accessible, readable image viewer. */
(() => {
  'use strict';
  const filter = document.querySelector('[data-gallery-filter]');
  const sections = [...document.querySelectorAll('[data-material-group]')];
  if (filter && sections.length) {
    const buttons = [...filter.querySelectorAll('[data-filter]')];
    const status = document.querySelector('[data-gallery-status]');
    filter.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => {
      const selected = button.dataset.filter;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      sections.forEach(section => {
        section.hidden = selected !== 'all' && section.dataset.materialGroup !== selected;
        if (!section.hidden) count += section.querySelectorAll('.j-material, .j-wide-material').length;
      });
      document.querySelectorAll('.j-safety-note').forEach(note => {
        note.hidden = selected !== 'all' && selected !== 'anleitungen';
      });
      if (status) status.textContent = `${count} Bilder werden angezeigt.`;
    }));
    // Fragment links to individual images also work after filtering.
    window.addEventListener('hashchange', () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target?.closest('[data-material-group][hidden]')) {
        buttons.find(button => button.dataset.filter === 'all')?.click();
        target.scrollIntoView();
      }
    });
  }

  const links = [...document.querySelectorAll('a[data-event-image]')];
  if (!links.length) return;
  const viewer = document.createElement('dialog');
  // Native links remain available in browsers without dialog support.
  if (typeof viewer.showModal !== 'function') return;
  viewer.className = 'j-viewer';
  viewer.setAttribute('aria-labelledby', 'j-viewer-title');
  viewer.innerHTML = `
    <div class="j-viewer-shell">
      <header class="j-viewer-toolbar">
        <div><h2 id="j-viewer-title"></h2><p class="j-viewer-counter" aria-live="polite"></p></div>
        <div class="j-viewer-tools">
          <button type="button" class="j-viewer-zoom" aria-pressed="false">Leseansicht +</button>
          <button type="button" class="j-viewer-close" aria-label="Bild schließen">×</button>
        </div>
      </header>
      <div class="j-viewer-stage" tabindex="0" role="region" aria-label="Bildansicht; in der Leseansicht horizontal und vertikal scrollbar">
        <div class="j-viewer-stage-inner"><img class="j-viewer-img" alt=""></div>
      </div>
      <footer class="j-viewer-bottom">
        <button type="button" class="j-viewer-prev" aria-label="Vorheriges Bild">← <span>Zurück</span></button>
        <p class="j-viewer-hint">Leseansicht für kleine Schrift · Esc zum Schließen</p>
        <button type="button" class="j-viewer-next" aria-label="Nächstes Bild"><span>Weiter</span> →</button>
      </footer>
    </div>`;
  document.body.appendChild(viewer);
  const photo = viewer.querySelector('.j-viewer-img');
  const title = viewer.querySelector('#j-viewer-title');
  const counter = viewer.querySelector('.j-viewer-counter');
  const stage = viewer.querySelector('.j-viewer-stage');
  const zoom = viewer.querySelector('.j-viewer-zoom');
  const close = viewer.querySelector('.j-viewer-close');
  const previous = viewer.querySelector('.j-viewer-prev');
  const next = viewer.querySelector('.j-viewer-next');
  const hint = viewer.querySelector('.j-viewer-hint');
  let current = 0;
  let entries = [];
  let opener = null;
  let priorOverflow = '';

  function setReading(reading) {
    viewer.classList.toggle('is-reading', reading);
    zoom.setAttribute('aria-pressed', String(reading));
    zoom.textContent = reading ? 'Ganzes Bild −' : 'Leseansicht +';
    hint.textContent = reading
      ? 'Zum Lesen im Bild scrollen oder auf dem Touchscreen wischen.'
      : 'Leseansicht für kleine Schrift · Esc zum Schließen';
    stage.scrollTop = 0;
    stage.scrollLeft = 0;
  }

  function show(index) {
    current = Math.max(0, Math.min(entries.length - 1, index));
    const link = entries[current];
    const source = link.querySelector('img');
    setReading(false);
    photo.src = link.dataset.preview || link.href;
    photo.alt = source?.alt || link.dataset.title || 'BuntBewegt-Material';
    photo.style.setProperty('--image-width', `${Number(source?.getAttribute('width')) || 1200}px`);
    title.textContent = link.dataset.title || source?.alt || 'BuntBewegt-Material';
    counter.textContent = `Bild ${current + 1} von ${entries.length}`;
    previous.disabled = current === 0;
    next.disabled = current === entries.length - 1;
  }

  function collection(link) {
    const isMaterial = link.closest('[data-material-group]') || document.querySelector('.j-collection');
    const eligible = links.filter(item => {
      if (isMaterial) {
        const section = item.closest('[data-material-group]');
        return section && !section.hidden;
      }
      return item.dataset.gallery === link.dataset.gallery;
    });
    if (!eligible.some(item => item.href === link.href)) eligible.unshift(link);
    const seen = new Set();
    return eligible.filter(item => {
      if (seen.has(item.href)) return false;
      seen.add(item.href);
      return true;
    });
  }

  links.forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    opener = link;
    entries = collection(link);
    priorOverflow = document.body.style.overflow;
    show(entries.findIndex(item => item.href === link.href));
    viewer.showModal();
    document.body.style.overflow = 'hidden';
    close.focus({preventScroll: true});
  }));
  zoom.addEventListener('click', () => setReading(zoom.getAttribute('aria-pressed') !== 'true'));
  close.addEventListener('click', () => viewer.close());
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', event => {
    if (viewer.classList.contains('is-reading') || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'ArrowLeft' && current > 0) {event.preventDefault(); show(current - 1);}
    if (event.key === 'ArrowRight' && current < entries.length - 1) {event.preventDefault(); show(current + 1);}
  });
  viewer.addEventListener('close', () => {
    document.body.style.overflow = priorOverflow;
    photo.removeAttribute('src');
    setReading(false);
    opener?.focus({preventScroll: true});
    opener = null;
  });
})();
