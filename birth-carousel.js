(function () {
  function initBirthCarousels() {
    if (!window.bootstrap || !bootstrap.Carousel) {
      return;
    }

    document.querySelectorAll('.story-page .carousel.slide').forEach(function (carouselEl) {
      carouselEl.querySelectorAll('.carousel-control-prev, .carousel-control-next').forEach(function (btn) {
        btn.remove();
      });

      bootstrap.Carousel.getOrCreateInstance(carouselEl, {
        interval: 5000,
        ride: 'carousel',
        pause: 'hover',
        wrap: true
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBirthCarousels);
  } else {
    initBirthCarousels();
  }
})();
