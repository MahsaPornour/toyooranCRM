import React from 'react';
import { 
  X, 
  CheckCircle2, 
  ChevronLeft, 
  HelpCircle, 
  Wrench, 
  Sparkles, 
  PhoneCall, 
  Building2, 
  Boxes 
} from 'lucide-react';
import { Service } from '../../types';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onOpenConsultation,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95  border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="bg-[#003F86] text-white text-xs font-bold px-3 py-1 rounded-lg">
              خدمات مهندسی و پیمانکاری
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
          
          {/* Top Title & Problem Solved */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2">
              {service.title}
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
              {service.tagline}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4">
              <span className="text-xs font-bold text-amber-900 block mb-1">
                چالش و مسئله‌ای که با این خدمت حل می‌شود:
              </span>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-normal">
                {service.problemSolved}
              </p>
            </div>
          </div>

          {/* What We Provide */}
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>شرح تعهدات و اقلام تحویلی (Scope of Work):</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.whatWeProvide.map((item, i) => (
                <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Steps */}
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              فرآیند گام‌به‌گام اجرای خدمت:
            </h3>
            <div className="space-y-3">
              {service.workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                  <span className="w-7 h-7 rounded-full bg-[#003F86] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      {step.title}
                    </strong>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-2 text-[11px] text-[#003F86] font-semibold flex items-center gap-1">
                      <span>خروجی تحویلی:</span>
                      <span className="underline">{step.deliverable}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For */}
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2">
              این خدمت مناسب چه فارم‌ها و پروژه‌هایی است؟
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.suitableFor.map((item, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Service FAQ */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#003F86]" />
                <span>پرسش‌های متداول این خدمت</span>
              </h4>
              <div className="space-y-2">
                {service.faqs.map((faq, i) => (
                  <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <strong className="text-slate-900 block mb-1">
                      {faq.q}
                    </strong>
                    <p className="text-slate-600 leading-relaxed">
                      {faq.a}
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
              درخواست اجرای خدمت: {service.title}
            </h4>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              تنظیم جلسه حضوری، بازدید از فارم یا دریافت برآورد اولیه هزینه و زمان‌بندی
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md"
          >
            <span>درخواست مشاوره اختصاصی</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
