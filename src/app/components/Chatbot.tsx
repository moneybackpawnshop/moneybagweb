import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatbotProps {
  language: 'en' | 'th';
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot({ language }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const t = {
    en: {
      title: 'Chat Assistant',
      placeholder: 'Type your message...',
      send: 'Send',
      welcome: 'Hello! How can I help you with your pawn shop needs today?',
    },
    th: {
      title: 'แชทบอท',
      placeholder: 'พิมพ์ข้อความของคุณ...',
      send: 'ส่ง',
      welcome: 'สวัสดี! เราจะช่วยคุณเรื่องการจำนำได้อย่างไร?',
    },
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Integrate with n8n webhook for AI responses
    try {
      // NOTE: Replace with your actual n8n webhook URL
      // You can set this in environment variable: process.env.VITE_N8N_WEBHOOK_URL
      const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || '';
      
      if (n8nWebhookUrl) {
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            language: language,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: data.response || data.message || (language === 'en'
              ? "Thank you for your message. Our team will assist you shortly."
              : "ขอบคุณสำหรับข้อความของคุณ ทีมงานจะช่วยเหลือคุณในไม่ช้า"),
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          throw new Error('Webhook failed');
        }
      } else {
        // Fallback to mock response if no webhook configured
        setTimeout(() => {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text:
              language === 'en'
                ? "Thank you for your message. Our team will assist you shortly. For immediate help, please scroll through our KYC, Evaluation, and other sections above."
                : "ขอบคุณสำหรับข้อความของคุณ ทีมงานจะช่วยเหลือคุณในไม่ช้า สำหรับความช่วยเหลือทันที กรุณาดูส่วน KYC, ประเมินราคา และส่วนอื่นๆ ด้านบน",
            sender: 'bot',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
        }, 1000);
      }
    } catch (error) {
      // Fallback to mock response on error
      console.error('n8n webhook error:', error);
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text:
            language === 'en'
              ? "Thank you for your message. Our team will assist you shortly. For immediate help, please scroll through our KYC, Evaluation, and other sections above."
              : "ขอบคุณสำหรับข้อความของคุณ ทีมงานจะช่วยเหลือคุณในไม่ช้า สำหรับความช่วยเหลือทันที กรุณาดูส่วน KYC, ประเมินราคา และส่วนอื่นๆ ด้านบน",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) {
              setMessages([
                {
                  id: '0',
                  text: t[language].welcome,
                  sender: 'bot',
                  timestamp: new Date(),
                },
              ]);
            }
          }}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#10B981] hover:bg-[#059669] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-[#10B981]">
          {/* Header */}
          <div className="bg-[#10B981] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6" />
              <span className="font-bold font-['Montserrat']">{t[language].title}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-[#10B981] text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm font-['Inter']">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t[language].placeholder}
                className="flex-1 font-['Inter']"
              />
              <Button
                onClick={handleSend}
                className="bg-[#10B981] hover:bg-[#059669] text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}