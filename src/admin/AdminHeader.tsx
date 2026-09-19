import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Calendar,
  Clock,
  Search,
  X,
  User,
  Building,
  Phone,
  PhoneCall,
  ExternalLink,
  LogOut,
  Bell,
  UserCheck,
  ChevronRight,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { CustomerContact } from '../types';
import { AdminTab } from './AdminSidebar';
import { getTodayShamsiFullDate, getFollowUpUrgency } from '../utils/dateUtils';
import { formatPhoneNumberDisplay, normalizePhoneNumber, toPersianDigits } from '../utils/phoneUtils';

interface AdminHeaderProps {
  onViewPublicSite: () => void;
  onSelectTab?: (tab: AdminTab) => void;
  onSelectCustomer?: (customer: CustomerContact) => void;
  onSearchCustomer?: (query: string) => void;
  onOpenNewCustomer?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  onViewPublicSite,
  onSelectTab,
  onSelectCustomer,
  onSearchCustomer,
  onOpenNewCustomer
}) => {
  const { adminUser, logout, quoteRequests, consultationRequests, customers } = useData();

  // Current Persian Date & Clock
  const [shamsiDate, setShamsiDate] = useState(() => getTodayShamsiFullDate());
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setShamsiDate(getTodayShamsiFullDate(now));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Ctrl+K / ⌘K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter customers by name, company, or phone
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const normQ = normalizePhoneNumber(q);

    return customers.filter(c => {
      const matchName = c.fullName && c.fullName.toLowerCase().includes(q);
      const matchCompany = c.companyName && c.companyName.toLowerCase().includes(q);
      const matchPhone = normQ.length > 2 && c.phoneNumber && normalizePhoneNumber(c.phoneNumber).includes(normQ);
      const matchRole = c.role && c.role.toLowerCase().includes(q);

      return matchName || matchCompany || matchPhone || matchRole;
    }).slice(0, 8); // Top 8 results for optimal UX
  }, [customers, searchQuery]);

  const handleSelectResult = (customer: CustomerContact) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectCustomer) {
      onSelectCustomer(customer);
    } else if (onSelectTab) {
      onSelectTab('customers');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    if (onSearchCustomer) {
      onSearchCustomer(searchQuery.trim());
    } else if (onSelectTab) {
      onSelectTab('customers');
    }
  };

  const handleCreateNewCustomer = () => {
    setIsSearchOpen(false);
    if (onOpenNewCustomer) {
      onOpenNewCustomer();
    } else if (onSelectTab) {
      onSelectTab('customers');
    }
  };

  const newQuotesCount = quoteRequests.filter(q => q.status === 'new').length;
  const newConsultationsCount = consultationRequests.filter(c => c.status === 'new').length;
  const totalPending = newQuotesCount + newConsultationsCount;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-md">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Right / Brand Info */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#003F86] border border-amber-400/80 flex items-center justify-center shadow-sm shrink-0">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-amber-400 rounded-lg transform rotate-45 flex items-center justify-center bg-[#003F86]">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
            </div>
          </div>
          <div className="hidden min-[480px]:block">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-white">طیوران صنعت پویا</span>
              <span className="hidden sm:inline-block text-[9px] sm:text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                پنل مدیریت
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 block font-normal">
              سامانه کنترل جامع و ارتباط با مشتریان
            </span>
          </div>
        </div>

        {/* Center: Live Shamsi Date & Customer Search Box */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-2xl justify-center">
          
          {/* Persian Calendar Date Pill */}
          <div 
            className="hidden md:flex items-center gap-2 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner transition-colors shrink-0"
            title="تاریخ و زمان رسمی طبق گاه‌شماری خورشیدی"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="text-right leading-tight">
              <span className="text-xs font-black text-slate-100 block">
                {shamsiDate.fullText}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-0.5">
                <Clock className="w-3 h-3 text-amber-400/80" />
                <span>ساعت {toPersianDigits(currentTime)}</span>
              </div>
            </div>
          </div>

          {/* Customer Search Box (Desktop & Tablet) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="جستجوی مشتری (نام، نام خانوادگی یا شرکت)..."
                className="w-full bg-slate-950/90 hover:bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 rounded-2xl py-2 pr-9 pl-14 text-xs text-white placeholder-slate-400 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />

              {/* Clear button or shortcut badge */}
              <div className="absolute left-2.5 top-2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="پاک کردن جستجو"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-slate-850 border border-slate-700 rounded-md">
                    Ctrl+K
                  </kbd>
                )}
              </div>
            </form>

            {/* Live Search Results Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-bold flex items-center gap-1.5 text-slate-300">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>یافته‌های مخاطبان و شرکت‌ها ({searchResults.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-500">برای مشاهده کلیک کنید</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1">
                  {searchResults.length === 0 ? (
                    <div className="py-6 px-4 text-center space-y-2">
                      <p className="text-xs text-slate-400">
                        مشتری یا شرکتی با عبارت «<span className="text-white font-bold">{searchQuery}</span>» یافت نشد.
                      </p>
                      <button
                        type="button"
                        onClick={handleCreateNewCustomer}
                        className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black transition-colors shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ثبت به عنوان مخاطب جدید</span>
                      </button>
                    </div>
                  ) : (
                    searchResults.map((customer) => {
                      const urgency = getFollowUpUrgency(
                        customer.nextFollowUpDate,
                        customer.nextFollowUpTime,
                        customer.followUpStatus
                      );

                      return (
                        <div
                          key={customer.id}
                          onClick={() => handleSelectResult(customer)}
                          className="group p-2.5 rounded-xl hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Avatar */}
                            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-xs shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                              {customer.fullName ? customer.fullName.charAt(0) : <User className="w-4 h-4" />}
                            </div>

                            {/* Customer & Company Details */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                  {customer.fullName}
                                </span>
                                {customer.role && (
                                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded text-nowrap">
                                    {customer.role}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 truncate">
                                {customer.companyName ? (
                                  <span className="flex items-center gap-1 text-slate-300 font-medium truncate">
                                    <Building className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{customer.companyName}</span>
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[10px]">بدون نام شرکت</span>
                                )}

                                <span className="flex items-center gap-1 font-mono text-[10px] text-amber-400/90 shrink-0" dir="ltr">
                                  <Phone className="w-2.5 h-2.5 shrink-0" />
                                  <span>{formatPhoneNumberDisplay(customer.phoneNumber)}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Follow-up status / Action */}
                          <div className="flex items-center gap-2 shrink-0">
                            {customer.nextFollowUpDate && urgency.urgency !== 'none' && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${urgency.badgeColorClass}`}>
                                ⏰ {urgency.label}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:-translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer of dropdown */}
                {searchResults.length > 0 && (
                  <div className="p-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <span>مشاهده همه نتایج در صفحه مخاطبان</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-slate-500 text-[10px]">کلید Enter جهت جستجوی کامل</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Left / Controls & User Action */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Mobile Calendar Date Indicator */}
          <div 
            className="flex md:hidden items-center gap-1 bg-slate-950/80 border border-slate-800 px-2 py-1.5 rounded-xl text-[10px] font-bold text-slate-200"
            title={shamsiDate.fullText}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{shamsiDate.day} {shamsiDate.month}</span>
          </div>

          {/* Inquiries Notification Pill */}
          {totalPending > 0 && (
            <div 
              onClick={() => onSelectTab && onSelectTab('quotes')}
              className="cursor-pointer hidden sm:flex items-center gap-1.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors"
              title={`${newQuotesCount} استعلام و ${newConsultationsCount} مشاوره جدید`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{toPersianDigits(totalPending)} پیام جدید</span>
            </div>
          )}

          {/* View Live Public Site */}
          <button
            onClick={onViewPublicSite}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm group"
            title="مشاهده ظاهر سایت برای کاربران"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline">مشاهده سایت اصلی</span>
            <span className="lg:hidden">سایت</span>
          </button>

          {/* User Profile Tag */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-950/85 border border-slate-800 px-3 py-1.5 rounded-xl">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <span className="text-xs font-bold text-slate-200 block">
                {adminUser?.displayName || 'مدیر ارشد'}
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">
                @{adminUser?.username || 'admin'}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-colors"
            title="خروج از حساب مدیریت"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>

        </div>

      </div>
    </header>
  );
};
