export default async function handler(req, res) {
  try {
    console.log("Incoming request");

    const { message } = req.body;
    console.log("Message:", message);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
     headers: {
  "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "HTTP-Referer": "https://k-with-christ.vercel.app",
  "X-Title": "Walk With Christ",
  "Content-Type": "application/json"
},
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a Christian AI assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenRouter response:", data);

    if (!response.ok) {
      return res.status(500).json({ error: data });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Server crash:", err);
    res.status(500).json({ error: "Server crashed" });
  }
}
