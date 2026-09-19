import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { LazyImage } from "./LazyImage";
import { LazyHeroImage } from './LazyHeroImage';
const heroPoultryImg = '/images/poultry-1.jpg';
import { 
  ChevronLeft, 
  ChevronDown,
  Building2, 
  Factory,
  Fan,
  Pill,
  ShieldCheck,
  ArrowDown,
  PhoneCall,
  Package,
  Award,
  CheckCircle2,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import { PageSection, ProductCategory } from '../types';

interface HeroProps {
  cmsHero?: import('../types').HeroCms;
  onNavigate: (section: PageSection) => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
  onOpenAiAssistant?: () => void;
  children?: React.ReactNode;
}

export interface CircleCategoryCard {
  id: ProductCategory;
  title: string;
  categoryEn: string;
  icon: React.ElementType;
  desc: string;
  badge: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  specs: string[];
  bgImage?: string;
}



// --- EXCLUSIVE 3D CARD COMPONENTS --- //

const ThematicParticles = ({ id, isHovered }: { id: string, isHovered: boolean }) => {
  if (!isHovered) return null;
  
  // Generating stable random positions for particles
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1,
  }));

  if (id === 'heating') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: -50 }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
            className="absolute w-1 h-1 bg-amber-400 rounded-full"
            style={{ left: `${p.left}%`, top: `${p.top}%`, boxShadow: '0 0 10px #fbbf24' }}
          />
        ))}
      </div>
    );
  }

  if (id === 'ventilation') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: [0, 0.5, 0], x: 50 }}
            transition={{ duration: p.duration * 0.8, delay: p.delay, repeat: Infinity, ease: "linear" }}
            className="absolute h-px bg-blue-300/40 w-12"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          />
        ))}
      </div>
    );
  }

  if (id === 'cooling') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.3, 0], scale: [0, 1, 0] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity }}
            className="absolute w-2 h-2 border border-emerald-400/70"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          />
        ))}
      </div>
    );
  }

  if (id === 'other') {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.6, 0], y: -30 }}
            transition={{ duration: p.duration * 1.5, delay: p.delay, repeat: Infinity }}
            className="absolute w-2 h-2 rounded-full border border-rose-400/40"
            style={{ left: `${p.left}%`, top: `${p.top}%` }}
          />
        ))}
      </div>
    );
  }

  return null;
}


