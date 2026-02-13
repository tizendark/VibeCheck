import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sentiment_score: number;
  created_at: string;
}

interface MessageFeedProps {
  messages: Message[];
}

export const MessageFeed: React.FC<MessageFeedProps> = ({ messages }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence mode="popLayout">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, scale: 0.8, y: 100, x: (Math.random() - 0.5) * 200 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: -200 - (index * 40),
              x: (Math.random() - 0.5) * 300,
              transition: { duration: 1.5, ease: "easeOut" }
            }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2"
          >
            <div 
              className="px-6 py-3 rounded-2xl backdrop-blur-md border shadow-xl max-w-xs text-center"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${0.05 + Math.abs(msg.sentiment_score) * 0.1})`,
                borderColor: msg.sentiment_score > 0.2 
                  ? 'rgba(16, 185, 129, 0.3)' 
                  : msg.sentiment_score < -0.2 
                    ? 'rgba(239, 68, 68, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                boxShadow: `0 10px 30px -10px ${
                  msg.sentiment_score > 0.2 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : msg.sentiment_score < -0.2 
                      ? 'rgba(239, 68, 68, 0.2)' 
                      : 'rgba(0, 0, 0, 0.3)'
                }`
              }}
            >
              <p className="text-white font-medium text-lg leading-tight">
                {msg.content}
              </p>
              <div className="mt-1 flex justify-center gap-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-1 h-1 rounded-full bg-white/20"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
