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

(function initHomeCalendar() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var calendar = document.getElementById("homeCalendar");
  var monthLabel = document.getElementById("homeCalendarMonth");
  var grid = document.getElementById("homeCalendarGrid");
  if (!calendar || !monthLabel || !grid) {
    return;
  }

  var monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  var eventDates = (calendar.getAttribute("data-event-dates") || "")
    .split(",")
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean);
  var eventDateSet = {};
  eventDates.forEach(function (dateKey) {
    eventDateSet[dateKey] = true;
  });

  var today = new Date();
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();
  var selectedDate = null;

  function pad(value) {
    return value < 10 ? "0" + value : String(value);
  }

  function dateKey(year, month, day) {
    return year + "-" + pad(month + 1) + "-" + pad(day);
  }

  function renderCalendar() {
    monthLabel.textContent = monthNames[viewMonth] + " " + viewYear;
    grid.innerHTML = "";

    var firstDay = new Date(viewYear, viewMonth, 1).getDay();
    var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    var daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    var totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (var cell = 0; cell < totalCells; cell += 1) {
      var dayNumber;
      var cellMonth = viewMonth;
      var cellYear = viewYear;
      var isMuted = false;

      if (cell < firstDay) {
        dayNumber = daysInPrevMonth - firstDay + cell + 1;
        isMuted = true;
        if (cellMonth === 0) {
          cellMonth = 11;
          cellYear -= 1;
        } else {
          cellMonth -= 1;
        }
      } else if (cell >= firstDay + daysInMonth) {
        dayNumber = cell - firstDay - daysInMonth + 1;
        isMuted = true;
        if (cellMonth === 11) {
          cellMonth = 0;
          cellYear += 1;
        } else {
          cellMonth += 1;
        }
      } else {
        dayNumber = cell - firstDay + 1;
      }

      var key = dateKey(cellYear, cellMonth, dayNumber);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "home-calendar__day";
      button.textContent = String(dayNumber);

      if (isMuted) {
        button.classList.add("is-muted");
      }

      if (
        cellYear === today.getFullYear() &&
        cellMonth === today.getMonth() &&
        dayNumber === today.getDate()
      ) {
        button.classList.add("is-today");
      }

      if (selectedDate === key) {
        button.classList.add("is-selected");
      }

      if (eventDateSet[key]) {
        var dot = document.createElement("span");
        dot.className = "home-calendar__dot";
        dot.setAttribute("aria-hidden", "true");
        button.appendChild(dot);
      }

      if (!isMuted) {
        button.addEventListener("click", function (eventKey) {
          return function () {
            selectedDate = eventKey;
            renderCalendar();
          };
        }(key));
      } else {
        button.disabled = true;
      }

      grid.appendChild(button);
    }
  }

  var prevBtn = calendar.querySelector("[data-cal-prev]");
  var nextBtn = calendar.querySelector("[data-cal-next]");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      if (viewMonth === 0) {
        viewMonth = 11;
        viewYear -= 1;
      } else {
        viewMonth -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (viewMonth === 11) {
        viewMonth = 0;
        viewYear += 1;
      } else {
        viewMonth += 1;
      }
      renderCalendar();
    });
  }

  renderCalendar();
})();

(function initVoicePlayers() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var playButtons = document.querySelectorAll(".voice-card__play-btn");
  if (!playButtons.length) {
    return;
  }

  var audio = new Audio();
  var activeButton = null;

  function setButtonState(button, isPlaying) {
    var card = button.closest(".voice-card");
    var icon = button.querySelector(".fa");

    button.classList.toggle("is-playing", isPlaying);
    if (card) {
      card.classList.toggle("is-playing", isPlaying);
    }
    if (icon) {
      icon.classList.toggle("fa-play", !isPlaying);
      icon.classList.toggle("fa-pause", isPlaying);
    }

    button.setAttribute(
      "aria-label",
      isPlaying ? button.getAttribute("data-aria-pause") : button.getAttribute("data-aria-play")
    );
  }

  function resetButtons() {
    playButtons.forEach(function (button) {
      setButtonState(button, false);
    });
    activeButton = null;
  }

  playButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var src = button.getAttribute("data-audio-src");
      if (!src) {
        return;
      }

      if (activeButton === button && !audio.paused) {
        audio.pause();
        setButtonState(button, false);
        activeButton = null;
        return;
      }

      playButtons.forEach(function (otherButton) {
        if (otherButton !== button) {
          setButtonState(otherButton, false);
        }
      });

      var resolvedSrc = new URL(src, window.location.href).href;
      if (audio.src !== resolvedSrc) {
        audio.src = src;
      }

      audio.play().then(function () {
        setButtonState(button, true);
        activeButton = button;
      }).catch(function () {
        resetButtons();
      });
    });
  });

  audio.addEventListener("ended", resetButtons);
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
