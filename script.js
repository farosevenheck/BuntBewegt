/* BuntBewegt — plain JavaScript; no external libraries or build step. */
(() => {
  'use strict';
  const profile = 'https://www.instagram.com/buntbewegt.de/';
  try { localStorage.removeItem('buntbewegt-language'); } catch (_) {}

  // Smooth Kontakt navigation: the destination #kontakt is placed on the
  // form grid, so visitors arrive with the form just below the sticky header.
  // Native anchors and normal links remain usable without JavaScript.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.main-nav a[href="kontakt.html#kontakt"]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        document.documentElement.classList.add('kontakt-smooth-leaving');
        window.setTimeout(() => { window.location.assign(link.href); }, 160);
      });
    });
  }

  // Accessible mobile navigation with a reversible, animated menu button.
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  const mobileMenu = window.matchMedia('(max-width: 900px)');
  const header = document.querySelector('.site-header');
  const pageContent = [...document.querySelectorAll('main, .site-footer')];
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  document.body.appendChild(backdrop);
  navigation?.querySelectorAll('a').forEach((link, index) => {
    link.style.setProperty('--nav-order', String(index));
  });
  // Match the coloured letters of the BuntBewegt logo on hover/focus.
  // Keep the original words as accessible link labels for assistive technology.
  // Red and blue lead, with small green/gold accents inspired by the logo.
  const logoLetterColours = [
    '#db2242', // clear BuntBewegt red
    '#176cbd', // bright, legible blue
    '#d92e43', // repeat red
    '#1976c5', // repeat blue
    '#25835a', // subtle green accent
    '#d62d43', // red
    '#1b6dbe', // blue
    '#a87814'  // warm gold accent
  ];
  navigation?.querySelectorAll('a').forEach(link => {
    const textNode = [...link.childNodes].find(node => node.nodeType === 3 && node.textContent.trim());
    if (!textNode) return;
    const originalLabel = textNode.textContent.trim();
    const word = document.createElement('span');
    word.className = 'nav-colourful-label';
    word.setAttribute('aria-hidden', 'true');
    let position = 0;
    for (const char of originalLabel) {
      if (/\s/u.test(char)) {
        word.appendChild(document.createTextNode(char));
        position = 0;
      } else {
        const letter = document.createElement('span');
        letter.className = 'nav-colourful-letter';
        letter.style.setProperty('--logo-letter-colour', logoLetterColours[position % logoLetterColours.length]);
        letter.textContent = char;
        word.appendChild(letter);
        position++;
      }
    }
    link.setAttribute('aria-label', originalLabel);
    textNode.replaceWith(word);
  });
  if (navigation) {
    const invitation = document.createElement('p');
    invitation.className = 'nav-invitation';
    invitation.innerHTML = '<span>Gemeinsam heute. Stark für morgen.</span>Bewegung. Kreativität. Gemeinschaft.';
    navigation.appendChild(invitation);
  }
  // Keep the page's normal scroll state: locking both html and body can
  // freeze touches / leave the page stuck on older iOS Safari browsers.
  // The lightweight backdrop catches touches outside the menu instead.
  const setMenu = open => {
    if (!menuButton || !navigation) return;
    open = Boolean(open && mobileMenu.matches);
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    navigation.inert = mobileMenu.matches && !open;
    if (mobileMenu.matches) navigation.setAttribute('aria-hidden', String(!open));
    else navigation.removeAttribute('aria-hidden');
    // Leave the document scrollable and accessible after dismissing the menu.
    // Only the menu itself becomes inert while collapsed.
    pageContent.forEach(element => { element.inert = open; });
    document.dispatchEvent(new Event('navigationchange'));
  };
  document.documentElement.classList.add('nav-ready');
  setMenu(false);
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  backdrop.addEventListener('click', () => {
    setMenu(false);
    menuButton?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (menuButton?.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenu(false);
      menuButton.focus({ preventScroll: true });
    } else if (event.key === 'Tab') {
      const focusable = [...header.querySelectorAll('a[href], button:not([disabled])')].filter(element => element.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  // addListener supports older Safari versions without MediaQueryList.addEventListener.
  if (typeof mobileMenu.addEventListener === 'function') {
    mobileMenu.addEventListener('change', () => setMenu(false));
  } else if (typeof mobileMenu.addListener === 'function') {
    mobileMenu.addListener(() => setMenu(false));
  }
  window.addEventListener('pagehide', () => setMenu(false));
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Activity filters keep all content in the HTML for search and offline use.
  const filters = [...document.querySelectorAll('.offer-filters button')];
  const cards = [...document.querySelectorAll('.offer-grid .offer-card')];
  filters.forEach((button, index) => button.addEventListener('click', () => {
    filters.forEach((item, i) => {
      item.classList.toggle('selected', i === index);
      item.setAttribute('aria-pressed', String(i === index));
    });
    cards.forEach((card, i) => { card.hidden = index !== 0 && i !== index - 1; });
    document.querySelector('.offer-grid')?.classList.toggle('filtered', index !== 0);
  }));

  // Four themed hero slides with matching headings, descriptions and actions.
  const hero = document.querySelector('.hero-slider');
  if (hero) {
    const slides = [...hero.querySelectorAll('.hero-slide')];
    const dots = [...hero.querySelectorAll('.hero-slide-dot')];
    const arrows = [...hero.querySelectorAll('.hero-slide-arrow')];
    const pause = hero.querySelector('.hero-slide-pause');
    const counter = hero.querySelector('.hero-slide-counter');
    const announcement = hero.querySelector('.hero-carousel-bar .sr-only');
    const heroTitleLines = [...hero.querySelectorAll('#hero-title span')];
    const heroDescription = hero.querySelector('.hero-description');
    const heroEyebrow = hero.querySelector('.hero-eyebrow-text');
    const heroNote = hero.querySelector('.hero-note');
    const heroCta = hero.querySelector('.hero-inner .button-yellow');
    const heroCtaLabel = heroCta?.querySelector('.hero-cta-label');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const icons = {
      play: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 3 14 9-14 9V3Z"/></svg>',
      pause: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4H5v16h4zM19 4h-4v16h4z"/></svg>',
    };
    let active = 0;
    let paused = motion.matches;
    let onScreen = true;
    let timer;
    const HERO_DELAY_MS = 4000;
    function schedule() {
      window.clearTimeout(timer);
      // Keep a reliable 4-second interval even when the pointer rests on the hero.
      // Keyboard focus still pauses automatic motion to keep controls accessible.
      const keyboardFocus = hero.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
      const running = !paused && !keyboardFocus && onScreen && !document.hidden && !document.body.classList.contains('menu-open');
      announcement?.setAttribute('aria-live', running ? 'off' : 'polite');
      if (running) timer = window.setTimeout(() => show(active + 1), HERO_DELAY_MS);
    }
    function updateHeroContent(slide) {
      if (!slide) return;
      const titles = [1, 2, 3].map(i => slide.getAttribute(`data-title-${i}`));
      heroTitleLines.forEach((line, i) => { if (titles[i]) line.textContent = titles[i]; });
      if (heroDescription) heroDescription.textContent = slide.dataset.description || '';
      if (heroEyebrow) heroEyebrow.textContent = slide.dataset.eyebrow || '';
      if (heroNote) {
        heroNote.textContent = slide.dataset.note || '';
      }
      if (heroCtaLabel) heroCtaLabel.textContent = slide.dataset.cta || 'Unsere Angebote entdecken';
      if (heroCta) heroCta.href = slide.dataset.href || '#angebote';
      hero.dataset.heroTheme = slide.dataset.theme || 'dark';
    }
    function show(index, manual = false) {
      const next = (index + slides.length) % slides.length;
      if (next === active) { schedule(); return; }
      active = next;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === active);
        dot.setAttribute('aria-pressed', String(i === active));
      });
      updateHeroContent(slides[active]);
      // Re-run staggered line-drop animation while keeping layout/hero size fixed.
      // Do not force a full hero layout on every automatic slide change.
      // This can visibly stall phones while large photographs are displayed.
      if (!motion.matches && manual && !mobileMenu.matches) {
        hero.classList.remove('bb-hero-enter');
        void hero.offsetWidth;
        hero.classList.add('bb-hero-enter');
      }
      if (counter?.firstChild) counter.firstChild.textContent = String(active + 1).padStart(2, '0');
      schedule();
      if (announcement) {
        if (manual) announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `${dots[active].getAttribute('aria-label')} — ${active + 1} von ${slides.length}`;
      }
    }
    function updatePause() {
      if (!pause) return;
      pause.setAttribute('aria-label', paused ? 'Automatischen Bildwechsel starten' : 'Automatischen Bildwechsel pausieren');
      pause.setAttribute('title', paused ? 'Bildwechsel starten' : 'Bildwechsel pausieren');
      pause.setAttribute('aria-pressed', String(paused));
      pause.innerHTML = icons[paused ? 'play' : 'pause'];
      schedule();
    }
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
    arrows[0]?.addEventListener('click', () => show(active - 1, true));
    arrows[1]?.addEventListener('click', () => show(active + 1, true));
    pause?.addEventListener('click', () => { paused = !paused; updatePause(); });
    hero.querySelector('.hero-carousel-controls')?.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(active + (event.key === 'ArrowLeft' ? -1 : 1), true);
      }
    });
    hero.addEventListener('focusin', schedule);
    hero.addEventListener('focusout', schedule);
    let touchStart = null;
    hero.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' || event.target.closest('a, button')) return;
      touchStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    }, { passive: true });
    hero.addEventListener('pointerup', event => {
      if (!touchStart || touchStart.id !== event.pointerId) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) show(active + (dx < 0 ? 1 : -1), true);
    }, { passive: true });
    hero.addEventListener('pointercancel', () => { touchStart = null; });
    document.addEventListener('navigationchange', schedule);
    document.addEventListener('visibilitychange', schedule);
    const onMotionChange = event => {
      if (event.matches) { paused = true; updatePause(); }
    };
    if (typeof motion.addEventListener === 'function') motion.addEventListener('change', onMotionChange);
    else if (typeof motion.addListener === 'function') motion.addListener(onMotionChange);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; schedule(); });
      observer.observe(hero);
    }
    window.addEventListener('pagehide', () => window.clearTimeout(timer));
    window.addEventListener('pageshow', schedule);
    updateHeroContent(slides[0]);
    if (!motion.matches) hero.classList.add('bb-hero-enter');
    updatePause();
  }

  // Prepare a real message locally; visitors choose when and where to send it.
  document.querySelectorAll('[data-contact-composer]').forEach(form => {
    const preview = document.createElement('div');
    preview.className = 'message-preview';
    preview.hidden = true;
    preview.innerHTML = '<h3 tabindex="-1">Eure Nachricht ist vorbereitet.</h3><p>Kopiert den Text und sendet ihn als Nachricht an BuntBewegt auf Instagram. Bisher wurde nichts gesendet.</p><label for="prepared-message" class="sr-only">Vorbereitete Nachricht</label><textarea id="prepared-message" readonly></textarea><div class="message-actions"><button class="button button-green copy-message" type="button">Nachricht kopieren</button><a class="button button-yellow instagram-message" target="_blank" rel="noopener noreferrer">Auf Instagram schreiben</a></div><p class="message-copy-status" role="status" aria-live="polite"></p><button class="message-edit" type="button">Nachricht bearbeiten</button>';
    preview.querySelector('.instagram-message').href = profile;
    form.insertAdjacentElement('afterend', preview);
    const text = preview.querySelector('textarea');
    const status = preview.querySelector('.message-copy-status');
    const copyButton = preview.querySelector('.copy-message');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const name = form.elements.name.value.trim();
      const message = form.elements.message.value.trim();
      form.elements.name.setCustomValidity(name.length < 2 ? 'Bitte gebt euren Namen an.' : '');
      form.elements.message.setCustomValidity(message.length < 10 ? 'Bitte schreibt mindestens 10 Zeichen.' : '');
      if (!form.reportValidity()) return;
      const interest = form.elements.interest.selectedOptions[0].textContent;
      text.value = `Hallo BuntBewegt!\n\n${message}\n\nInteresse: ${interest}\nName: ${name}\nE-Mail: ${form.elements.email.value.trim()}`;
      status.textContent = '';
      copyButton.textContent = 'Nachricht kopieren';
      form.hidden = true;
      preview.hidden = false;
      preview.querySelector('h3').focus();
    });
    form.addEventListener('input', event => {
      if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    });
    copyButton.addEventListener('click', async () => {
      let copied = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text.value);
          copied = true;
        }
      } catch (_) { /* File previews may not expose the Clipboard API. */ }
      if (!copied) {
        text.focus();
        text.select();
        try { copied = document.execCommand('copy'); } catch (_) {}
      }
      copyButton.textContent = copied ? 'Text kopiert ✓' : 'Nachricht kopieren';
      status.textContent = copied ? 'Kopiert. Jetzt könnt ihr die Nachricht auf Instagram einfügen und selbst senden.' : 'Bitte markiert den Text und kopiert ihn mit Strg+C oder über das Kopieren-Menü eures Geräts.';
    });
    preview.querySelector('.message-edit').addEventListener('click', () => {
      preview.hidden = true;
      form.hidden = false;
      form.elements.message.focus();
    });
  });


  // Photo preview overlay: show the full photo without leaving the page.
  // Works for galleries on the homepage, "News & Events", and Angebot pages.
  const imageLinks = [...document.querySelectorAll('a[data-photo-lightbox]')];
  if (imageLinks.length) {
    const viewer = document.createElement('dialog');
    viewer.className = 'photo-viewer';
    viewer.setAttribute('aria-label', 'Bild in Großansicht');
    viewer.innerHTML = `
      <div class="photo-viewer-stage">
        <button class="photo-viewer-close" type="button" aria-label="Bild schließen" title="Bild schließen">
          <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <img class="photo-viewer-image" alt="" />
      </div>`;
    document.body.appendChild(viewer);

    const photo = viewer.querySelector('.photo-viewer-image');
    const stage = viewer.querySelector('.photo-viewer-stage');
    const closeButton = viewer.querySelector('.photo-viewer-close');
    let opener = null;
    let previousOverflow = '';
    const closeViewer = () => { if (viewer.open) viewer.close(); };

    imageLinks.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const source = link.querySelector('img');
      if (!source) return;
      opener = link;
      // Use only the site's own gallery asset, never an external Instagram URL.
      photo.src = link.getAttribute('href') || source.getAttribute('src');
      photo.alt = source.alt || 'BuntBewegt Foto';
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      viewer.showModal();
      closeButton.focus({ preventScroll: true });
    }));

    closeButton.addEventListener('click', closeViewer);
    stage.addEventListener('click', event => {
      if (event.target === stage) closeViewer();
    });
    viewer.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      photo.removeAttribute('src');
      const target = opener;
      opener = null;
      target?.focus({ preventScroll: true });
    });
  }

  // Animate details without removing their native semantics or keyboard behaviour.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const faqItems = [...document.querySelectorAll('.faq-list details')];
  const faqAnimations = new WeakMap();
  function animateDetails(item, open) {
    const previous = faqAnimations.get(item);
    const start = item.getBoundingClientRect().height;
    previous?.cancel();
    if (open) item.open = true;
    const summary = item.querySelector('summary');
    const finish = () => {
      item.open = open;
      item.style.height = '';
      item.style.overflow = '';
      item.classList.remove('is-animating');
      item.removeAttribute('data-target-open');
      faqAnimations.delete(item);
    };
    if (reducedMotion.matches || !item.animate) { finish(); return; }
    item.style.height = '';
    const end = open ? item.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
    item.dataset.targetOpen = String(open);
    item.classList.add('is-animating');
    const animation = item.animate([{ height: start + 'px' }, { height: end + 'px' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
    faqAnimations.set(item, animation);
    animation.onfinish = finish;
  }
  faqItems.forEach(item => {
    // JS manages the single-open group so closing can finish its animation first.
    item.removeAttribute('name');
    item.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      const open = item.dataset.targetOpen ? item.dataset.targetOpen !== 'true' : !item.open;
      if (open) faqItems.filter(other => other !== item && other.open).forEach(other => animateDetails(other, false));
      animateDetails(item, open);
    });
  });

  // Offer, team and cooperation enquiries carry through to the existing message composer.
  const interest = document.querySelector('[data-contact-composer] select[name="interest"]');
  if (interest) {
    const offerIds = { workshops:'angebot-01', projektwochen:'angebot-02', kindergeburtstage:'angebot-03', 'musical-theater':'angebot-04', mitmachzirkus:'angebot-05', teambuilding:'angebot-06', 'yoga-entspannung':'angebot-07', 'upcycling-kreatives':'angebot-08', wissenschaft:'angebot-09', kinderschminken:'angebot-10', 'events-feste':'angebot-11' };
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('angebot');
    if (params.get('anliegen') === 'kooperation') {
      interest.value = 'kooperation';
    } else if (params.get('anliegen') === 'buntbewegt-team') {
      interest.value = 'buntbewegt-team';
    } else if (Object.prototype.hasOwnProperty.call(offerIds, requested)) {
      interest.value = offerIds[requested];
    }
  }

  // Short, once-only reveals; no content is hidden unless an observer is ready.
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const targets = [...document.querySelectorAll('.section-intro, .offer-card, .offers-view-all, .about, .cta-inner, .impact-heading, .impact-gallery figure, .impact-bottom, .join-steps-heading, .join-steps-grid li, .faq > div, .all-angebot-card, .program-explore-intro, .experience, .audience-inner, .flow-heading, .flow-step, .program-moments-card, .related-card, .kontakt-outro')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -20px 0px' });
    targets.forEach((element, index) => {
      if (element.getBoundingClientRect().top < window.innerHeight - 25) return;
      element.style.setProperty('--reveal-delay', Math.min(index % 3, 2) * 65 + 'ms');
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
    const onReduceMotion = event => {
      if (event.matches) { observer.disconnect(); targets.forEach(element => element.classList.add('is-visible')); }
    };
    if (typeof reducedMotion.addEventListener === 'function') reducedMotion.addEventListener('change', onReduceMotion);
    else if (typeof reducedMotion.addListener === 'function') reducedMotion.addListener(onReduceMotion);
    window.addEventListener('beforeprint', () => targets.forEach(element => element.classList.add('is-visible')));
    document.addEventListener('focusin', event => event.target.closest('.reveal-ready')?.classList.add('is-visible'));
  }

})();
