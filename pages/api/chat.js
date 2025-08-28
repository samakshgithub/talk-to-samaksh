export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    // Simple mock response for now to test deployment
    const mockResponse = {
      content: [
        {
          type: "text",
          text: "Hello! I'm your AI assistant. I can help you with questions, creative tasks, analysis, coding, and much more. What would you like to discuss today?"
        }
      ]
    };

    // Add a small delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.status(200).json(mockResponse);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response',
      details: error.message 
    });
  }
}