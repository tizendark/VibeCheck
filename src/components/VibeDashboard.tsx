import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface VibeDashboardProps {
  averageSentiment: number;
}

export const VibeDashboard: React.FC<VibeDashboardProps> = ({ averageSentiment }) => {
  const getStatus = () => {
    if (averageSentiment > 0.4) return { label: 'EUPHORIC', color: 'text-success', icon: TrendingUp };
    if (averageSentiment > 0.1) return { label: 'CHILL', color: 'text-secondary', icon: TrendingUp };
    if (averageSentiment < -0.4) return { label: 'CHAOTIC', color: 'text-error', icon: TrendingDown };
    if (averageSentiment < -0.1) return { label: 'TENSE', color: 'text-warning', icon: TrendingDown };
    return { label: 'NEUTRAL', color: 'text-white/60', icon: Minus };
  };

  const status = getStatus();
  const percentage = ((averageSentiment + 1) / 2) * 100;

  return (
    <div className="fixed top-12 right-12 z-50 flex flex-col items-end gap-4">
      <div className="bg-surface/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl min-w-[200px]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Global Vibe</span>
          <Activity className="w-4 h-4 text-primary animate-pulse" />
        </div>
        
        <div className="flex flex-col gap-1">
          <motion.span 
            key={status.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-3xl font-black tracking-tighter ${status.color}`}
          >
            {status.label}
          </motion.span>
          <div className="flex items-center gap-2">
            <status.icon className={`w-4 h-4 ${status.color}`} />
            <span className="text-xs font-medium text-white/40">
              Score: {averageSentiment.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: `${percentage}%` }}
            className="h-full bg-gradient-to-r from-error via-primary to-success"
          />
        </div>
      </div>
    </div>
  );
};
