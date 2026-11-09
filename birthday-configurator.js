/* Three-step birthday planner. User-driven enquiry; nothing is sent automatically. */
(() => {
  'use strict';
  const form = document.getElementById('birthday-configurator');
  if (!form) return;
  const panels = Array.from(form.querySelectorAll('[data-wizard-step]'));
  const finish = form.querySelector('[data-wizard-finish]');
  const progress = document.querySelector('.birthday-wizard__progress');
  const indicators = progress ? Array.from(progress.querySelectorAll('[data-wizard-indicator]')) : [];
  const count = progress?.querySelector('[data-wizard-counter]');
  const track = progress?.querySelector('[data-wizard-progress]');
  const stationInputs = Array.from(form.querySelectorAll('input[name="birthday-station"]'));
  const extraInputs = Array.from(form.querySelectorAll('input[name="birthday-extra"]'));
  const status = form.querySelector('[data-birthday-status]');
  const chips = form.querySelector('[data-birthday-chips]');
  const ageField = form.elements.namedItem('age');
  const guestsField = form.elements.namedItem('guests');
  const themeField = form.elements.namedItem('theme');
  const wishesField = form.elements.namedItem('wishes');
  let activeStep = 1;

  function checkedValues(inputs) { return inputs.filter(input => input.checked).map(input => input.value); }
  function addChip(name) {
    const chip = document.createElement('span');
    chip.className = 'birthday-configurator__chip';
    chip.textContent = name;
    chips.append(chip);
  }
  function render() {
    const stations = checkedValues(stationInputs);
    const extras = checkedValues(extraInputs);
    chips.replaceChildren();
    stations.forEach(addChip);
    extras.forEach(item => addChip('+ ' + item));
    status.textContent = stations.length || extras.length
      ? `${stations.length} ${stations.length === 1 ? 'Station' : 'Stationen'} und ${extras.length} ${extras.length === 1 ? 'Extra' : 'Extras'} vorgemerkt.`
      : 'Noch nichts ausgewählt? Kein Problem! Wir besprechen eure Wünsche persönlich.';
  }
  function detailsAreValid() {
    for (const input of [ageField, guestsField]) {
      if (!input.reportValidity()) { input.focus(); return false; }
    }
    return true;
  }
  function showStep(step, scroll = true) {
    activeStep = Math.max(1, Math.min(panels.length, step));
    panels.forEach((panel, index) => { panel.hidden = index + 1 !== activeStep; });
    if (finish) finish.hidden = activeStep !== 3;
    indicators.forEach((indicator, index) => {
      const number = index + 1;
      indicator.classList.toggle('is-active', number === activeStep);
      indicator.classList.toggle('is-done', number < activeStep);
      if (number === activeStep) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');
    });
    if (count) count.textContent = `Schritt ${activeStep} von ${panels.length}`;
    if (track) track.style.width = `${100 * activeStep / panels.length}%`;
    if (scroll) {
      const target = progress || form;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
      // Keep the keyboard focus in the new panel without scrolling a second time.
      const heading = panels[activeStep - 1].querySelector('h3');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
  }
  // Pointer users select an entire card; focus must never auto-scroll to the
  // hidden checkbox at the start of the card. Keyboard focus remains native.
  form.querySelectorAll('.birthday-stations-grid .bbd-station, .birthday-extras .birthday-extra').forEach(card => {
    card.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('button, a')) return;
      const input = card.querySelector('input[type="checkbox"]');
      if (input && !input.disabled) input.focus({ preventScroll: true });
    });
  });
  stationInputs.concat(extraInputs).forEach(input => input.addEventListener('change', render));
  form.querySelectorAll('[data-wizard-next]').forEach(button => button.addEventListener('click', () => {
    if (activeStep === 1 && !detailsAreValid()) return;
    showStep(activeStep + 1);
  }));
  form.querySelectorAll('[data-wizard-back]').forEach(button => button.addEventListener('click', () => showStep(activeStep - 1)));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!detailsAreValid()) { showStep(1); return; }
    const params = new URLSearchParams({
      angebot: 'kindergeburtstage',
      alter: ageField.value.trim(),
      kinder: guestsField.value.trim()
    });
    if (themeField.value.trim()) params.set('motto', themeField.value.trim());
    if (wishesField.value.trim()) params.set('wuensche', wishesField.value.trim());
    const stations = checkedValues(stationInputs);
    const extras = checkedValues(extraInputs);
    if (stations.length) params.set('stationen', stations.join('|'));
    if (extras.length) params.set('extras', extras.join('|'));
    window.location.assign(`kontakt.html?${params.toString()}#kontakt`);
  });
  // Progressive enhancement: all form fields remain accessible if JS is unavailable.
  form.classList.add('birthday-wizard--ready');
  if (progress) progress.hidden = false;
  render();
  showStep(1, false);
})();
