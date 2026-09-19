import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  ChevronLeft, 
  FileText, 
  HelpCircle,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { Article, Product } from '../types';
import { ARTICLES, PRODUCTS } from '../data/mockData';

interface KnowledgeSectionProps {
  articles?: Article[];
  onSelectArticle: (article: Article) => void;
  onSelectProductById: (productId: string) => void;
}

export const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({
  articles = ARTICLES,
  onSelectArticle,
  onSelectProductById,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه مقالات و راهنماها' },
    { id: 'technical-guide', label: 'راهنماهای فنی مهندسی' },
    { id: 'product-guide', label: 'راهنمای انتخاب محصول' },
    { id: 'article', label: 'مقالات علمی پرورش' },
  ];

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <section className="py-12 bg-[#F8FAFC] border-b border-slate-200" id="knowledge-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003F86] bg-blue-50 px-3 py-1 rounded-full mb-2 border border-blue-100">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>پایگاه دانش فنی و راهنمای محاسبات مهندسی</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              آموزش و مقالات تخصصی
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
              راهنماهای کاربردی برای انتخاب صحیح تجهیزات، محاسبات CFM تهویه و بهبود ضریب تبدیل
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#003F86] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => {
            const linkedProducts = PRODUCTS.filter((p) => article.relatedProductIds.includes(p.id));

            return (
              <div
                key={article.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-[#003F86] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="bg-blue-50 text-[#003F86] text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {article.categoryLabel}
                    </span>
                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                    </div>
                  </div>

                  {/* Article Title */}
                  <h3 
                    onClick={() => onSelectArticle(article)}
                    className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#003F86] transition-colors leading-snug mb-2 cursor-pointer"
                  >
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
                    {article.summary}
                  </p>

                  {/* Connected Products Bridge (Direct Link to Product - Rule #16) */}
                  {linkedProducts.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-2">
                        <LinkIcon className="w-3.5 h-3.5 text-[#003F86]" />
                        <span>تجهیزات و راهکارهای مرتبط با این موضوع:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {linkedProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => onSelectProductById(p.id)}
                            className="bg-white hover:bg-amber-100 text-slate-800 hover:text-slate-950 border border-slate-200 text-xs px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span>{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Read Full Article Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectArticle(article)}
                    className="text-xs font-bold text-[#003F86] hover:text-[#00224b] flex items-center gap-1.5 group-hover:underline"
                  >
                    <span>مطالعه متن کامل و راهنمای محاسباتی</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
