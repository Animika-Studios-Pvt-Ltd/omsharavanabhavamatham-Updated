(function () {
  function initDevoteeStoryModal() {
    if (!document.body.classList.contains('devotees-page')) {
      return;
    }

    var modalEl = document.getElementById('devoteeStoryModal');
    if (!modalEl || typeof bootstrap === 'undefined' || !bootstrap.Modal) {
      return;
    }

    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    var modalTitle = modalEl.querySelector('.devotee-story-modal__title');
    var modalBody = modalEl.querySelector('.devotee-story-modal__body');
    var panels = document.querySelectorAll('.story-page.devotees-page .panel.panel-default.module');

    panels.forEach(function (panel) {
      var link = panel.querySelector('.panel-title > a');
      var body = panel.querySelector('.panel-body');
      if (!link || !body) {
        return;
      }

      link.removeAttribute('data-bs-toggle');
      link.removeAttribute('data-bs-parent');
      link.setAttribute('href', '#');
      link.setAttribute('aria-expanded', 'false');

      link.addEventListener('click', function (event) {
        event.preventDefault();

        var titleClone = link.cloneNode(true);
        titleClone.querySelectorAll('.more-less').forEach(function (icon) {
          icon.remove();
        });

        modalTitle.textContent = titleClone.textContent.replace(/\s+/g, ' ').trim();
        modalBody.innerHTML = body.innerHTML;
        modal.show();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDevoteeStoryModal);
  } else {
    initDevoteeStoryModal();
  }
})();
