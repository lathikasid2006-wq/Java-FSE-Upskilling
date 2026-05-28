 function validatePhone(input) {
  var phone = input.value.trim();
  if (phone.length !== 10 || isNaN(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    input.focus();
  }
}
function showEventFee(select) {
  var fees = {
    music: "Music Festival - Free Entry",
    health: "Health Camp - Free Entry",
    workshop: "Skill Workshop - Registration Fee: Rs.200",
    sports: "Sports Meet - Registration Fee: Rs.100"
  };
  var display = document.getElementById("feeDisplay");
  display.textContent = fees[select.value] || "";

  if (select.value) {
    localStorage.setItem("preferredEvent", select.value);
  }
}

function submitForm() {
  var name = document.getElementById("fullname").value.trim();
  var email = document.getElementById("email").value.trim();
  var eventType = document.getElementById("eventType").value;

  if (!name || !email || !eventType) {
    alert("Please fill in all required fields.");
    return;
  }

  var output = document.getElementById("confirmOutput");
  output.textContent = "Thank you, " + name + "! You have successfully registered for the event.";
}

function enlargeImage(img) {
  if (img.style.width === "400px") {
    img.style.width = "200px";
    img.style.height = "150px";
  } else {
    img.style.width = "400px";
    img.style.height = "300px";
  }
}

function countChars(textarea) {
  var count = textarea.value.length;
  document.getElementById("charCount").textContent = "Characters typed: " + count;
}

function submitFeedback() {
  var text = document.getElementById("feedbackText").value.trim();
  if (!text) {
    alert("Please write your feedback before submitting.");
    return;
  }
  alert("Thank you for your feedback!");
  document.getElementById("feedbackText").value = "";
  document.getElementById("charCount").textContent = "Characters typed: 0";
}

function videoReady() {
  document.getElementById("videoMsg").textContent = "Video ready to play!";
}

function findLocation() {
  var output = document.getElementById("locationOutput");

  if (!navigator.geolocation) {
    output.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  output.textContent = "Locating you...";

  var options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    function(position) {
      var lat = position.coords.latitude.toFixed(4);
      var lon = position.coords.longitude.toFixed(4);
      output.textContent = "Your location: Latitude " + lat + ", Longitude " + lon + ". Showing nearby events...";
    },
    function(error) {
      if (error.code === error.PERMISSION_DENIED) {
        output.textContent = "Location access denied. Please allow location to find nearby events.";
      } else if (error.code === error.TIMEOUT) {
        output.textContent = "Request timed out. Please try again.";
      } else {
        output.textContent = "Unable to retrieve location. Please try again.";
      }
    },
    options
  );
}

window.onload = function() {
  var saved = localStorage.getItem("preferredEvent");
  if (saved) {
    var select = document.getElementById("eventType");
    select.value = saved;

    var names = {
      music: "Music Festival",
      health: "Health Camp",
      workshop: "Skill Workshop",
      sports: "Sports Meet"
    };

    document.getElementById("savedPref").textContent = "Saved preference loaded: " + (names[saved] || saved);
  }
};

function clearPrefs() {
  localStorage.clear();
  sessionStorage.clear();
  document.getElementById("savedPref").textContent = "Preferences cleared.";
  document.getElementById("eventType").value = "";
}

window.onbeforeunload = function() {
  var name = document.getElementById("fullname").value.trim();
  var email = document.getElementById("email").value.trim();
  if (name || email) {
    return "You have unsaved registration details. Are you sure you want to leave?";
  }
};