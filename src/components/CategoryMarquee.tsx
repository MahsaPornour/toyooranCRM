import React, { useRef, useState, useEffect } from 'react';
import { CATEGORIES_DATA } from '../data/mockData';
import { ProductCategory } from '../types';
import * as LucideIcons from 'lucide-react';

interface CategoryMarqueeProps {
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
}

export const CategoryMarquee: React.FC<CategoryMarqueeProps> = ({ selectedCategory, onSelectCategory }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // We add 'all' manually to the list for repeating
  const allItem = { id: 'all', title: 'همه محصولات', icon: 'LayoutGrid', productCount: 113 };
  const items = [allItem, ...CATEGORIES_DATA];
  const repeatedItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const container = containerRef.current;
      if (container && !isPaused && !isDragging.current) {
        const deltaTime = time - lastTime;
        lastTime = time;
        // Scroll speed - very smooth
        const scrollSpeed = 0.04 * deltaTime;
        
        container.scrollBy({ left: -scrollSpeed });

        const setWidth = container.scrollWidth / 4;
        if (Math.abs(container.scrollLeft) >= setWidth * 2) {
          container.scrollLeft += setWidth; 
        }
      } else {
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsPaused(true);
    if (!containerRef.current) return;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setIsPaused(false); 
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="w-full relative mb-6 group/marquee">
      {/* Gradients for smooth edge fade */}
      <div className="absolute inset-y-0 left-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent z-20 pointer-events-none" />
      
      <div 
        ref={containerRef}
        className="flex overflow-x-auto hide-scroll-bar gap-3 sm:gap-5 px-4 cursor-grab active:cursor-grabbing select-none touch-pan-x py-12"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {repeatedItems.map((cat, idx) => {
          const IconComponent = (LucideIcons as any)[cat.icon] || LucideIcons.Box;
          const isSelected = selectedCategory === cat.id;
          const isAll = cat.id === 'all';

          return (
            <div
              key={`${cat.id}-${idx}`}
              onClick={() => onSelectCategory(cat.id as ProductCategory | 'all')}
              className={`group relative flex-shrink-0 w-[150px] sm:w-[200px] md:w-[220px] aspect-square p-4 sm:p-6 rounded-[2rem] border transition-all duration-500 ease-out flex flex-col items-center justify-center gap-3 sm:gap-5 overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#003F86] via-[#002a5c] to-slate-900 border-[#003F86]/50 shadow-[0_10px_30px_rgba(0,63,134,0.4)] scale-105 z-10 -translate-y-2'
                  : 'bg-white  border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-amber-400/50 hover:shadow-[0_15px_35px_rgba(251,191,36,0.15)] hover:-translate-y-2'
              }`}
            >
              {/* Shine Sweep Effect for Hover */}
              {!isSelected && (
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[1500ms] ease-in-out bg-gradient-to-r from-transparent via-white/80 to-transparent z-10" />
              )}
              
              {/* Animated Glow for Selected State */}
              {isSelected && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 to-transparent opacity-50 z-0 animate-pulse" />
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-400/20 blur-2xl rounded-full pointer-events-none" />
                </>
              )}

              <div className={`relative z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                isSelected 
                  ? 'bg-white/10 text-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] rotate-3 scale-110 border border-white/10' 
                  : 'bg-slate-50 text-slate-500 group-hover:bg-gradient-to-br group-hover:from-amber-100 group-hover:to-amber-50 group-hover:text-amber-600 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-amber-200/50 border border-slate-100'
              }`}>
                <IconComponent className={`w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-500 ${isSelected ? 'drop-shadow-md' : 'group-hover:scale-110 drop-shadow-sm'}`} />
              </div>
              
              <div className="relative z-20 flex flex-col items-center justify-center gap-1.5 w-full h-full pb-2">                <h3 className={`text-lg sm:text-2xl font-black text-center transition-colors duration-300 ${                  isSelected ? 'text-white' : 'text-slate-800 group-hover:text-[#003F86]'                }`}>                  {cat.title.replace(/ مرغداری$/, '')}                </h3>              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
