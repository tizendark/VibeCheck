import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MeshBackgroundProps {
  sentiment: number; // -1 to 1
}

export const MeshBackground: React.FC<MeshBackgroundProps> = ({ sentiment }) => {
  // Interpolamos colores basados en el sentimiento
  // -1 (Negativo): Rojos/Naranjas oscuros
  // 0 (Neutral): Grises/Violetas profundos
  // 1 (Positivo): Azules/Verdes/Cianes brillantes
  
  const colors = useMemo(() => {
    if (sentiment > 0.2) {
      return ['#0ea5e9', '#10b981', '#8b5cf6']; // Vibe Positiva
    } else if (sentiment < -0.2) {
      return ['#ef4444', '#f59e0b', '#7f1d1d']; // Vibe Tensa/Caótica
    }
    return ['#4f46e5', '#9333ea', '#1e1b4b']; // Vibe Neutral/Default
  }, [sentiment]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
      {/* Capa de ruido para textura */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={colors.join(',')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          {/* Orbe Principal */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full blur-[120px] opacity-20"
            style={{ backgroundColor: colors[0] }}
          />

          {/* Orbe Secundario */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -50, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20"
            style={{ backgroundColor: colors[1] }}
          />

          {/* Orbe de Acento */}
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full blur-[150px]"
            style={{ backgroundColor: colors[2] }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay de viñeta para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/80" />
    </div>
  );
};
