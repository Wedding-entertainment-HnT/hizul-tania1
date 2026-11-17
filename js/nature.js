/* Burung layang-layang bergaya ilustrasi alam, lebih rinci dan lembut. */
(function () {
  'use strict';

  function enhanceBirds() {
    var birds = document.querySelectorAll('.birds .bird');
    birds.forEach(function (bird, index) {
      var svg = bird.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('viewBox', '0 0 72 46');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML =
        '<defs>' +
          '<linearGradient id="wing-' + index + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#455b4d"/><stop offset="1" stop-color="#263a32"/>' +
          '</linearGradient>' +
          '<linearGradient id="feather-' + index + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#71816d"/><stop offset="1" stop-color="#34483d"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<g class="bird-wings">' +
          '<path class="bird-wing bird-wing-back" d="M34 22C26 14 16 6 3 4c7 8 10 14 12 20-5-3-9-4-13-4 9 8 18 11 30 9z" fill="url(#feather-' + index + ')"/>' +
          '<path class="bird-wing bird-wing-front" d="M37 22C46 13 56 6 69 5c-7 8-10 14-12 20 5-3 9-4 13-4-9 8-18 11-31 9z" fill="url(#wing-' + index + ')"/>' +
          '<path d="M7 6c8 5 14 11 19 18M65 7c-8 5-14 11-19 18" stroke="#d7c69a" stroke-opacity=".42" stroke-width=".7"/>' +
          '<path d="M12 12l12 12M18 10l10 13M60 11 48 24M54 10 46 23" stroke="#e7dfc9" stroke-opacity=".28" stroke-width=".55"/>' +
        '</g>' +
        '<path d="M30 24c3-4 8-5 12-2 3 2 4 5 4 9-4 3-10 4-15 1-3-2-4-5-1-8z" fill="#34483d"/>' +
        '<path d="M43 29c4 1 7 3 10 7-5-2-8-2-11-2M39 30c2 4 3 8 2 12-3-4-5-6-8-8" fill="#34483d"/>' +
        '<circle cx="43" cy="24" r=".8" fill="#e7d6a8"/>' +
        '<path d="M46 25l5 1-5 1" fill="#b69a67"/>';
      svg.classList.add('bird-art');
      bird.style.opacity = String(.58 + (index % 3) * .08);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceBirds, { once: true });
  } else {
    enhanceBirds();
  }
})();
