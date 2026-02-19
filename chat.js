// Walk with Christ - Conversational Christian AI Chat

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Auto-scroll to bottom
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Add message to chat
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  msg.innerHTML = `
    <div class="bubble">
      ${text}
    </div>
  `;

  chatBox.appendChild(msg);
  scrollToBottom();
}

// Typing indicator
function showTyping() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot");
  typing.id = "typing-indicator";
  typing.innerHTML = `
    <div class="bubble typing">
      Walk with Christ is typing...
    </div>
  `;
  chatBox.appendChild(typing);
  scrollToBottom();
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// Send message to server
async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  input.value = "";
  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    removeTyping();

    if (data.reply) {
      addMessage(data.reply, "bot");
    } else {
      addMessage("I'm here with you. Let's keep walking in faith together. ✝️", "bot");
    }

  } catch (error) {
    removeTyping();
    addMessage("Something went wrong. Please try again.", "bot");
    console.error(error);
  }
}

// Enter key support
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// Button click
sendBtn.addEventListener("click", sendMessage);

// Welcome message
window.onload = () => {
  addMessage(
    "Hello, I'm here to walk with you in faith. How can I encourage you today? ✝️",
    "bot"
  );
};
