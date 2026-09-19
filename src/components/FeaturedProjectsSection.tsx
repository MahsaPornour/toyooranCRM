import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  ArrowLeft, 
  Sparkles,
  FileCheck,
  ChevronLeft,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Project } from '../types';
import { PROJECTS } from '../data/mockData';

import { InnerScrollIndicator } from './InnerScrollIndicator';
import { UnderConstruction } from './UnderConstruction';
import { LazyImage } from './LazyImage';

interface FeaturedProjectsSectionProps {
  projects?: Project[];
  onSelectProject: (project: Project) => void;
  onOpenConsultation: () => void;
}


export const FeaturedProjectsSection: React.FC<FeaturedProjectsSectionProps> = ({
  projects = PROJECTS,
  onSelectProject,
  onOpenConsultation,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { margin: "200px 0px" });

  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter]);

  useEffect(() => {
    if (isInView) {
      setVisibleCount(prev => prev + 6);
    }
  }, [isInView]);

  const filterTabs = [
    { id: 'all', label: 'همه پروژه‌ها' },
    { id: 'broiler', label: 'مرغداری گوشتی' },
    { id: 'layer', label: 'مرغداری تخم‌گذار' },
    { id: 'feed_mill', label: 'کارخانه خوراک' },
    { id: 'breeder', label: 'مادر و اجداد' },
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.type === activeFilter);
    
  const displayedProjects = filteredProjects.slice(0, visibleCount);

  return (
    <section className="min-h-screen relative overflow-hidden z-0" id="projects-section">
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
              <FileCheck className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">مطالعات موردی (Case Studies)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              پروژه‌های شاخص <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">اجرا شده</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              اثبات عملکرد با نتایج واقعی در ظرفیت، بهبود ضریب تبدیل (FCR) و کاهش تلفات. پروژه‌هایی که استانداردهای صنعت طیور را ارتقا داده‌اند.
            </p>
          </motion.div>
        </div>
        <InnerScrollIndicator />
      </div>

      <div className="w-full relative z-10 -mt-16">
        <UnderConstruction 
          title="بخش پروژه‌ها در حال بروزرسانی است" 
          description="ما در حال تهیه مستندات کامل، گالری تصاویر و تحلیل‌های تخصصی از بزرگترین پروژه‌های اجرا شده در سراسر کشور هستیم. این بخش به زودی تکمیل خواهد شد."
        />
      </div>
    </section>
  );
};
