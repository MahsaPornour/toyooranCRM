import React, { useState } from 'react';
import { 
  Compass, 
  Building2, 
  Boxes, 
  Hammer, 
  Wrench, 
  CheckCircle2, 
  Headphones, 
  ArrowLeft,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface WorkflowSectionProps {
  onOpenConsultation: () => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onOpenConsultation }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '۰۱',
      title: 'طراحی مهندسی',
      icon: Compass,
      subtitle: 'محاسبات اقلیمی و نقشه',
      desc: 'محاسبه بارهای حرارتی و برودتی، محاسبه سرعت باد و حجم CFM تهویه سالن، جانمایی سالن‌ها و نقشه‌های سازه‌ای طبق استاندارد نظام مهندسی.',
      deliverable: 'دفترچه محاسبات فنی و پکیج نقشه‌های اجرایی سه‌بعدی'
    },
    {
      num: '۰۲',
      title: 'ساخت سازه و سوله',
      icon: Building2,
      subtitle: 'احداث اسکلت و فونداسیون',
      desc: 'اجرای فونداسیون استاندارد، ساخت اسکلت فلزی با جوشکاری زیرپودری، پوشش ساندویچ پانل پلی‌یورتان نسوز B2 و کف‌سازی بتن صیقلی ضد باکتری.',
      deliverable: 'سازه سوله عایق‌بندی شده و آماده استقرار تأسیسات'
    },
    {
      num: '۰۳',
      title: 'تأمین تجهیزات',
      icon: Boxes,
      subtitle: 'تولید و تأمین متریال استاندارد',
      desc: 'تولید و تأمین تجهیزات دانخوری بشقابی اوگماتیک، خطوط نیپل استیل ۳۶۰ درجه ضدچکه، فن‌های ۱۴۰ گریز از مرکز، پد سلولزی و ماشین‌آلات خوراک.',
      deliverable: 'تجهیزات صنعتی با گارانتی تعویض و بالاترین گرید کیفی'
    },
    {
      num: '۰۴',
      title: 'اجرای پروژه',
      icon: Hammer,
      subtitle: 'مدیریت پیمان و نظارت فنی',
      desc: 'پیمانکاری دقیق بر مبنای جدول زمان‌بندی (Gantt Chart)، اجرای لوله‌کشی‌های تخصصی، مسیرهای کابل‌کشی و استقرار شاسی ماشین‌آلات.',
      deliverable: 'اجرای دقیق مهندسی بدون تأخیر در جدول زمان‌بندی'
    },
    {
      num: '۰۵',
      title: 'نصب و کالیبراسیون',
      icon: Wrench,
      subtitle: 'استقرار مکانیکی و اتوماسیون',
      desc: 'تراز خطوط آب و دان با وینچ‌های برقی، سیم‌کشی تابلوی PLC مرکزی، تنظیم سنسورهای اقلیم، تست دود و سنجش فشار استاتیکی سالن.',
      deliverable: 'تست بدون بار و زیر بار تمام خطوط مکانیکی و الکتریکی'
    },
    {
      num: '۰۶',
      title: 'بهره‌برداری و تحویل',
      icon: CheckCircle2,
      subtitle: 'آماده‌سازی جوجه‌ریزی',
      desc: 'حضور کارشناس فنی در روز جوجه‌ریزی اول، تنظیم ارتفاع خطوط متناسب با سن پرنده و آموزش کامل کاربری سیستم به پرسنل و مدیریت فارم.',
      deliverable: 'صورتجلسه تحویل نهایی سالن آماده جوجه‌ریزی'
    },
    {
      num: '۰۷',
      title: 'پشتیبانی و اورهال',
      icon: Headphones,
      subtitle: 'خدمات پس از فروش ۲۴/۷',
      desc: 'تأمین دائمی قطعات یدکی فابریک از انبار مرکزی، اعزام تیم امداد فنی در شرایط بحرانی، سرویس‌های دوره‌ای و اورهال دای و رولر پرس پلت.',
      deliverable: 'پشتیبانی فنی مادام‌العمر و پایداری مداوم خطوط تولید'
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003F86] bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>فرآیند یکپارچه مهندسی طیوران صنعت پویا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            ما چه کاری انجام می‌دهیم؟
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
            از ایده و نقشه اولیه تا بهره‌برداری کامل و پشتیبانی، در تمام مراحل در کنار پروژه شما هستیم.
          </p>
        </div>

        {/* Visual 7-Step Horizontal Workflow Pipeline */}
        <div className="relative">
          
          {/* Horizontal Connecting Line on desktop */}
          <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 bg-slate-200 z-0">
            <div 
              className="h-full bg-[#003F86] transition-all duration-500"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {/* Step Buttons Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              const isPassed = idx <= activeStep;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center text-center p-3 rounded-3xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#003F86] text-white shadow-lg scale-105 ring-4 ring-blue-100'
                      : isPassed
                      ? 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {/* Step Icon Badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : isPassed
                      ? 'bg-blue-100 text-[#003F86]'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className={`text-[10px] font-mono font-bold mb-0.5 ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                    گام {step.num}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Active Step Details Panel */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-mono font-bold bg-[#003F86] text-white px-2.5 py-1 rounded-lg">
                  مرحله {steps[activeStep].num} از ۰۷
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {steps[activeStep].title} : {steps[activeStep].subtitle}
                </h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed max-w-3xl mt-2">
                {steps[activeStep].desc}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-500">خروجی قابل تحویل:</span>
                <strong className="text-[#003F86]">{steps[activeStep].deliverable}</strong>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={onOpenConsultation}
                className="bg-[#003F86] hover:bg-[#003366] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>مشاوره اجرای این مرحله</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
