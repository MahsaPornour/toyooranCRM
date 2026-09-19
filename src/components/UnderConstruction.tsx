import React from 'react';
import { motion } from 'motion/react';
import { Settings, Sparkles, Clock } from 'lucide-react';

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export const UnderConstruction: React.FC<UnderConstructionProps> = ({
  title = "در حال آماده‌سازی و بارگذاری...",
  description = "ما در حال ارتقاء و تکمیل این بخش با اطلاعات جدید، تصاویر باکیفیت و امکانات پیشرفته هستیم. به زودی با تجربه کاربری کامل‌تری در خدمت شما خواهیم بود."
}) => {
  return (
    <div className="w-full min-h-[100dvh] flex flex-col justify-center relative py-16 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
      {/* Soft Animated Background Gradients specifically for this block */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[80%] bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-16 md:p-20 border border-white/80 shadow-2xl shadow-blue-900/10 text-center relative overflow-hidden"
        >
          {/* Inner Light Effect */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Floating Icons */}
          <div className="relative w-32 h-32 mx-auto mb-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center text-slate-200/60"
            >
              <Settings className="w-full h-full stroke-[0.5]" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#003F86] to-blue-600 rounded-[1.5rem] shadow-xl shadow-blue-900/20 flex items-center justify-center transform rotate-12 relative overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] opacity-0 hover:opacity-100 transition-opacity" />
                 <Clock className="w-10 h-10 text-white -rotate-12" />
              </div>
            </div>
            
            {/* Sparkles */}
            <motion.div 
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-4 text-amber-500"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </div>

          {/* Typography */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-6 drop-shadow-sm leading-tight">
            {title}
          </h3>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            {description}
          </p>

          {/* Elegant Status Bar */}
          <div className="max-w-md mx-auto relative">
             <div className="w-full h-3 bg-slate-200/50 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
                <motion.div 
                  initial={{ width: "0%" }}
                  whileInView={{ width: "65%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-400 via-[#003F86] to-amber-400 relative"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                </motion.div>
             </div>
             <div className="flex justify-between items-center mt-4 px-2">
                <span className="text-xs sm:text-sm font-bold text-slate-500">در حال توسعه زیرساخت و طراحی</span>
                <span className="text-sm font-black text-amber-600">۶۵٪</span>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
