document.addEventListener("DOMContentLoaded", function () {
  var modalEl = document.getElementById("poojaBookModal");
  if (!modalEl || typeof bootstrap === "undefined") return;

  var modalTitle = modalEl.querySelector(".pooja-book-modal__title");
  var modalList = modalEl.querySelector(".pooja-book-modal__list");
  var modal = bootstrap.Modal.getOrCreateInstance(modalEl);

  document.querySelectorAll(".pooja-book-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".social-impact-card");
      if (!card) return;

      var titleEl = card.querySelector(".social-impact-card__title");
      var menu = card.querySelector(".pooja-card__menu");
      if (!menu) return;

      modalTitle.textContent = titleEl ? titleEl.textContent.trim() : "Book a Pooja";
      modalList.innerHTML = "";

      menu.querySelectorAll("a").forEach(function (link) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.className = "pooja-book-modal__link";
        a.href = link.getAttribute("href") || "#";
        a.textContent = link.textContent.trim();
        li.appendChild(a);
        modalList.appendChild(li);
      });

      modal.show();
    });
  });
});
