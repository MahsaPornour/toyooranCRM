import React from 'react';
import { motion } from 'motion/react';
import { FlaskConical } from 'lucide-react';
import { InnerScrollIndicator } from './InnerScrollIndicator';
import { UnderConstruction } from './UnderConstruction';

export const RnDPage: React.FC = () => {
  return (
    <div className="bg-blueprint-light min-h-screen">
      {/* Background patterns similar to other pages */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.15)_0%,_transparent_60%)]" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_60%)]" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[30%] right-[30%] w-[40vw] h-[40vw] bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.12)_0%,_transparent_60%)]" style={{ animationDuration: '12s' }} />
      </div>

      <div className="w-full min-h-[100dvh] flex flex-col justify-center relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-white/50 shadow-sm mb-6">
              <FlaskConical className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">آینده صنعت مرغداری</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              واحد <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">تحقیق و توسعه</span> طیوران صنعت پویا
            </h2>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              طراحی، بومی‌سازی و ارتقاء تکنولوژی‌های نوین در تجهیزات مرغداری و کارخانجات خوراک با تکیه بر دانش متخصصین داخلی و آخرین دستاوردهای علمی جهان.
            </p>
          </motion.div>
          
        </div>
        <InnerScrollIndicator />
      </div>

      <div className="w-full relative z-10">
        <UnderConstruction 
          title="دپارتمان تحقیق و توسعه در حال تجهیز است" 
          description="ما در حال گردآوری و طراحی بخش‌های مربوط به دستاوردهای علمی، اختراعات ثبت شده و پروژه‌های مشترک با دانشگاه‌ها هستیم. این بخش به زودی در دسترس متخصصین قرار خواهد گرفت."
        />
      </div>
    </div>
  );
};
