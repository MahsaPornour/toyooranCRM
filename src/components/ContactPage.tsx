import React, { useState } from "react";
import { AparatIcon } from "./AparatIcon";
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { 
  Phone, Mail, MapPin, Clock, Building2, Factory, Map,
  MessageCircle, Instagram, Linkedin, FileText, Send, Youtube, Tv, Grid
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { FreeConsultationForm } from './FreeConsultationForm';
import { InnerScrollIndicator } from './InnerScrollIndicator';

interface ContactPageProps {
  initialSubject?: string;
  initialProduct?: string;
  initialMessage?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  initialSubject,
  initialProduct,
  initialMessage
}) => {
  const { companyInfo } = useData();
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  
  const locations = companyInfo.locations || [];
  const activeLocation = locations[activeLocationIndex] || null;

  return (
    <div className="w-full min-h-screen relative overflow-hidden z-0" id="contact-page">
      <style>{`
        .dir-scrollbar::-webkit-scrollbar { width: 4px; }
        .dir-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 8px; }
        .dir-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 8px; }
        .dir-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251, 191, 36, 0.4); }
      `}</style>
      
      {/* Dynamic Vibrant Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.15)_0%,_transparent_60%)] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_60%)] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.12)_0%,_transparent_60%)] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="w-full min-h-[100dvh] flex flex-col justify-center relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          {/* Header section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-white/50 shadow-sm mb-6">
              <Phone className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">ارتباط هوشمند با طیوران صنعت پویا</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              تماس با <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">ما</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              تیم مهندسی و پشتیبانی ما آماده ارائه مشاوره رایگان، پاسخ به استعلامات و اعزام تکنسین برای پروژه‌های شما در سراسر کشور است.
            </p>
          </motion.div>
        </div>
        <InnerScrollIndicator />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 relative z-10">

        {/* Central Layout: Unified Free Consultation Form + Contact Direct Info Box */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Contact Direct Info Box (5 Cols) */}
          <div className="xl:col-span-5 space-y-4">
            <div className="bg-[#003F86] text-white rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border border-blue-400/30 shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
              {/* Inner Glows */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="font-bold text-amber-400 text-lg flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <Phone className="w-5 h-5" />
                  <span>راه‌های ارتباط مستقیم</span>
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/30 hover:bg-white/10 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 shadow-inner shadow-amber-400/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-300 block text-xs mb-1">تلفن دفتر مرکزی:</span>
                      <a href={`tel:\${companyInfo.phone}`} className="font-mono font-bold text-white text-base sm:text-lg hover:text-amber-400 transition-colors drop-shadow-md">
                        {companyInfo.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center shrink-0 shadow-inner shadow-blue-400/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-300 block text-xs mb-1">واحد فروش و استعلام:</span>
                      <a href="tel:09151126258" className="font-mono font-bold text-white text-base sm:text-lg hover:text-blue-400 transition-colors drop-shadow-md" style={{ direction: 'ltr', display: 'inline-block' }}>
                        ۰۹۱۵۱۱۲۶۲۵۸
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 text-slate-300 flex items-center justify-center shrink-0 shadow-inner shadow-white/5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-slate-300 block text-xs mb-1">ساعات پاسخگویی مهندسین:</span>
                      <span className="text-slate-200 text-sm font-medium">{companyInfo.workingHours}</span>
                    </div>
                  </div>
                </div>

                {/* Social Links inside the dark card */}
                {companyInfo.socialLinks && (
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <span className="text-slate-400 text-xs block mb-4">شبکه‌های اجتماعی:</span>
                    <div className="flex items-center gap-3">
                      <a 
                        href={companyInfo.socialLinks.instagram || '#'} 
                        onClick={(e) => {
                          if (!companyInfo.socialLinks.instagram) {
                            e.preventDefault();
                            toast('به زودی صفحه اینستاگرام ما راه‌اندازی می‌شود', { icon: '✨' });
                          }
                        }}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:border-transparent transition-all duration-300 group">
                        <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a 
                        href={companyInfo.socialLinks.telegram || '#'} 
                        onClick={(e) => {
                          if (!companyInfo.socialLinks.telegram) {
                            e.preventDefault();
                            toast('به زودی کانال تلگرام ما راه‌اندازی می‌شود', { icon: '✨' });
                          }
                        }}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0088cc] hover:border-transparent transition-all duration-300 group">
                        <Send className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform" />
                      </a>
                      <a 
                        href={companyInfo.socialLinks.aparat || '#'} 
                        onClick={(e) => {
                          if (!companyInfo.socialLinks.aparat) {
                            e.preventDefault();
                            toast('به زودی کانال آپارات ما راه‌اندازی می‌شود', { icon: '✨' });
                          }
                        }}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#263238] hover:border-transparent transition-all duration-300 group">
                        <AparatIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a 
                        href={companyInfo.socialLinks.rubika || '#'} 
                        onClick={(e) => {
                          if (!companyInfo.socialLinks.rubika) {
                            e.preventDefault();
                            toast('به زودی کانال روبیکا ما راه‌اندازی می‌شود', { icon: '✨' });
                          }
                        }}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-[#ff7300] hover:to-[#7600b5] hover:border-transparent transition-all duration-300 group">
                        <Grid className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a 
                        href={companyInfo.socialLinks.youtube || '#'} 
                        onClick={(e) => {
                          if (!companyInfo.socialLinks.youtube) {
                            e.preventDefault();
                            toast('به زودی کانال یوتیوب ما راه‌اندازی می‌شود', { icon: '✨' });
                          }
                        }}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff0000] hover:border-transparent transition-all duration-300 group">
                        <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                      <a 
                        href={companyInfo.socialLinks.linkedin || '#'} 
                        onClick={(e) => {
                          if (!companyInfo.socialLinks.linkedin) {
                            e.preventDefault();
                            toast('به زودی صفحه لینکدین ما راه‌اندازی می‌شود', { icon: '✨' });
                          }
                        }}
                        target="_blank" rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0077b5] hover:border-transparent transition-all duration-300 group">
                        <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Free Consultation Form (7 Cols) */}
          <div className="xl:col-span-7 h-full">
            <FreeConsultationForm 
              initialSubject={initialSubject}
              initialProduct={initialProduct}
              initialMessage={initialMessage}
              className="h-full shadow-lg border-slate-200 hover:shadow-xl transition-shadow"
            />
          </div>
          
        </div>

        {/* Section 2: Massive Dark Cinematic Locations Card (from unified section) */}
        <div className="bg-[#001c3d] rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.15)] border-none">
          {/* Ambient Background Magic */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_rgba(0,63,134,0.15)_0%,_transparent_70%)] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 bg-[url('/images/cubes.png')] opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-6 mb-10 opacity-60">
                <div className="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent" />
                <h3 className="text-white/80 font-bold text-lg tracking-widest uppercase">آدرس مراکز و شعب</h3>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>

              {/* Fixed-Height Container for Scalability */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[500px]">
                
                {/* 1. Left Sidebar: Scrollable List of Branches */}
                <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col  h-[350px] lg:h-full relative overflow-hidden shadow-2xl">
                   {/* Fade masks for elegant scrolling */}
                   <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-950/80 to-transparent z-10 pointer-events-none rounded-t-[2rem]" />
                   <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950/90 to-transparent z-10 pointer-events-none rounded-b-[2rem]" />
                   
                   <div className="flex-1 overflow-y-auto pl-2 pr-1 dir-scrollbar space-y-3 relative z-0 pb-6 pt-2">
                     {locations.map((loc, idx) => {
                        const isActive = idx === activeLocationIndex;
                        const isHQ = loc.type === 'headquarter';
                        const isFact = loc.type === 'factory';
                        const Icon = isHQ ? Building2 : isFact ? Factory : MapPin;

                        return (
                          <button
                            key={loc.id || idx}
                            onClick={() => setActiveLocationIndex(idx)}
                            className={`w-full text-right flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                              isActive
                                ? 'bg-white/10 border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.1)]'
                                : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                            }`}
                          >
                             <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 transition-all duration-300 shadow-inner ${
                               isActive ? 'bg-amber-400 text-slate-900 shadow-white/20' : 'bg-white/5 text-slate-400 shadow-transparent'
                             }`}>
                               <Icon className="w-5 h-5" />
                             </div>
                             <div className="flex-1 overflow-hidden">
                               <h5 className={`font-black truncate text-[13px] sm:text-sm mb-1 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-300'}`}>
                                 {loc.title || (isHQ ? 'دفتر مرکزی' : 'شعبه')}
                               </h5>
                               <p className="text-[11px] text-slate-500 truncate">{loc.address}</p>
                             </div>
                          </button>
                        )
                     })}
                   </div>
                </div>

                {/* 2. Right Detail View: Active Card */}
                <div className="lg:col-span-8 relative rounded-[2rem] overflow-hidden bg-[#002d61]/50 border border-white/10 h-[400px] lg:h-full group shadow-2xl">
                   <AnimatePresence mode="wait">
                      {activeLocation && (
                         <motion.div
                           key={activeLocationIndex}
                           initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                           animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                           exit={{ opacity: 0, scale: 1.02, filter: 'blur(5px)' }}
                           transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                           className="absolute inset-0 flex flex-col w-full h-full"
                         >
                            {/* Elegant Graphic Background instead of Map */}
                            <div className="absolute inset-0 z-0 bg-[#001c3d] overflow-hidden">
                              {/* Background Patterns */}
                              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.08)_0%,_transparent_70%)]" />
                              <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]" />
                              <div className="absolute bottom-[20%] left-[20%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[100px]" />
                              
                              {/* Central Abstract Logo / Icon Element */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <div className="w-80 h-80 border border-white/5 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                                    <div className="w-56 h-56 border border-white/10 rounded-full flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
                                       <div className="w-32 h-32 border border-amber-500/20 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(251,191,36,0.1)]">
                                          {activeLocation.type === 'headquarter' ? <Building2 className="w-12 h-12 text-amber-500/60" /> : 
                                           activeLocation.type === 'factory' ? <Factory className="w-12 h-12 text-amber-500/60" /> : 
                                           <MapPin className="w-12 h-12 text-amber-500/60" />}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              
                              {/* Soft Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-[#001c3d] via-[#001c3d]/60 to-transparent z-10" />
                            </div>
                            
                            {/* Massive Dark Gradient Overlay for Typography */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none" />

                            {/* Info Content Anchored Bottom */}
                            <div className="relative z-20 mt-auto p-6 sm:p-10 lg:p-12 flex flex-col w-full text-right pointer-events-auto">
                                <div className="flex items-center gap-3 mb-6">
                                  {/* <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-lg border  ${
                                    activeLocation.type === 'headquarter' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]' :
                                    activeLocation.type === 'factory' ? 'text-blue-300 bg-[#003F86]/30 border-[#003F86]/50 shadow-[0_0_15px_rgba(0,63,134,0.3)]' :
                                    'text-emerald-400 bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                                  }`}>
                                     {activeLocation.type === 'headquarter' ? <Building2 className="w-3.5 h-3.5"/> : activeLocation.type === 'factory' ? <Factory className="w-3.5 h-3.5"/> : <MapPin className="w-3.5 h-3.5"/>}
                                     {activeLocation.type === 'headquarter' ? 'دفتر مرکزی' : activeLocation.type === 'factory' ? 'سایت تولید' : 'شعبه / نمایندگی'}
                                  </span> */}
                                </div>

                                <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 drop-shadow-lg leading-tight">
                                  {activeLocation.title || (activeLocation.type === 'headquarter' ? 'دفتر مرکزی' : 'شعبه')}
                                </h4>

                                <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mb-8 font-medium">
                                  {activeLocation.address}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                                  {((activeLocation as any).workingHours || (activeLocation.type === 'headquarter' ? companyInfo.workingHours : null)) && (
                                    <div className="flex items-center gap-2.5 text-sm sm:text-base text-amber-400 font-bold bg-amber-500/10 px-5 py-2.5 rounded-xl border border-amber-500/20  shadow-lg">
                                      <Clock className="w-4.5 h-4.5" />
                                      <span>{(activeLocation as any).workingHours || companyInfo.workingHours}</span>
                                    </div>
                                  )}
                                </div>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                </div>

              </div>
          </div>
        </div>

      </div>
    </div>
  );
};
