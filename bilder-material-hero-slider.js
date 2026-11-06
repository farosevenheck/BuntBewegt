/* Small hero carousel: uses the 13 images that already exist in this page. */
(() => {
  'use strict';
  const cover = document.querySelector('.festival-gallery-page .j-gallery-cover');
  const poster = cover?.querySelector('.j-gallery-cover-image');
  const image = poster?.querySelector('img');
  const previous = cover?.querySelector('[data-cover-prev]');
  const next = cover?.querySelector('[data-cover-next]');
  const counter = cover?.querySelector('.gallery-cover-progress');
  const caption = cover?.querySelector('.gallery-cover-caption');
  const items = [...document.querySelectorAll('.j-collection a[data-event-image]')].filter(link => link.querySelector('img'));
  if (!cover || !poster || !image || !previous || !next || !counter || !caption || !items.length) return;

  // Start with the cover already shown in the original design.
  let current = items.findIndex(item => item.getAttribute('href') === poster.getAttribute('href'));
  if (current < 0) current = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    const link = items[current];
    const original = link.querySelector('img');
    const w = Number(original.getAttribute('width')) || 0;
    const h = Number(original.getAttribute('height')) || 0;
    const title = link.dataset.title || original.alt || 'BuntBewegt-Material';

    // Update the existing image link too, so opening it shows the selected picture.
    poster.setAttribute('href', link.getAttribute('href'));
    poster.dataset.preview = link.dataset.preview || '';
    poster.dataset.title = title;
    poster.setAttribute('aria-label', `Bild öffnen: ${title}`);
    image.src = original.getAttribute('src');
    const srcset = original.getAttribute('srcset');
    if (srcset) image.setAttribute('srcset', srcset);
    else image.removeAttribute('srcset');
    image.sizes = '(max-width: 760px) 80vw, 370px';
    image.alt = original.alt || title;
    if (w) image.setAttribute('width', String(w));
    if (h) image.setAttribute('height', String(h));
    poster.classList.toggle('is-landscape', w > h);
    counter.textContent = `${current + 1} / ${items.length}`;
    caption.textContent = title;
  }

  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  cover.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft') {event.preventDefault(); show(current - 1);}
    if (event.key === 'ArrowRight') {event.preventDefault(); show(current + 1);}
  });
  show(current);
})();
