/* BuntBewegt: Bestellanfrage ausschließlich bei Aufruf über den Shop. */
(() => {
  'use strict';
  const form = document.getElementById('shop-order-form');
  const section = document.getElementById('shop-anfrage');
  if (!form || !section) return;

  const choice = new URLSearchParams(window.location.search).get('shop');
  if (choice !== 'tshirt' && choice !== 'jacke') return;

  // Eine normale Kontaktseite zeigt ausschließlich das bestehende Kontaktformular.
  document.documentElement.classList.add('shop-inquiry-mode');
  section.hidden = false;
  const ordinaryIntro = document.querySelector('.kontakt-art-intro');
  const ordinaryContact = document.getElementById('kontakt-section');
  if (ordinaryIntro) ordinaryIntro.hidden = true;
  if (ordinaryContact) ordinaryContact.hidden = true;

  const product = form.querySelector('#shop-product');
  if (product) product.value = choice === 'jacke' ? 'Jacke (Anfrage)' : 'BuntBewegt T-Shirt (weiß)';

  const address = document.getElementById('shop-shipping-address');
  const pickupNote = document.getElementById('shop-pickup-note');
  const shippingChoices = [...form.querySelectorAll('input[name="Versandart"]')];
  if (!address || !pickupNote || shippingChoices.length !== 2) return;
  const addressInputs = [...address.querySelectorAll('input')];

  function updateDelivery() {
    const pickup = form.querySelector('input[name="Versandart"]:checked')?.value === 'Abholung';
    address.hidden = pickup;
    pickupNote.hidden = !pickup;
    addressInputs.forEach(input => {
      input.disabled = pickup;
      input.required = !pickup;
    });
  }
  shippingChoices.forEach(input => input.addEventListener('change', updateDelivery));
  updateDelivery();
})();
