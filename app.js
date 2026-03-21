/* =====================================
   WALK WITH CHRIST — APP.JS
   ===================================== */

/* ---------- Navigation ---------- */
function showSection(id) {
  document.querySelectorAll(".section").forEach(section => {
    section.classList.add("hidden");
  });

  const activeSection = document.getElementById(id);
  if (activeSection) activeSection.classList.remove("hidden");
}

/* ---------- Dark Mode ---------- */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ---------- Verse of the Day ---------- */
async function loadVerse() {
  try {
    const res = await fetch(
      "https://beta.ourmanna.com/api/v1/get/?format=json",
      { cache: "no-store" }
    );

    const data = await res.json();
    document.getElementById("verseText").innerText =
      data?.verse?.details?.text ||
      "The Lord is my shepherd; I shall not want. — Psalm 23:1";
  } catch (error) {
    document.getElementById("verseText").innerText =
      "The Lord is my shepherd; I shall not want. — Psalm 23:1";
  }
}

/* ---------- Bible Search ---------- */
async function searchBible() {
  const input = document.getElementById("searchInput");
  const resultBox = document.getElementById("searchResult");

  if (!input || !resultBox) return;

  const query = input.value.trim();
  if (!query) {
    resultBox.innerText = "Please enter a verse like John 3:16.";
    return;
  }

  resultBox.innerText = "Searching...";

  try {
    const res = await fetch(`https://bible-api.com/${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.text) {
      resultBox.innerText = `${data.text} — ${data.reference}`;
    } else {
      resultBox.innerText = "No results found. Try 'John 3:16'.";
    }
  } catch (error) {
    resultBox.innerText = "Error retrieving scripture.";
  }
}

/* ---------- Prayer Journal ---------- */
function savePrayer() {
  const textArea = document.getElementById("prayerText");
  if (!textArea) return;

  const text = textArea.value.trim();
  if (!text) return;

  const prayers = JSON.parse(localStorage.getItem("prayers")) || [];
  prayers.push(text);
  localStorage.setItem("prayers", JSON.stringify(prayers));

  textArea.value = "";
  displayPrayers();
}

function displayPrayers() {
  const list = document.getElementById("prayerList");
  if (!list) return;

  list.innerHTML = "";
  const prayers = JSON.parse(localStorage.getItem("prayers")) || [];

  prayers.forEach(prayer => {
    const li = document.createElement("li");
    li.textContent = prayer;
    list.appendChild(li);
  });
}

/* ---------- Chat ---------- */
const chatMessages = [
  {
    role: "system",
    content:
      "You are a compassionate Christian assistant. Provide biblical, encouraging, and thoughtful guidance in a warm conversational tone."
  }
];

function addMessage(sender, text) {
  const chatBox = document.getElementById("chatWindow");
  if (!chatBox) return;

  const msg = document.createElement("div");
  msg.className = sender === "You" ? "message user" : "message bot";
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatWindow");

  if (!input || !chatBox) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("You", userMessage);
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerHTML = "<em>Jesus AI is typing...</em>";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  chatMessages.push({ role: "user", content: userMessage });

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatMessages })
    });

    const data = await response.json();
    if (typing.parentNode === chatBox) chatBox.removeChild(typing);

    const reply =
      data.reply ||
      data.choices?.[0]?.message?.content ||
      data.error ||
      "I'm here with you. How can I support you today?";

    chatMessages.push({ role: "assistant", content: reply });
    addMessage("Jesus AI", reply);
  } catch (error) {
    if (typing.parentNode === chatBox) chatBox.removeChild(typing);
    addMessage(
      "System",
      "I'm having trouble connecting right now. Please try again later."
    );
    console.error(error);
  }
}

/* ---------- INITIALIZATION ---------- */
document.addEventListener("DOMContentLoaded", () => {
  loadVerse();
  displayPrayers();
  showSection("verse");

  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("chatInput");

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (input) input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
});
