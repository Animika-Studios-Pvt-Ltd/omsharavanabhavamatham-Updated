(function initInnerPageAos() {
  if (!document.body.classList.contains("story-page")) {
    return;
  }

  document.querySelectorAll(".inner-banner").forEach(function (banner) {
    if (!banner.hasAttribute("data-aos")) {
      banner.setAttribute("data-aos", "fade");
    }
  });

  var AOS_CDN = "https://unpkg.com/aos@2.3.4/dist/aos";

  function setAos(el, animation, delay) {
    if (!el || el.hasAttribute("data-aos")) {
      return;
    }

    el.setAttribute("data-aos", animation);

    if (delay) {
      el.setAttribute("data-aos-delay", String(delay));
    }
  }

  function applyAosAttributes() {
    document.querySelectorAll(".birth-article__header").forEach(function (header) {
      setAos(header, "fade");
    });

    document.querySelectorAll(".birth-article__media").forEach(function (media) {
      setAos(media, "fade-right", 200);
    });

    document.querySelectorAll(".birth-article__copy").forEach(function (copy) {
      setAos(copy, "fade-left", 350);
    });

    document.querySelectorAll(".birth-article__divider").forEach(function (divider) {
      setAos(divider, "fade", 450);
    });

    document.querySelectorAll(".birth-article__more").forEach(function (more) {
      setAos(more, "fade-up", 200);
    });

    document.querySelectorAll(".birth-article__grid").forEach(function (grid) {
      if (grid.querySelector(".birth-article__media, .birth-article__copy")) {
        return;
      }

      grid.querySelectorAll(":scope > *").forEach(function (child, index) {
        var animation = index % 2 === 0 ? "fade-right" : "fade-left";
        setAos(child, animation, 200 + index * 150);
      });
    });

    document.querySelectorAll(".social-impact-card").forEach(function (card, index) {
      setAos(card, "fade-up", 150 + index * 100);
    });

    document
      .querySelectorAll(".inner-seva__card, .birth-seva__card")
      .forEach(function (card, index) {
        setAos(card, "fade-up", 150 + index * 120);
      });
  }

  function stripAosAttributes() {
    document.querySelectorAll("[data-aos]").forEach(function (el) {
      el.removeAttribute("data-aos");
      el.removeAttribute("data-aos-delay");
      el.removeAttribute("data-aos-duration");
      el.removeAttribute("data-aos-easing");
    });
  }

  function initAos() {
    if (typeof AOS === "undefined") {
      return;
    }

    var reducedMotionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotionMq.matches) {
      stripAosAttributes();
      return;
    }

    applyAosAttributes();

    AOS.init({
      duration: 1200,
      easing: "ease-in-out",
      once: false,
      offset: 100,
      delay: 0,
      mirror: true,
      anchorPlacement: "top-bottom",
    });
  }

  function ensureAosAssets(done) {
    if (!document.querySelector('link[href*="aos"]')) {
      var aosCss = document.createElement("link");
      aosCss.rel = "stylesheet";
      aosCss.href = AOS_CDN + ".css";
      document.head.appendChild(aosCss);
    }

    if (typeof AOS !== "undefined") {
      done();
      return;
    }

    var aosScript = document.createElement("script");
    aosScript.src = AOS_CDN + ".js";
    aosScript.onload = done;
    document.body.appendChild(aosScript);
  }

  function start() {
    ensureAosAssets(initAos);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
