export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Use the exact same approach as the working artifact
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: messages
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      res.status(200).json(data);
    } else {
      // If API fails, return error that will trigger client-side handling
      res.status(response.status).json(data);
    }

  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}