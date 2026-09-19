import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Bell, 
  ExternalLink, 
  Home, 
  LayoutDashboard,
  Users,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { getTodayShamsiFullDate } from '../../utils/crmDateUtils';
import { toPersianDigits } from '../../utils/crmPhoneUtils';

interface CrmHeaderProps {
  onBackToAdmin?: () => void;
  onViewPublicSite?: () => void;
}

export const CrmHeader: React.FC<CrmHeaderProps> = ({ onBackToAdmin, onViewPublicSite }) => {
  const { stats, setActiveTab } = useCrm();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${toPersianDigits(hours)}:${toPersianDigits(minutes)}:${toPersianDigits(seconds)}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const shamsiDate = getTodayShamsiFullDate();
  const urgentCount = (stats.todayFollowUps || 0) + (stats.overdueFollowUps || 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-3.5 shadow-xl transition-all">
      <div className="max-w-[1650px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  سامانه مدیریت ارتباط با مشتریان (CRM)
                </h1>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ماژول مستقل
                </span>
              </div>
              <p className="text-xs text-slate-400">
                طیوران صنعت پویا • پایپ‌لاین فروش و پیگیری مزارع پرورش طیور
              </p>
            </div>
          </div>

          {/* Mobile Back Button */}
          <div className="flex md:hidden items-center gap-2">
            {onBackToAdmin && (
              <button
                onClick={onBackToAdmin}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="بازگشت به پنل اصلی"
              >
                <LayoutDashboard className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Center Live Date & Time Info */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-300">{shamsiDate.fullText}</span>
            <span className="text-slate-600">|</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono text-amber-300 font-bold">{currentTime}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-2.5 py-1.5 text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>پایگاه داده برخط</span>
          </div>

          {urgentCount > 0 && (
            <button
              onClick={() => setActiveTab('followups')}
              className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-xl px-2.5 py-1.5 text-xs animate-pulse hover:bg-rose-500/25 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-rose-400" />
              <span>{toPersianDigits(urgentCount)} تماس معوق / فوری</span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {onBackToAdmin && (
            <button
              onClick={onBackToAdmin}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/60 transition-all hover:border-slate-600 shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span>پنل مدیریت اصلی</span>
            </button>
          )}

          {onViewPublicSite && (
            <button
              onClick={onViewPublicSite}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700/60 transition-all hover:border-slate-600 shadow-sm"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>مشاهده وب‌سایت</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
