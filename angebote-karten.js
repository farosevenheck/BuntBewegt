/* Angebote page: filter individual programme cards; all content is static and works without JS. */
(() => {
 'use strict';
 const panel=document.querySelector('.all-angebote-section');
 if(!panel)return;
 const buttons=[...panel.querySelectorAll('.all-angebote-filters button')];
 const cards=[...panel.querySelectorAll('.all-angebot-card')];
 buttons.forEach(button => button.addEventListener('click',() => {
   const filter=button.dataset.filter;
   buttons.forEach(b=>{const active=b===button;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});
   cards.forEach(card => {card.hidden=filter!=='alle' && card.dataset.category!==filter;});
 }));
})();
