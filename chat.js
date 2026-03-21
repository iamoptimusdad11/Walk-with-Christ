const chatBox = document.getElementById("chatWindow");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const chatMessages = [
  {
    role: "system",
    content: "You are a compassionate Christian assistant."
  }
];

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender === "You" ? "message user" : "message bot";
  msg.innerHTML = `<div class="bubble">${text}</div>`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage("You", userMessage);
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerHTML = "<em>Jesus AI is typing...</em>";
  chatBox.appendChild(typing);

  chatMessages.push({ role: "user", content: userMessage });

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatMessages })
    });

    const data = await res.json();
    chatBox.removeChild(typing);

    let reply = "I'm here to encourage you! 🙏";
    if (data.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    } else if (data.error) {
      reply = "Error: " + data.error;
    }

    chatMessages.push({ role: "assistant", content: reply });
    addMessage("Jesus AI", reply);
  } catch (err) {
    chatBox.removeChild(typing);
    addMessage("System", "Error connecting to AI.");
    console.error(err);
  }
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});
