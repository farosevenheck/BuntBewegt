/* Event stations: local selection with optional handoff to the existing contact form. */
(() => {
  'use strict';
  const section = document.getElementById('event-stationen');
  if (!section) return;
  const choices = Array.from(section.querySelectorAll('input[name="station"]'));
  const count = section.querySelector('[data-station-count]');
  const description = section.querySelector('[data-station-description]');
  const chips = section.querySelector('[data-station-chips]');
  const action = section.querySelector('[data-station-request]');
  if (!count || !description || !chips || !action || choices.length === 0) return;

  function render() {
    const selected = choices.filter(item => item.checked).map(item => item.value);
    count.textContent = selected.length === 0 ? 'Wählt eure Lieblingsstationen'
      : selected.length === 1 ? '1 Station ausgewählt' : `${selected.length} Stationen ausgewählt`;
    description.textContent = selected.length ? 'Diese Stationen nehmen wir in eure Anfrage auf:'
      : 'Tippt auf die Stationen, die ihr euch für euer Event wünscht.';
    chips.replaceChildren();
    selected.forEach(name => { const chip = document.createElement('span'); chip.className = 'bbd-stations__chip'; chip.textContent = name; chips.append(chip); });
    chips.hidden = selected.length === 0;
    action.disabled = selected.length === 0;
  }

  // Keep the viewport stationary when a user clicks a selection card.
  // Normally the <label> focuses its visually hidden checkbox at the top
  // corner, which may make browsers scroll the page unexpectedly.
  // Mouse/touch clicks are handled without moving focus; direct checkbox
  // interaction through Tab/Space continues to work as usual.
  choices.forEach(input => {
    const card = input.closest('.bbd-station');
    if (!card) return;
    card.addEventListener('click', event => {
      if (event.target === input || event.defaultPrevented) return;
      event.preventDefault(); // Stop automatic focus/scroll caused by <label>.
      input.checked = !input.checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  choices.forEach(item => item.addEventListener('change', render));
  action.addEventListener('click', () => {
    const selected = choices.filter(item => item.checked).map(item => item.value);
    if (!selected.length) return;
    const params = new URLSearchParams({ angebot: 'events-feste', stationen: selected.join('|') });
    window.location.assign(`kontakt.html?${params.toString()}#kontakt`);
  });
  render();
})();
