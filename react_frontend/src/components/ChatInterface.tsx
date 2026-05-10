import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Send, Loader2, Mic, Volume2, VolumeX, Globe } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MessageBubble, type Message } from './MessageBubble';

interface ChatInterfaceProps {
  overrideAppId?: string;
}

export function ChatInterface({ overrideAppId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoRead, setAutoRead] = useState(false);
  const [language, setLanguage] = useState('en-IN');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const autoReadRef = useRef(autoRead);
  const languageRef = useRef(language);

  useEffect(() => {
    autoReadRef.current = autoRead;
  }, [autoRead]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isListening) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = languageRef.current;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      setInput(fullTranscript);
    };
    recognition.onerror = (event: any) => {
      console.error('STT Error:', event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const scriptTag = document.querySelector('script[src*="chatbot-widget.js"]') as HTMLScriptElement;
      const baseUrl = scriptTag ? new URL(scriptTag.src).origin : 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          app_id: overrideAppId || 'homeveda_shop',
          question: userMsg.text,
          language: languageRef.current
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsTyping(false);

      const botMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [
        ...prev, 
        {
          id: botMsgId,
          text: '',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullResponse = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsgId 
                ? { ...msg, text: msg.text + chunk }
                : msg
            )
          );
        }
      }

      if (autoReadRef.current && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(fullResponse);
        utterance.lang = languageRef.current;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setIsTyping(false);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error connecting to the server. Please check the backend connection.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'between', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
          <h2 style={{ fontWeight: 600, color: '#1e293b', margin: 0 }}>AI Assistant</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
            <Globe style={{ width: '16px', height: '16px' }} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                background: 'transparent',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="en-IN">English</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
              <option value="mr-IN">मराठी (Marathi)</option>
            </select>
          </div>
          <button 
            onClick={() => {
              setAutoRead(!autoRead);
              if (autoRead) window.speechSynthesis?.cancel();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: autoRead ? '#3b82f6' : '#64748b'
            }}
          >
            {autoRead ? <Volume2 style={{ width: '20px', height: '20px' }} /> : <VolumeX style={{ width: '20px', height: '20px' }} />}
            <span className="hidden sm:inline" style={{ fontSize: '14px', fontWeight: 500 }}>{autoRead ? "Reading Aloud" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', padding: '8px' }}>
            <Loader2 style={{ width: '16px', height: '16px' }} className="animate-spin" /> AI is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '16px' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'hi-IN' ? "अपना संदेश टाइप करें..." : language === 'mr-IN' ? "तुमचा संदेश टाइप करा..." : "Type your message..."}
              style={{
                width: '100%',
                borderRadius: '9999px',
                border: '2px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                padding: '12px 48px 12px 16px',
                fontSize: '14px',
                outline: 'none',
                color: '#1e293b'
              }}
            />
            <button
              type="button"
              onClick={toggleListening}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                padding: '8px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isListening ? '#ef4444' : 'transparent',
                color: isListening ? 'white' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Mic style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: (!input.trim() || isTyping) ? '#f1f5f9' : '#2563eb',
              color: (!input.trim() || isTyping) ? '#94a3b8' : 'white',
              width: '48px',
              height: '48px',
              border: 'none',
              cursor: (!input.trim() || isTyping) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              flexShrink: 0
            }}
          >
            <Send style={{ width: '20px', height: '20px' }} />
          </button>
        </form>
      </div>
    </div>
  );
}
