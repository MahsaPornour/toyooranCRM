import React from 'react';
import { Award, Layers, ShieldCheck, Factory, CheckCircle } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

export const TrustBar: React.FC = () => {
  const trustMetrics = [
    {
      icon: Award,
      value: '۵۰+ سال',
      label: 'تجربه و سابقه صنعتی',
      detail: 'بیش از ۵۰ سال تجربه در صنعت دام، طیور و آبزیان'
    },
    {
      icon: Layers,
      value: '۲۰۰+ پروژه',
      label: 'پروژه ملی و بین‌المللی',
      detail: 'اجرای فارم‌های گوشتی، تخم‌گذار، مادر و کارخانجات خوراک'
    },
    {
      icon: Factory,
      value: 'صفر تا ۱۰۰',
      label: 'طراحی، ساخت و تجهیز',
      detail: 'پوشش زنجیره کامل از نقشه و سوله تا خطوط اتوماسیون'
    },
    {
      icon: ShieldCheck,
      value: 'استاندارد مهندسی',
      label: 'گارانتی و خدمات پس از فروش',
      detail: 'تضمین اصالت متریال، تأمین قطعات فابریک و اورهال تخصصی'
    }
  ];

  return (
    <div className="w-full bg-slate-50/60 py-8 my-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trustMetrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/70 shadow-xs hover:shadow-sm hover:border-[#003F86]/20 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50/80 flex items-center justify-center shrink-0 text-[#003F86] mb-3">
                  <Icon className="w-5 h-5 text-[#003F86]" />
                </div>
                <div>
                  <div className="text-xl font-bold text-slate-900 tracking-tight mb-0.5">
                    {item.value}
                  </div>
                  <div className="text-xs font-semibold text-[#003F86] mb-1">
                    {item.label}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
