import React from 'react';
import { 
  LayoutDashboard,
  Users, 
  Package, 
  Building2, 
  Wrench, 
  BookOpen, 
  Layers, 
  FileText, 
  MessageSquareText, 
  Building, 
  Bot, 
  Image as ImageIcon, 
  Database, 
  KeyRound,
  Sparkles,
  ChevronDown,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useState } from 'react';
import { getFollowUpUrgency } from '../utils/dateUtils';
import { toPersianDigits } from '../utils/phoneUtils';

export type AdminTab = 
  | 'overview'
  | 'crm'
  | 'customers'
  | 'products'
  | 'projects'
  | 'services'
  | 'articles'
  | 'categories'
  | 'quotes'
  | 'consultations'
  | 'company'
  | 'hero'
  | 'ai'
  | 'media'
  | 'backup'
  | 'security';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentTab, onSelectTab }) => {
  const { quoteRequests, consultationRequests, products, projects, articles, customers } = useData();

  const newQuotes = quoteRequests.filter(q => q.status === 'new').length;
  const newConsultations = consultationRequests.filter(c => c.status === 'new').length;

  const dueFollowUps = customers.filter(c => {
    if (!c.nextFollowUpDate || c.followUpStatus === 'completed' || c.followUpStatus === 'cancelled') return false;
    const urgency = getFollowUpUrgency(c.nextFollowUpDate, c.nextFollowUpTime, c.followUpStatus);
    return urgency.urgency === 'today' || urgency.urgency === 'overdue';
  }).length;

  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true});
  const toggleGroup = (idx: number) => setExpandedGroups(prev => ({...prev, [idx]: !prev[idx]}));

  const menuGroups = [
    {
      groupTitle: 'داشبورد',
      items: [
        { id: 'overview' as AdminTab, label: 'نمای کلی', icon: LayoutDashboard, badge: null },
      ]
    },
    {
      groupTitle: 'ارتباطات و فروش (CRM)',
      items: [
        { 
          id: 'crm' as AdminTab, 
          label: 'صفحه CRM', 
          icon: UserCheck, 
          badge: dueFollowUps > 0 ? `${toPersianDigits(dueFollowUps)} فوری` : 'تب جدید ↗',
          badgeHighlight: dueFollowUps > 0
        },
        { 
          id: 'quotes' as AdminTab, 
          label: 'درخواست استعلام قیمت', 
          icon: FileText, 
          badge: newQuotes > 0 ? `${newQuotes} جدید` : quoteRequests.length,
          badgeHighlight: newQuotes > 0
        },
        { 
          id: 'consultations' as AdminTab, 
          label: 'فرم‌های تماس و مشاوره', 
          icon: MessageSquareText, 
          badge: newConsultations > 0 ? `${newConsultations} جدید` : consultationRequests.length,
          badgeHighlight: newConsultations > 0
        },
        { 
          id: 'customers' as AdminTab, 
          label: 'مخاطبین و پیگیری‌ها', 
          icon: Users, 
          badge: toPersianDigits(customers.length),
          badgeHighlight: false
        },
      ]
    },
    {
      groupTitle: 'صفحه اصلی (Home)',
      items: [
        { id: 'hero' as AdminTab, label: 'هیرو و بنر', icon: ImageIcon, badge: null },
        { id: 'company' as AdminTab, label: 'اطلاعات شرکت', icon: Building, badge: null },
      ]
    },
    {
      groupTitle: 'کاتالوگ (Products)',
      items: [
        { id: 'products' as AdminTab, label: 'محصولات', icon: Package, badge: products.length },
        { id: 'categories' as AdminTab, label: 'دسته‌بندی‌ها', icon: Layers, badge: null },
      ]
    },
    {
      groupTitle: 'سایر صفحات (Pages)',
      items: [
        { id: 'projects' as AdminTab, label: 'پروژه‌ها', icon: Building2, badge: projects.length },
        { id: 'services' as AdminTab, label: 'خدمات', icon: Wrench, badge: null },
        { id: 'articles' as AdminTab, label: 'مقالات', icon: BookOpen, badge: articles.length },
      ]
    },
    {
      groupTitle: 'فایل‌ها و رسانه (Media)',
      items: [
        { id: 'media' as AdminTab, label: 'کتابخانه رسانه', icon: ImageIcon, badge: null },
      ]
    },
    {
      groupTitle: 'پیکربندی سیستم',
      items: [
        { id: 'ai' as AdminTab, label: 'دستیار هوش مصنوعی', icon: Bot, badge: 'فعال' },
        { id: 'security' as AdminTab, label: 'امنیت', icon: KeyRound, badge: null },
        { id: 'backup' as AdminTab, label: 'بکاپ', icon: Database, badge: null },
      ]
    }
  ];

  return (
    <aside className="w-64 sm:w-72 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <button 
              onClick={() => toggleGroup(gIdx)}
              className="w-full flex items-center justify-between px-3 mb-1 text-slate-500 hover:text-slate-300 transition-colors group"
            >
              <h4 className="text-[11px] font-bold uppercase tracking-wider">
                {group.groupTitle}
              </h4>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedGroups[gIdx] ? 'rotate-180' : ''}`} />
            </button>
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ${expandedGroups[gIdx] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={item.id === 'crm' ? 'sidebar-btn-crm-page' : undefined}
                    onClick={() => {
                      if (item.id === 'crm') {
                        try {
                          window.open('/crm', '_blank');
                        } catch (e) {
                          console.error(e);
                        }
                        onSelectTab('crm');
                        return;
                      }
                      onSelectTab(item.id);
                    }}
                    className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right group ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400/10 to-transparent text-amber-400 font-black'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-amber-400 rounded-l-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />}
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.label}</span>
                      {item.id === 'crm' && (
                        <ExternalLink className="w-3 h-3 text-amber-400/80 group-hover:text-amber-300 transition-transform group-hover:scale-110" />
                      )}
                    </div>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-amber-400/20 text-amber-300'
                          : item.badgeHighlight
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
