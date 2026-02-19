// chat.js

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

// Add message to chat UI
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.className = "message";
  typing.id = "typing";
  typing.innerHTML = `<em>Jesus AI is typing...</em>`;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Extract reply from OpenRouter response
function extractReply(data) {
  if (!data) return "No response from server.";

  // OpenRouter format
  if (data.choices?.[0]?.message?.content) {
    return data.choices[0].message.content;
  }

  // fallback formats
  if (typeof data.reply === "string") return data.reply;
  if (data.message) return data.message;

  return JSON.stringify(data);
}

// Send message to API
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  showTyping();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    console.log("API response:", data);

    removeTyping();

    const replyText = extractReply(data);
    addMessage("Jesus AI", replyText);

  } catch (err) {
    removeTyping();
    console.error("Fetch error:", err);
    addMessage("System", "⚠️ Unable to reach the server.");
  }
}

// Send button click
sendBtn.addEventListener("click", sendMessage);

// Press Enter to send
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
