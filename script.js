const navbar = document.getElementById("navbar");

function openSidebar() {
  navbar.classList.add("show");
}

function closeSidebar() {
  navbar.classList.remove("show");
}

// ===========================

// --- New jQuery Code for Equipment Grid and Modal ---
$(document).ready(function () {
  let equipmentData = []; // To store the fetched equipment data

  // 1. Fetch data and display equipment grid
  $.getJSON("equipments.json", function (data) {
    equipmentData = data;
    const equipmentList = $("#equipment-list");

    // Loop through each equipment item and create a card
    $.each(equipmentData, function (index, item) {
      const equipmentCard = `
        <div class="equipment-card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name} sizes="content"">
          <div class="equipment-card-name">${item.name}</div>
        </div>
      `;
      equipmentList.append(equipmentCard);
    });
  });

  // 2. Handle click on an equipment card to open the modal
  $("#equipment-list").on("click", ".equipment-card", function () {
    const equipmentId = $(this).data("id");

    // Find the equipment item that was clicked
    const selectedEquipment = equipmentData.find(
      (item) => item.id === equipmentId
    );

    if (selectedEquipment) {
      // Populate the modal with the item's details
      const modalBody = `
        <h2>${selectedEquipment.name}</h2>
        <img src="${selectedEquipment.image}" alt="${selectedEquipment.name}">
        <p class="price">$${selectedEquipment.price.toFixed(2)}</p>
        <p>${selectedEquipment.description}</p>
        <video width="100%" controls>
          <source src="${selectedEquipment.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;
      $("#modal-body").html(modalBody);
      $("#equipment-modal").css("display", "block");
    }
  });

  // 3. Handle closing the modal
  $(".close-button").on("click", function () {
    $("#equipment-modal").css("display", "none");
  });

  // Close modal if user clicks outside of the modal content
  $(window).on("click", function (event) {
    if ($(event.target).is("#equipment-modal")) {
      $("#equipment-modal").css("display", "none");
    }
  });
});
