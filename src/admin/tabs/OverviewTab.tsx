import React from 'react';
import { 
  Package, 
  Building2, 
  BookOpen, 
  Wrench, 
  FileText, 
  MessageSquareText, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Plus,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Users,
  Bell,
  Phone,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AdminTab } from '../AdminSidebar';
import { getFollowUpUrgency, formatToShamsi } from '../../utils/dateUtils';
import { toPersianDigits, formatPhoneNumberDisplay } from '../../utils/phoneUtils';

interface OverviewTabProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigateTab }) => {
  const { 
    products, 
    projects, 
    articles, 
    services, 
    quoteRequests, 
    consultationRequests,
    customers,
    companyInfo 
  } = useData();

  const newQuotes = quoteRequests.filter(q => q.status === 'new');
  const newConsultations = consultationRequests.filter(c => c.status === 'new');

  // Urgent and today follow-ups
  const dueFollowUps = customers.filter(c => {
    if (!c.nextFollowUpDate || c.followUpStatus === 'completed' || c.followUpStatus === 'cancelled') return false;
    const urgency = getFollowUpUrgency(c.nextFollowUpDate, c.nextFollowUpTime, c.followUpStatus);
    return urgency.urgency === 'today' || urgency.urgency === 'overdue';
  });

  const statCards = [
    {
      title: 'مرکز مدیریت CRM و پایپ‌لاین فروش',
      count: customers.length,
      unit: 'مخاطب',
      icon: Users,
      tab: 'crm' as AdminTab,
      bgGradient: 'from-amber-500 to-amber-700',
      tag: dueFollowUps.length > 0 ? `${toPersianDigits(dueFollowUps.length)} پیگیری نیازمند اقدام` : 'به‌روز',
      highlight: dueFollowUps.length > 0
    },
    {
      title: 'محصولات و تجهیزات',
      count: products.length,
      unit: 'قلم کالا',
      icon: Package,
      tab: 'products' as AdminTab,
      bgGradient: 'from-blue-600 to-blue-800',
      tag: 'فعال در کاتالوگ'
    },
    {
      title: 'درخواست‌های استعلام قیمت',
      count: quoteRequests.length,
      unit: 'درخواست',
      icon: FileText,
      tab: 'quotes' as AdminTab,
      bgGradient: 'from-emerald-600 to-emerald-800',
      tag: newQuotes.length > 0 ? `${newQuotes.length} جدید` : 'بررسی شده',
      highlight: newQuotes.length > 0
    },
    {
      title: 'مشاوره‌ها و تماس‌ها',
      count: consultationRequests.length,
      unit: 'پیام',
      icon: MessageSquareText,
      tab: 'consultations' as AdminTab,
      bgGradient: 'from-violet-600 to-violet-800',
      tag: newConsultations.length > 0 ? `${newConsultations.length} جدید` : 'پاسخ داده شده',
      highlight: newConsultations.length > 0
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#00224B] via-[#003F86] to-slate-900 border border-blue-800/40 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>کنترل پنل مرکزی طیوران صنعت پویا (نسخه ۳.۲)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            سامانه مدیریت جامع و بلادرنگ وب‌سایت
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-2 leading-relaxed">
            تمامی بخش‌ها شامل محصولات صنعتی، مقالات فنی، پروژه‌های اجرایی، درخواست‌های قیمت و مشخصات شرکت به صورت زنده (Real-Time) مدیریت می‌شوند و تغییرات فوراً روی سایت اعمال می‌گردند.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigateTab('products')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن محصول جدید</span>
            </button>

            <button
              onClick={() => onNavigateTab('quotes')}
              className="bg-slate-800/80 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 border border-slate-600 transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>بررسی استعلام قیمتها ({newQuotes.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(stat.tab)}
              className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 p-5 rounded-3xl transition-all cursor-pointer group relative shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  stat.highlight
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {stat.tag}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium block">
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {stat.count}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {stat.unit}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-amber-300">
                <span>مشاهده و ویرایش</span>
                <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* CRM Follow-Up Reminders Quick Action Center */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>یادآوری‌های پیگیری بعدی مخاطبین (CRM Follow-up)</span>
                {dueFollowUps.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse font-bold">
                    {toPersianDigits(dueFollowUps.length)} تماس معوق یا امروز
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                مشتریانی که طبق برنامه زمان‌بندی نیاز به تماس تلفنی یا پیگیری فروش دارند
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('crm')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 self-start sm:self-auto bg-slate-800/70 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            <span>ورود به مرکز مدیریت جامع CRM</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {dueFollowUps.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs font-bold text-slate-200">
              هیچ پیگیری معوقه‌ای برای امروز وجود ندارد!
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              همه تماس‌ها به موقع انجام شده یا برای روزهای آینده برنامه‌ریزی شده‌اند.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueFollowUps.map(customer => {
              const urgency = getFollowUpUrgency(
                customer.nextFollowUpDate,
                customer.nextFollowUpTime,
                customer.followUpStatus
              );
              return (
                <div
                  key={customer.id}
                  onClick={() => onNavigateTab('crm')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer bg-slate-950/70 hover:bg-slate-950 flex flex-col justify-between group ${
                    urgency.urgency === 'overdue'
                      ? 'border-rose-500/40 hover:border-rose-500'
                      : 'border-amber-500/40 hover:border-amber-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border ${urgency.badgeColorClass}`}>
                        <Clock className="w-3 h-3" />
                        <span>{urgency.label}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {customer.nextFollowUpTime}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                      {customer.fullName}
                    </h4>
                    {customer.companyName && (
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {customer.companyName}
                      </p>
                    )}

                    {customer.nextFollowUpNote && (
                      <p className="text-[11px] text-slate-300 mt-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 line-clamp-2">
                        {customer.nextFollowUpNote}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]" dir="ltr">
                      {formatPhoneNumberDisplay(customer.phoneNumber)}
                    </span>
                    <span className="text-[11px] font-bold text-amber-400 group-hover:underline">
                      اقدام در CRM ←
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2-Column Feeds: Recent Quotes & Recent Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Quotes */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">آخرین درخواست‌های استعلام قیمت</h3>
            </div>
            <button
              onClick={() => onNavigateTab('quotes')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {quoteRequests.slice(0, 3).map((q) => (
              <div
                key={q.id}
                onClick={() => onNavigateTab('quotes')}
                className="bg-slate-950/60 hover:bg-slate-950 p-3.5 rounded-xl border border-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{q.formData.fullName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{q.formData.projectType} • {q.formData.capacity}</p>
                    <p className="text-[11px] text-amber-400/90 font-mono mt-1">{q.formData.phoneNumber}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    q.status === 'new' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {q.status === 'new' ? 'جدید' : 'در حال بررسی'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-bold text-white">آخرین پیام‌های مشاوره و تماس</h3>
            </div>
            <button
              onClick={() => onNavigateTab('consultations')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold"
            >
              مشاهده همه
            </button>
          </div>

          <div className="space-y-3">
            {consultationRequests.slice(0, 3).map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigateTab('consultations')}
                className="bg-slate-950/60 hover:bg-slate-950 p-3.5 rounded-xl border border-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.formData.fullName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{c.formData.message}</p>
                    <p className="text-[11px] text-amber-400/90 font-mono mt-1">{c.formData.phoneNumber}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    c.status === 'new' 
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {c.status === 'new' ? 'جدید' : 'پاسخ داده'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
