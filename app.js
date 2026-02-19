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
async function sendChat() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const msg = input.value.toLowerCase();
  if (!msg) return;

  chatBox.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
  input.value = "";

  let reply = "God walks with you always.";

  // Encouragement topics
  if (msg.includes("fear") || msg.includes("afraid")) {
    reply = "Isaiah 41:10 — Do not fear, for I am with you.";
  }

  else if (msg.includes("hope")) {
    reply = "Romans 15:13 — May the God of hope fill you with all joy and peace.";
  }

  else if (msg.includes("anxiety") || msg.includes("worry")) {
    reply = "Philippians 4:6 — Do not be anxious about anything.";
  }

  // Prayer generator
  else if (msg.includes("pray for me") || msg.includes("prayer")) {
    reply = "Heavenly Father, please bring peace, guidance, and strength today. Amen.";
  }

  // Bible search intent
  else if (msg.includes("verse") || msg.includes("scripture")) {
    const res = await fetch("https://bible-api.com/john 3:16");
    const data = await res.json();
    reply = data.text + " — " + data.reference;
  }

  // Who is Jesus
  else if (msg.includes("who is jesus")) {
    reply = "Jesus Christ is the Son of God, Savior of the world, and the source of eternal life (John 14:6).";
  }

  chatBox.innerHTML += `<p><strong>Assistant:</strong> ${reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
