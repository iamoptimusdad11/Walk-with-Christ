const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(sender, text) {
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("You", message);
  input.value = "";

  // Show typing indicator
  const typingMsg = document.createElement("p");
  typingMsg.innerHTML = "<strong>Jesus AI:</strong> Typing...";
  chatBox.appendChild(typingMsg);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    chatBox.removeChild(typingMsg);

    if (data.reply) {
      addMessage("Jesus AI", data.reply);
    } else {
      addMessage("System", "No response from AI.");
      console.error("API response:", data);
    }
  } catch (err) {
    chatBox.removeChild(typingMsg);
    addMessage("System", "Error contacting AI.");
    console.error("Fetch error:", err);
  }
}
