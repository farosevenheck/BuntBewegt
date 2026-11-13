/* BuntBewegt — plain JavaScript; no external libraries or build step. */
(() => {
  'use strict';
  try { localStorage.removeItem('buntbewegt-language'); } catch (_) {}

  // Informational cookie notice: this site does not load optional trackers.
  // Remember only that the visitor has seen the notice for up to 180 days.
  (() => {
    const key = 'buntbewegt-cookie-hinweis-v1';
    const lifetime = 180 * 24 * 60 * 60 * 1000;
    let acknowledged = false;
    try {
      const stored = Number(localStorage.getItem(key));
      acknowledged = stored > 0 && Date.now() - stored < lifetime;
    } catch (_) { /* The notice still works without browser storage. */ }

    const notice = document.createElement('aside');
    notice.id = 'bb-cookie-notice';
    notice.className = 'bb-cookie-notice';
    notice.setAttribute('role', 'region');
    notice.setAttribute('aria-labelledby', 'bb-cookie-title');
    notice.hidden = true;
    notice.innerHTML = `
      <div class="bb-cookie-illustration" aria-hidden="true">
        <span class="bb-cookie-emoji">🍪</span><i></i><i></i><i></i>
      </div>
      <div class="bb-cookie-copy">
        <p class="bb-cookie-eyebrow">EIN KLEINER HINWEIS VON BUNTBEWEGT</p>
        <h2 id="bb-cookie-title">Deine Privatsphäre ist uns wichtig.</h2>
        <p>Wir nutzen keine Analyse- oder Werbe-Cookies. Nur dass du diesen Hinweis geschlossen hast, speichern wir lokal im Browser.</p>
        <div class="bb-cookie-actions">
          <button class="bb-cookie-accept" type="button" data-cookie-dismiss>Alles klar <span aria-hidden="true">✓</span></button>
          <a href="datenschutz.html">Mehr zum Datenschutz <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <button class="bb-cookie-close" type="button" data-cookie-dismiss aria-label="Cookie-Hinweis schließen">×</button>
    `;
    document.body.appendChild(notice);

    const reopen = document.createElement('button');
    reopen.type = 'button';
    reopen.className = 'bb-cookie-reopen';
    reopen.textContent = 'Cookie-Hinweis';
    const legalNav = document.querySelector('.footer-legal nav');
    const backToTop = legalNav?.querySelector('.footer-up');
    if (legalNav) legalNav.insertBefore(reopen, backToTop || null);

    const open = () => { notice.hidden = false; };
    const close = () => {
      notice.hidden = true;
      try { localStorage.setItem(key, String(Date.now())); } catch (_) {}
    };
    notice.querySelectorAll('[data-cookie-dismiss]').forEach(button => {
      button.addEventListener('click', () => {
        const keyboardFocused = button.matches(':focus-visible');
        close();
        if (keyboardFocused) reopen.focus({ preventScroll: true });
      });
    });
    reopen.addEventListener('click', open);
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !notice.hidden) close();
    });
    if (!acknowledged) open();
  })();

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

  // Four mobile slides; the fifth desktop slide stays inert on small screens.
  const hero = document.querySelector('.hero-slider');
  if (hero) {
    const slideTrack = hero.querySelector('.hero-slides');
    const dotTrack = hero.querySelector('.hero-slide-dots');
    const desktopSlides = [...(hero.querySelector('[data-hero-desktop-slides]')?.content.querySelectorAll('.hero-slide') || [])];
    const desktopDots = [...(hero.querySelector('[data-hero-desktop-dots]')?.content.querySelectorAll('.hero-slide-dot') || [])];
    const allSlides = [...hero.querySelectorAll('.hero-slide'), ...desktopSlides];
    const allDots = [...hero.querySelectorAll('.hero-slide-dot'), ...desktopDots];
    const mobileHero = window.matchMedia('(max-width: 740px)');
    let slides = allSlides;
    let dots = allDots;
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
    let heroInitialized = false;
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
    function show(index, manual = false, force = false) {
      const next = (index + slides.length) % slides.length;
      if (next === active && !force) { schedule(); return; }
      const changed = heroInitialized && !slides[next].classList.contains('is-active');
      active = next;
      allSlides.forEach(slide => slide.classList.toggle('is-active', slide === slides[active]));
      allDots.forEach(dot => {
        dot.classList.toggle('is-active', dot === dots[active]);
        dot.setAttribute('aria-pressed', String(dot === dots[active]));
      });
      updateHeroContent(slides[active]);
      // Alternate identical keyframe names to replay the original entry on every
      // slide change, including autoplay and touch, without forcing hero layout.
      if (changed && !motion.matches) {
        hero.classList.add('bb-hero-enter');
        hero.classList.toggle('bb-hero-replay', !hero.classList.contains('bb-hero-replay'));
      }
      if (counter?.firstChild) counter.firstChild.textContent = String(active + 1).padStart(2, '0');
      const total = counter?.querySelector('span');
      if (total) total.textContent = `/ ${String(slides.length).padStart(2, '0')}`;
      schedule();
      if (announcement) {
        if (manual) announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = `${dots[active].getAttribute('aria-label')} — ${active + 1} von ${slides.length}`;
      }
    }
    function syncHeroViewport() {
      const currentSlide = heroInitialized ? slides[active] : null;
      desktopSlides.forEach(slide => {
        if (mobileHero.matches) slide.remove();
        else slideTrack.appendChild(slide);
      });
      desktopDots.forEach(dot => {
        if (mobileHero.matches) dot.remove();
        else dotTrack.appendChild(dot);
      });
      const visible = allSlides.map((slide, index) => ({ slide, dot: allDots[index] }))
        .filter(({ slide }) => slide.parentElement === slideTrack);
      if (mobileHero.matches) {
        visible.sort((a, b) => Number(a.slide.dataset.mobileOrder) - Number(b.slide.dataset.mobileOrder));
      }
      slides = visible.map(({ slide }) => slide);
      dots = visible.map(({ dot }) => dot);
      visible.forEach(({ slide, dot }, index) => {
        slideTrack.appendChild(slide);
        dotTrack.appendChild(dot);
        dot.setAttribute('aria-label', dot.getAttribute('aria-label').replace(/^Bild \d+:/, `Bild ${index + 1}:`));
      });
      // Keep a visible slide selected after rotation or a desktop-to-phone resize.
      show(Math.max(0, slides.indexOf(currentSlide)), false, true);
      heroInitialized = true;
    }
    function updatePause() {
      if (!pause) return;
      pause.setAttribute('aria-label', paused ? 'Automatischen Bildwechsel starten' : 'Automatischen Bildwechsel pausieren');
      pause.setAttribute('title', paused ? 'Bildwechsel starten' : 'Bildwechsel pausieren');
      pause.setAttribute('aria-pressed', String(paused));
      pause.innerHTML = icons[paused ? 'play' : 'pause'];
      schedule();
    }
    allDots.forEach(dot => dot.addEventListener('click', () => {
      const index = dots.indexOf(dot);
      if (index >= 0) show(index, true);
    }));
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
    if (typeof mobileHero.addEventListener === 'function') mobileHero.addEventListener('change', syncHeroViewport);
    else if (typeof mobileHero.addListener === 'function') mobileHero.addListener(syncHeroViewport);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; schedule(); });
      observer.observe(hero);
    }
    window.addEventListener('pagehide', () => window.clearTimeout(timer));
    window.addEventListener('pageshow', schedule);
    syncHeroViewport();
    if (!motion.matches) hero.classList.add('bb-hero-enter');
    updatePause();
  }

  // The Kontakt form now sends real enquiries via a native FormSubmit POST.
  // No JavaScript submit interception: browser validation and reCAPTCHA remain available.

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

  // Offer, team and cooperation enquiries carry through to the contact form.
  const interest = document.querySelector('[data-contact-composer] select[name="Interesse"]');
  if (interest) {
    const offerIds = { workshops:'Workshops', projektwochen:'Projektwochen', kindergeburtstage:'Kindergeburtstage', 'musical-theater':'Musical & Theater', mitmachzirkus:'Mitmachzirkus', teambuilding:'Teambuilding', 'yoga-entspannung':'Yoga & Entspannung', 'upcycling-kreatives':'Upcycling & Kreatives', wissenschaft:'Wissenschaft', kinderschminken:'Kinderschminken', 'events-feste':'Events & Feste' };
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('angebot');
    if (params.get('anliegen') === 'kooperation') {
      interest.value = 'Zusammenarbeit / Kooperation';
    } else if (params.get('anliegen') === 'buntbewegt-team') {
      interest.value = 'BuntBewegt Team';
    } else if (Object.prototype.hasOwnProperty.call(offerIds, requested)) {
      interest.value = offerIds[requested];
    }
    // Event station names are allow-listed so only real options appear in enquiries.
    const allowedStations = new Set(['Kinderschminken', 'Glitzertattoos', 'Spielestationen', 'Kreativwerkstatt', 'Seifenblasen', 'Mitmachzirkus', 'Yoga', 'Volleyball']);
    const stationParam = params.get('stationen') || '';
    const selectedStations = [...new Set(stationParam.split('|'))].filter(name => allowedStations.has(name));
    const messageField = document.querySelector('[data-contact-composer] textarea[name="message"]');
    // Birthday enquiry: accept only known station/extra values and bounded personal wishes.
    if (requested === 'kindergeburtstage' && messageField && !messageField.value.trim()) {
      const extrasAllowed = new Set(['Popcornmaschine','Zuckerwatte','Riesenseifenblasen','Naschtüten','Kostümiert kommen','Musik']);
      const extras = [...new Set((params.get('extras') || '').split('|'))].filter(item => extrasAllowed.has(item));
      const age = params.get('alter') || '';
      const guests = params.get('kinder') || '';
      const safeAge = /^\d{1,2}$/.test(age) && Number(age) >= 1 && Number(age) <= 18 ? age : '';
      const safeGuests = /^\d{1,3}$/.test(guests) && Number(guests) >= 1 && Number(guests) <= 120 ? guests : '';
      // Remove control characters to avoid injecting unintended lines into the template.
      const clean = (input, limit) => (input || '').slice(0,limit).replace(/[\x00-\x1f\x7f]/g,' ').trim();
      const theme = clean(params.get('motto'), 70);
      const wishes = clean(params.get('wuensche'), 320);
      const lines = ['Hallo BuntBewegt!', '', 'Wir möchten einen Kindergeburtstag individuell planen.', '', 'Unsere Eckdaten:'];
      if (safeAge) lines.push('• Alter des Geburtstagskindes: ' + safeAge + ' Jahre');
      if (safeGuests) lines.push('• Anzahl der Kinder: ' + safeGuests);
      if (theme) lines.push('• Wunschmotto: ' + theme);
      if (selectedStations.length) lines.push('', 'Gewünschte Stationen:', ...selectedStations.map(item => '• ' + item));
      if (extras.length) lines.push('', 'Optionale Extras:', ...extras.map(item => '• ' + item));
      if (wishes) lines.push('', 'Weitere Wünsche: ' + wishes);
      lines.push('', 'Wir würden gern das passende Paket und den Ablauf mit euch besprechen.', 'Wunschtermin / weitere Fragen: ');
      messageField.value = lines.join('\n');
    }
    if (requested === 'teambuilding' && messageField && !messageField.value.trim()) {
      const allowedExercises = new Set([
        'Flussüberquerung','Spinnennetz','Turmbau-Challenge','Blindparcours','Balltransport',
        'Team-Slalom','Inselhüpfen','Seilquadrat','Gordischer Knoten','Vertrauensweg',
        'Brückenbau','Schatztransport','Team-Memory','Gleichgewichtskette','Zielwurf im Team'
      ]);
      const exercises = [...new Set((params.get('uebungen') || '').split('|'))].filter(v => allowedExercises.has(v));
      const duration = ['60–90 Minuten (kleines Angebot)','3–5 Stunden (Tagesangebot)'].includes(params.get('dauer')) ? params.get('dauer') : '';
      const certificate = params.get('urkunden') === 'ja';
      const group = ['Schulklasse','Schule / Jahrgang','Verein / Gruppe','Team / Unternehmen','Sonstige Gruppe'].includes(params.get('gruppe')) ? params.get('gruppe') : '';
      const participantsRaw = params.get('teilnehmer') || '';
      const participants = /^\d{1,4}$/.test(participantsRaw) && Number(participantsRaw)>=1 && Number(participantsRaw)<=2000 ? participantsRaw : '';
      const notes = (params.get('wuensche') || '').slice(0,400).replace(/[\x00-\x1f\x7f]/g,' ').trim();
      const lines = ['Hallo BuntBewegt!', '', 'Wir interessieren uns für ein bewegungsorientiertes Teambuilding-Angebot.'];
      if (group) lines.push('', 'Gruppe: ' + group);
      if (participants) lines.push('Ungefähre Teilnehmerzahl: ' + participants);
      if (duration) lines.push('Gewünschte Dauer: ' + duration);
      lines.push('Urkundenpaket: ' + (certificate ? 'Ja, bitte hinzufügen (Klasse, Teilnehmende, Schule/Träger).' : 'Nicht ausgewählt.'));
      if (exercises.length) lines.push('', 'Vorgemerkte Übungen (Auswahl wird abgestimmt):', ...exercises.map(item => '• ' + item));
      if (notes) lines.push('', 'Wünsche und Hinweise: ' + notes);
      lines.push('', 'Wir freuen uns auf ein unverbindliches Angebot.', 'Wunschtermin / Kontakt: ');
      messageField.value = lines.join('\n');
    }
    if (requested === 'workshops' && messageField && !messageField.value.trim()) {
      const allowedThemes = new Set(['Musical & Theater', 'Zirkus', 'Upcycling', 'Volleyball', 'Yoga & Entspannung', 'Kreativwerkstatt', 'Wissenschaft & Experimente', 'Bewegung & Spiel']);
      const themes = [...new Set((params.get('themen') || '').split('|'))].filter(theme => allowedThemes.has(theme));
      if (themes.length) {
        messageField.value = ['Hallo BuntBewegt!', '', 'Wir interessieren uns für einen individuell zugeschnittenen Workshop oder eine Projektwoche.', '', 'Unsere Wunschthemen:', ...themes.map(theme => '• ' + theme), '', 'Für welche Gruppe und welches Alter: ', 'Gewünschter Zeitraum / weitere Wünsche: '].join('\n');
      }
    }
    if (requested === 'events-feste' && selectedStations.length && messageField && !messageField.value.trim()) {
      messageField.value = 'Hallo BuntBewegt!\n\nWir interessieren uns für folgende Stationen für unser Event:\n• '
        + selectedStations.join('\n• ')
        + '\n\nUnser Event / Termin / weitere Wünsche: ';
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
