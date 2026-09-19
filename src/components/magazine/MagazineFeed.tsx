import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Clock, Calendar, ArrowLeft, ChevronLeft, Sparkles } from 'lucide-react';
import { Article } from '../../types';
import { InnerScrollIndicator } from '../InnerScrollIndicator';
import { LazyImage } from '../LazyImage';

const IMAGES = [
  '/images/poultry-1.jpg',
  '/images/factory-1.jpg',
  '/images/equipment-1.jpg',
  '/images/tech-1.jpg',
  '/images/control-1.jpg',
  '/images/machine-1.jpg',
  '/images/silo-1.jpg',
];

interface MagazineFeedProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}


export const MagazineFeed: React.FC<MagazineFeedProps> = ({ articles, onSelectArticle }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { margin: "200px 0px" });

  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory]);

  useEffect(() => {
    if (isInView) {
      setVisibleCount(prev => prev + 6);
    }
  }, [isInView]);
  
  const categories = [
    { id: 'all', label: 'همه مطالب' },
    { id: 'technical-guide', label: 'فنی مهندسی' },
    { id: 'product-guide', label: 'راهنمای محصول' },
    { id: 'article', label: 'مقالات علمی' },
  ];

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);
  const displayedGridArticles = gridArticles.slice(0, visibleCount);

  const getArticleImage = (article: Article, index: number) => article.image || IMAGES[index % IMAGES.length];

  return (
    <div className="min-h-screen relative overflow-hidden z-0" id="magazine-feed">
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
              <span className="text-sm font-bold text-slate-800">مجله تخصصی طیوران صنعت پویا</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              کشف <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">دانش و نوآوری</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              به‌روزترین مقالات، تحلیل‌ها و راهنماهای کاربردی برای ارتقای بهره‌وری در صنعت طیور
            </p>
          </motion.div>
        </div>
        <InnerScrollIndicator />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24 relative z-10">

        {/* Categories (Glassmorphism Tabs) */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#003F86] to-blue-700 text-white border-blue-600 shadow-xl shadow-blue-900/20 scale-105'
                  : 'bg-white/95 text-slate-700 border-white/80 hover:bg-white hover:border-white hover:shadow-lg'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <AnimatePresence mode="wait">
          {featuredArticle && (
            <motion.div
              key={`featured-${activeCategory}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mb-12 group cursor-pointer relative"
              onClick={() => onSelectArticle(featuredArticle)}
            >
              {/* Highlight glow behind featured */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-amber-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
              
              <div className="relative rounded-[2rem] overflow-hidden bg-white transform-gpu will-change-transform shadow-sm hover:shadow-lg border border-slate-100 flex flex-col md:flex-row h-auto md:min-h-[28rem] transition-all duration-300">
                {/* Image Side */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10 pointer-events-none" />
                  <LazyImage 
                    src={getArticleImage(featuredArticle, 0)} 
                    alt={featuredArticle.title}
                    className="absolute inset-0 w-full h-full"
                    imgClassName="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 z-20">
                     <span className="bg-white/20 text-white border border-white/30 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                       {featuredArticle.categoryLabel}
                     </span>
                  </div>
                </div>
                
                {/* Content Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                  <div className="flex items-center gap-5 text-sm text-slate-500 mb-6 font-medium">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#003F86]" /> {featuredArticle.date}</span>
                    <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> {featuredArticle.readTime}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-[1.6] mb-6 group-hover:text-[#003F86] transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8">
                    {featuredArticle.summary}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-2 text-[#003F86] font-bold group-hover:gap-4 transition-all bg-blue-50 px-5 py-2.5 rounded-xl border border-blue-100">
                      ادامه مطلب <ArrowLeft className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Articles */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {displayedGridArticles.map((article, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="relative bg-white transform-gpu will-change-transform rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col h-full origin-center"
              >
                {/* Accent Top Border */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30" />
                
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent z-10 pointer-events-none" />
                  <LazyImage 
                    src={getArticleImage(article, index + 1)} 
                    alt={article.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 right-4 z-20">
                     <span className="bg-white/20 text-white border border-white/30 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                       {article.categoryLabel}
                     </span>
                  </div>
                </div>
                
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#003F86]" /> {article.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> {article.readTime}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 leading-[1.6] group-hover:text-[#003F86] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3 flex-1">
                    {article.summary}
                  </p>
                  
                  <div className="mt-auto pt-5 border-t border-slate-200/60 flex items-center text-sm font-bold text-[#003F86]">
                     <span className="group-hover:-translate-x-2 transition-transform flex items-center gap-1.5">
                        مطالعه مقاله <ChevronLeft className="w-4 h-4" />
                     </span>
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>

        {/* Lazy Load Trigger */}
        {visibleCount < gridArticles.length && (
          <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center mt-8">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin opacity-50" />
          </div>
        )}

      </div>
    </div>
  );
};
