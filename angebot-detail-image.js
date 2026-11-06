/* On opened offer-detail pages, show the same image as the clicked card on
   angebote.html. Keep the selected offer slug for contact enquiry links. */
(() => {
  'use strict';

  const slug = new URLSearchParams(window.location.search).get('angebot');
  if (!slug || !/^[a-z0-9-]{1,64}$/.test(slug)) return;

  const offerImages = {
    'workshops': {
      src: 'images/angebot-workshops-design.webp',
      alt: 'Illustration zum Thema Workshops',
      width: '1536',
      height: '1024'
    },
    'projektwochen': {
      src: 'images/angebot-projektwochen-design.webp',
      alt: 'Illustration zum Thema Projektwochen',
      width: '1536',
      height: '1024'
    },
    'kindergeburtstage': {
      src: 'images/angebot-geburtstage.webp',
      alt: 'Illustration zum Thema Kindergeburtstage',
      width: '900',
      height: '600'
    },
    'musical-theater': {
      src: 'images/angebot-musical.webp',
      alt: 'Illustration zum Thema Musical & Theater',
      width: '900',
      height: '600'
    },
    'mitmachzirkus': {
      src: 'images/angebot-mitmachzirkus-design.webp',
      alt: 'Illustration zum Thema Mitmachzirkus',
      width: '1536',
      height: '1024'
    },
    'teambuilding': {
      src: 'images/angebot-team-design.webp',
      alt: 'Illustration zum Thema Teambuilding',
      width: '1536',
      height: '1024'
    },
    'yoga-entspannung': {
      src: 'images/angebot-yoga-design.webp',
      alt: 'Illustration zum Thema Yoga & Entspannung',
      width: '1536',
      height: '1024'
    },
    'upcycling-kreatives': {
      src: 'images/angebot-upcycling-design.webp',
      alt: 'Illustration zum Thema Upcycling & Kreatives',
      width: '1536',
      height: '1024'
    },
    'wissenschaft': {
      src: 'images/angebot-wissenschaft-design.webp',
      alt: 'Illustration zum Thema Wissenschaft',
      width: '1536',
      height: '1024'
    },
    'kinderschminken': {
      src: 'images/angebot-kinderschminken.webp',
      alt: 'Illustration zum Thema Kinderschminken',
      width: '900',
      height: '600'
    },
    'events-feste': {
      src: 'images/angebot-events-design.webp',
      alt: 'Illustration zum Thema Events & Feste',
      width: '1536',
      height: '1024'
    }
  };

  const heroImage = document.querySelector('.program-hero-visual > img');
  const currentOffer = offerImages[slug];
  if (heroImage && currentOffer) {
    heroImage.src = currentOffer.src;
    heroImage.alt = currentOffer.alt;
    heroImage.setAttribute('width', currentOffer.width);
    heroImage.setAttribute('height', currentOffer.height);
  }

  document.querySelectorAll('main a[href^="kontakt.html"]').forEach(link => {
    const url = new URL(link.getAttribute('href'), window.location.href);
    url.searchParams.set('angebot', slug);
    link.href = url.pathname.split('/').pop() + '?' + url.searchParams.toString();
  });
})();
