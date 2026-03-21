export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${process.env.CLOUDFLARE_MODEL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        },
        body: JSON.stringify({
          messages,
        }),
      }
    );

    const data = await response.json();

    console.log("Cloudflare status:", response.status);
    console.log("Cloudflare response:", JSON.stringify(data));

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Cloudflare API request failed",
        details: data,
      });
    }

    let reply =
      data?.result?.response ||
      data?.result?.text ||
      data?.response ||
      "I’m sorry, but I couldn’t generate a response.";

    return res.status(200).json({ reply, raw: data });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
