/* Workshops – independent card selection, same pattern as Events. */
(() => {
  'use strict';
  const section = document.getElementById('themen');
  if (!section) return;
  const inputs = [...section.querySelectorAll('input[name="thema"]')];
  const count = section.querySelector('[data-workshop-count]');
  const description = section.querySelector('[data-workshop-description]');
  const chips = section.querySelector('[data-workshop-chips]');
  const request = section.querySelector('[data-workshop-request]');
  if (!inputs.length || !count || !description || !chips || !request) return;
  const selected = () => inputs.filter(input => input.checked).map(input => input.value);
  function render() {
    const values = selected();
    count.textContent = values.length === 0 ? 'Wählt eure Lieblingsthemen'
      : values.length === 1 ? '1 Thema ausgewählt' : `${values.length} Themen ausgewählt`;
    description.textContent = values.length ? 'Diese Themen nehmen wir in eure unverbindliche Anfrage auf:'
      : 'Ihr könnt mehrere Themen auswählen und später gemeinsam mit uns abstimmen.';
    chips.replaceChildren();
    values.forEach(name => {
      const chip = document.createElement('span');
      chip.className = 'bbd-stations__chip';
      chip.textContent = name;
      chips.appendChild(chip);
    });
    chips.hidden = values.length === 0;
    request.disabled = values.length === 0;
  }
  inputs.forEach(input => input.addEventListener('change', render));
  request.addEventListener('click', () => {
    const values = selected();
    if (!values.length) return;
    const params = new URLSearchParams({ angebot:'workshops', themen:values.join('|') });
    window.location.assign(`kontakt.html?${params.toString()}#kontakt`);
  });
  render();
})();
