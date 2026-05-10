import { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { MessageCircle, X } from 'lucide-react';

export function WidgetWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [appId, setAppId] = useState('demo_app_1');

  useEffect(() => {
    // Look for data-app-id on the script tag or a global config
    const scriptTag = document.querySelector('script[data-app-id]');
    if (scriptTag) {
      const id = scriptTag.getAttribute('data-app-id');
      if (id) setAppId(id);
    }
  }, []);

  return (
    <div 
      className="chatbot-widget-container" 
      style={{
        position: 'fixed',
        bottom: '0',
        right: '0',
        width: 'auto',
        height: 'auto',
        zIndex: 2147483647, // Max z-index to stay on top of everything
        pointerEvents: 'none', // Allow clicks to pass through to main app
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        padding: '20px'
      }}
    >
      <span style={{ position: 'absolute', opacity: 0 }}>Chatbot Active</span>
      {/* Interactive elements must re-enable pointer events */}
      <div style={{ pointerEvents: 'auto' }}>
        {/* Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '65px',
            height: '65px',
            borderRadius: '32px',
            backgroundColor: '#15b19f', // Homeveda Primary Teal
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(21, 177, 159, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            marginLeft: 'auto',
            position: 'relative',
            zIndex: 2147483647
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
        >
          {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div style={{
            position: 'absolute',
            bottom: '90px',
            right: '20px',
            width: '400px',
            height: '600px',
            maxWidth: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatbot-slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <ChatInterface overrideAppId={appId} />
            
            <style>{`
              @keyframes chatbot-slideUp {
                from { opacity: 0; transform: translateY(30px) scale(0.95); transform-origin: bottom right; }
                to { opacity: 1; transform: translateY(0) scale(1); transform-origin: bottom right; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
