import React, { useState, useRef, useEffect } from 'react';
import { Asset, MarketEvent, ChatMessage } from '../types';
import { getAdvisoryResponse } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface AdvisoryProps {
  portfolio: Asset[];
  events: MarketEvent[];
}

const Advisory: React.FC<AdvisoryProps> = ({ portfolio, events }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello. I've analyzed your ${portfolio.length} assets. I see exposure in ${portfolio.length > 0 ? portfolio[0].exposureTags[0] : 'markets'}. How can I help?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await getAdvisoryResponse(userMsg.text, portfolio, events, messages);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Connection lost. Please check your network.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-rh-card border border-zinc-800 rounded-2xl overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rh-green flex items-center justify-center text-black">
            <Sparkles size={16} fill="black" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">UniAsset Assistant</h3>
            <p className="text-xs text-zinc-500">Online • Gemini 3.0</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[85%] px-5 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-zinc-800 text-white rounded-2xl rounded-tr-sm'
                  : 'bg-transparent text-zinc-200 pl-0'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            {msg.role === 'model' && (
               <div className="text-[10px] text-zinc-600 mt-1 pl-0 font-medium">AI ADVISOR</div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 pl-0">
             <div className="w-2 h-2 bg-rh-green rounded-full animate-pulse"></div>
             <span className="text-xs text-zinc-500 font-medium">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-black border-t border-zinc-900">
        <div className="relative flex items-center bg-zinc-900 rounded-full border border-zinc-800 focus-within:border-rh-green transition-colors">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Message..."
            className="w-full bg-transparent text-white px-5 py-3 focus:outline-none placeholder:text-zinc-600 font-medium"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2 mr-1 bg-rh-green text-black rounded-full hover:bg-green-400 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-700 mt-3 font-medium">
          AI generated content may be inaccurate.
        </p>
      </div>
    </div>
  );
};

export default Advisory;