export const ServiceCard: React.FC<{ card: any, idx: number, onClick: () => void }> = ({ card, idx, onClick }) => {
  const Icon = card.icon;
  return (
    <div
      onClick={onClick}
      className="relative group w-full h-[380px] sm:h-[420px] rounded-[2.5rem] overflow-hidden bg-[#001c3d] border border-blue-800/60 hover:border-blue-500/50 transition-colors duration-500 cursor-pointer shadow-2xl transform-gpu will-change-transform"
    >
      {/* 🌟 NEW HOVER EFFECT (Replaced the Flashlight/Conic Gradient) 🌟 */}
      {/* Soft animated neon glow around the card instead of flashlight */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none " />
      <div className="absolute -inset-[2px] rounded-[calc(2.5rem+2px)] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100  transition-all duration-700 -z-10" />

      {/* Inner Card Surface */}
      <div className="absolute inset-[2px] rounded-[calc(2.5rem-2px)] bg-[#001c3d] z-10 overflow-hidden flex flex-col p-6 sm:p-8">
        
        {/* Background Image */}
        {card.bgImage && (
          <div className="absolute inset-0 z-0 opacity-60 group-hover:opacity-85 transition-opacity duration-700 pointer-events-none">
            <LazyImage src={card.bgImage} className="w-full h-full" imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001c3d]/30 via-[#001c3d]/60 to-[#001c3d]/90 z-0 pointer-events-none" />

        {/* Ambient Blobs inside the card */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-[radial-gradient(circle_at_center,_rgba(0,63,134,0.25)_0%,_transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.15)_0%,_transparent_70%)] transition-colors duration-700" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] group-hover:bg-[radial-gradient(circle_at_center,_rgba(0,63,134,0.25)_0%,_transparent_70%)] transition-colors duration-700" />
        
        {/* Subtle Grid Texture */}
        
        {/* Huge Number Graphic in Background */}
        <div className="absolute -top-4 -right-4 text-[120px] font-light [-webkit-text-stroke:0.5px_rgba(255,255,255,0.3)] group-hover:[-webkit-text-stroke:1px_rgba(251,191,36,0.6)] text-transparent group-hover:text-amber-500/10 transition-all duration-700 pointer-events-none group-hover:scale-110 group-hover:-translate-x-4 group-hover:translate-y-4 origin-top-right">
          0{idx + 1}
        </div>
        
        {/* Center Animated HUD Icon */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-20 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-4 mt-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              {/* Tech Radar Rings - Dynamic Colors */}
              {(() => {
                const getRingColors = (id) => {
                  switch(id) {
                    case 'heating': return ['group-hover:border-blue-400/100', 'group-hover:border-blue-300/50'];
                    case 'ventilation': return ['group-hover:border-amber-400/100', 'group-hover:border-amber-300/50'];
                    case 'cooling': return ['group-hover:border-emerald-400/100', 'group-hover:border-emerald-300/50'];
                    case 'other': return ['group-hover:border-rose-400/80', 'group-hover:border-rose-300/50'];
                    default: return ['group-hover:border-amber-400/100', 'group-hover:border-amber-300/50'];
                  }
                };
                const [ring1, ring2] = getRingColors(card.id);
                return (
                  <>
                    <div className={`absolute inset-0 rounded-full border-[2.5px] border-dashed border-white/60 ${ring1} group-hover:animate-spin [animation-duration:8s] transition-all duration-500`} />
                    <div className={`absolute inset-3 rounded-full border-[2px] border-white/50 ${ring2} animate-spin [animation-duration:12s] transition-all duration-500`} style={{ animationDirection: 'reverse' }} />
                  </>
                );
              })()}
              
              {/* Abstract Glass Prism - Uniquely styled per category */}
              {(() => {
                switch(card.id) {
                  case 'heating': return (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rotate-45 border-[2px] border-blue-400/80 bg-gradient-to-br from-blue-400/50 to-blue-400/10 transform-gpu will-change-transform group-hover:border-blue-400/100 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5),inset_0_0_15px_rgba(59,130,246,0.3)] transition-all duration-700 group-hover:rotate-[135deg] flex items-center justify-center">
                      <div className="absolute inset-2 border-[1.5px] border-blue-400/60 group-hover:border-blue-400/80 transition-all duration-700 group-hover:-rotate-90" />
                      <div className="w-3 h-3 bg-blue-400/80 group-hover:bg-blue-300 rounded-sm group-hover:shadow-[0_0_12px_rgba(59,130,246,1)] transition-all duration-700" />
                    </div>
                  );
                  case 'ventilation': return (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-[2px] border-amber-400/80 bg-gradient-to-br from-amber-400/50 to-amber-400/10 transform-gpu will-change-transform group-hover:border-amber-400/100 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5),inset_0_0_15px_rgba(251,191,36,0.3)] transition-all duration-700 group-hover:rotate-[180deg] flex items-center justify-center">
                      <div className="absolute inset-2.5 rounded-full border-[2px] border-dashed border-amber-400/80 group-hover:border-amber-400/90 transition-all duration-700 group-hover:animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="w-3.5 h-3.5 bg-amber-400/80 group-hover:bg-amber-300 rounded-full group-hover:shadow-[0_0_12px_rgba(251,191,36,1)] transition-all duration-700" />
                    </div>
                  );
                  case 'cooling': return (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-[2px] border-emerald-400/80 bg-gradient-to-br from-emerald-400/50 to-emerald-400/10 transform-gpu will-change-transform group-hover:border-emerald-400/100 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5),inset_0_0_15px_rgba(16,185,129,0.3)] transition-all duration-700 group-hover:rotate-[90deg] flex items-center justify-center overflow-hidden">
                      <div className="absolute w-full h-[2px] bg-emerald-400/70 group-hover:bg-emerald-400/90 transition-colors duration-700" />
                      <div className="absolute h-full w-[2px] bg-emerald-400/70 group-hover:bg-emerald-400/90 transition-colors duration-700" />
                      <div className="w-4 h-4 border-[2px] border-emerald-400/90 group-hover:border-emerald-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.9)_inset] transition-all duration-700 rotate-45" />
                    </div>
                  );
                  case 'other': return (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rotate-45 border-[2px] border-rose-400/80 bg-gradient-to-br from-rose-400/50 to-rose-400/10 transform-gpu will-change-transform group-hover:border-rose-400/100 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.5),inset_0_0_15px_rgba(244,63,94,0.3)] transition-all duration-700 group-hover:rotate-[225deg] flex items-center justify-center">
                      <div className="absolute inset-2 border-[1.5px] border-rose-400/60 group-hover:border-rose-400/80 transition-all duration-700 rounded-full" />
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-rose-400/80 group-hover:bg-rose-300 rounded-full transition-all duration-700 group-hover:translate-x-1 group-hover:translate-y-1" />
                      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-rose-400/80 group-hover:bg-rose-300 rounded-full transition-all duration-700 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                      <div className="w-2 h-2 bg-rose-400/80 group-hover:bg-rose-300 rounded-full group-hover:shadow-[0_0_12px_rgba(244,63,94,1)] transition-all duration-700 group-hover:scale-150" />
                    </div>
                  );
                  default: return null;
                }
              })()}
            </div>
        </div>
        
        {/* Bottom Content & Hidden Action Reveal */}
        <div className="relative z-20 mt-auto flex flex-col items-center text-center w-full">
            <h3 className="text-lg sm:text-xl font-black text-slate-300 mb-2 transition-colors duration-500 group-hover:text-white drop-shadow-md">
              {card.title}
            </h3>
            
            {/* Hidden Details that reveal using CSS Grid */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] w-full">
              <div className="overflow-hidden flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 w-full">
                <p className="text-[11px] sm:text-xs text-slate-400 mb-4 px-2 leading-relaxed h-[36px] overflow-hidden">
                  {card.desc}
                </p>
                <div className="w-full flex justify-center">
                  <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/30 flex items-center justify-center gap-2 group-hover:bg-amber-400/20 group-hover:border-amber-400/40 transition-colors duration-300 w-full max-w-[200px]">
                    <span className="text-xs font-bold text-amber-300 whitespace-nowrap">مشاهده جزئیات</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 -rotate-135 group-hover:-rotate-45 transition-transform duration-500">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({
  cmsHero,
  onNavigate,
  onSelectCategory,
  onOpenConsultation,
  onOpenQuote,
  onOpenAiAssistant,
  children,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const cardsSectionRef = useRef<HTMLDivElement>(null);

  // Default beautiful images for poultry & feed mill
  const defaultImages = [
    '/images/hero-final-1.jpg',
    '/images/hero-final-2.jpg',
    '/images/hero-final-3.jpg',
  ];

  const validCmsImages = cmsHero?.backgroundImages?.filter(img => img && img.trim() !== '') || [];
  
  const isDefaultBg = cmsHero?.backgroundImage === "/images/hero-1.jpg" || !cmsHero?.backgroundImage;
  const heroImages = validCmsImages.length > 0 
    ? validCmsImages 
    : (isDefaultBg ? defaultImages : [cmsHero.backgroundImage]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds for a calm, luxurious feel
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToCards = () => {
    if (cardsSectionRef.current) {
      cardsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const categoryCards: CircleCategoryCard[] = [
    {
      id: 'heating',
      title: 'ماشین‌آلات خوراک',
      categoryEn: 'Feed Machinery',
      icon: Factory,
      desc: 'پرس پلت، اکسترودر، میکرودایزینگ و آسیاب میکسر',
      badge: 'کارخانجات خوراک',
      accentColor: '#003F86',
      badgeBg: 'bg-blue-50',
      badgeText: 'text-[#003F86]',
      specs: ['پرس پلت ۲ الی ۲۰ تن/ساعت', 'میکرودایزینگ دقیق افزودنی‌ها'],
      bgImage: '/images/service_feed_machinery.jpg'
    },
    {
      id: 'ventilation',
      title: 'تجهیزات مرغداری',
      categoryEn: 'Farm Equipment',
      icon: Fan,
      desc: 'بشقاب پروانه‌ای FDA، آبخوری نیپل و جت هیتر',
      badge: 'تاییدیه FDA آمریکا',
      accentColor: '#FF9F14',
      badgeBg: 'bg-amber-50',
      badgeText: 'text-amber-700',
      specs: ['بشقاب پروانه‌ای لیسانس آمریکا', 'جت هیتر و سیستم‌های گرمایشی'],
      bgImage: '/images/service_farm_equipment.jpg'
    },
    {
      id: 'cooling',
      title: 'سوله و سالن صنعتی',
      categoryEn: 'Turnkey Shed',
      icon: Building2,
      desc: 'طراحی، ساخت سازه و تجهیز کامل سالن',
      badge: 'اجرای صفر تا صد',
      accentColor: '#003F86',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      specs: ['سازه‌های سبک و بهداشتی', 'عایق‌بندی و هوابندی کامل'],
      bgImage: '/images/service_turnkey_shed.jpg'
    },
    {
      id: 'other',
      title: 'خوراک و مکمل',
      categoryEn: 'Feed & Supplements',
      icon: Pill,
      desc: 'کنسانتره تخصصی، پریمیکس و روغن خام سویا',
      badge: 'فرمولاسیون علمی',
      accentColor: '#FF9F14',
      badgeBg: 'bg-purple-50',
      badgeText: 'text-purple-700',
      specs: ['کنسانتره گوشتی و تخم‌گذار', 'پریمیکس دامی و روغن‌های گیاهی'],
      bgImage: '/images/service_supplements.jpg'
    },
  ];

  return (
    <div className="w-full relative min-h-screen bg-slate-950">
      
      {/* ========================================================================= */}
      {/* 1. 100% FIXED HERO (Redesigned: Clean, Minimalist, Image-Focused) */}
      {/* ========================================================================= */}
      <section 
        id="hero-fixed-pinned-section"
        className="fixed top-0 left-0 right-0 w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 z-0 pointer-events-auto"
      >
        
        {/* Full-bleed Background Image with Elegant Vignette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950">
          {heroImages.map((src, index) => (
            <LazyHeroImage
              key={src}
              src={src}
              alt="شرکت طیوران صنعت پویا"
              isActive={currentImageIndex === index}
            />
          ))}
          {/* Subtle gradient to ensure text readability but keep image prominent */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/50 z-10" />
        </div>

        {/* Minimalist Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-4xl mx-auto w-full mt-[-6vh] sm:mt-[-4vh]">
          
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full mb-6 shadow-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-xs sm:text-[13px] font-medium text-slate-200 tracking-tight">
              {cmsHero?.pillText || 'با نیم قرن تجربه و بیش از ۲۰۰ پروژه ملی و بین‌المللی'}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.12] tracking-tight mb-5 drop-shadow-sm"
          >
            {cmsHero?.title || 'طیوران صنعت پویا'}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal mb-8 text-balance"
          >
            {cmsHero?.subtitle}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
          >
            <Link
              to="/products"
              className="w-full sm:w-auto bg-[#003F86] hover:bg-blue-800 text-white font-semibold px-7 py-3 rounded-full text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Package className="w-4 h-4" />
              <span>{cmsHero?.ctaPrimaryText || 'محصولات و تجهیزات'}</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-7 py-3 rounded-full text-sm sm:text-base flex items-center justify-center gap-2 border border-white/30 backdrop-blur-xl transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{cmsHero?.ctaSecondaryText === 'ارتباط با مهندسین' ? 'تماس با ما' : (cmsHero?.ctaSecondaryText || 'تماس با ما')}</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10"
          onClick={scrollToCards}
        >
          <span className="text-[10px] sm:text-xs tracking-widest text-white/50 font-medium">اسکرول کنید</span>
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-[1.5px] border-white/40 rounded-full flex justify-center p-1  bg-slate-950/20">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-400 rounded-full"
            />
          </div>
        </motion.div>

      </section>

      {/* ========================================================================= */}
      {/* 2. INVISIBLE SCROLL SPACER (Fits exact viewport height) */}
      {/* ========================================================================= */}
      <div className="w-full h-[100dvh] pointer-events-none" />

      {/* ========================================================================= */}
      {/* 3. SLIDING DRAWER / COVER SHEET */}
      {/* ========================================================================= */}
      <div 
        ref={cardsSectionRef}
        id="categories-drawer-sheet"
        className="relative z-20 w-full bg-[#F8FAFC] shadow-2xl rounded-t-lg sm:rounded-t-lg border-t border-slate-200/90 py-6 sm:py-8"
      >
        
        {/* Subtle Top Pull Handle Bar */}
        <div className="w-14 h-1.5 bg-slate-300 hover:bg-amber-400 rounded-full mx-auto mb-4 transition-colors" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Section Title Header */}
          <div className="w-full mb-6 text-center sm:text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block mb-1.5">
                دسته‌بندی تخصصی طیوران صنعت پویا
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#003F86]">
                طراحی، ساخت و تجهیز پروژه‌های صنعتی در دام، طیور و آبزیان
              </h2>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="self-center sm:self-auto text-xs bg-white hover:bg-slate-100 text-[#003F86] font-bold px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 text-amber-500" />
              <span>ارتباط با واحد فروش و مهندسی</span>
            </button>
          </div>

          {/* 🎨 Dribbble-Worthy High-Fidelity Magic Cards */}
              <div className="relative z-10 w-full py-8 lg:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
                  
                  {categoryCards.map((card, idx) => (
                    <ServiceCard key={idx} idx={idx} card={card} onClick={() => onSelectCategory(card.id)} />
                  ))}
                </div>

                {/* Ultra-Wide Premium Brand Banner */}
                <div className="mt-8 relative group w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#001c3d] via-[#002d61] to-[#003F86] border border-blue-800 p-8 sm:p-10 cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500" onClick={onOpenConsultation}>
                    {/* Animated geometric background */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000 ease-out pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.08)_0%,_transparent_70%)] translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-1000 ease-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                       <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-6">
                          {/* Glowing Award Badge */}
                          <div className="relative w-20 h-20 shrink-0 rounded-2xl bg-white/10  transform-gpu will-change-transform border-[1.5px] border-white/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                             <Award className="w-10 h-10 text-amber-400 drop-shadow-md" />
                             <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-300 rounded-full  " />
                             <div className="absolute -top-2 -right-2 w-2 h-2 bg-white rounded-full" />
                          </div>
                          
                          <div>
                             <span className="text-[10px] sm:text-[11px] font-bold text-amber-400/90 tracking-widest uppercase mb-1.5 block drop-shadow-md">Engineering Excellence</span>
                             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg mb-2">شرکت طیوران صنعت پویا</h2>
                             <p className="text-sm sm:text-base text-blue-100/90 max-w-xl leading-relaxed font-medium">از طراحی و ساخت تا تجهیز و بهره‌برداری؛ راهکاری یکپارچه برای پروژه‌های صنعت دام، طیور و آبزیان</p>
                          </div>
                       </div>

                       <div className="w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
                         <button className="w-full lg:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-transform duration-300 transform active:scale-95 shadow-[0_10px_30px_rgba(251,191,36,0.3)]">
                            <span className="text-sm">ثبت درخواست مشاوره</span>
                            <div className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center group-hover:translate-x-[-4px] transition-transform">
                               <ArrowLeft className="w-4 h-4" />
                            </div>
                         </button>
                       </div>
                    </div>
                </div>
              </div>

          {/* Bottom Quick Feature Strip */}
          <div className="relative z-10 w-full mt-6">
            <div className="bg-white/90  border border-slate-200/90 rounded-3xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 shadow-2xs">
              
              <div className="flex items-center gap-4">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  مشاوره رایگان
                </span>
                <span className="hidden sm:inline text-slate-300">|</span>
                <span className="hidden sm:inline text-slate-500">
                  ارائه خدمات نصب و پشتیبانی فنی، متناسب با نوع پروژه و محصول
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-[#003F86] hover:text-amber-500 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>تماس با ما</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Seamless Content Continuation (About & Contact Unified Section) */}
          {children && (
            <div className="relative z-10 w-full mt-8 sm:mt-10">
              {children}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export { Hero };
