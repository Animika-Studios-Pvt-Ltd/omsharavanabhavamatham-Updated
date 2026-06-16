window.onload = function () {
  document.getElementById("popupOverlay").style.display = "flex";
};

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

(function initSevaLotusAnimations() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var section = document.querySelector(".seva-section__inner");
  var cards = document.querySelectorAll(".seva-section .seva-card");
  if (!section || !cards.length) {
    return;
  }

  var header = document.querySelector(".seva-section__header");

  function revealCards() {
    if (header) {
      header.classList.add("is-in-view");
    }
    cards.forEach(function (card) {
      card.classList.add("is-in-view");
    });
  }

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    revealCards();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealCards();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" }
  );

  observer.observe(section);
})();

(function initHomeDesktopDropdowns() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var desktopMq = window.matchMedia("(min-width: 992px)");
  var hideDelayMs = 280;
  var navItems = document.querySelectorAll(
    ".site-navbar__links > li:has(.pushNav_level)"
  );

  navItems.forEach(function (item) {
    var menu = item.querySelector(".pushNav_level");
    if (!menu) {
      return;
    }

    var hideTimer;

    function showMenu() {
      if (!desktopMq.matches) {
        return;
      }
      clearTimeout(hideTimer);
      document.querySelectorAll(".pushNav_level.is-dropdown-open").forEach(function (openMenu) {
        if (openMenu !== menu) {
          openMenu.classList.remove("is-dropdown-open");
        }
      });
      menu.classList.add("is-dropdown-open");
    }

    function scheduleHide() {
      if (!desktopMq.matches) {
        return;
      }
      hideTimer = setTimeout(function () {
        menu.classList.remove("is-dropdown-open");
      }, hideDelayMs);
    }

    item.addEventListener("mouseenter", showMenu);
    item.addEventListener("mouseleave", scheduleHide);
    menu.addEventListener("mouseenter", showMenu);
    menu.addEventListener("mouseleave", scheduleHide);

    item.addEventListener("focusin", showMenu);
    item.addEventListener("focusout", function (event) {
      if (!item.contains(event.relatedTarget)) {
        scheduleHide();
      }
    });
  });
})();
