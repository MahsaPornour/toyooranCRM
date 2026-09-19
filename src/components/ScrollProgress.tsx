import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const [percentage, setPercentage] = useState(0);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      setPercentage(Math.round(latest * 100));
    });
  }, [scrollYProgress]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      className="fixed bottom-6 left-6 sm:bottom-10 sm:left-10 z-[99999] flex items-center justify-center cursor-pointer group"
      onClick={scrollToTop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: percentage > 1 ? 1 : 0, y: percentage > 1 ? 0 : 20, scale: percentage > 1 ? 1 : 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      title="بازگشت به بالا"
    >
      {/* Background Glass */}
      <div className="absolute inset-0 bg-slate-900/95  rounded-full border border-white/10 shadow-2xl group-hover:shadow-amber-500/40 transition-all duration-300 group-hover:scale-110" />
      
      {/* SVG Progress Ring */}
      <svg width="64" height="64" className="transform -rotate-90 relative z-10">
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
          fill="none"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="28"
          stroke="#fbbf24"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: smoothProgress }}
          className="drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center text-amber-400 z-20">
        <motion.div
          initial={false}
          animate={{ y: percentage > 97 ? 0 : 15, opacity: percentage > 97 ? 1 : 0 }}
          className="absolute"
        >
           <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </motion.div>
        <motion.span 
          initial={false}
          animate={{ y: percentage > 97 ? -15 : 0, opacity: percentage > 97 ? 0 : 1 }}
          className="text-[12px] font-black font-mono tracking-tighter mt-0.5"
        >
          {percentage}
        </motion.span>
      </div>
    </motion.div>
  );
};
