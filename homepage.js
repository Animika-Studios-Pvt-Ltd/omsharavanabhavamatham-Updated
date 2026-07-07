/* -------------------------------------------- UTILITY FUNCTIONS -------------------------------------------- */
function refreshHubLucideIcons() {
  if (typeof lucide === "undefined") {
    return;
  }

  lucide.createIcons({
    attrs: {
      "stroke-width": 1.5,
      width: 18,
      height: 18,
    },
    nameAttr: "data-lucide",
  });
}

/* -------------------------------------------- BABAJI HERO SECTION -------------------------------------------- */
(function initBabajiHeroParallax() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var hero = document.querySelector(".babaji-hero");
  var parallaxEls = document.querySelectorAll("[data-babaji-parallax]");
  if (!hero || !parallaxEls.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var ticking = false;

  function updateParallax() {
    var rect = hero.getBoundingClientRect();
    var viewMid = window.innerHeight * 0.5;
    var heroMid = rect.top + rect.height * 0.5;
    var offset = (viewMid - heroMid) * 0.08;

    parallaxEls.forEach(function (el) {
      var factor = parseFloat(el.getAttribute("data-babaji-parallax")) || 0.03;
      var y = offset * factor * 10;
      var flip = el.classList.contains("babaji-hero-floral-bl")
        ? "scaleX(-1) "
        : "";
      el.style.transform = flip + "translate3d(0, " + y + "px, 0)";
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateParallax);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  updateParallax();
})();

/* -------------------------------------------- SEVA SECTION -------------------------------------------- */
(function initSevaLotusAnimations() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var section = document.querySelector(".seva-section-inner");
  var cards = document.querySelectorAll(".seva-section .seva-showcase-card");
  if (!section || !cards.length) {
    return;
  }

  var header = document.querySelector(".seva-section-header");

  function revealCards() {
    if (header) {
      header.classList.add("is-in-view");
    }
    cards.forEach(function (card) {
      card.classList.add("is-in-view");
    });
  }

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
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
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
  );

  observer.observe(section);
})();

/* -------------------------------------------- NEWS & EVENTS (EVENTS HUB) SECTION -------------------------------------------- */
(function initHomeCalendar() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var calendar = document.getElementById("homeCalendar");
  var monthLabel = document.getElementById("homeCalendarMonth");
  var grid = document.getElementById("homeCalendarGrid");
  var eventDateLabel = document.getElementById("homeCalendarEventDate");
  var eventTitleLabel = document.getElementById("homeCalendarEventTitle");
  var eventDescLabel = document.getElementById("homeCalendarEventDesc");
  var eventIconWrap = document.getElementById("homeCalendarEventIcon");

  if (!calendar || !monthLabel || !grid) {
    return;
  }

  var monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var monthNamesFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var isHubCalendar = calendar.classList.contains("home-calendar-hub");
  var eventsData = [];

  try {
    eventsData = JSON.parse(calendar.getAttribute("data-events") || "[]");
  } catch (error) {
    eventsData = [];
  }

  var eventMap = {};
  var eventDates = [];

  eventsData.forEach(function (item) {
    if (item && item.date) {
      eventMap[item.date] = item;
      eventDates.push(item.date);
    }
  });

  if (!eventDates.length) {
    eventDates = (calendar.getAttribute("data-event-dates") || "")
      .split(",")
      .map(function (value) {
        return value.trim();
      })
      .filter(Boolean);
  }

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

  function formatDisplayDate(key) {
    var parts = key.split("-");
    if (parts.length !== 3) {
      return key;
    }

    var monthIndex = parseInt(parts[1], 10) - 1;
    var monthLabel = isHubCalendar
      ? monthNamesFull[monthIndex]
      : monthNames[monthIndex].toUpperCase();
    return parseInt(parts[2], 10) + " " + monthLabel + " " + parts[0];
  }

  function setEventPanelIcon(iconName) {
    if (!eventIconWrap) {
      return;
    }

    eventIconWrap.innerHTML =
      '<i data-lucide="' + (iconName || "calendar") + '"></i>';
    refreshHubLucideIcons();
  }

  function syncLinkedCards(key) {
    document
      .querySelectorAll(".events-hub-card[data-event-date]")
      .forEach(function (card) {
        card.classList.toggle(
          "is-linked",
          card.getAttribute("data-event-date") === key,
        );
      });
  }

  function updateEventPanel(key) {
    if (!eventDateLabel || !eventTitleLabel || !eventDescLabel) {
      return;
    }

    var eventItem = eventMap[key];
    var eventPanel = document.getElementById("homeCalendarEventPanel");

    eventDateLabel.textContent = formatDisplayDate(key);

    if (!eventItem) {
      eventTitleLabel.textContent = "A Day for Devotion";
      eventDescLabel.textContent =
        "No formal program scheduled — open for satsang, prayer, and quiet reflection.";
      setEventPanelIcon("calendar");
      if (eventPanel) {
        eventPanel.classList.add("is-empty");
      }
      return;
    }

    eventTitleLabel.textContent = eventItem.title || "Sacred gathering";
    eventDescLabel.textContent = eventItem.desc || "";
    setEventPanelIcon(eventItem.icon || "calendar");
    if (eventPanel) {
      eventPanel.classList.remove("is-empty");
    }
  }

  function selectDate(key) {
    selectedDate = key;
    syncLinkedCards(key);
    updateEventPanel(key);
    renderCalendar();
  }

  function renderCalendar() {
    var monthLabelText = isHubCalendar
      ? monthNamesFull[viewMonth] + " " + viewYear
      : monthNames[viewMonth] + " " + viewYear;
    monthLabel.textContent = monthLabelText;
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
          cellMonth -= 1;
        }
      } else {
        dayNumber = cell - firstDay + 1;
      }

      var key = dateKey(cellYear, cellMonth, dayNumber);
      var button = document.createElement("button");
      button.type = "button";
      button.className = "home-calendar-day";
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
        button.classList.add("has-event");
        var dot = document.createElement("span");
        dot.className = "home-calendar-dot";
        dot.setAttribute("aria-hidden", "true");
        button.appendChild(dot);
      }

      if (!isMuted) {
        button.addEventListener(
          "click",
          (function (eventKey) {
            return function () {
              selectDate(eventKey);
            };
          })(key),
        );
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

  calendar.querySelectorAll("[data-cal-view]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      calendar.querySelectorAll("[data-cal-view]").forEach(function (peer) {
        peer.classList.remove("is-active");
        peer.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
    });
  });

  var defaultDate = eventDates.length
    ? eventDates[0]
    : dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  if (defaultDate) {
    var dateParts = defaultDate.split("-");
    viewYear = parseInt(dateParts[0], 10);
    viewMonth = parseInt(dateParts[1], 10) - 1;
  }
  selectDate(defaultDate);
  refreshHubLucideIcons();
})();

