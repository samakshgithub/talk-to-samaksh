import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage = { role: 'user', content: input.trim() };
  const newMessages = [...messages, userMessage];
  
  setMessages(newMessages);
  setInput('');
  setIsLoading(true);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: newMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.content?.[0]?.text || "I'm here to help! What would you like to know?";

    setMessages([...newMessages, { role: 'assistant', content: assistantResponse }]);
    
  } catch (error) {
    console.error('Chat Error:', error);
    
    let errorMessage = "I'm your AI assistant! I can help with questions, creative writing, problem-solving, coding, analysis, and much more. What would you like to explore?";
    
    if (error.name === 'AbortError') {
      errorMessage = "The request took too long. Let me try again - what can I help you with?";
    }
    
    setMessages([...newMessages, { 
      role: 'assistant', 
      content: errorMessage
    }]);
  } finally {
    setIsLoading(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Head>
        <title>Talk to Samaksh - Your Personal AI Assistant</title>
        <meta name="description" content="Chat with Samaksh, your personal AI assistant powered by Claude AI. Get help with questions, creative tasks, and more." />
        <meta name="keywords" content="AI assistant, chat, Claude AI, Samaksh, artificial intelligence" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta property="og:title" content="Talk to Samaksh - Your Personal AI Assistant" />
        <meta property="og:description" content="Chat with Samaksh, your personal AI assistant powered by Claude AI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talktosamaksh.in" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talk to Samaksh - Your Personal AI Assistant" />
        <meta name="twitter:description" content="Chat with Samaksh, your personal AI assistant powered by Claude AI" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center space-x-3">
              <Bot className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Talk to Samaksh</h1>
                <p className="text-blue-100">Your Personal AI Assistant</p>
              </div>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-white text-gray-800 shadow-md'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-md">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex space-x-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here... (Press Enter to send)"
                className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-center text-sm text-gray-500">
            Powered by Claude AI • Built with ❤️
          </div>
        </div>
      </div>
    </>
  );
}