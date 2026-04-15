import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, Loader2 } from 'lucide-react';
import './Chatbot.css';

// Function to format bot responses with CSS styling
const formatBotResponse = (content: string) => {
  // Convert markdown-like formatting to styled HTML
  let formatted = content;
  
  // Convert headings (### Heading) and (## Heading) to styled headings
  formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h3>$1</h3>');
  
  // Convert bold text (**text**) to styled bold
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<span class="highlight">$1</span>');
  
  // Split content into lines for better processing
  const lines = formatted.split('\n');
  const processedLines: string[] = [];
  let currentList: string[] = [];
  let isOrderedList = false;
  let inList = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check for numbered list items
    if (/^\d+\.\s+/.test(trimmedLine)) {
      if (!inList) {
        inList = true;
        isOrderedList = true;
        currentList = [];
      }
      const itemText = trimmedLine.replace(/^\d+\.\s+/, '');
      currentList.push(`<li>${itemText}</li>`);
    }
    // Check for bullet points
    else if (/^-\s+/.test(trimmedLine)) {
      if (!inList) {
        inList = true;
        isOrderedList = false;
        currentList = [];
      }
      const itemText = trimmedLine.replace(/^-\s+/, '');
      currentList.push(`<li>${itemText}</li>`);
    }
    // Check for empty lines (end of list)
    else if (trimmedLine === '') {
      if (inList && currentList.length > 0) {
        const listTag = isOrderedList ? 'ol' : 'ul';
        processedLines.push(`<${listTag}>${currentList.join('')}</${listTag}>`);
        currentList = [];
        inList = false;
      }
      processedLines.push('');
    }
    // Regular text
    else {
      if (inList && currentList.length > 0) {
        const listTag = isOrderedList ? 'ol' : 'ul';
        processedLines.push(`<${listTag}>${currentList.join('')}</${listTag}>`);
        currentList = [];
        inList = false;
      }
      processedLines.push(line);
    }
  }
  
  // Handle any remaining list
  if (inList && currentList.length > 0) {
    const listTag = isOrderedList ? 'ol' : 'ul';
    processedLines.push(`<${listTag}>${currentList.join('')}</${listTag}>`);
  }
  
  formatted = processedLines.join('\n');
  
  // Convert company information to special boxes
  if (formatted.toLowerCase().includes('gstin') || formatted.toLowerCase().includes('company name')) {
    formatted = `<div class="company-info">${formatted}</div>`;
  }
  
  // Convert service information to info boxes
  if (formatted.toLowerCase().includes('services') || formatted.toLowerCase().includes('process')) {
    formatted = `<div class="info-box">${formatted}</div>`;
  }
  
  // Convert line breaks to proper spacing
  formatted = formatted.replace(/\n\n/g, '<span class="spacing"></span>');
  formatted = formatted.replace(/\n/g, '<br>');
  
  return formatted;
};

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Temporarily hardcoded to fix CORS issue - should use env var in production
      const aiApiUrl = 'https://chatbot-8jk1.onrender.com';
      console.log('AI API URL:', aiApiUrl); // Debug log to verify URL
      const response = await fetch(`${aiApiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          history: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      const botMessage: Message = { role: 'bot', content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'bot', content: 'Sorry, I am having trouble connecting. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col border border-gray-200 overflow-hidden mb-4 transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <span className="font-semibold text-sm">Nucleus Metal Cast Assistant</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-10 px-4">
                Hello! How can I help you today with information about our manufacturing services or products?
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white self-end rounded-br-none'
                    : 'bg-white text-gray-800 self-start rounded-bl-none shadow-sm border border-gray-100'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div 
                    className="chatbot-response"
                    dangerouslySetInnerHTML={{ __html: formatBotResponse(msg.content) }}
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white text-gray-800 self-start p-3 rounded-lg rounded-bl-none shadow-sm border border-gray-100">
                <Loader2 className="animate-spin" size={16} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
