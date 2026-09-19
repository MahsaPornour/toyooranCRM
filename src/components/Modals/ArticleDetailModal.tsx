import React from 'react';
import { X, Clock, Calendar, BookOpen, Link as LinkIcon, ChevronLeft, FileText, PhoneCall } from 'lucide-react';
import { Article, Product } from '../../types';
import { PRODUCTS } from '../../data/mockData';

interface ArticleDetailModalProps {
  products?: Product[];
  article: Article | null;
  onClose: () => void;
  onSelectProductById: (productId: string) => void;
  onOpenConsultation: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  products = PRODUCTS,
  article,
  onClose,
  onSelectProductById,
  onOpenConsultation,
}) => {
  if (!article) return null;

  const linkedProducts = products.filter((p) => article.relatedProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95  border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="bg-[#003F86] text-white text-xs font-bold px-3 py-1 rounded-lg">
              {article.categoryLabel}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              زمان مطالعه: {article.readTime}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>تاریخ انتشار: {article.date}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-4">
              {article.title}
            </h2>

            <div className="bg-blue-50/70 border-r-4 border-[#003F86] p-4 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {article.summary}
            </div>
          </div>

          {/* Article Full Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
            {article.content.map((p, idx) => (
              <p key={idx} className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                {p}
              </p>
            ))}
          </div>

          {/* Connected Products Bridge */}
          {linkedProducts.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-900 mb-3">
                <LinkIcon className="w-4 h-4 text-amber-700" />
                <span>تجهیزات و خطوط مرتبط با این راهنما:</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 shadow-2xs hover:border-[#003F86] transition-colors"
                  >
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block line-clamp-1">
                        {p.name}
                      </strong>
                      <span className="text-[10px] font-mono text-slate-400">کد: {p.code}</span>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectProductById(p.id);
                      }}
                      className="bg-[#003F86] hover:bg-[#003366] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span>مشاهده</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky CTA Footer */}
        <div className="sticky bottom-0 bg-slate-900 text-white p-4 sm:p-6 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div>
            <h4 className="font-bold text-amber-400 text-sm">
              نیاز به استعلام قیمت در رابطه با تجهیزات این مبحث دارید؟
            </h4>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              تیم مهندسی طیوران صنعت پویا آماده پاسخگویی تخصصی به سوالات شماست.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md"
          >
            <span>درخواست استعلام قیمت</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
