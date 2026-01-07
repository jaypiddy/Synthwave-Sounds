
import React from 'react';
import { motion } from 'framer-motion';

interface WindowProps {
  title: string;
  id: string;
  isOpen?: boolean;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  zIndex: number;
  defaultPos: { x: number, y: number };
}

const Window: React.FC<WindowProps> = ({ title, id, onClose, onFocus, children, zIndex, defaultPos }) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, x: defaultPos.x, y: defaultPos.y }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onPointerDown={onFocus}
      style={{ zIndex }}
      className="absolute cyber-panel neon-border w-80 md:w-[450px] overflow-hidden"
    >
      {/* Title Bar */}
      <div className="h-8 bg-pink-500/20 border-b-2 border-pink-500 flex items-center justify-between px-2 cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 shadow-[0_0_5px_#00ffff]"></div>
          <span className="text-sm font-bold tracking-widest text-pink-100 italic">{title}</span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-5 h-5 bg-pink-500 flex items-center justify-center text-white hover:bg-pink-400"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="p-4 bg-[#0d0221]/80 max-h-[60vh] overflow-y-auto">
        {children}
      </div>
      
      {/* Decorative Corners */}
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-cyan-400"></div>
    </motion.div>
  );
};

export default Window;
