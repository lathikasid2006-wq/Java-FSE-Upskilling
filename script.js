function showConfirmation(e) {
  e.preventDefault();
  document.getElementById('confirmation').value = "Registration successful!";
}

function validatePhone(input) {
  const phonePattern = /^[0-9]{10}$/;
  if (!phonePattern.test(input.value)) {
    alert("Enter a valid 10-digit phone number");
  }
}

function countChars(textarea) {
  document.getElementById('charCount').innerText = textarea.value.length;
}

function enlargeImage(img) {
  img.style.width = "200px";
}

function savePreference(eventType) {
  localStorage.setItem("preferredEvent", eventType);
}

window.onload = function() {
  const saved = localStorage.getItem("preferredEvent");
  if (saved) {
    document.querySelector("select[name='eventType']").value = saved;
  }
}

function clearPreferences() {
  localStorage.clear();
  sessionStorage.clear();
  alert("Preferences cleared!");
}

function findEvents() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById('location').innerText =
        `Latitude: ${pos.coords.latitude}, Longitude: ${pos.coords.longitude}`;
    },
    (err) => {
      alert("Error: " + err.message);
    },
    { enableHighAccuracy: true, timeout: 5000 }
  );
}

window.onbeforeunload = function() {
  return "Are you sure you want to leave? Unsaved form data will be lost.";
}
