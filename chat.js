// chat.js — Frontend chat handler for Walk with Christ

const chatWindow = document.getElementById("chatWindow");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// 🔹 Send message when button clicked
sendBtn.addEventListener("click", sendMessage);

// 🔹 Send message when pressing Enter
chatInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("You", message);
  chatInput.value = "";

  // Show typing indicator
  const typingId = appendMessage("Jesus AI", "Typing...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST", // ✅ REQUIRED
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Remove typing indicator
    removeMessage(typingId);

    if (data.reply) {
      appendMessage("Jesus AI", data.reply);
    } else {
      appendMessage("System", "No response from AI.");
    }

  } catch (error) {
    removeMessage(typingId);
    appendMessage("Error", "Failed to connect to AI.");
    console.error(error);
  }
}

// 🧱 Append message to chat window
function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  const id = "msg-" + Date.now();

  messageDiv.className = "chat-message";
  messageDiv.id = id;

  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatWindow.appendChild(messageDiv);

  // Auto scroll
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return id;
}

// ❌ Remove typing message
function removeMessage(id) {
  const msg = document.getElementById(id);
  if (msg) msg.remove();
}
