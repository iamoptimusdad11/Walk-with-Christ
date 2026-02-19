// Navigation
function showSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Verse of the Day
fetch("https://bible-api.com/psalms 23:1")
  .then(res => res.json())
  .then(data => {
    document.getElementById("verseText").innerText =
      data.text + " — " + data.reference;
  });

// Bible Search
function searchBible() {
  const query = document.getElementById("searchInput").value;
  fetch(`https://bible-api.com/${query}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("searchResult").innerText =
        data.text || "No results found.";
    });
}

// Prayer Journal
function savePrayer() {
  const text = document.getElementById("prayerText").value;
  if (!text) return;

  let prayers = JSON.parse(localStorage.getItem("prayers")) || [];
  prayers.push(text);
  localStorage.setItem("prayers", JSON.stringify(prayers));
  displayPrayers();
}

function displayPrayers() {
  const list = document.getElementById("prayerList");
  list.innerHTML = "";
  let prayers = JSON.parse(localStorage.getItem("prayers")) || [];

  prayers.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    list.appendChild(li);
  });
}

displayPrayers();

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Simple Christian Chatbot (local responses)
function sendChat() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");

  const userMsg = input.value;
  if (!userMsg) return;

  const userDiv = document.createElement("p");
  userDiv.textContent = "You: " + userMsg;
  chatBox.appendChild(userDiv);

  const botDiv = document.createElement("p");

  if (userMsg.toLowerCase().includes("hope")) {
    botDiv.textContent = "Christ is our living hope. — 1 Peter 1:3";
  } else if (userMsg.toLowerCase().includes("fear")) {
    botDiv.textContent = "Do not fear, for I am with you. — Isaiah 41:10";
  } else {
    botDiv.textContent = "Keep faith. God walks with you always.";
  }

  chatBox.appendChild(botDiv);
  input.value = "";
}
