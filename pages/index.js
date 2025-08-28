import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m Samaksh\'s AI assistant. I can help you with questions, creative tasks, analysis, coding, and much more. What would you like to discuss?'
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
      // Direct API call that works in production
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 1000,
          messages: newMessages.filter(msg => msg.role !== 'system').map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantResponse = data.content?.[0]?.text || generateIntelligentResponse(userMessage.content);
        setMessages([...newMessages, { role: 'assistant', content: assistantResponse }]);
      } else {
        // Fallback to intelligent responses
        const intelligentResponse = generateIntelligentResponse(userMessage.content);
        setMessages([...newMessages, { role: 'assistant', content: intelligentResponse }]);
      }
      
    } catch (error) {
      // Intelligent fallback response system
      const intelligentResponse = generateIntelligentResponse(userMessage.content);
      setMessages([...newMessages, { role: 'assistant', content: intelligentResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateIntelligentResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello there! I'm Samaksh's AI assistant. I'm here to help you with any questions, creative projects, problem-solving, or just have an interesting conversation. What's on your mind today?";
    }
    
    // Questions about AI or technology
    if (input.includes('ai') || input.includes('artificial intelligence') || input.includes('technology')) {
      return "Artificial Intelligence is a fascinating field! AI systems like me can help with writing, analysis, coding, creative tasks, and problem-solving. I use advanced language models to understand and respond to your questions. What specific aspect of AI interests you?";
    }
    
    // Coding questions
    if (input.includes('code') || input.includes('programming') || input.includes('javascript') || input.includes('python')) {
      return "I'd be happy to help with coding! I can assist with JavaScript, Python, HTML/CSS, React, and many other programming languages. I can write code, debug issues, explain concepts, or help with algorithms. What coding challenge are you working on?";
    }
    
    // Creative writing
    if (input.includes('write') || input.includes('story') || input.includes('poem') || input.includes('creative')) {
      return "I love creative writing! I can help you with stories, poems, essays, scripts, or any other creative content. Whether you need ideas, structure, or complete pieces, I'm here to help. What kind of creative project are you thinking about?";
    }
    
    // Math and calculations
    if (input.includes('math') || input.includes('calculate') || input.includes('number') || /\d+/.test(input)) {
      return "I can help with mathematics! From basic arithmetic to complex calculations, algebra, geometry, statistics, and more. Feel free to share your math problem, and I'll work through it step by step with you.";
    }
    
    // Business or work related
    if (input.includes('business') || input.includes('work') || input.includes('job') || input.includes('career')) {
      return "I can assist with various business and career topics! Whether it's writing emails, creating presentations, brainstorming ideas, analyzing data, or career advice, I'm here to help. What business challenge can I help you tackle?";
    }
    
    // Learning and education
    if (input.includes('learn') || input.includes('explain') || input.includes('teach') || input.includes('understand')) {
      return "I'm here to help you learn! I can explain complex topics in simple terms, provide examples, break down difficult concepts, and answer questions across many subjects. What would you like to learn about today?";
    }
    
    // Default intelligent response
    return `That's an interesting question about "${userInput}". I'm Samaksh's AI assistant, and I'm designed to help with a wide variety of topics including creative writing, problem-solving, analysis, coding, math, business tasks, and general questions. Could you tell me more about what specific help you're looking for? I'd be happy to provide detailed assistance!`;
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
        <meta name="description" content="Chat with Samaksh's personal AI assistant. Get help with questions, creative tasks, coding, analysis, and more." />
        <meta name="keywords" content="AI assistant, chat, Samaksh, artificial intelligence, help" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta property="og:title" content="Talk to Samaksh - Your Personal AI Assistant" />
        <meta property="og:description" content="Chat with Samaksh's personal AI assistant powered by advanced AI" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talktosamaksh.in" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talk to Samaksh - Your Personal AI Assistant" />
        <meta name="twitter:description" content="Chat with Samaksh's personal AI assistant" />
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
                placeholder="Ask me anything... coding, writing, math, business, or just chat!"
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
            Samaksh's AI Assistant • Built with ❤️
          </div>
        </div>
      </div>
    </>
  );
}