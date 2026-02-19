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

let lastTopic = "";

function sendChat() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatBox");
  const msg = input.value.trim();
  if (!msg) return;

  // Display user message
  chatBox.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
  input.value = "";

  const lowerMsg = msg.toLowerCase();
  let reply = "";
  let followUp = "";

  /* ----- Topic Detection ----- */

  if (lowerMsg.includes("anxious") || lowerMsg.includes("worry")) {
    lastTopic = "anxiety";
    reply = "I'm sorry you're feeling anxious. You're not alone — God cares deeply for you.";
    followUp = "Would you like a short prayer for peace?";
  }

  else if (lowerMsg.includes("fear") || lowerMsg.includes("afraid")) {
    lastTopic = "fear";
    reply = "Fear can feel overwhelming, but God walks beside you even in the darkest moments.";
    followUp = "Would you like a comforting verse?";
  }

  else if (lowerMsg.includes("hope")) {
    lastTopic = "hope";
    reply = "Hope in Christ is steady and unshakable, even when life feels uncertain.";
    followUp = "Would you like a verse about hope?";
  }

  else if (lowerMsg.includes("pray")) {
    lastTopic = "prayer";
    reply = "It would be my honor to pray with you.";
    followUp = "What would you like to pray about?";
  }

  else if (lowerMsg.includes("who is jesus")) {
    lastTopic = "jesus";
    reply = "Jesus Christ is the Son of God, our Savior, and the perfect example of love and grace.";
    followUp = "Would you like to read a verse about His love?";
  }

  /* ----- Follow-up Responses ----- */

  else if (lowerMsg.includes("yes") && lastTopic === "anxiety") {
    reply = "Heavenly Father, please calm this heart and bring peace that surpasses understanding. Amen.";
  }

  else if (lowerMsg.includes("yes") && lastTopic === "fear") {
    reply = "Isaiah 41:10 — Do not fear, for I am with you; do not be dismayed, for I am your God.";
  }

  else if (lowerMsg.includes("yes") && lastTopic === "hope") {
    reply = "Romans 15:13 — May the God of hope fill you with all joy and peace as you trust in Him.";
  }

  else if (lastTopic === "prayer" && msg.length > 3) {
    reply = `Heavenly Father, we lift up ${msg}. Please bring comfort, guidance, and peace. Amen.`;
  }

  /* ----- Default Response ----- */

  else {
    reply = "Thank you for sharing that with me. God sees your heart and walks with you each day.";
    followUp = "Would you like a verse or a prayer?";
  }

  // Display assistant reply
  chatBox.innerHTML += `<p><strong>Assistant:</strong> ${reply}</p>`;

  // Optional follow-up
  if (followUp) {
    setTimeout(() => {
      chatBox.innerHTML += `<p><strong>Assistant:</strong> ${followUp}</p>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
