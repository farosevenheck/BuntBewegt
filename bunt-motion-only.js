/* BuntBewegt scroll and secondary-page entry animation only. No layout styling. */
(() => {
  'use strict';
  document.body.classList.add('bb-page-loaded');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || motion.matches) return;
  // Avoid duplicating existing scroll reveals from the base site.
  const selectors = [
    '.all-angebote-heading', '.all-angebote-filters',
    '.ab-pillars', '.ab-idea-aside', '.ab-idea-main',
    '.ab-audience-photo', '.ab-audience-content', '.ab-section-head',
    '.ab-values-grid', '.ab-impact-header', '.kontakt-form-section .contact-copy',
    '.kontakt-form-section .contact-form-wrap', '.kontakt-outro-copy',
    '.program-benefits > div', '.program-section-nav',
    '.program-audience .audience-content', '.program-flow .flow-intro',
    '.moments-header', '.moments-gallery', '.faq-list',
    '.offers .section-intro', '.join-steps-heading'
  ];
  const elements = [...document.querySelectorAll(selectors.join(','))]
    .filter(node => !node.classList.contains('reveal-ready'));
  if (!elements.length) return;
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('bb-visible');
      io.unobserve(entry.target);
    }
  }, {threshold:.04,rootMargin:'0px 0px -30px 0px'});
  elements.forEach((element,index) => {
    if (element.getBoundingClientRect().top < window.innerHeight * .96) return;
    element.style.setProperty('--bb-delay', `${(index % 3) * 65}ms`);
    element.classList.add('bb-scroll-enter');
    io.observe(element);
  });
  document.addEventListener('focusin', event => {
    event.target.closest('.bb-scroll-enter')?.classList.add('bb-visible');
  });
  window.addEventListener('beforeprint', () => elements.forEach(el => el.classList.add('bb-visible')));
  motion.addEventListener('change',event => {
    if (event.matches) {io.disconnect();elements.forEach(el => el.classList.add('bb-visible'));}
  });
})();
