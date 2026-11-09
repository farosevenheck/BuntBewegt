/* Teambuilding compact overview: interactive selections without page jumping. */
(() => {
  'use strict';
  const root = document.querySelector('.team-ref-page');
  if (!root) return;
  const request = root.querySelector('#team-ref-request');
  const count = root.querySelector('[data-team-count]');
  const exerciseInputs = [...root.querySelectorAll('input[name="exercise"]')];
  const durationInputs = [...root.querySelectorAll('input[name="duration"]')];
  const certificate = root.querySelector('#team-certificate');
  function refresh(){
    const chosen = exerciseInputs.filter(input => input.checked).map(input => input.value);
    const duration = durationInputs.find(input => input.checked)?.value || '';
    const params = new URLSearchParams({angebot:'teambuilding'});
    if (chosen.length) params.set('uebungen',chosen.join('|'));
    if (duration) params.set('dauer',duration);
    if (certificate?.checked) params.set('urkunden','ja');
    if (request) request.href = `kontakt.html?${params.toString()}#kontakt`;
    if (count) count.textContent = chosen.length ? `${chosen.length} Übung${chosen.length===1?'':'en'} vorgemerkt` : 'Noch keine Übungen ausgewählt';
  }
  [...exerciseInputs,...durationInputs,certificate].filter(Boolean).forEach(input => input.addEventListener('change',refresh));
  refresh();
})();
