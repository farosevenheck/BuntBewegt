/* Lichtermeer article image carousel — same 13 image resources as Bilder & Material. */
(() => {
  'use strict';
  const root = document.querySelector('[data-event-picture-carousel]');
  if (!root) return;
  const link = root.querySelector('.event-picture-frame');
  const image = link?.querySelector('img');
  const caption = root.querySelector('.event-picture-caption');
  const counter = root.querySelector('.event-picture-counter');
  const previous = root.querySelector('[data-event-prev]');
  const next = root.querySelector('[data-event-next]');
  if (!link || !image || !caption || !counter || !previous || !next) return;
  const pictures = [{"src":"images/events/lichterzauber-640.webp","srcset":"images/events/lichterzauber-640.webp 640w, images/events/lichterzauber.webp 1055w","href":"downloads/events/lichterzauber.png","preview":"images/events/lichterzauber.webp","title":"BuntBewegt Lichterzauber","alt":"Willkommen beim BuntBewegt-Lichterzauber","width":1055,"height":1491},{"src":"images/events/laternenwerkstatt-640.webp","srcset":"images/events/laternenwerkstatt-640.webp 640w, images/events/laternenwerkstatt.webp 1312w","href":"downloads/events/laternenwerkstatt.png","preview":"images/events/laternenwerkstatt.webp","title":"Unsere Laternenwerkstatt","alt":"Einblick in die Laternenwerkstatt","width":1312,"height":1199},{"src":"images/events/laternenauswahl-640.webp","srcset":"images/events/laternenauswahl-640.webp 640w, images/events/laternenauswahl.webp 1055w","href":"downloads/events/laternenauswahl.png","preview":"images/events/laternenauswahl.webp","title":"Welche Laterne wird deine?","alt":"Sechs Ideen für eure Laterne","width":1055,"height":1491},{"src":"images/events/runde-laterne-640.webp","srcset":"images/events/runde-laterne-640.webp 640w, images/events/runde-laterne.webp 1024w","href":"downloads/events/runde-laterne.png","preview":"images/events/runde-laterne.webp","title":"Bunte Papierlaterne","alt":"Eine runde Papierlaterne gestalten","width":1024,"height":1536},{"src":"images/events/fliegenpilz-laterne-640.webp","srcset":"images/events/fliegenpilz-laterne-640.webp 640w, images/events/fliegenpilz-laterne.webp 1024w","href":"downloads/events/fliegenpilz-laterne.png","preview":"images/events/fliegenpilz-laterne.webp","title":"Die kleine Fliegenpilz-Laterne","alt":"Fliegenpilz-Laterne aus einer kleinen Trinkflasche","width":1024,"height":1536},{"src":"images/events/pet-laterne-640.webp","srcset":"images/events/pet-laterne-640.webp 640w, images/events/pet-laterne.webp 1024w","href":"downloads/events/pet-laterne.png","preview":"images/events/pet-laterne.webp","title":"Martinslaterne aus PET","alt":"Martinslaterne aus einer PET-Flasche","width":1024,"height":1536},{"src":"images/events/glas-laterne-640.webp","srcset":"images/events/glas-laterne-640.webp 640w, images/events/glas-laterne.webp 1055w","href":"downloads/events/glas-laterne.png","preview":"images/events/glas-laterne.webp","title":"Leuchtendes Einmachglas","alt":"Upcycling-Laterne aus einem Einmachglas","width":1055,"height":1491},{"src":"images/events/papier-haeuschen-640.webp","srcset":"images/events/papier-haeuschen-640.webp 640w, images/events/papier-haeuschen.webp 1024w","href":"downloads/events/papier-haeuschen.png","preview":"images/events/papier-haeuschen.webp","title":"Bunte Papier-Häuschen","alt":"Bunte Papier-Häuschen","width":1024,"height":1536},{"src":"images/events/milchkarton-laterne-640.webp","srcset":"images/events/milchkarton-laterne-640.webp 640w, images/events/milchkarton-laterne.webp 1024w","href":"downloads/events/milchkarton-laterne.png","preview":"images/events/milchkarton-laterne.webp","title":"Ein Haus aus Milchkarton","alt":"Laterne aus einem Milchkarton","width":1024,"height":1536},{"src":"images/events/flyer-uebersicht-640.webp","srcset":"images/events/flyer-uebersicht-640.webp 640w, images/events/flyer-uebersicht.webp 1536w","href":"downloads/events/flyer-uebersicht.png","preview":"images/events/flyer-uebersicht.webp","title":"Alle Stationen auf einen Blick","alt":"Unsere Stationen im Überblick","width":1536,"height":1024},{"src":"images/events/flyer-stationen-640.webp","srcset":"images/events/flyer-stationen-640.webp 640w, images/events/flyer-stationen.webp 1055w","href":"downloads/events/flyer-stationen.png","preview":"images/events/flyer-stationen.webp","title":"Eure Stationen. Eure Auswahl.","alt":"Wählbare Stationen für euer Event","width":1055,"height":1491},{"src":"images/events/flyer-stationspakete-640.webp","srcset":"images/events/flyer-stationspakete-640.webp 640w, images/events/flyer-stationspakete.webp 1024w","href":"downloads/events/flyer-stationspakete.png","preview":"images/events/flyer-stationspakete.webp","title":"Das passende Event-Paket","alt":"Stationspakete für euer Event","width":1024,"height":1536},{"src":"images/events/flyer-extras-640.webp","srcset":"images/events/flyer-extras-640.webp 640w, images/events/flyer-extras.webp 1024w","href":"downloads/events/flyer-extras.png","preview":"images/events/flyer-extras.webp","title":"Das besondere Extra","alt":"Das besondere Extra","width":1024,"height":1536}];
  let current = pictures.findIndex(picture => picture.href === link.getAttribute('href'));
  if (current < 0) current = 0;
  function show(index) {
    current = (index + pictures.length) % pictures.length;
    const picture = pictures[current];
    link.setAttribute('href', picture.href);
    link.dataset.title = picture.title;
    link.dataset.preview = picture.preview;
    link.setAttribute('aria-label', `Bild öffnen: ${picture.title}`);
    image.src = picture.src;
    image.srcset = picture.srcset;
    image.sizes = '(max-width: 650px) 75vw, 340px';
    image.alt = picture.alt;
    image.width = picture.width;
    image.height = picture.height;
    link.classList.toggle('is-landscape', picture.width > picture.height);
    counter.textContent = `${current + 1} / ${pictures.length}`;
    caption.textContent = picture.title;
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  root.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });
  let touchX = null;
  link.addEventListener('touchstart', event => {
    touchX = event.changedTouches[0]?.clientX ?? null;
  }, {passive:true});
  link.addEventListener('touchend', event => {
    if (touchX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
    touchX = null;
    if (Math.abs(delta) > 45) { event.preventDefault(); show(current + (delta < 0 ? 1 : -1)); }
  }, {passive:false});
  show(current);
})();
