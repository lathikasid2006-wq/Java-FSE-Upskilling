console.log("Welcome to the Community Portal");

window.onload = function() {
  alert("Page loaded successfully!");
  loadSavedPreference();
  loadEvents();
};

const eventName = "Music Festival";
const eventDate = "2025-07-12";
let seats = 200;

let info = `Event: ${eventName} | Date: ${eventDate} | Seats Available: ${seats}`;
console.log(info);

function Event(id, name, date, category, venue, seats, isPast) {
  this.id = id;
  this.name = name;
  this.date = date;
  this.category = category;
  this.venue = venue;
  this.seats = seats;
  this.isPast = isPast;
}

Event.prototype.checkAvailability = function() {
  if (this.isPast) return "Event already over";
  if (this.seats <= 0) return "Housefull";
  return `${this.seats} seats available`;
};

let events = [
  new Event(1, "Music Festival", "2025-07-12", "music", "City Park", 10, false),
  new Event(2, "Health Camp", "2025-07-18", "health", "Community Hall", 50, false),
  new Event(3, "Skill Workshop", "2025-07-25", "workshop", "Learning Center", 0, false),
  new Event(4, "Sports Meet", "2025-08-02", "sports", "Stadium", 30, false),
  new Event(5, "Old Cultural Night", "2024-01-10", "music", "Town Hall", 5, true)
];

events.push(new Event(6, "Workshop on Baking", "2025-08-15", "workshop", "Kitchen Studio", 20, false));

console.log("All event keys:", Object.keys(events[0]));
console.log("All event values:", Object.values(events[0]));
Object.entries(events[0]).forEach(function(entry) {
  console.log(entry[0], ":", entry[1]);
});

function makeCategoryCounter() {
  let counts = {};
  return function(category) {
    counts[category] = (counts[category] || 0) + 1;
    return counts[category];
  };
}

let trackRegistration = makeCategoryCounter();

function filterEventsByCategory(list, category) {
  if (category === "all") return list;
  return list.filter(function(e) { return e.category === category; });
}

function addEvent(id, name, date, category, venue, seats, isPast) {
  let newEvent = new Event(id, name, date, category, venue, seats, isPast);
  events.push(newEvent);
  return newEvent;
}

function registerUser(eventId) {
  try {
    let found = events.find(function(e) { return e.id === eventId; });
    if (!found) throw new Error("Event not found");
    if (found.isPast) throw new Error("Cannot register for a past event");
    if (found.seats <= 0) throw new Error("No seats available");
    found.seats--;
    let count = trackRegistration(found.category);
    console.log(`Registered for ${found.name}. Total ${found.category} registrations: ${count}`);
    renderEvents(getCurrentFilter());
  } catch (err) {
    alert(err.message);
  }
}

function cancelRegistration(eventId) {
  let found = events.find(function(e) { return e.id === eventId; });
  if (found) {
    found.seats++;
    renderEvents(getCurrentFilter());
  }
}

function getCurrentFilter() {
  return document.getElementById("categoryFilter").value || "all";
}

function renderEvents(category) {
  let list = document.getElementById("eventList");
  list.innerHTML = "";

  let [...cloned] = events;
  let filtered = filterEventsByCategory(cloned, category);

  let musicEvents = events.filter(function(e) { return e.category === "music"; });
  console.log("Music events count:", musicEvents.length);

  let displayNames = events.map(function(e) { return e.name; });
  console.log("All event names:", displayNames);

  let validEvents = filtered.filter(function(e) { return !e.isPast; });

  document.getElementById("totalCount").textContent = `Showing ${validEvents.length} event(s)`;

  validEvents.forEach(function(e) {
    if (!e.isPast) {
      let availability = e.checkAvailability();

      let card = document.createElement("div");
      card.className = "eventCard visible";
      card.setAttribute("data-id", e.id);

      let title = document.createElement("h3");
      title.textContent = e.name;

      let details = document.createElement("p");
      details.textContent = `Date: ${e.date} | Venue: ${e.venue} | ${availability}`;

      let regBtn = document.createElement("button");
      regBtn.textContent = "Register";
      regBtn.className = "cta-button";
      regBtn.setAttribute("data-id", e.id);
      if (e.seats <= 0) regBtn.disabled = true;

      let cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "cta-button";
      cancelBtn.style.marginLeft = "10px";
      cancelBtn.style.backgroundColor = "#e53935";
      cancelBtn.setAttribute("data-id", e.id);

      regBtn.addEventListener("click", function() {
        registerUser(parseInt(this.getAttribute("data-id")));
      });

      cancelBtn.addEventListener("click", function() {
        cancelRegistration(parseInt(this.getAttribute("data-id")));
      });

      card.appendChild(title);
      card.appendChild(details);
      card.appendChild(regBtn);
      card.appendChild(cancelBtn);
      list.appendChild(card);
    }
  });
}

