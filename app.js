/* ===============================
   WALK WITH CHRIST — FULL APP.JS
   =============================== */

/* ---------- Navigation ---------- */
function showSection(id) {
  document.querySelectorAll("section").forEach(section => {
    section.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

/* ---------- Verse of the Day ---------- */
async function loadVerse() {
  try {
    const res = await fetch("https://bible-api.com/psalms 23:1");
    const data = await res.json();
    document.getElementById("verseText").innerText =
      data.text + " — " + data.reference;
  } catch {
    document.getElementById("verseText").innerText =
      "The Lord is my shepherd; I shall not want. — Psalm 23:1";
  }
}
loadVerse();

/* ---------- Bible Search ---------- */
async function searchBible() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  const resultBox = document.getElementById("searchResult");
  resultBox.innerText = "Searching...";

  try {
    const res = await fetch(`https://bible-api.com/${query}`);
    const data = await res.json();

    if (data.text) {
      resultBox.innerText = data.text + " — " + data.reference;
    } else {
      resultBox.innerText = "No results found. Try 'John 3:16'.";
    }
  } catch {
    resultBox.innerText = "Error retrieving scripture.";
  }
}

/* ---------- Prayer Journal ---------- */
function savePrayer() {
  const text = document.getElementById("prayerText").value.trim();
  if (!text) return;

  const prayers = JSON.parse(localStorage.getItem("prayers")) || [];
  prayers.push(text);
  localStorage.setItem("prayers", JSON.stringify(prayers));

  document.getElementById("prayerText").value = "";
  displayPrayers();
}

function displayPrayers() {
  const list = document.getElementById("prayerList");
  list.innerHTML = "";

  const prayers = JSON.parse(localStorage.getItem("prayers")) || [];

  prayers.forEach(prayer => {
    const li = document.createElement("li");
    li.textContent = prayer;
    list.appendChild(li);
  });
}

displayPrayers();

/* ---------- Dark Mode ---------- */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

/* ---------- Conversational Christian Chat ---------- */

const messages = [
  {
    role: "system",
    content: "You are a compassionate Christian assistant who gives biblical, encouraging, and thoughtful guidance. Always respond conversationally and warmly."
  }
];

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Show user message
  chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  input.value = "";

  messages.push({ role: "user", content: userMessage });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_API_KEY_HERE",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: messages
    })
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  messages.push({ role: "assistant", content: reply });

  chatBox.innerHTML += `<p><strong>Walk with Christ:</strong> ${reply}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
