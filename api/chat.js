export default async function handler(req, res) {
  // ✅ Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // 🔐 Your OpenRouter API key stored in Vercel env variables
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // 🧠 Send request to OpenRouter (free models available)
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://walk-with-christ.vercel.app",
        "X-Title": "Walk with Christ"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // ✅ Free model
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate Christian assistant who provides biblical wisdom, encouragement, and accurate scripture references."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: "AI request failed" });
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      "I'm here with you. How can I help spiritually today?";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Failed to connect to AI." });
  }
}
