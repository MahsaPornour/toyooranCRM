import React, { useState, useMemo } from 'react';
import { Search, X, ChevronLeft, Wrench, Layers, BookOpen, CheckCircle2, Zap } from 'lucide-react';
import { Product, Project, Article } from '../../types';
import { PRODUCTS, PROJECTS, ARTICLES } from '../../data/mockData';

interface GlobalSearchModalProps {
  products?: Product[];
  projects?: Project[];
  articles?: Article[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectProject: (project: Project) => void;
  onSelectArticle: (article: Article) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  products = PRODUCTS,
  projects = PROJECTS,
  articles = ARTICLES,
  isOpen,
  onClose,
  onSelectProduct,
  onSelectProject,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], projects: [], articles: [] };

    const q = query.toLowerCase();
    const matchedProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.categoryTitle.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.models && p.models.some((m) => m.toLowerCase().includes(q)))
    );

    const matchedProjects = projects.filter(
      (pr) =>
        pr.title.toLowerCase().includes(q) ||
        pr.location.toLowerCase().includes(q) ||
        pr.typeTitle.toLowerCase().includes(q) ||
        pr.equipmentSummary.some((e) => e.toLowerCase().includes(q))
    );

    const matchedArticles = articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.categoryLabel.toLowerCase().includes(q)
    );

    return {
      products: matchedProducts,
      projects: matchedProjects,
      articles: matchedArticles,
    };
  }, [products, projects, articles, query]);

  if (!isOpen) return null;

  const totalMatches =
    results.products.length + results.projects.length + results.articles.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-start justify-center p-4 sm:p-6 pt-16 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی نام تجهیزات، کد قطعه (مثلاً: ۱۴۰ یا ۴۲۰)، پروژه یا مقاله فنی..."
            className="w-full bg-transparent border-none text-sm focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-200 rounded-lg"
            >
              پاک کردن
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          {!query.trim() ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <span className="block mb-2 font-bold text-slate-600">جستجوی هوشمند در کل پایگاه داده طیوران</span>
              عبارت مورد نظر خود مانند: «دانخوری»، «پرس پلت»، «هواکش ۱۴۰»، «مرغداری گوشتی»، «تهویه زمستان» را تایپ کنید.
            </div>
          ) : totalMatches === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              نتیجه‌ای برای «{query}» یافت نشد. لطفاً کلمات کلیدی دیگری را جستجو کنید.
            </div>
          ) : (
            <>
              {/* Products Found */}
              {results.products.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003F86] mb-3">
                    <Wrench className="w-4 h-4" />
                    <span>محصولات و تجهیزات ({results.products.length}):</span>
                  </div>
                  <div className="space-y-2">
                    {results.products.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onClose();
                          onSelectProduct(p);
                        }}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#003F86] cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg">
                            {p.code}
                          </span>
                          <div>
                            <strong className="text-xs font-bold text-slate-900 group-hover:text-[#003F86] block">
                              {p.name}
                            </strong>
                            <span className="text-[11px] text-slate-500 line-clamp-1">
                              {p.shortDescription}
                            </span>
                          </div>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#003F86]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Found */}
              {results.projects.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003F86] mb-3">
                    <Layers className="w-4 h-4" />
                    <span>پروژه‌ها و مطالعات موردی ({results.projects.length}):</span>
                  </div>
                  <div className="space-y-2">
                    {results.projects.map((pr) => (
                      <div
                        key={pr.id}
                        onClick={() => {
                          onClose();
                          onSelectProject(pr);
                        }}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#003F86] cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-[#003F86] block">
                            {pr.title}
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            {pr.location} | ظرفیت: {pr.capacity}
                          </span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#003F86]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Found */}
              {results.articles.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003F86] mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span>مقالات و راهنماهای فنی ({results.articles.length}):</span>
                  </div>
                  <div className="space-y-2">
                    {results.articles.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => {
                          onClose();
                          onSelectArticle(art);
                        }}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-[#003F86] cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-[#003F86] block">
                            {art.title}
                          </strong>
                          <span className="text-[11px] text-slate-500">
                            {art.categoryLabel} | زمان مطالعه: {art.readTime}
                          </span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#003F86]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
