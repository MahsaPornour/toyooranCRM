import React, { useRef, useState, useEffect } from 'react';
import { 
  Building2, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  ChevronLeft,
  Sparkles,
  Factory,
  Pill,
  ArrowLeft
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'motion/react';
import { Service } from '../types';
import { SERVICES } from '../data/mockData';
import { ServiceCard } from './Hero';

import { Fan } from 'lucide-react';
const categoryCards = [
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
      desc: 'طراحی، ساخت و تجهیز کامل سوله‌های پرورشی',
      badge: 'پیمانکاری Turn-key',
      accentColor: '#10B981',
      badgeBg: 'bg-emerald-50',
      badgeText: 'text-emerald-700',
      specs: ['سازه‌های مقاوم و عایق', 'اتوماسیون هوشمند یکپارچه'],
      bgImage: '/images/service_turnkey_shed.jpg'
    },
    {
      id: 'other',
      title: 'قطعات و پشتیبانی',
      categoryEn: 'Parts & Support',
      icon: Wrench,
      desc: 'تامین قطعات یدکی، گارانتی ۲۴ ماهه و تعمیرات',
      badge: 'خدمات پس از فروش',
      accentColor: '#F43F5E',
      badgeBg: 'bg-rose-50',
      badgeText: 'text-rose-700',
      specs: ['تامین فوری قطعات مصرفی', 'پشتیبانی فنی ۲۴/۷'],
      bgImage: '/images/service_supplements.jpg'
    }
  ];

import { useNavigate } from 'react-router-dom';

import { InnerScrollIndicator } from './InnerScrollIndicator';

interface ServicesSectionProps {
  services?: Service[];
  onSelectService: (service: Service) => void;
  onSelectCategory?: (categoryId: any) => void;
  onOpenConsultation: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Factory,
  Wrench,
  Pill,
  TrendingUp,
};


export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services = SERVICES,
  onSelectService,
  onSelectCategory,
  onOpenConsultation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [visibleCount, setVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { margin: "200px 0px" });

  useEffect(() => {
    if (isInView) {
      setVisibleCount(prev => prev + 6);
    }
  }, [isInView]);

  const displayedServices = services.slice(0, visibleCount);
  
  return (
    <section className="min-h-screen relative overflow-hidden z-0" id="services-section">
      {/* Dynamic Vibrant Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.15)_0%,_transparent_60%)]" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_60%)]" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.12)_0%,_transparent_60%)]" style={{ animationDuration: '12s' }} />
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
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">خدمات مهندسی و اجرایی (Outcome-Driven)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              پوشش کامل <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">چرخه عمر</span> پروژه‌های صنعتی
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              ما صرفاً تجهیزات نمی‌فروشیم. طیوران صنعت پویا با بیش از نیم قرن تجربه، شریک مهندسی شما از فاز طراحی مفهومی سوله تا رسیدن به بالاترین راندمان و ظرفیت نامی است.
            </p>
          </motion.div>
        </div>
        <InnerScrollIndicator />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 relative z-10">

        {/* Services Grid */}
        
        {/* 🎨 Dribbble-Worthy High-Fidelity Magic Cards */}
        <div className="relative z-10 w-full py-8 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
            {categoryCards.map((card, idx) => (
              <ServiceCard key={idx} idx={idx} card={card} onClick={() => onSelectCategory && onSelectCategory(card.id)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
