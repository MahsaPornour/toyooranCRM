import React from 'react';
import { motion } from 'motion/react';

export const InnerScrollIndicator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer z-20 group"
      onClick={() => window.scrollBy({ top: window.innerHeight - 80, behavior: 'smooth' })}
    >
      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase group-hover:text-amber-500 transition-colors">
         اسکرول کنید
      </span>
      <div className="w-[2px] h-10 sm:h-12 bg-slate-200/60 relative overflow-hidden group-hover:bg-amber-100 transition-colors rounded-full">
         <motion.div 
            className="w-full h-1/2 bg-[#003F86] group-hover:bg-amber-500 absolute top-0 left-0 rounded-full"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
         />
      </div>
    </motion.div>
  );
};
