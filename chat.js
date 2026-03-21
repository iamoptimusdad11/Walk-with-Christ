const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

let conversation = [
  {
    role: "system",
    content:
      "You are Walk with Christ, a kind, peaceful, encouraging Christian assistant. Give thoughtful, biblically respectful, compassionate answers.",
  },
];

function addMessage(text, sender) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("message", sender);
  messageEl.textContent = text;
  chatBox.appendChild(messageEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  conversation.push({ role: "user", content: message });
  userInput.value = "";

  addMessage("Thinking...", "bot");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: conversation }),
    });

    const data = await response.json();

    const thinkingMessage = chatBox.querySelector(".message.bot:last-child");
    if (thinkingMessage && thinkingMessage.textContent === "Thinking...") {
      thinkingMessage.remove();
    }

    if (!response.ok) {
      console.error("API Error:", data);
      addMessage("I'm having trouble connecting right now. Please try again later.", "bot");
      return;
    }

    const botReply = data.reply || "I’m sorry, but I couldn’t generate a response.";

    addMessage(botReply, "bot");
    conversation.push({ role: "assistant", content: botReply });
  } catch (error) {
    console.error("Fetch error:", error);

    const thinkingMessage = chatBox.querySelector(".message.bot:last-child");
    if (thinkingMessage && thinkingMessage.textContent === "Thinking...") {
      thinkingMessage.remove();
    }

    addMessage("I'm having trouble connecting right now. Please try again later.", "bot");
  }
});
