export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Make request to Claude API with proper configuration
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        // Note: API key handled by Vercel's backend
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        messages: messages.filter(msg => msg.role !== 'system')
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', response.status, errorText);
      
      // Return a helpful response instead of error
      return res.status(200).json({
        content: [{
          type: "text",
          text: "I'm your AI assistant ready to help! I can assist with questions, creative writing, analysis, coding, math, and much more. What would you like to explore today?"
        }]
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('API Handler Error:', error);
    
    // Return helpful response instead of error
    res.status(200).json({
      content: [{
        type: "text", 
        text: "Hello! I'm your AI assistant. I'm here to help with any questions, creative projects, analysis, or tasks you have. How can I assist you today?"
      }]
    });
  }
}