(function initEventsHubFestivals() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var track = document.getElementById("festivalsCarouselTrack");
  var dotsWrap = document.getElementById("festivalsCarouselDots");
  var carousel = document.getElementById("festivalsCarousel");
  var prevBtn = document.getElementById("festivalsCarouselPrev");
  var nextBtn = document.getElementById("festivalsCarouselNext");
  var festivals = track
    ? track.querySelectorAll(".events-hub-festival[data-festival-start]")
    : [];

  if (!track || !festivals.length) {
    return;
  }

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var activeItem = null;
  var nearestDistance = Infinity;
  var currentIndex = 0;
  var autoplayTimer = null;
  var resizeTimer = null;
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  festivals.forEach(function (item) {
    var start = new Date(item.getAttribute("data-festival-start"));
    var end = new Date(
      item.getAttribute("data-festival-end") ||
        item.getAttribute("data-festival-start"),
    );
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      activeItem = item;
      nearestDistance = -1;
      return;
    }

    if (today < start) {
      var distance = start - today;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        activeItem = item;
      }
    }
  });

  if (activeItem) {
    activeItem.classList.add("is-active");
  }

  function getVisibleCount() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return 1;
    }
    if (window.matchMedia("(max-width: 991px)").matches) {
      return 2;
    }
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, festivals.length - getVisibleCount());
  }

  function getStepSize() {
    var first = festivals[0];
    if (!first) {
      return 0;
    }
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.gap) || parseFloat(styles.columnGap) || 16;
    return first.getBoundingClientRect().width + gap;
  }

  function buildDots() {
    if (!dotsWrap) {
      return;
    }

    dotsWrap.innerHTML = "";
    var maxIndex = getMaxIndex();

    for (var i = 0; i <= maxIndex; i += 1) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "events-hub-festivals-dot";
      dot.setAttribute("aria-label", "Show festival slide " + (i + 1));
      dot.addEventListener(
        "click",
        (function (index) {
          return function () {
            goTo(index, true);
          };
        })(i),
      );
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) {
      return;
    }

    var dots = dotsWrap.querySelectorAll(".events-hub-festivals-dot");
    dots.forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  }

  function goTo(index, pauseAutoplay) {
    var maxIndex = getMaxIndex();
    currentIndex = index;

    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }
    if (currentIndex < 0) {
      currentIndex = maxIndex;
    }

    track.style.transform =
      "translateX(-" + getStepSize() * currentIndex + "px)";
    updateDots();

    if (pauseAutoplay) {
      restartAutoplay();
    }
  }

  function nextSlide() {
    goTo(currentIndex + 1);
  }

  function prevSlide() {
    goTo(currentIndex - 1);
  }

  function startAutoplay() {
    if (prefersReducedMotion || getMaxIndex() === 0) {
      return;
    }

    autoplayTimer = window.setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  function refreshCarousel() {
    var maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    buildDots();
    track.style.transform =
      "translateX(-" + getStepSize() * currentIndex + "px)";
    updateDots();
  }

  refreshCarousel();
  startAutoplay();

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prevSlide();
      restartAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      nextSlide();
      restartAutoplay();
    });
  }

  if (carousel) {
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);
  }

  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(refreshCarousel, 150);
  });

  var festivalsPanel = document.getElementById("festivalsPanel");
  if (festivalsPanel) {
    festivalsPanel.__refreshCarousel = refreshCarousel;
  }

  refreshHubLucideIcons();
})();

