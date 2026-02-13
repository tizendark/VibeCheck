import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import { analyzeSentiment } from './lib/sentiment';
import { MeshBackground } from './components/MeshBackground';
import { VibeDashboard } from './components/VibeDashboard';
import { MessageFeed } from './components/MessageFeed';

interface Message {
  id: string;
  content: string;
  sentiment_score: number;
  created_at: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [avgSentiment, setAvgSentiment] = useState(0);

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Realtime subscription fix
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public', // Important: specify schema
          table: 'messages'
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => {
            const updated = [newMessage, ...prev];
            return updated.slice(0, 20); // Keep only last 20 for feed
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Calculate rolling average of last 15 messages whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;

    // Take only the last 15 messages for calculation
    const recentMessages = messages.slice(0, 15);
    const sum = recentMessages.reduce((acc, m) => acc + m.sentiment_score, 0);
    const average = sum / recentMessages.length;

    setAvgSentiment(average);
    document.title = `Vibe: ${average.toFixed(2)}`; // Debug helper
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    try {
      // 1. Analyze sentiment first
      const sentiment = await analyzeSentiment(input);

      // 2. Insert into Supabase
      const { error } = await supabase
        .from('messages')
        .insert([{
          content: input,
          sentiment_score: sentiment
        }]);

      if (error) throw error;
      setInput('');
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center font-sans selection:bg-primary/30">
      <MeshBackground sentiment={avgSentiment} />
      <VibeDashboard averageSentiment={avgSentiment} />

      <MessageFeed messages={messages} />

      {/* Header */}
      <header className="fixed top-12 left-12 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            VibeCheck <span className="text-white/40 font-light">Arena</span>
          </h1>
        </div>
      </header>

      {/* Input Area */}
      <div className="fixed bottom-12 w-full max-w-2xl px-6 z-50">
        <form
          onSubmit={handleSubmit}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
          <div className="relative flex items-center bg-surface/40 backdrop-blur-2xl border border-white/10 rounded-[1.8rem] p-2 pl-6 shadow-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Suelta tu vibe de forma anónima..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 py-4 text-lg"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-4 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSending ? (
                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-white/20 text-xs tracking-widest uppercase">
          Encriptado & Anónimo • Powered by OpenRouter AI
        </p>
      </div>

      {/* Empty State Hint */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/10 text-4xl font-bold tracking-tighter text-center px-10"
        >
          EL ARENA ESTÁ EN SILENCIO.<br />SÉ EL PRIMERO EN ROMPERLO.
        </motion.div>
      )}
    </div>
  );
}

export default App;
