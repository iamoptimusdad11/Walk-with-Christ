// Get elements
const chatWindow = document.getElementById("chatWindow");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// Add message to chat
function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = "chat-message";
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Send message
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  const typingMsg = document.createElement("div");
  typingMsg.className = "chat-message";
  typingMsg.innerHTML = "<strong>Jesus AI:</strong> typing...";
  chatWindow.appendChild(typingMsg);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    chatWindow.removeChild(typingMsg);

    if (data.reply) {
      addMessage("Jesus AI", data.reply);
    } else {
      addMessage("System", data.error || "No response");
      console.error("API response:", data);
    }
  } catch (err) {
    chatWindow.removeChild(typingMsg);
    addMessage("System", "Error contacting server.");
    console.error("Fetch error:", err);
  }
}

// Events
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
