import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  CheckCircle2, 
  ChevronLeft, 
  Upload, 
  Compass, 
  Wrench, 
  ShieldCheck, 
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { ConsultationFormData } from '../../types';
import { COMPANY_INFO } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { sendNotificationToBale } from '../../utils/sendToBale';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addConsultationRequest } = useData();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    phoneNumber: '',
    requestType: 'project-design',
    projectType: 'مرغداری گوشتی صنعتی',
    projectCapacity: '',
    location: '',
    message: '',
  });

  if (!isOpen) return null;

  const requestTypeOptions = [
    { id: 'project-design', label: 'طراحی نقشه و ساخت صفر تا صد سوله', icon: Compass },
    { id: 'equipment-selection', label: 'انتخاب و تأمین تجهیزات مرغداری', icon: Wrench },
    { id: 'efficiency-audit', label: 'مشاوره افزایش راندمان و کاهش FCR', icon: TrendingUp },
    { id: 'after-sales', label: 'خدمات پس از فروش و تأمین قطعات یدکی', icon: ShieldCheck },
    { id: 'technical-inquiry', label: 'ارتباط مستقیم با کارشناس ارشد مهندسی', icon: MessageSquare },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addConsultationRequest(formData);
    sendNotificationToBale({
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      subject: formData.projectType,
      capacity: formData.projectCapacity,
      location: formData.location,
      message: formData.message,
      source: 'مودال مشاوره تخصصی'
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-[#003F86] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                درخواست مشاوره تخصصی پروژه
              </h2>
              <span className="text-xs text-blue-200 font-medium">
                گفتگو با مهندسین ارشد و برآورد ظرفیت و سرمایه‌گذاری
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-blue-900/60 hover:bg-blue-800 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              درخواست مشاوره شما ثبت گردید
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              مهندس مشاور فنی شرکت در اسرع وقت (کمتر از ۱ ساعت در ساعات کاری) با شماره <strong>{formData.phoneNumber}</strong> تماس حاصل خواهد کرد.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="bg-[#003F86] text-white font-bold px-8 py-2.5 rounded-xl text-xs hover:bg-[#003366] transition-colors"
              >
                بستن و ادامه
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            
            {/* Request Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                نوع درخواست خود را انتخاب کنید:
              </label>
              <div className="space-y-1.5">
                {requestTypeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.requestType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, requestType: opt.id as any })}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-[#003F86] text-[#003F86] font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#003F86]' : 'text-slate-400'}`} />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-[#003F86]"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  نام و نام خانوادگی: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="نام شما..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  شماره تماس همراه: *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#003F86] text-left font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ظرفیت یا ابعاد پروژه:
                </label>
                <input
                  type="text"
                  value={formData.projectCapacity}
                  onChange={(e) => setFormData({ ...formData, projectCapacity: e.target.value })}
                  placeholder="مثال: ۳۰,۰۰۰ قطعه یا ۱۵ تن در ساعت"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  استان / شهر پروژه:
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="مثال: مازندران، اصفهان..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                توضیحات یا پرسش مورد نظر:
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="خلاصه نیازهای پروژه، زمان‌بندی مدنظر، شرایط اقلیمی..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
              />
            </div>

            {/* Direct Phone Assistance */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#003F86]" />
                <span>تماس فوری: {COMPANY_INFO.phone}</span>
              </span>
              
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>ارسال درخواست مشاوره</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
