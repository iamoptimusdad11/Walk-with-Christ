export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful Christian assistant who answers using the Bible and Christian teachings.",
            },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    res.status(200).json({
      reply: data.result.response,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI error" });
  }
}
