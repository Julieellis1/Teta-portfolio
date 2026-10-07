/* Adebiyi Thompson - Portfolio interactions (vanilla, mobile-safe) */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* page-load entrance */
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });
  if (document.readyState === 'complete') document.body.classList.add('loaded');

  /* scroll reveals */
  var revealEls = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = en.target.getAttribute('data-delay');
          if (d) en.target.style.transitionDelay = d + 'ms';
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* work carousel arrow */
  document.querySelectorAll('[data-carousel-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-carousel-next');
      var track = document.getElementById(id);
      if (!track) return;
      var card = track.querySelector('.work-card');
      var step = card ? card.getBoundingClientRect().width + 24 : 400;
      track.scrollBy({ left: step, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });

  /* mobile menu */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* footer year */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
