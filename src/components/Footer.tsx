import React from "react";
import { AparatIcon } from "./AparatIcon";
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Send, 
  MessageCircle, 
  Linkedin,
  Youtube,
  Tv,
  Grid,
  ArrowLeft,
  ChevronLeft
} from 'lucide-react';

interface FooterProps {
  onNavigate: (id: string) => void;
  onSelectCategory: (id: string) => void;
  onOpenConsultation: () => void;
  onOpenQuote: () => void;
  companyInfo: any;
  categories: any[];
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory, onOpenConsultation, onOpenQuote, companyInfo, categories }) => {
  const navigation = [
    { title: 'صفحه اصلی', path: '/' },
    { title: 'درباره ما', path: '/about' },
    { title: 'پروژه‌ها', path: '/projects' },
    { title: 'محصولات', path: '/products' },
    { title: 'خدمات', path: '/services' },
    { title: 'مجله', path: '/magazine' },
    { title: 'تماس با ما', path: '/contact' },
  ];

  

  const mainPhone = '09151126258';
  const email = companyInfo?.email || 'info@pooyapoultry.com';
  const hq = companyInfo?.locations?.find(loc => loc.type === 'headquarter');

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#00142c] pt-16 pb-8 overflow-hidden border-t border-white/10 z-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.06)_0%,_transparent_70%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.04)_0%,_transparent_70%)] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-12">
          
          {/* Column 1: Brand & About (Span 5) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-10 flex items-center justify-center">
                  <img src="/images/logo-wide.png" alt="Logo" className="h-full w-auto object-contain" />
               </div>
               <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{companyInfo?.name}</h3>
                  <span className="text-[11px] text-amber-400 font-semibold tracking-wider uppercase">{companyInfo?.nameEn}</span>
               </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal mb-6 max-w-sm">
              شرکت طیوران صنعت پویا با بیش از ۵۰ سال تجربه تخصصی، پیشگام در طراحی، مهندسی و اجرای تجهیزات مدرن مرغداری و کارخانجات خوراک دام و طیور.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a 
                href={companyInfo?.socialLinks?.instagram || '#'} 
                onClick={(e) => {
                  if (!companyInfo?.socialLinks?.instagram) {
                    e.preventDefault();
                    toast('به زودی صفحه اینستاگرام ما راه‌اندازی می‌شود', { icon: '✨' });
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href={companyInfo?.socialLinks?.telegram || '#'} 
                onClick={(e) => {
                  if (!companyInfo?.socialLinks?.telegram) {
                    e.preventDefault();
                    toast('به زودی کانال تلگرام ما راه‌اندازی می‌شود', { icon: '✨' });
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200">
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </a>
              <a 
                href={companyInfo?.socialLinks?.aparat || '#'} 
                onClick={(e) => {
                  if (!companyInfo?.socialLinks?.aparat) {
                    e.preventDefault();
                    toast('به زودی کانال آپارات ما راه‌اندازی می‌شود', { icon: '✨' });
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200">
                <AparatIcon className="w-3.5 h-3.5" />
              </a>
              <a 
                href={companyInfo?.socialLinks?.rubika || '#'} 
                onClick={(e) => {
                  if (!companyInfo?.socialLinks?.rubika) {
                    e.preventDefault();
                    toast('به زودی کانال روبیکا ما راه‌اندازی می‌شود', { icon: '✨' });
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200">
                <Grid className="w-3.5 h-3.5" />
              </a>
              <a 
                href={companyInfo?.socialLinks?.youtube || '#'} 
                onClick={(e) => {
                  if (!companyInfo?.socialLinks?.youtube) {
                    e.preventDefault();
                    toast('به زودی کانال یوتیوب ما راه‌اندازی می‌شود', { icon: '✨' });
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a 
                href={companyInfo?.socialLinks?.linkedin || '#'} 
                onClick={(e) => {
                  if (!companyInfo?.socialLinks?.linkedin) {
                    e.preventDefault();
                    toast('به زودی صفحه لینکدین ما راه‌اندازی می‌شود', { icon: '✨' });
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (Span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4">
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5">
              {navigation.map((nav, idx) => (
                <li key={idx}>
                  <Link to={nav.path} className="text-slate-400 hover:text-white text-xs font-normal transition-colors">
                    {nav.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services (Span 2) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4">
              محصولات و خدمات
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white text-xs font-normal transition-colors">
                  کارخانجات خوراک
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white text-xs font-normal transition-colors">
                  تجهیزات مرغداری
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-white text-xs font-normal transition-colors">
                  سوله‌های صنعتی
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-slate-400 hover:text-white text-xs font-normal transition-colors">
                  سیستم‌های گرمایشی
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info (Span 3) */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-white font-semibold text-sm mb-4">
              ارتباط مستقیم
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[11px] text-slate-500 mb-0.5">مشاوره و فروش:</span>
                  <a href="tel:09151126258" className="text-slate-200 hover:text-amber-400 font-medium text-xs transition-colors" dir="ltr">۰۹۱۵۱۱۲۶۲۵۸</a>
                </div>
              </div>
              
              {hq && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[11px] text-slate-500 mb-0.5">دفتر مرکزی:</span>
                    <span className="text-slate-300 font-normal text-xs leading-relaxed">{hq.address}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 mb-6" />

        {/* Copyright & Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-normal text-slate-500">
          <p>
            © {currentYear} تمامی حقوق محفوظ است. شرکت طیوران صنعت پویا.
          </p>
          <div className="flex items-center gap-3">
             <a href="#" className="hover:text-slate-400 transition-colors">قوانین و مقررات</a>
             <div className="w-1 h-1 rounded-full bg-slate-700" />
             <a href="#" className="hover:text-slate-400 transition-colors">حریم خصوصی</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
