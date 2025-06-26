// Sidebar control
const openButton = document.getElementById("open-sidebar-button");
const navbar = document.getElementById("navbar");

function openSidebar() {
  navbar.classList.add("show");
}
function closeSidebar() {
  navbar.classList.remove("show");
}

// Star rating display
function renderRating(value, color) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars += `<i class="fas fa-star" style="color:${color}"></i>`;
    } else if (value >= i - 0.5) {
      stars += `<i class="fas fa-star-half-alt" style="color:${color}"></i>`;
    } else {
      stars += `<i class="far fa-star" style="color:${color}"></i>`;
    }
  }
  return `<div class="rating">${stars}</div>`;
}

$(document).ready(function () {
  let equipmentData = [];

  // Load and display equipment cards
  $.getJSON("equipments.json", function (data) {
    equipmentData = data;
    const equipmentList = $("#equipment-list");

    $.each(equipmentData, function (index, item) {
      const ratingHTML = renderRating(item.rating, "#f8e825");
      const firstImage =
        Array.isArray(item.images) && item.images.length > 0
          ? item.images[0]
          : "contents/assets/Adjustable-Dumbbell1.png";

      const equipmentCard = `
        <div class="equipment-card" data-id="${item.id}">
          <img class="image" src="${firstImage}" alt="${item.name}">
          <div class="equipment-card-name">${item.name}</div>
          ${ratingHTML}
          <div class="equipment-card-name">Price: ${item.price}</div>
        </div>
      `;
      equipmentList.append(equipmentCard);
    });
  });

  // Item click: open modal
  $("#equipment-list").on("click", ".equipment-card", function () {
    const equipmentId = $(this).data("id");
    const selectedEquipment = equipmentData.find(
      (item) => item.id === equipmentId
    );
    if (!selectedEquipment) return;

    let images = Array.isArray(selectedEquipment.images)
      ? selectedEquipment.images
      : [];
    if (!images.length) images = ["contents/assets/Adjustable-Dumbbell1.png"];

    const reservationKey = `reserved_${selectedEquipment.id}`;
    const existingReservation = localStorage.getItem(reservationKey);

    const modalBody = `
      <h2>${selectedEquipment.name}</h2>
      <div class="slider-container">
        <button class="prev-slide">❮</button>
        <img id="slider-image" src="${images[0]}" alt="${
      selectedEquipment.name
    }">
        <button class="next-slide">❯</button>
      </div>
      <p class="price">$${selectedEquipment.price.toFixed(2)}</p>
      <p>${selectedEquipment.description}</p>
      <video width="100%" controls>
        <source src="${selectedEquipment.video}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div id="reservationSection">
        <h3>Reserve This Item</h3>
        <form id="reservationForm">
          <input type="text" id="reserve-name" placeholder="Your Name" required />
          <input type="email" id="reserve-email" placeholder="Your Email" required />
          <input type="tel" id="reserve-phone" placeholder="Phone Number" required />
          <button type="submit">Reserve</button>
        </form>
        <div id="reservationMessage" style="margin-top: 10px;"></div>
      </div>
    `;

    $("#modal-body").html(modalBody);
    $("#equipment-modal").css("display", "block");

    // Image slider logic
    let currentIndex = 0;

    $(".prev-slide")
      .off("click")
      .on("click", function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        $("#slider-image").attr("src", images[currentIndex]);
      });

    $(".next-slide")
      .off("click")
      .on("click", function () {
        currentIndex = (currentIndex + 1) % images.length;
        $("#slider-image").attr("src", images[currentIndex]);
      });

    // Reservation logic
    if (existingReservation) {
      $("#reservationForm").hide();
      $("#reservationMessage").text("⛔ This item has already been reserved.");
    } else {
      $("#reservationForm").on("submit", function (e) {
        e.preventDefault();
        const name = $("#reserve-name").val().trim();
        const email = $("#reserve-email").val().trim();
        const phone = $("#reserve-phone").val().trim();

        if (!name || !email || !phone) {
          alert("Please fill out all fields.");
          return;
        }

        const reservation = {
          id: selectedEquipment.id,
          name,
          email,
          phone,
          reservedAt: new Date().toISOString(),
        };

        localStorage.setItem(reservationKey, JSON.stringify(reservation));
        $("#reservationForm").hide();
        $("#reservationMessage").text(
          `✅ ${selectedEquipment.name} reserved successfully. Thank you, ${name}!`
        );
      });
    }
  });

  // Modal close
  $(".close-button").on("click", function () {
    $("#equipment-modal").hide();
  });

  $(window).on("click", function (event) {
    if ($(event.target).is("#equipment-modal")) {
      $("#equipment-modal").hide();
    }
  });

  // Search filter
  $("#searchInput").on("input", function () {
    const query = $(this).val().toLowerCase();
    $(".equipment-card").each(function () {
      const name = $(this)
        .find(".equipment-card-name")
        .first()
        .text()
        .toLowerCase();
      $(this).toggle(name.includes(query));
    });
  });
});
