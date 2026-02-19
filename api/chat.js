export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://walk-with-christ.vercel.app",
        "X-Title": "Walk With Christ AI"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a Christian assistant who answers using the Bible and Christian teachings."
          },
          { role: "user", content: message }
        ]
      }),
    });

    const data = await response.json();

    // ✅ Extract the actual AI message
    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I could not respond.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error." });
  }
}
