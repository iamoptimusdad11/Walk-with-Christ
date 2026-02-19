export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://walk-with-christ.vercel.app", // REQUIRED
        "X-Title": "Walk With Christ AI" // REQUIRED
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a Christian assistant who answers using the Bible."
          },
          { role: "user", content: message }
        ]
      }),
    });

    const data = await response.json();

    console.log("OpenRouter raw response:", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "API error",
        error: data
      });
    }

    const reply = data.choices?.[0]?.message?.content || "No AI response.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ reply: "Server error." });
  }
}
