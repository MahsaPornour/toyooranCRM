import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  User, 
  Package, 
  Wrench, 
  Building, 
  BookOpen, 
  Compass, 
  Sparkles, 
  Menu, 
  X, 
  Search, 
  FileText,
  Phone,
  ChevronLeft,
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSection } from '../types';

interface NavbarProps {
  currentSection: PageSection;
  onNavigate: (section: PageSection) => void;
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
  onOpenSearch: () => void;
  onOpenAiAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  onOpenConsultation,
  onOpenQuote,
  onOpenSearch,
  onOpenAiAssistant,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Nav items ordered right to left as requested:
  // خانه, خدمات, محصولات, پروژه‌ها, تحقیق و توسعه, مجله, درباره ما, تماس با ما
  const navItems: { id: PageSection; path: string; label: string; icon: React.ElementType }[] = [
    { id: 'home', path: '/', label: 'خانه', icon: Home },
    { id: 'services', path: '/services', label: 'خدمات', icon: Wrench },
    { id: 'products', path: '/products', label: 'محصولات', icon: Package },
    { id: 'projects', path: '/projects', label: 'پروژه‌ها', icon: Building },
    { id: 'rnd', path: '/rnd', label: 'تحقیق و توسعه', icon: FlaskConical },
    { id: 'knowledge', path: '/magazine', label: 'مجله', icon: BookOpen },
    { id: 'about', path: '/about', label: 'درباره ما', icon: User },
    { id: 'contact', path: '/contact', label: 'تماس با ما', icon: Compass },
  ];

  const handleNavClick = (section: PageSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 bg-white/80 backdrop-blur-2xl border-b lg:border border-slate-200/60 lg:rounded-full px-4 sm:px-6 lg:px-4 py-2.5 lg:py-2 transition-all duration-300 lg:max-w-6xl lg:mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.04)] w-full lg:w-[calc(100%-2.5rem)]">
      <div className="flex items-center justify-between w-full">
        
        {/* Left Side: Brand Logo */}
        <Link 
          to="/"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group relative z-[60]"
          id="brand-logo-btn"
        >
          {/* Logo Mark: Full Image */}
          <div className="h-9 sm:h-10 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
             <img 
               src="/images/logo-wide.png" 
               alt="Logo" 
               className="h-full w-auto object-contain"
             />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-base sm:text-lg font-black text-[#003F86] tracking-tight transition-colors">
              TSPK
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-wider -mt-1">
              طیوران صنعت پویا
            </span>
          </div>
          
        </Link>

        {/* Center / Right Nav Items (Apple Segmented Style) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/40">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center ${
                  isActive
                    ? 'bg-white text-[#003F86] shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <span className="relative z-10 tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-2">
          
          {/* Minimal Search Trigger */}
          <button 
            onClick={onOpenSearch}
            className="flex items-center justify-center w-9 h-9 bg-slate-100/80 hover:bg-white border border-slate-200/60 hover:border-slate-300 transition-all duration-200 rounded-full group cursor-pointer shadow-xs hover:shadow-sm"
            title="جستجو"
          >
            <Search className="w-4 h-4 text-slate-600 group-hover:text-[#003F86] transition-colors" />
          </button>
        </div>

        {/* Mobile Menu & Action Buttons */}
        <div className="flex items-center gap-2 lg:hidden relative z-[60]">
          <button
            onClick={onOpenSearch}
            className="p-2.5 text-slate-500 hover:text-[#003F86] hover:bg-white rounded-full transition-colors bg-white/50 backdrop-blur-md border border-white/60 shadow-sm"
            aria-label="جستجو"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle-btn"
            className="p-2.5 rounded-full text-slate-700 hover:bg-white transition-all duration-300 bg-white/50 backdrop-blur-md shadow-sm border border-white/60 hover:scale-105 active:scale-95 flex items-center justify-center relative overflow-hidden"
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Perfect Fit Minimalist Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[100] bg-slate-50 flex flex-col w-full h-[100dvh] overflow-hidden shadow-2xl"
          >
            {/* Top Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-auto min-w-[2.5rem] bg-slate-100 rounded-lg flex items-center justify-center px-2 py-1 shadow-inner border border-slate-200/50">
                  <img src="/images/logo-wide.png" alt="Logo" className="w-full h-full object-contain " />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black bg-gradient-to-r from-[#003F86] to-blue-600 bg-clip-text text-transparent">TSPK</span>
                  <span className="text-[10px] font-extrabold text-slate-500 -mt-1">طیوران صنعت پویا</span>
                </div>
              </div>
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors active:scale-95 border border-slate-200/50"
              >
                <motion.div
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              </button>
            </div>

            {/* Menu Items Area - Exactly fits available height */}
            <div 
              className="flex-1 flex flex-col justify-between px-5 pt-4 w-full h-[calc(100dvh-80px)] overflow-hidden"
              style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex flex-col justify-evenly flex-1">
                {navItems.map((item, i) => {
                  const isActive = currentSection === item.id;
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full"
                    >
                      <Link
                        to={item.path}
                        onClick={() => handleNavClick(item.id)}
                        className={`relative flex items-center justify-between w-full py-2.5 px-3 sm:p-4 rounded-2xl transition-all duration-300 ${isActive ? 'scale-[1.02]' : 'active:scale-95'}`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="active-mobile-bg"
                            className="absolute inset-0 bg-blue-50/80 rounded-2xl border border-blue-100/60 shadow-sm"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        
                        <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                          <div className={`flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 rounded-xl transition-all duration-400 ${isActive ? 'bg-[#003F86] shadow-md shadow-blue-900/20 rotate-3 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                            <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${isActive ? 'text-amber-400' : ''}`} />
                          </div>
                          <span className={`text-[15px] sm:text-lg font-bold tracking-wide ${isActive ? 'text-[#003F86] font-black' : 'text-slate-600'}`}>
                            {item.label}
                          </span>
                        </div>
                        
                        {isActive && (
                          <ChevronLeft className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 text-[#003F86]/50" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Search Action at Bottom */}
              <div className="mt-4 shrink-0">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: navItems.length * 0.05 + 0.1 }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#003F86] to-blue-700 text-white p-3.5 sm:p-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                  <Search className="w-5 h-5 text-amber-400" />
                  <span>جستجوی هوشمند</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