function filterByCategory() {
  let val = document.getElementById("categoryFilter").value;
  renderEvents(val);
}

function loadEvents() {
  let spinner = document.getElementById("spinner");
  spinner.style.display = "block";

  setTimeout(function() {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=1")
      .then(function(res) {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then(function(data) {
        console.log("Mock API responded:", data);
        spinner.style.display = "none";
        renderEvents("all");
      })
      .catch(function(err) {
        console.error("Fetch failed:", err);
        spinner.style.display = "none";
        renderEvents("all");
      });
  }, 1000);
}

async function postRegistration(userData) {
  try {
    let res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    let data = await res.json();
    console.log("Registration posted:", data);
    return data;
  } catch (err) {
    console.error("POST failed:", err);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  let search = document.getElementById("searchInput");
  if (search) {
    search.addEventListener("keydown", function(e) {
      let term = e.target.value.toLowerCase();
      let cards = document.querySelectorAll(".eventCard");
      cards.forEach(function(card) {
        let title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(term) ? "block" : "none";
      });
    });
  }

  let categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterByCategory);
  }

  $("#registerBtn").click(function() {
    let name = document.getElementById("fullname").value.trim();
    let email = document.getElementById("email").value.trim();
    let eventType = document.getElementById("eventType").value;

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";

    let valid = true;

    if (!name) {
      document.getElementById("nameError").textContent = "Name is required.";
      valid = false;
    }

    if (!email) {
      document.getElementById("emailError").textContent = "Email is required.";
      valid = false;
    }

    if (!valid) return;

    let userData = { name, email, eventType };

    setTimeout(function() {
      postRegistration(userData).then(function() {
        document.getElementById("confirmOutput").textContent = `Thank you, ${name}! Registration submitted successfully.`;
        console.log("Form submitted:", userData);
      });
    }, 500);

    $("#confirmOutput").hide().fadeIn(600);
  });

  $(".eventCard").hide().fadeIn(800);
});

function validatePhone(input) {
  let phone = input.value.trim();
  if (phone.length !== 10 || isNaN(phone)) {
    alert("Please enter a valid 10-digit phone number.");
    input.focus();
  }
}

function showEventFee(select) {
  let fees = {
    music: "Music Festival - Free Entry",
    health: "Health Camp - Free Entry",
    workshop: "Skill Workshop - Rs.200",
    sports: "Sports Meet - Rs.100"
  };
  document.getElementById("feeDisplay").textContent = fees[select.value] || "";
  if (select.value) {
    localStorage.setItem("preferredEvent", select.value);
  }
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
  document.getElementById("charCount").textContent = "Characters typed: " + textarea.value.length;
}

function submitFeedback() {
  let text = document.getElementById("feedbackText").value.trim();
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
  let output = document.getElementById("locationOutput");

  if (!navigator.geolocation) {
    output.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  output.textContent = "Locating you...";

  let options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    function(position) {
      let lat = position.coords.latitude.toFixed(4);
      let lon = position.coords.longitude.toFixed(4);
      output.textContent = `Your location: Latitude ${lat}, Longitude ${lon}. Showing nearby events...`;
    },
    function(error) {
      if (error.code === error.PERMISSION_DENIED) {
        output.textContent = "Location access denied.";
      } else if (error.code === error.TIMEOUT) {
        output.textContent = "Request timed out. Please try again.";
      } else {
        output.textContent = "Unable to retrieve location.";
      }
    },
    options
  );
}

function loadSavedPreference() {
  let saved = localStorage.getItem("preferredEvent");
  if (saved) {
    let select = document.getElementById("eventType");
    if (select) select.value = saved;
    let names = { music: "Music Festival", health: "Health Camp", workshop: "Skill Workshop", sports: "Sports Meet" };
    document.getElementById("savedPref").textContent = "Saved preference: " + (names[saved] || saved);
  }
}

function clearPrefs() {
  localStorage.clear();
  sessionStorage.clear();
  document.getElementById("savedPref").textContent = "Preferences cleared.";
  let select = document.getElementById("eventType");
  if (select) select.value = "";
}

window.onbeforeunload = function() {
  let name = document.getElementById("fullname");
  let email = document.getElementById("email");
  if (name && email && (name.value.trim() || email.value.trim())) {
    return "You have unsaved registration details. Are you sure you want to leave?";
  }
};