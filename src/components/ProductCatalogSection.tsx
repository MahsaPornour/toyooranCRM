import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { 
  Search,
  Layers, 
  Zap, 
  PhoneCall,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Product, ProductCategory } from '../types';

import { InnerScrollIndicator } from './InnerScrollIndicator';
import { LazyImage } from './LazyImage';

interface ProductCatalogSectionProps {
  products: Product[];
  selectedCategory?: ProductCategory | 'all';
  onSelectCategory?: (cat: ProductCategory | 'all') => void;
  onSelectProduct: (product: Product) => void;
  onRequestQuoteForProduct: (product: Product) => void;
}

import { CategoryMarquee } from "./CategoryMarquee";



export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({ 
  products, 
  selectedCategory: propSelectedCategory,
  onSelectCategory: propOnSelectCategory,
  onSelectProduct,
  onRequestQuoteForProduct
}) => {
  const [localCategory, setLocalCategory] = useState<ProductCategory | 'all'>('all');
  const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : localCategory;
  
  const handleSelectCategory = (cat: ProductCategory | 'all') => {
    if (propOnSelectCategory) {
      propOnSelectCategory(cat);
    } else {
      setLocalCategory(cat);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { margin: "200px 0px" });

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (isInView) {
      setVisibleCount(prev => prev + 6);
    }
  }, [isInView]);

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustrial = true;
    return matchesCat && matchesSearch && matchesIndustrial;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section id="products" className="min-h-screen relative overflow-hidden z-0">
      {/* Dynamic Vibrant Mesh Gradient Background to match Magazine */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.15)_0%,_transparent_60%)]" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.15)_0%,_transparent_60%)]" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[30%] right-[30%] w-[40vw] h-[40vw] bg-[radial-gradient(circle_at_center,_rgba(52,211,153,0.12)_0%,_transparent_60%)]" style={{ animationDuration: '12s' }} />
      </div>

      <div className="w-full min-h-[100dvh] flex flex-col justify-center relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
          {/* 
            ========================================================
            HERO & HEADER
            ========================================================
          */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 border border-white/50 shadow-sm mb-6">
              <Zap className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">تجهیزات و ماشین‌آلات</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              کاتالوگ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">محصولات</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              تجهیزات تخصصی مرغداری، ماشین‌آلات خطوط تولید خوراک و سیستم‌های مدرن صنعت طیور
            </p>
          </motion.div>
        </div>
        <InnerScrollIndicator />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-16 lg:pb-24 relative z-10">

        {/* 
          ========================================================
          FILTERS & SEARCH
          ========================================================
        */}
        <div className="w-full flex flex-col justify-start mb-10 relative z-20 pt-4 sm:pt-8">
          {/* Infinite Draggable Category Marquee */}
          <CategoryMarquee 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleSelectCategory} 
          />

          {/* Search & Toggles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mt-6 w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی محصول یا کد..."
                className="w-full bg-white/90 backdrop-blur-md border border-slate-200 focus:border-[#003F86] focus:ring-4 focus:ring-[#003F86]/10 rounded-2xl py-3.5 pr-11 pl-4 text-sm font-bold text-slate-800 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* 
          ========================================================
          PRODUCT GRID
          ========================================================
        */}
        <motion.div className="mt-4 sm:mt-6">
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-20 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">محصولی یافت نشد</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-sm">هیچ محصولی مطابق با فیلتر یا واژه جستجو شده وجود ندارد.</p>
                <button 
                  onClick={() => { handleSelectCategory('all'); setSearchQuery('');  }}
                  className="px-6 py-2.5 rounded-xl bg-[#003F86] text-white text-sm font-bold hover:bg-blue-800 transition-colors shadow-sm"
                >
                  نمایش همه محصولات
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {displayedProducts.map((product, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                      key={`${product.id}-${selectedCategory}`}
                      className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-100 transition-all duration-300 flex flex-col"
                    >
                    {/* Image Area */}
                    <div 
                      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-5 cursor-pointer"
                      onClick={() => onSelectProduct(product)}
                    >
                      <LazyImage
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                      {/* Floating Badges */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#003F86] shadow-sm border border-white/50">
                        {product.categoryTitle.replace(/ مرغداری$/, '')}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-1 flex-1 flex flex-col">
                      <div className="text-xs text-slate-400 font-mono font-medium mb-1.5">
                        کد: {product.code}
                      </div>
                      
                      <h3 
                        className="text-lg font-black text-slate-900 mb-8 group-hover:text-[#003F86] transition-colors cursor-pointer line-clamp-2 leading-[1.6]"
                        onClick={() => onSelectProduct(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Action Buttons */}
                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRequestQuoteForProduct(product);
                          }}
                          className="flex-1 bg-[#003F86] hover:bg-blue-800 text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-900/10 flex justify-center items-center gap-2 active:scale-95"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>استعلام قیمت</span>
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                          }}
                          className="w-11 h-11 shrink-0 flex justify-center items-center bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-colors active:scale-95 border border-slate-100"
                          title="مشاهده جزئیات کامل"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          {/* Lazy Load Trigger */}
          {visibleCount < filteredProducts.length && (
            <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center mt-8">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin opacity-50" />
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};
