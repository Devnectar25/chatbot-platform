// No React import needed
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "flex max-w-[85%] gap-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm",
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        )}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className={cn(
          "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
          isUser 
            ? "bg-blue-600 text-white rounded-tr-sm" 
            : "bg-white text-gray-800 border border-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 rounded-tl-sm"
        )}>
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.text.split(/(IMAGE_URL: https?:\/\/[^\s]+|PRICE: [^\n]+|https?:\/\/[^\s]+)/g).map((part, i) => {
              if (part.startsWith('IMAGE_URL:')) {
                const url = part.replace('IMAGE_URL:', '').trim();
                return (
                  <img 
                    key={i} 
                    src={url} 
                    alt="Product" 
                    className="max-w-full rounded-lg my-2 border border-black/5 dark:border-white/10 shadow-sm" 
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                );
              }
              if (part.startsWith('PRICE:')) {
                const price = part.replace('PRICE:', '').trim();
                return <div key={i} className="font-bold text-lg text-blue-600 dark:text-blue-400 mt-1">Price: {price}</div>;
              }
              if (part.match(/https?:\/\/[^\s]+/)) {
                const isImage = part.match(/\.(jpeg|jpg|gif|png|webp)/i) || part.includes('supabase.co/storage');
                if (isImage) {
                  return (
                    <img 
                      key={i} 
                      src={part} 
                      alt="Embedded Content" 
                      className="max-w-full rounded-lg my-2 border border-black/5 dark:border-white/10 shadow-sm" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  );
                }
                return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline break-all">{part}</a>;
              }
              return part;
            })}
          </div>
          <div className={cn(
            "text-[10px] mt-1 text-right font-medium",
            isUser ? "text-blue-200" : "text-gray-400"
          )}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
