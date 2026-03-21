import express from "express";
import fetch from "node-fetch"; // or global fetch

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    if (!messages) return res.status(400).json({ error: "No messages sent" });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages
      })
    });

    const data = await response.json();
    res.json(data); // send raw response to frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Chat API running on port 3000"));
