/* Only for the Teambuilding page; selection remains voluntary and user-controlled. */
(() => {
  'use strict';
  const form = document.querySelector('#team-form');
  if (!form) return;
  const exerciseBoxes = Array.from(document.querySelectorAll('.tb-exercise input[type="checkbox"]'));
  const certificate = form.querySelector('input[name="certificate"]');
  const durations = [...form.querySelectorAll('input[name="duration"]')];
  const exerciseCount = document.querySelector('[data-exercise-count]');
  const summary = document.querySelector('[data-team-summary]');
  const selection = document.querySelector('[data-team-selection]');
  function selectedExercises() { return exerciseBoxes.filter(input => input.checked).map(input => input.value); }
  function update() {
    const chosen = selectedExercises();
    const duration = durations.find(el => el.checked)?.value || '';
    if (exerciseCount) exerciseCount.textContent = chosen.length ? `${chosen.length} von 15 Übungen vorgemerkt` : 'Noch keine Übungen vorgemerkt';
    if (summary) summary.textContent = `${duration || 'Dauer nach Absprache'} · ${certificate.checked ? 'mit Urkundenpaket' : 'ohne Urkundenpaket'}`;
    if (selection) selection.textContent = chosen.length ? `${chosen.length} Übung${chosen.length===1?'':'en'} für die Anfrage vorgemerkt` : 'Die Übungsauswahl könnt ihr auch später besprechen.';
  }
  [...exerciseBoxes,...durations,certificate].forEach(el => el.addEventListener('change', update));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const params = new URLSearchParams({angebot:'teambuilding'});
    const duration = durations.find(el => el.checked)?.value || '';
    if (duration) params.set('dauer',duration);
    if (certificate.checked) params.set('urkunden','ja');
    const chosen = selectedExercises();
    if (chosen.length) params.set('uebungen',chosen.join('|'));
    const group = form.elements.namedItem('group')?.value.trim();
    const participants = form.elements.namedItem('participants')?.value.trim();
    const notes = form.elements.namedItem('notes')?.value.trim();
    if (group) params.set('gruppe',group.slice(0,60));
    if (participants && /^\d{1,4}$/.test(participants) && Number(participants)>=1 && Number(participants)<=2000) params.set('teilnehmer',participants);
    if (notes) params.set('wuensche',notes.slice(0,400));
    window.location.assign(`kontakt.html?${params}#kontakt`);
  });
  update();
})();
