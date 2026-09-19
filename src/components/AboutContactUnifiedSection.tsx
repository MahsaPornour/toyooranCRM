import React, { useState } from "react";
import { AparatIcon } from "./AparatIcon";
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Send, 
  MessageCircle, 
  Linkedin,
  Building2,
  Factory,
  Map,
  Youtube,
  Tv,
  Grid
} from 'lucide-react';
import { useData } from '../context/DataContext';

export const AboutContactUnifiedSection: React.FC = () => {
  const { companyInfo } = useData();
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  
  // Clean Data Extractions
  const phones = [companyInfo.phone].filter(Boolean) || [];
  const mainPhone = phones[0] || '۰۵۱-۳۶۶۶۵۶۰۰';
  const email = companyInfo.email || 'info@pooyapoultry.com';
  const locations = companyInfo.locations || [];
  
  const hasSocials = companyInfo.socialLinks && Object.values(companyInfo.socialLinks).some(link => typeof link === 'string' && link.trim() !== '');

  const activeLocation = locations[activeLocationIndex] || null;

  return (
    <section className="relative w-full py-16 lg:py-24 bg-slate-50 overflow-hidden z-10">
      <style>{`
        .dir-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .dir-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }
        .dir-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
        }
        .dir-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.4);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Massive Dark Cinematic Card */}
        <div className="bg-[#001c3d] rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-14 relative overflow-hidden flex flex-col shadow-lg border border-white/10">
          
          {/* Ambient Background Magic */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.06)_0%,_transparent_70%)] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(0,63,134,0.2)_0%,_transparent_70%)] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          {/* TOP ROW: Manifesto & Core Contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 relative z-10">
            {/* Left: Manifesto */}
            <div className="flex flex-col justify-center">
              <span className="text-amber-400 font-semibold tracking-wider text-xs uppercase mb-4 flex items-center gap-2">
                <div className="w-5 h-px bg-amber-400/60" />
                ارتباط با ما
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.2] mb-4">
                آینده‌ی صنعت را <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  با هم بسازیم.
                </span>
              </h2>
              
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-0 font-normal max-w-md text-balance">
                تیم مهندسی طیوران صنعت پویا آماده ارائه مشاوره تخصصی در زمینه راه‌اندازی و تجهیز مدرن‌ترین سیستم‌های پرورشی است.
              </p>
            </div>

            {/* Right: Core Contacts */}
            <div className="flex flex-col gap-6 justify-center lg:pl-10">
              {/* Phone */}
              <div className="group flex items-center gap-5 cursor-pointer">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-900 group-hover:scale-110 transition-all duration-500 shadow-lg  shrink-0">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <span className="block text-[11px] sm:text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">مشاوره و فروش</span>
                  <a href={`tel:${mainPhone}`} className="block text-xl sm:text-2xl text-white font-black group-hover:text-amber-400 transition-colors drop-shadow-md" dir="ltr" style={{ textAlign: 'right' }}>{mainPhone}</a>
                </div>
              </div>
              
              {/* Social Links Row */}
              {hasSocials && (
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-500 ml-2">شبکه‌های اجتماعی:</span>
                  
                  <a 
                    href={companyInfo.socialLinks?.instagram || '#'} 
                    onClick={(e) => {
                      if (!companyInfo.socialLinks?.instagram) {
                        e.preventDefault();
                        toast('به زودی صفحه اینستاگرام ما راه‌اندازی می‌شود', { icon: '✨' });
                      }
                    }}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white hover:border-transparent hover:scale-110 hover:-rotate-12 transition-all duration-300">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a 
                    href={companyInfo.socialLinks?.telegram || '#'} 
                    onClick={(e) => {
                      if (!companyInfo.socialLinks?.telegram) {
                        e.preventDefault();
                        toast('به زودی کانال تلگرام ما راه‌اندازی می‌شود', { icon: '✨' });
                      }
                    }}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-[#0088cc] hover:text-white hover:border-transparent hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <Send className="w-4 h-4 ml-0.5" />
                  </a>
                  <a 
                    href={companyInfo.socialLinks?.aparat || '#'} 
                    onClick={(e) => {
                      if (!companyInfo.socialLinks?.aparat) {
                        e.preventDefault();
                        toast('به زودی کانال آپارات ما راه‌اندازی می‌شود', { icon: '✨' });
                      }
                    }}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-[#263238] hover:text-white hover:border-transparent hover:scale-110 hover:-rotate-12 transition-all duration-300">
                    <AparatIcon className="w-4 h-4" />
                  </a>
                  <a 
                    href={companyInfo.socialLinks?.rubika || '#'} 
                    onClick={(e) => {
                      if (!companyInfo.socialLinks?.rubika) {
                        e.preventDefault();
                        toast('به زودی کانال روبیکا ما راه‌اندازی می‌شود', { icon: '✨' });
                      }
                    }}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-gradient-to-r hover:from-[#ff7300] hover:to-[#7600b5] hover:text-white hover:border-transparent hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <Grid className="w-4 h-4" />
                  </a>
                  <a 
                    href={companyInfo.socialLinks?.youtube || '#'} 
                    onClick={(e) => {
                      if (!companyInfo.socialLinks?.youtube) {
                        e.preventDefault();
                        toast('به زودی کانال یوتیوب ما راه‌اندازی می‌شود', { icon: '✨' });
                      }
                    }}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-[#ff0000] hover:text-white hover:border-transparent hover:scale-110 hover:-rotate-12 transition-all duration-300">
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a 
                    href={companyInfo.socialLinks?.linkedin || '#'} 
                    onClick={(e) => {
                      if (!companyInfo.socialLinks?.linkedin) {
                        e.preventDefault();
                        toast('به زودی صفحه لینکدین ما راه‌اندازی می‌شود', { icon: '✨' });
                      }
                    }}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center hover:bg-[#0a66c2] hover:text-white hover:border-transparent hover:scale-110 hover:rotate-12 transition-all duration-300">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM ROW: Master-Detail Locations Directory */}
          {locations && locations.length > 0 && (
            <div className="mt-16 sm:mt-24 relative z-10">
              
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
          )}

        </div>
      </div>
    </section>
  );
};
