import React from 'react';
import { 
  Wheat, 
  Droplets, 
  Fan, 
  Factory, 
  Warehouse, 
  Pill, 
  ArrowLeft, 
  ChevronLeft,
  Sparkles,
  Thermometer,
  Snowflake,
  Wind,
  LayoutGrid,
  Database,
  MoreHorizontal
} from 'lucide-react';
import { ProductCategory, PageSection, CategoryInfo } from '../types';
import { CATEGORIES_DATA } from '../data/mockData';
import { LazyImage } from './LazyImage';

interface CategoryHexSectionProps {
  categories?: CategoryInfo[];
  onSelectCategory: (cat: ProductCategory) => void;
  onNavigateToProducts: () => void;
}

export const CategoryHexSection: React.FC<CategoryHexSectionProps> = ({
  categories = CATEGORIES_DATA,
  onSelectCategory,
  onNavigateToProducts,
}) => {
  const iconMap: Record<string, React.ElementType> = {
    Thermometer,
    Fan,
    Droplets,
    Snowflake,
    Wind,
    Wheat,
    LayoutGrid,
    Database,
    MoreHorizontal,
    Factory,
    Warehouse,
    Pill
  };

  return (
    <section className="py-12 bg-white border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003F86] bg-blue-50/80 px-3 py-1 rounded-full mb-2.5 border border-blue-100/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>تجهیزات تخصصی مرغداری و خطوط خوراک</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              محصولات و تجهیزات تخصصی
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              تأمین و ساخت قطعات استاندارد با بالاترین کیفیت مهندسی و بازدهی انرژی
            </p>
          </div>

          <button
            onClick={onNavigateToProducts}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#003F86] hover:text-blue-700 transition-colors group"
          >
            <span>مشاهده همه محصولات</span>
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 6 Clean Category Cards (Apple Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Factory;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id as ProductCategory)}
                className="group cursor-pointer bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/70 hover:border-[#003F86]/30 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Image Preview Strip */}
                <div className="relative h-32 -mx-5 -mt-5 mb-4 overflow-hidden bg-slate-100 rounded-t-2xl">
                  <LazyImage
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  
                  {/* Badge */}
                  <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-slate-900 font-semibold text-[10px] px-2.5 py-1 rounded-full shadow-xs border border-white/50">
                    {cat.badge}
                  </span>

                  {/* Icon on Image */}
                  <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-md flex items-center justify-center text-[#003F86] shadow-xs">
                    <Icon className="w-4 h-4 text-[#003F86]" />
                  </div>
                </div>

                {/* Body Content */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#003F86] transition-colors">
                      {cat.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 block mb-1.5">
                    {cat.titleEn}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-[#003F86] transition-colors">
                    مشاهده تجهیزات
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-200/60 group-hover:bg-[#003F86] group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
