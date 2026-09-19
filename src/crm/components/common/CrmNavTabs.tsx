import React from 'react';
import { 
  GitMerge, 
  Clock, 
  Users, 
  Sparkles, 
  CopyCheck, 
  BarChart3, 
  Plus,
  Download
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { CrmSubTab } from '../../types/crm.types';
import { toPersianDigits } from '../../utils/crmPhoneUtils';
import { exportContactsToCsv } from '../../utils/crmExportUtils';

export const CrmNavTabs: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    stats, 
    openNewCustomerModal,
    customers
  } = useCrm();

  const tabs: { id: CrmSubTab; label: string; icon: any; count?: number; badgeColor?: string }[] = [
    { 
      id: 'pipeline', 
      label: 'خط لوله فروش (کانبان)', 
      icon: GitMerge, 
      count: stats.activeLeads,
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    { 
      id: 'followups', 
      label: 'کارتابل تماس‌ها و یادآورها', 
      icon: Clock, 
      count: (stats.todayFollowUps + stats.overdueFollowUps) || undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    { 
      id: 'contacts', 
      label: 'بانک جامع مزارع و مخاطبان', 
      icon: Users, 
      count: stats.totalContacts,
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    { 
      id: 'inbound', 
      label: 'سرنخ‌های ورودی سایت', 
      icon: Sparkles, 
      count: stats.inboundLeadsCount || undefined,
      badgeColor: 'bg-cyan-500/20 text-cyan-300'
    },
    { 
      id: 'duplicates', 
      label: 'اسکن و ادغام تکراری‌ها', 
      icon: CopyCheck, 
      count: stats.duplicateCount > 0 ? stats.duplicateCount : undefined,
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    { 
      id: 'reports', 
      label: 'تحلیل فروش و ماشین‌حساب', 
      icon: BarChart3 
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800/80 shadow-md">
      
      {/* Scrollable Horizontal Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-slate-950/20 text-slate-950' : tab.badgeColor || 'bg-slate-800 text-slate-300'
                }`}>
                  {toPersianDigits(tab.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          onClick={() => exportContactsToCsv(customers)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all"
          title="خروجی فایل اکسل از مخاطبین"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline">خروجی اکسل</span>
        </button>

        <button
          onClick={() => openNewCustomerModal('new_lead')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت پرونده جدید</span>
        </button>
      </div>

    </div>
  );
};
