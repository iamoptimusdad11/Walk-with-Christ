const chatBox = document.getElementById("chatWindow");
const input = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

function addMessage(sender, text) {
  const msg = document.createElement("div");
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

  const typing = document.createElement("div");
  typing.innerHTML = "<em>Jesus AI is typing...</em>";
  chatBox.appendChild(typing);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    chatBox.removeChild(typing);

    // ✅ Handle OpenRouter response structure
    const reply =
      data.reply ||
      data.choices?.[0]?.message?.content ||
      data.error ||
      "No response";

    addMessage("Jesus AI", reply);
  } catch (err) {
    chatBox.removeChild(typing);
    addMessage("System", "Error contacting AI.");
    console.error(err);
  }
}
