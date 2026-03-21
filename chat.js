const chatMessages = [
  { role: "system", content: "You are a compassionate Christian assistant." }
];

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBox = document.getElementById("chatWindow");
  if (!input || !chatBox) return;

  const msg = input.value.trim();
  if (!msg) return;

  addMessage("You", msg);
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerHTML = "<em>Jesus AI is typing...</em>";
  chatBox.appendChild(typing);

  chatMessages.push({ role: "user", content: msg });

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
