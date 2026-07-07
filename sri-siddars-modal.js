(function () {
  function initSiddarsModal() {
    if (!document.body.classList.contains('sri-siddars-page')) {
      return;
    }

    var modal = document.getElementById('sriSiddarsModal');
    var titleEl = document.getElementById('sriSiddarsModalTitle');
    var bodyEl = document.getElementById('sriSiddarsModalBody');
    var grid = document.querySelector('.sri-siddars-page .expanding-grid');

    if (!modal || !titleEl || !bodyEl || !grid) {
      return;
    }

    var lastFocus = null;

    function openModal(sectionId) {
      var section = document.getElementById(sectionId);
      if (!section) {
        return;
      }

      var entry = section.querySelector('.entry-image');
      if (!entry) {
        return;
      }

      var heading = entry.querySelector('h3');
      titleEl.textContent = heading ? heading.textContent.trim() : '';

      bodyEl.innerHTML = '';
      Array.prototype.forEach.call(entry.children, function (child) {
        if (child.tagName === 'H3') {
          return;
        }
        bodyEl.appendChild(child.cloneNode(true));
      });

      lastFocus = document.activeElement;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('sri-siddars-modal-open');
      modal.querySelector('.sri-siddars-modal__close').focus();
    }

    function closeModal() {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('sri-siddars-modal-open');
      bodyEl.innerHTML = '';
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }

    grid.addEventListener('click', function (event) {
      var link = event.target.closest('.links a[href^="#"]');
      if (!link || !grid.contains(link)) {
        return;
      }

      var match = link.getAttribute('href').match(/#([^\?]+)/);
      if (!match) {
        return;
      }

      event.preventDefault();
      openModal(match[1]);
    });

    modal.addEventListener('click', function (event) {
      if (event.target.closest('[data-close-modal]')) {
        event.preventDefault();
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiddarsModal);
  } else {
    initSiddarsModal();
  }
})();
