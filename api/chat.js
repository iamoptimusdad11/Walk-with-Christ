export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct", // Free & smart
        messages: [
          {
            role: "system",
            content: `
You are "Walk with Christ", a compassionate Christian AI assistant.

Your purpose:
- Encourage faith and spiritual growth
- Explain Bible verses simply
- Offer prayers when requested
- Provide hope, kindness, and biblical wisdom
- Never judge or condemn

When appropriate:
- Include short Bible verses
- Speak warmly and conversationally
- Keep responses concise but meaningful
`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    });

    const data = await aiResponse.json();

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm here with you. Let's continue walking in faith together. ✝️";

    res.status(200).json({ reply });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      reply: "Something went wrong, but God’s love never fails. Please try again."
    });
  }
}
