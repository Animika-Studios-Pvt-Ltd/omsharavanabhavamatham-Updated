/* -------------------------------- HEADER SECTION -------------------------------- */
$(document).ready(function () {
  // --- Mobile Navigation Drawer Logic ---
  var $menuTrigger = $(".js-menuToggle");
  var $topNav = $(".js-topPushNav");
  var $openLevel = $(".js-openLevel");
  var $closeLevel = $(".js-closeLevel");
  var $closeLevelTop = $(".js-closeLevelTop");
  var $navLevel = $(".js-pushNavLevel");

  function openPushNav() {
    $topNav.addClass("isOpen");
    $("body").addClass("pushNavIsOpen");
    $("#nav-icon1").addClass("open");
  }

  function closePushNav() {
    $topNav.removeClass("isOpen");
    $navLevel.removeClass("isOpen");
    $("body").removeClass("pushNavIsOpen");
    $("#nav-icon1").removeClass("open");
  }

  $menuTrigger.on("click touchstart", function (e) {
    e.preventDefault();
    if ($topNav.hasClass("isOpen")) {
      closePushNav();
    } else {
      openPushNav();
    }
  });

  var mobileNavMq = window.matchMedia("(max-width: 991px)");

  $openLevel.on("click", function (e) {
    if (!mobileNavMq.matches) {
      return;
    }
    e.preventDefault();
    var $submenu = $(this).next($navLevel);
    if ($submenu.hasClass("isOpen")) {
      $submenu.removeClass("isOpen");
    } else {
      $navLevel.removeClass("isOpen");
      $submenu.addClass("isOpen");
    }
  });

  $closeLevel.on("click touchstart", function () {
    $(this).closest($navLevel).removeClass("isOpen");
  });

  $closeLevelTop.on("click touchstart", function () {
    closePushNav();
  });

  $(".screen").click(function () {
    closePushNav();
  });

  // --- Desktop Dropdown Hover/Focus Logic ---
  (function initDesktopDropdowns() {
    var desktopMq = window.matchMedia("(min-width: 992px)");
    var hideDelayMs = 280;
    var navItems = document.querySelectorAll(
      ".site-navbar-links > li:has(.push-nav-level)",
    );

    navItems.forEach(function (item) {
      var menu = item.querySelector(".push-nav-level");
      if (!menu) {
        return;
      }

      var hideTimer;

      function showMenu() {
        if (!desktopMq.matches) {
          return;
        }
        clearTimeout(hideTimer);
        document
          .querySelectorAll(
            ".push-nav-level.is-dropdown-open",
          )
          .forEach(function (openMenu) {
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
});

/* Inner story pages — same slow AOS scroll reveals as homepage */
(function loadInnerAos() {
  if (!document.body.classList.contains("story-page")) {
    return;
  }

  if (document.querySelector('script[src*="inner-aos.js"]')) {
    return;
  }

  function appendInnerAosScript() {
    var script = document.createElement("script");
    script.src = "inner-aos.js";
    document.body.appendChild(script);
  }

  if (document.readyState === "complete") {
    appendInnerAosScript();
  } else {
    window.addEventListener("load", appendInnerAosScript, { once: true });
  }
})();