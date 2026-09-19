import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  CheckCircle2, 
  ChevronLeft, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { Product } from '../../types';
import { LazyImage } from '../LazyImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
  onOpenConsultation: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestQuote,
  onOpenConsultation,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!product) return null;

  const handleDownloadCatalog = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95  border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="bg-[#003F86] text-white text-xs font-bold px-3 py-1 rounded-lg">
              {product.categoryTitle.replace(/ مرغداری$/, '')}
            </span>
            <span className="font-mono text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-lg">
              {product.code}
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
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Main Top Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Image Preview */}
            <div className="space-y-3">
              <div className="rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 h-64 sm:h-72 shadow-sm">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Title & Intro */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.name}
                </h2>
                {product.nameEn && (
                  <span className="text-xs font-mono text-slate-400 block mt-1">
                    {product.nameEn}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-4 rounded-3xl border border-slate-100">
                {product.fullDescription}
              </p>

              {/* Key Advantages */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>مزایای رقابتی و استانداردهای متریال:</span>
                </h4>
                <div className="space-y-2">
                  {product.advantages.map((adv, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{adv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">
                  کاربردهای اصلی در صنعت:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.applications.map((app, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Full Technical Specifications Table */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#003F86]" />
              <h3 className="text-base font-extrabold text-slate-900">
                جدول مشخصات فنی مهندسی (Technical Specifications)
              </h3>
            </div>
            
            <div className="overflow-hidden border border-slate-200 rounded-3xl shadow-2xs">
              <table className="w-full text-right text-xs">
                <tbody>
                  {product.specs.map((spec, idx) => (
                    <tr 
                      key={idx} 
                      className={idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'}
                    >
                      <td className="py-3 px-4 font-bold text-slate-700 border-b border-slate-100 w-1/3">
                        {spec.label}
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-medium border-b border-slate-100">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Models Available */}
          {product.models && product.models.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">
                تیپ‌ها و ظرفیت‌های قابل سفارش:
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.models.map((mod, i) => (
                  <span key={i} className="bg-blue-50 text-[#003F86] font-bold text-xs px-3 py-1.5 rounded-xl border border-blue-200">
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Product FAQ */}
          {product.faqs && product.faqs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#003F86]" />
                <span>پرسش‌های متداول درباره این تجهیز (FAQ)</span>
              </h4>
              <div className="space-y-2">
                {product.faqs.map((faq, i) => (
                  <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <strong className="text-slate-900 block mb-1">
                      سؤال: {faq.q}
                    </strong>
                    <p className="text-slate-600 leading-relaxed">
                      پاسخ: {faq.a}
                    </p>
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
              استعلام قیمت رسمی برای {product.code}
            </h4>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              جهت دریافت قیمت روز و استعلام، با ما تماس بگیرید.
            </p>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onRequestQuote(product);
              }}
              className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>استعلام قیمت</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