(function initEventsHubFestivalsToggle() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var toggle = document.getElementById("festivalsToggle");
  var panel = document.getElementById("festivalsPanel");
  var hub = document.querySelector(".events-hub");

  if (!toggle || !panel) {
    return;
  }

  function setExpanded(expanded) {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      expanded ? "Hide upcoming festivals" : "Show upcoming festivals",
    );
    panel.classList.toggle("is-collapsed", !expanded);

    if (expanded) {
      panel.classList.add("is-in-view");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (typeof panel.__refreshCarousel === "function") {
            panel.__refreshCarousel();
          }
          if (typeof refreshHubLucideIcons === "function") {
            refreshHubLucideIcons(hub || panel);
          }
        });
      });
    }
  }

  toggle.addEventListener("click", function () {
    var isExpanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(!isExpanded);
  });
})();

(function initEventsHubReveal() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var hub = document.querySelector(".events-hub");
  if (!hub) {
    return;
  }

  hub.classList.add("events-hub-animate");

  var cards = hub.querySelectorAll(".events-hub-card");
  var calendarWrap = hub.querySelector(".events-hub-calendar-wrap");

  function revealAll() {
    cards.forEach(function (card, index) {
      card.style.transitionDelay = index * 0.08 + "s";
      card.classList.add("is-in-view");
    });
    if (calendarWrap) {
      calendarWrap.classList.add("is-in-view");
    }
    refreshHubLucideIcons(hub);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealAll();
    return;
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealAll();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(hub);
  } else {
    revealAll();
  }
})();

/* -------------------------------------------- BABAJI'S VIDEOS & DIVINE VOICE SECTION -------------------------------------------- */
(function initVoicePlayers() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var playButtons = document.querySelectorAll(".voice-card-play-btn");
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
      isPlaying
        ? button.getAttribute("data-aria-pause")
        : button.getAttribute("data-aria-play"),
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

      audio
        .play()
        .then(function () {
          setButtonState(button, true);
          activeButton = button;
        })
        .catch(function () {
          resetButtons();
        });
    });
  });

  audio.addEventListener("ended", resetButtons);
})();

/* -------------------------------------------- SOCIAL IMPACT SECTION -------------------------------------------- */
(function initSocialImpactReveal() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var content = document.querySelector(".social-impact-hero-content");
  if (!content) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    content.classList.add("is-in-view");
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
  );

  observer.observe(content);
})();

/* -------------------------------------------- HOW TO GET HERE (REACH LUXE) SECTION -------------------------------------------- */
(function initReachLuxeSection() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var section = document.getElementById("reachLuxe");
  if (!section) {
    return;
  }

  var cards = section.querySelectorAll("[data-reach-card]");
  var mapHero = section.querySelector("[data-reach-map]");
  var reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function reveal(el) {
    if (el) {
      el.classList.add("is-in-view");
    }
  }

  if (reducedMotion || !("IntersectionObserver" in window)) {
    cards.forEach(reveal);
    reveal(mapHero);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
  );

  cards.forEach(function (card) {
    observer.observe(card);
  });

  if (mapHero) {
    observer.observe(mapHero);
  }
})();

/* -------------------------------------------- FOOTER / RETURN TO TOP BUTTON -------------------------------------------- */
(function initFooterPalaceTop() {
  if (!document.body.classList.contains("home-page")) {
    return;
  }

  var topBtn = document.getElementById("return-to-top");
  if (!topBtn || !topBtn.classList.contains("footer-palace-top")) {
    return;
  }

  if (window.jQuery) {
    jQuery(window).off("scroll");
    jQuery(topBtn).stop(true, true).css({ display: "inline-flex", opacity: 1 });
    jQuery(topBtn)
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        jQuery("body,html").animate({ scrollTop: 0 }, 500);
      });
    if (typeof refreshHubLucideIcons === "function") {
      refreshHubLucideIcons();
    }
    return;
  }

  topBtn.style.display = "inline-flex";
  topBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (typeof refreshHubLucideIcons === "function") {
    refreshHubLucideIcons();
  }
})();