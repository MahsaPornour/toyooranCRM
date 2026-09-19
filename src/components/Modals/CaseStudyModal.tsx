import React from 'react';
import { X, CheckCircle2, MapPin, Calendar, Layers, Activity, ChevronLeft, PhoneCall, TrendingUp } from 'lucide-react';
import { Project } from '../../types';
import { LazyImage } from '../LazyImage';

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
  onOpenConsultation,
}) => {
  if (!project) return null;

  const caseStudy = project.caseStudy;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95  border-b border-slate-200 p-4 sm:p-6 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="bg-[#003F86] text-white text-xs font-bold px-3 py-1 rounded-lg">
              مطالعه موردی تخصصی (Case Study)
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {project.typeTitle}
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
          
          {/* Top Hero Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-[#003F86]" />
                  {project.location}
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Calendar className="w-4 h-4 text-[#003F86]" />
                  سال اجرای پروژه: {project.year}
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#003F86]">
                  <Activity className="w-4 h-4" />
                  ظرفیت: {project.capacity}
                </span>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-sm h-40 bg-slate-100">
              <LazyImage
                src={project.image}
                alt={project.title}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Results Showcase Metrics */}
          {caseStudy?.results && (
            <div className="bg-blue-50/80 border border-blue-100 rounded-3xl p-5">
              <h3 className="text-xs font-black text-[#003F86] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <span>دستاوردهای ملموس و مستند پروژه</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {caseStudy.results.map((res, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-xs text-slate-500 block mb-1">{res.label}</span>
                    <strong className="text-xl font-extrabold text-[#003F86] block font-mono">
                      {res.value}
                    </strong>
                    <span className="text-[11px] text-slate-600 mt-1 block">
                      {res.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem vs Need vs Solution */}
          {caseStudy ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-red-50/60 border border-red-100 p-4 rounded-3xl">
                <h4 className="text-xs font-bold text-red-900 mb-1.5">۱. چالش و مسئله کارفرما:</h4>
                <p className="text-xs text-red-950/80 leading-relaxed font-normal">
                  {caseStudy.problem}
                </p>
              </div>

              <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-3xl">
                <h4 className="text-xs font-bold text-amber-900 mb-1.5">۲. نیاز فنی پروژه:</h4>
                <p className="text-xs text-amber-950/80 leading-relaxed font-normal">
                  {caseStudy.clientNeed}
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-3xl">
                <h4 className="text-xs font-bold text-emerald-900 mb-1.5">۳. راهکار مهندسی ما:</h4>
                <p className="text-xs text-emerald-950/80 leading-relaxed font-normal">
                  {caseStudy.solution}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 mb-1">دستاورد کلیدی پروژه:</h4>
              <p className="text-sm text-slate-700">{project.keyOutcome}</p>
            </div>
          )}

          {/* Process Steps */}
          {caseStudy?.processSteps && (
            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-4">
                فرآیند و مراحل گام‌به‌گام اجرا:
              </h3>
              <div className="space-y-3">
                {caseStudy.processSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="w-7 h-7 rounded-full bg-[#003F86] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">
                        {step.title}
                      </strong>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment Installed */}
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-3">
              تجهیزات و خطوط مکانیزه نصب‌شده:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.equipmentSummary.map((eq, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#003F86] shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Sticky CTA Footer */}
        <div className="sticky bottom-0 bg-slate-900 text-white p-4 sm:p-6 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div>
            <h4 className="font-bold text-amber-400 text-sm">
              نیاز به پیاده‌سازی پروژه مشابه در استان خود دارید؟
            </h4>
            <p className="text-xs text-slate-300 font-light mt-0.5">
              مشاوران ارشد مهندسی شرکت آماده پاسخگویی و ارائه پیش‌طرح فنی به شما هستند.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md"
          >
            <span>درخواست اجرای پروژه مشابه</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
