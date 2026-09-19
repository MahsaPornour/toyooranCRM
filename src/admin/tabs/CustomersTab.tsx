import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  User,
  Trash2,
  X,
  Save,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Bell,
  Check,
  Sparkles,
  GitMerge,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CustomerContact, FollowUpRecord } from '../../types';
import {
  findDuplicateCustomer,
  normalizePhoneNumber,
  formatPhoneNumberDisplay,
  detectAllDuplicateGroups,
  toPersianDigits
} from '../../utils/phoneUtils';
import {
  formatToShamsi,
  formatToShamsiDateTime,
  getFollowUpUrgency,
  getTodayDateString,
  addDaysToToday,
  FollowUpUrgency
} from '../../utils/dateUtils';

type FilterTab = 'all' | 'today' | 'overdue' | 'upcoming' | 'no-reminder' | 'completed';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export interface CustomersTabProps {
  initialSearchTerm?: string;
  selectedCustomerId?: string | null;
  onClearSelectedCustomer?: () => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  initialSearchTerm = '',
  selectedCustomerId = null,
  onClearSelectedCustomer
}) => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    completeFollowUp,
    rescheduleFollowUp,
    mergeCustomers
  } = useData();

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  // Modals state
  const [isCreating, setIsCreating] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerContact | null>(null);
  const [formData, setFormData] = useState<Partial<CustomerContact>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initialSearchTerm if changed externally
  useEffect(() => {
    if (initialSearchTerm !== undefined) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Quick action modals
  const [quickCompleteTarget, setQuickCompleteTarget] = useState<CustomerContact | null>(null);
  const [quickCompleteNote, setQuickCompleteNote] = useState('');

  const [quickRescheduleTarget, setQuickRescheduleTarget] = useState<CustomerContact | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(getTodayDateString());
  const [rescheduleTime, setRescheduleTime] = useState('10:00');
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [reschedulePriority, setReschedulePriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Duplicate Scanner Modal
  const [showDuplicateScanner, setShowDuplicateScanner] = useState(false);

  // Toast / feedback message
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showFeedback = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Live duplicate detection inside form
  const detectedDuplicate = useMemo(() => {
    if (!formData.phoneNumber && !formData.email) return null;
    const excludeId = editingCustomer?.id;
    return findDuplicateCustomer(customers, formData.phoneNumber || '', formData.email, excludeId);
  }, [formData.phoneNumber, formData.email, customers, editingCustomer]);

  // Overall Statistics
  const stats = useMemo(() => {
    let overdueCount = 0;
    let todayCount = 0;
    let upcomingCount = 0;
    let completedCount = 0;
    let noReminderCount = 0;

    customers.forEach(c => {
      const urgency = getFollowUpUrgency(c.nextFollowUpDate, c.nextFollowUpTime, c.followUpStatus);
      if (c.followUpStatus === 'completed') {
        completedCount++;
      } else if (urgency.urgency === 'overdue') {
        overdueCount++;
      } else if (urgency.urgency === 'today') {
        todayCount++;
      } else if (urgency.urgency === 'upcoming') {
        upcomingCount++;
      } else {
        noReminderCount++;
      }
    });

    return {
      total: customers.length,
      overdue: overdueCount,
      today: todayCount,
      upcoming: upcomingCount,
      completed: completedCount,
      noReminder: noReminderCount,
      urgentTotal: overdueCount + todayCount
    };
  }, [customers]);

  // Duplicate groups in database
  const duplicateGroups = useMemo(() => {
    return detectAllDuplicateGroups(customers);
  }, [customers]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search term
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phoneNumber.includes(searchTerm) ||
        normalizePhoneNumber(c.phoneNumber).includes(normalizePhoneNumber(searchTerm)) ||
        (c.companyName && c.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.nextFollowUpNote && c.nextFollowUpNote.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      // Priority filter
      if (priorityFilter !== 'all' && c.followUpPriority !== priorityFilter) {
        return false;
      }

      // Tab filter
      const urgency = getFollowUpUrgency(c.nextFollowUpDate, c.nextFollowUpTime, c.followUpStatus);
      if (filterTab === 'today') {
        return urgency.urgency === 'today' && c.followUpStatus !== 'completed';
      }
      if (filterTab === 'overdue') {
        return urgency.urgency === 'overdue' && c.followUpStatus !== 'completed';
      }
      if (filterTab === 'upcoming') {
        return urgency.urgency === 'upcoming' && c.followUpStatus !== 'completed';
      }
      if (filterTab === 'completed') {
        return c.followUpStatus === 'completed';
      }
      if (filterTab === 'no-reminder') {
        return !c.nextFollowUpDate || c.followUpStatus === 'none';
      }

      return true;
    }).sort((a, b) => {
      // Sort priority: overdue & today first, then upcoming by date
      const urgencyA = getFollowUpUrgency(a.nextFollowUpDate, a.nextFollowUpTime, a.followUpStatus);
      const urgencyB = getFollowUpUrgency(b.nextFollowUpDate, b.nextFollowUpTime, b.followUpStatus);

      const rank = (u: FollowUpUrgency, status?: string) => {
        if (status === 'completed') return 5;
        if (u === 'overdue') return 1;
        if (u === 'today') return 2;
        if (u === 'upcoming') return 3;
        return 4;
      };

      const rankDiff = rank(urgencyA.urgency, a.followUpStatus) - rank(urgencyB.urgency, b.followUpStatus);
      if (rankDiff !== 0) return rankDiff;

      // Compare dates
      if (a.nextFollowUpDate && b.nextFollowUpDate) {
        return a.nextFollowUpDate.localeCompare(b.nextFollowUpDate);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [customers, searchTerm, filterTab, priorityFilter]);

  // Open Create
  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setFormData({
      fullName: '',
      phoneNumber: '',
      companyName: '',
      role: '',
      email: '',
      notes: '',
      source: 'manual',
      nextFollowUpDate: getTodayDateString(),
      nextFollowUpTime: '10:00',
      nextFollowUpNote: '',
      followUpPriority: 'medium',
      followUpStatus: 'pending'
    });
    setFormError(null);
    setIsCreating(true);
  };

  // Open Edit
  const handleOpenEdit = (customer: CustomerContact) => {
    setEditingCustomer(customer);
    setFormData({
      ...customer,
      nextFollowUpDate: customer.nextFollowUpDate || '',
      nextFollowUpTime: customer.nextFollowUpTime || '10:00',
      nextFollowUpNote: customer.nextFollowUpNote || '',
      followUpPriority: customer.followUpPriority || 'medium',
      followUpStatus: customer.followUpStatus || 'pending'
    });
    setFormError(null);
    setIsCreating(false);
  };

  // Open modal if selectedCustomerId prop is provided
  useEffect(() => {
    if (selectedCustomerId) {
      const target = customers.find(c => c.id === selectedCustomerId);
      if (target) {
        handleOpenEdit(target);
        onClearSelectedCustomer?.();
      }
    }
  }, [selectedCustomerId, customers]);

  // Save Customer (with Duplicate Prevention check)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = (formData.fullName || '').trim();
    const phone = (formData.phoneNumber || '').trim();

    if (!name) {
      setFormError('لطفاً نام و نام خانوادگی مخاطب را وارد نمایید.');
      return;
    }
    if (!phone) {
      setFormError('لطفاً شماره تماس معتبر وارد نمایید.');
      return;
    }

    // Duplicate Check
    const existing = findDuplicateCustomer(
      customers,
      phone,
      formData.email,
      editingCustomer ? editingCustomer.id : undefined
    );

    if (existing) {
      setFormError(`خطا در ثبت: این شماره تماس قبلاً با نام «${existing.fullName}» و نام شرکت «${existing.companyName || 'ثبت نشده'}» ذخیره شده است.`);
      return;
    }

    const hasFollowUp = Boolean(formData.nextFollowUpDate);

    if (isCreating) {
      const newCustomer: CustomerContact = {
        id: 'cust-' + Date.now(),
        fullName: name,
        phoneNumber: phone,
        email: formData.email?.trim() || '',
        companyName: formData.companyName?.trim() || '',
        role: formData.role?.trim() || '',
        source: formData.source || 'manual',
        notes: formData.notes?.trim() || '',
        createdAt: new Date().toISOString(),
        nextFollowUpDate: formData.nextFollowUpDate || undefined,
        nextFollowUpTime: formData.nextFollowUpTime || undefined,
        nextFollowUpNote: formData.nextFollowUpNote?.trim() || undefined,
        followUpPriority: formData.followUpPriority || 'medium',
        followUpStatus: hasFollowUp ? (formData.followUpStatus || 'pending') : 'none',
        followUpHistory: []
      };

      const res = addCustomer(newCustomer);
      if (!res.success) {
        setFormError(res.message || 'خطا در ثبت مخاطب تکراری');
        return;
      }
      showFeedback('مخاطب جدید با موفقیت در سیستم ثبت گردید.');
    } else if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        fullName: name,
        phoneNumber: phone,
        email: formData.email?.trim() || '',
        companyName: formData.companyName?.trim() || '',
        role: formData.role?.trim() || '',
        notes: formData.notes?.trim() || '',
        nextFollowUpDate: formData.nextFollowUpDate || undefined,
        nextFollowUpTime: formData.nextFollowUpTime || undefined,
        nextFollowUpNote: formData.nextFollowUpNote?.trim() || undefined,
        followUpPriority: formData.followUpPriority || 'medium',
        followUpStatus: hasFollowUp ? (formData.followUpStatus || 'pending') : 'none'
      });
      showFeedback('اطلاعات مخاطب با موفقیت به‌روزرسانی شد.');
    }

    setIsCreating(false);
    setEditingCustomer(null);
    setFormData({});
  };

  // Quick mark follow-up as completed
  const handleQuickCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCompleteTarget) return;

    completeFollowUp(quickCompleteTarget.id, quickCompleteNote);
    showFeedback(`پیگیری مخاطب «${quickCompleteTarget.fullName}» به اتمام رسید و در تاریخچه ثبت شد.`);
    setQuickCompleteTarget(null);
    setQuickCompleteNote('');
  };

  // Quick reschedule follow-up
  const handleQuickRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickRescheduleTarget || !rescheduleDate) return;

    rescheduleFollowUp(
      quickRescheduleTarget.id,
      rescheduleDate,
      rescheduleTime,
      rescheduleNote,
      reschedulePriority
    );
    showFeedback(`موعد پیگیری جدید برای «${quickRescheduleTarget.fullName}» با موفقیت تنظیم شد.`);
    setQuickRescheduleTarget(null);
    setRescheduleNote('');
  };

  // Switch to editing the detected duplicate customer
  const handleSwitchToDuplicate = () => {
    if (detectedDuplicate) {
      handleOpenEdit(detectedDuplicate);
    }
  };

  // Merge form info into detected duplicate
  const handleMergeIntoDuplicate = () => {
    if (!detectedDuplicate) return;

    const mergedNotes = [
      detectedDuplicate.notes,
      formData.notes ? `[یادداشت جدید]: ${formData.notes}` : '',
      formData.companyName && !detectedDuplicate.companyName ? `[شرکت جدید]: ${formData.companyName}` : ''
    ].filter(Boolean).join('\n---\n');

    updateCustomer(detectedDuplicate.id, {
      notes: mergedNotes,
      companyName: detectedDuplicate.companyName || formData.companyName,
      role: detectedDuplicate.role || formData.role,
      email: detectedDuplicate.email || formData.email,
      nextFollowUpDate: formData.nextFollowUpDate || detectedDuplicate.nextFollowUpDate,
      nextFollowUpTime: formData.nextFollowUpTime || detectedDuplicate.nextFollowUpTime,
      nextFollowUpNote: formData.nextFollowUpNote || detectedDuplicate.nextFollowUpNote,
      followUpStatus: formData.nextFollowUpDate ? 'pending' : detectedDuplicate.followUpStatus
    });

    showFeedback(`اطلاعات با مخاطب موجود «${detectedDuplicate.fullName}» ادغام شد.`);
    setIsCreating(false);
    setEditingCustomer(null);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-xs font-bold transition-all animate-bounce ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40 shadow-emerald-950/50'
              : feedbackMessage.type === 'error'
              ? 'bg-rose-950/90 text-rose-200 border-rose-500/40 shadow-rose-950/50'
              : 'bg-slate-900/90 text-amber-200 border-amber-500/40 shadow-slate-950/50'
          }`}
        >
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : feedbackMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Header & KPI Summary Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>مدیریت مخاطبین و پیگیری‌های CRM</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                    {toPersianDigits(customers.length)} مخاطب
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  ثبت هوشمند مشتریان، جلوگیری قطعی از مخاطب تکراری و مدیریت یادآوری‌های پیگیری
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Duplicate Scanner Button */}
            {duplicateGroups.length > 0 && (
              <button
                onClick={() => setShowDuplicateScanner(true)}
                className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{toPersianDigits(duplicateGroups.length)} مورد تکراری نیازمند بررسی</span>
              </button>
            )}

            <button
              onClick={handleOpenCreate}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-lg shadow-amber-400/20"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن مخاطب جدید</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {/* Today */}
          <button
            onClick={() => setFilterTab('today')}
            className={`p-3.5 rounded-2xl border text-right transition-all group ${
              filterTab === 'today'
                ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">موعد امروز</span>
              <Bell className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {toPersianDigits(stats.today)}
              </span>
              <span className="text-[11px] text-slate-500">مورد</span>
            </div>
          </button>

          {/* Overdue */}
          <button
            onClick={() => setFilterTab('overdue')}
            className={`p-3.5 rounded-2xl border text-right transition-all group ${
              filterTab === 'overdue'
                ? 'bg-rose-500/15 border-rose-400 shadow-md ring-1 ring-rose-400/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-rose-500/40 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">معوقه و فوری</span>
              <AlertCircle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-400 font-mono">
                {toPersianDigits(stats.overdue)}
              </span>
              <span className="text-[11px] text-slate-500">نیاز به تماس</span>
            </div>
          </button>

          {/* Upcoming */}
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`p-3.5 rounded-2xl border text-right transition-all group ${
              filterTab === 'upcoming'
                ? 'bg-blue-500/15 border-blue-400 shadow-md ring-1 ring-blue-400/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-blue-500/40 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">پیگیری‌های آینده</span>
              <Calendar className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-400 font-mono">
                {toPersianDigits(stats.upcoming)}
              </span>
              <span className="text-[11px] text-slate-500">برنامه‌ریزی شده</span>
            </div>
          </button>

          {/* Completed */}
          <button
            onClick={() => setFilterTab('completed')}
            className={`p-3.5 rounded-2xl border text-right transition-all group ${
              filterTab === 'completed'
                ? 'bg-emerald-500/15 border-emerald-400 shadow-md ring-1 ring-emerald-400/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">انجام‌شده</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {toPersianDigits(stats.completed)}
              </span>
              <span className="text-[11px] text-slate-500">پیگیری موفق</span>
            </div>
          </button>

          {/* All */}
          <button
            onClick={() => setFilterTab('all')}
            className={`p-3.5 rounded-2xl border text-right transition-all col-span-2 sm:col-span-4 lg:col-span-1 group ${
              filterTab === 'all'
                ? 'bg-slate-800 border-slate-600 shadow-md ring-1 ring-slate-500/50'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">کل بانک مخاطبین</span>
              <Users className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white font-mono">
                {toPersianDigits(stats.total)}
              </span>
              <span className="text-[11px] text-slate-500">پرونده فعال</span>
            </div>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="flex-1 w-full flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 focus-within:border-amber-400 transition-colors">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="جستجوی سریع با نام، شماره تماس، شرکت یا موضوع پیگیری..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none text-white text-xs px-3 py-1 focus:outline-none placeholder:text-slate-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-slate-500 hover:text-white p-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap">اولویت:</span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 w-full md:w-auto">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  priorityFilter === 'all'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                همه
              </button>
              <button
                onClick={() => setPriorityFilter('high')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  priorityFilter === 'high'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-rose-400/70 hover:text-rose-300'
                }`}
              >
                فوری
              </button>
              <button
                onClick={() => setPriorityFilter('medium')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  priorityFilter === 'medium'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400/70 hover:text-amber-300'
                }`}
              >
                عادی
              </button>
              <button
                onClick={() => setPriorityFilter('low')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  priorityFilter === 'low'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-blue-400/70 hover:text-blue-300'
                }`}
              >
                کم
              </button>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              filterTab === 'all'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            همه مخاطبین ({toPersianDigits(stats.total)})
          </button>
          <button
            onClick={() => setFilterTab('today')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              filterTab === 'today'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'bg-slate-950 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>موعد امروز ({toPersianDigits(stats.today)})</span>
          </button>
          <button
            onClick={() => setFilterTab('overdue')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              filterTab === 'overdue'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-950 border border-rose-500/30 text-rose-300 hover:bg-rose-500/10'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>معوقه و فوری ({toPersianDigits(stats.overdue)})</span>
          </button>
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              filterTab === 'upcoming'
                ? 'bg-blue-500 text-white shadow'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            پیش‌رو ({toPersianDigits(stats.upcoming)})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              filterTab === 'completed'
                ? 'bg-emerald-500 text-slate-950 shadow font-black'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            تکمیل‌شده ({toPersianDigits(stats.completed)})
          </button>
          <button
            onClick={() => setFilterTab('no-reminder')}
            className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
              filterTab === 'no-reminder'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-950 border border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            بدون پیگیری ({toPersianDigits(stats.noReminder)})
          </button>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-900/30 border border-slate-800/80 rounded-3xl">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-40" />
            <h4 className="text-sm font-bold text-slate-300">مخاطبی مطابق با فیلتر یافت نشد</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              می‌توانید عبارت جستجو یا فیلترهای فعال را تغییر دهید یا مخاطب جدید ثبت نمایید.
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/20 text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>ثبت مخاطب جدید</span>
            </button>
          </div>
        ) : (
          filteredCustomers.map(customer => {
            const urgency = getFollowUpUrgency(
              customer.nextFollowUpDate,
              customer.nextFollowUpTime,
              customer.followUpStatus
            );

            const isPendingFollowUp =
              customer.nextFollowUpDate &&
              customer.followUpStatus !== 'completed' &&
              customer.followUpStatus !== 'cancelled';

            return (
              <div
                key={customer.id}
                className={`bg-slate-900/60 backdrop-blur-md border p-5 rounded-3xl transition-all duration-200 flex flex-col justify-between group shadow-lg ${
                  urgency.urgency === 'overdue' && customer.followUpStatus !== 'completed'
                    ? 'border-rose-500/40 hover:border-rose-500/70 shadow-rose-950/20'
                    : urgency.urgency === 'today' && customer.followUpStatus !== 'completed'
                    ? 'border-amber-500/50 hover:border-amber-400 shadow-amber-950/20 ring-1 ring-amber-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badges & Edit Button */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Urgency Badge */}
                      {customer.nextFollowUpDate && (
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-full border font-bold flex items-center gap-1 ${urgency.badgeColorClass}`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>{urgency.label}</span>
                        </span>
                      )}

                      {/* Priority Chip */}
                      {customer.followUpPriority && isPendingFollowUp && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${
                            customer.followUpPriority === 'high'
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                              : customer.followUpPriority === 'medium'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {customer.followUpPriority === 'high'
                            ? 'اولویت بالا'
                            : customer.followUpPriority === 'medium'
                            ? 'اولویت عادی'
                            : 'اولویت کم'}
                        </span>
                      )}

                      {/* Completed Badge */}
                      {customer.followUpStatus === 'completed' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>پیگیری شد</span>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenEdit(customer)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors shrink-0"
                    >
                      ویرایش
                    </button>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3 mt-2">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-inner border ${
                        urgency.urgency === 'overdue' && customer.followUpStatus !== 'completed'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : urgency.urgency === 'today' && customer.followUpStatus !== 'completed'
                          ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {customer.fullName.slice(0, 1)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-white truncate flex items-center gap-1.5">
                        <span>{customer.fullName}</span>
                      </h3>
                      {customer.companyName && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1 truncate">
                          <Building className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                          <span className="truncate">
                            {customer.companyName} {customer.role && `(${customer.role})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Links */}
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <a
                        href={`tel:${customer.phoneNumber}`}
                        className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors group/tel font-mono"
                        dir="ltr"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-500 group-hover/tel:text-amber-400" />
                        <span>{formatPhoneNumberDisplay(customer.phoneNumber)}</span>
                      </a>
                      <a
                        href={`tel:${customer.phoneNumber}`}
                        className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"
                      >
                        <span>تماس</span>
                      </a>
                    </div>

                    {customer.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-400" dir="ltr">
                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Follow-up Note Section */}
                  {customer.nextFollowUpNote && (
                    <div className="mt-3 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-2.5 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                        <Sparkles className="w-3 h-3" />
                        <span>موضوع و شرح پیگیری:</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                        {customer.nextFollowUpNote}
                      </p>
                    </div>
                  )}

                  {/* General Notes snippet */}
                  {customer.notes && !customer.nextFollowUpNote && (
                    <div className="mt-3 text-[11px] text-slate-400 bg-slate-950/50 p-2.5 rounded-2xl border border-slate-800/60 line-clamp-2">
                      <span className="font-bold text-slate-300 ml-1">یادداشت:</span>
                      {customer.notes}
                    </div>
                  )}
                </div>

                {/* Card Footer Quick Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Quick Reschedule */}
                    <button
                      onClick={() => {
                        setQuickRescheduleTarget(customer);
                        setRescheduleDate(customer.nextFollowUpDate || getTodayDateString());
                        setRescheduleTime(customer.nextFollowUpTime || '10:00');
                        setRescheduleNote(customer.nextFollowUpNote || '');
                        setReschedulePriority(customer.followUpPriority || 'medium');
                      }}
                      className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                      title="تنظیم یا تمدید زمان پیگیری"
                    >
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>{customer.nextFollowUpDate ? 'تغییر موعد' : 'تعیین پیگیری'}</span>
                    </button>

                    {/* Quick Complete (if pending) */}
                    {isPendingFollowUp && (
                      <button
                        onClick={() => {
                          setQuickCompleteTarget(customer);
                          setQuickCompleteNote(`تماس برقرار شد و پیگیری انجام گردید.`);
                        }}
                        className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                        title="ثبت به عنوان انجام شده"
                      >
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>انجام شد</span>
                      </button>
                    )}
                  </div>

                  {/* History indicator */}
                  {customer.followUpHistory && customer.followUpHistory.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {toPersianDigits(customer.followUpHistory.length)} تماس ثبت‌شده
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= MODAL: CREATE / EDIT CUSTOMER ================= */}
      {(isCreating || editingCustomer) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    {isCreating ? 'ثبت مخاطب جدید در سیستم' : 'ویرایش پرونده مخاطب'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    سیستم بررسی خودکار عدم تکرار شماره تماس و تنظیم یادآوری پیگیری
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingCustomer(null);
                  setFormError(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* LIVE DUPLICATE WARNING BOX */}
            {detectedDuplicate && (
              <div className="mx-6 mt-5 p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-200 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-2 flex-1">
                    <div className="font-black text-xs text-rose-300 flex items-center justify-between">
                      <span>هشدار: مخاطب تکراری در سیستم شناسایی شد!</span>
                      <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded-full font-mono">
                        کد: {detectedDuplicate.id}
                      </span>
                    </div>
                    <p className="text-xs text-rose-200 leading-relaxed">
                      این شماره تماس یا ایمیل قبلاً برای مخاطب{' '}
                      <strong className="text-white font-black underline">
                        «{detectedDuplicate.fullName}»
                      </strong>{' '}
                      {detectedDuplicate.companyName && (
                        <span>از شرکت «{detectedDuplicate.companyName}» </span>
                      )}
                      در تاریخ {formatToShamsi(detectedDuplicate.createdAt)} ثبت شده است.
                    </p>

                    {/* Action buttons for duplicate */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSwitchToDuplicate}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>مشاهده و ویرایش مخاطب موجود</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleMergeIntoDuplicate}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs px-3.5 py-1.5 rounded-xl border border-amber-400/30 transition-colors flex items-center gap-1.5"
                      >
                        <GitMerge className="w-3.5 h-3.5 text-amber-400" />
                        <span>ادغام اطلاعات جدید با مخاطب موجود</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Section 1: Contact Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>اطلاعات فردی و شناسنامه مخاطب</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      نام و نام خانوادگی <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مهندس احمد رضایی"
                      value={formData.fullName || ''}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      شماره تماس همراه / ثابت <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="09123456789"
                      value={formData.phoneNumber || ''}
                      onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors text-left font-mono ${
                        detectedDuplicate
                          ? 'border-rose-500 ring-1 ring-rose-500/50'
                          : 'border-slate-800 focus:border-amber-400'
                      }`}
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      سیستم هوشمند به طور خودکار شماره را اعتبارسنجی و از ثبت مجدد جلوگیری می‌کند.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      نام شرکت، فارم یا مجتمع
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مرغداری صنعتی خاوران"
                      value={formData.companyName || ''}
                      onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      سمت یا حوزه فعالیت
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مدیر تولید، مدیرعامل، دکتر دامپزشک"
                      value={formData.role || ''}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      آدرس ایمیل (اختیاری)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      placeholder="name@example.com"
                      value={formData.email || ''}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors text-left"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Follow-up Reminder Settings (قابلیت یادآوری پیگیری) */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>تنظیم یادآوری پیگیری بعدی (Follow-up Reminder)</span>
                  </h4>
                  {formData.nextFollowUpDate && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, nextFollowUpDate: '', nextFollowUpNote: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300"
                    >
                      حذف پیگیری
                    </button>
                  )}
                </div>

                {/* Quick Date Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400">میانبرهای تاریخ:</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nextFollowUpDate: getTodayDateString() })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-slate-700 transition-colors"
                  >
                    امروز
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nextFollowUpDate: addDaysToToday(1) })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
                  >
                    فردا
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nextFollowUpDate: addDaysToToday(3) })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
                  >
                    ۳ روز بعد
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nextFollowUpDate: addDaysToToday(7) })}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors"
                  >
                    ۱ هفته بعد
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      تاریخ پیگیری
                    </label>
                    <input
                      type="date"
                      value={formData.nextFollowUpDate || ''}
                      onChange={e => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                    {formData.nextFollowUpDate && (
                      <p className="text-[10px] text-amber-400 mt-1">
                        معادل شمسی: {formatToShamsi(formData.nextFollowUpDate)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      ساعت تماس / جلسه
                    </label>
                    <input
                      type="time"
                      value={formData.nextFollowUpTime || '10:00'}
                      onChange={e => setFormData({ ...formData, nextFollowUpTime: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      اولویت پیگیری
                    </label>
                    <select
                      value={formData.followUpPriority || 'medium'}
                      onChange={e => setFormData({ ...formData, followUpPriority: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="high">فوری و حیاتی (قرمز)</option>
                      <option value="medium">عادی (زرد)</option>
                      <option value="low">کم‌اهمیت (آبی)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      موضوع و شرح پیگیری بعدی
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: تماس جهت اعلام قیمت نهایی پرس پلت و ارسال پیش‌فاکتور رسمی"
                      value={formData.nextFollowUpNote || ''}
                      onChange={e => setFormData({ ...formData, nextFollowUpNote: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Notes & History */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    یادداشت‌های پرونده و توضیحات سابقه
                  </label>
                  <textarea
                    rows={2}
                    placeholder="توضیحات کلی، سوابق مذاکرات یا جزئیات تجهیزات مورد نیاز مشتری..."
                    value={formData.notes || ''}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Follow-up History Viewer (if editing) */}
                {editingCustomer?.followUpHistory && editingCustomer.followUpHistory.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      تاریخچه تماس‌ها و پیگیری‌های قبلی ({toPersianDigits(editingCustomer.followUpHistory.length)}):
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                      {editingCustomer.followUpHistory.map(record => (
                        <div
                          key={record.id}
                          className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>{record.performedBy || 'مدیر سیستم'}</span>
                              <span>{formatToShamsiDateTime(record.date)}</span>
                            </div>
                            <p className="text-slate-200 mt-1 text-[11px] leading-relaxed">
                              {record.note}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-6">
                {editingCustomer ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('آیا از حذف این مخاطب اطمینان دارید؟')) {
                        deleteCustomer(editingCustomer.id);
                        setEditingCustomer(null);
                        showFeedback('مخاطب با موفقیت حذف شد.', 'info');
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1.5 px-2 py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف مخاطب</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCustomer(null);
                      setFormError(null);
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    انصراف
                  </button>

                  <button
                    type="submit"
                    disabled={Boolean(detectedDuplicate && isCreating)}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all ${
                      detectedDuplicate && isCreating
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    <span>{isCreating ? 'ثبت مخاطب در سیستم' : 'ذخیره تغییرات'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK RESCHEDULE ================= */}
      {quickRescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  تنظیم موعد پیگیری برای «{quickRescheduleTarget.fullName}»
                </h3>
              </div>
              <button
                onClick={() => setQuickRescheduleTarget(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickRescheduleSubmit} className="p-5 space-y-4">
              {/* Quick presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
                <button
                  type="button"
                  onClick={() => setRescheduleDate(getTodayDateString())}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 font-bold border border-slate-700"
                >
                  امروز
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleDate(addDaysToToday(1))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold border border-slate-700"
                >
                  فردا
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleDate(addDaysToToday(3))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold border border-slate-700"
                >
                  ۳ روز بعد
                </button>
                <button
                  type="button"
                  onClick={() => setRescheduleDate(addDaysToToday(7))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 font-bold border border-slate-700"
                >
                  ۱ هفته بعد
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تاریخ پیگیری</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={e => setRescheduleDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 font-mono"
                  />
                  <p className="text-[10px] text-amber-400 mt-1">
                    شمسی: {formatToShamsi(rescheduleDate)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">ساعت تماس</label>
                  <input
                    type="time"
                    value={rescheduleTime}
                    onChange={e => setRescheduleTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اولویت</label>
                <select
                  value={reschedulePriority}
                  onChange={e => setReschedulePriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                >
                  <option value="high">فوری و معوقه (قرمز)</option>
                  <option value="medium">عادی (زرد)</option>
                  <option value="low">کم‌اهمیت (آبی)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">موضوع و شرح پیگیری</label>
                <input
                  type="text"
                  placeholder="مثال: تماس جهت هماهنگی جلسه حضوری یا ارسال برآورد مالی"
                  value={rescheduleNote}
                  onChange={e => setRescheduleNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickRescheduleTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ثبت موعد پیگیری</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK COMPLETE ================= */}
      {quickCompleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-white">
                  ثبت اتمام پیگیری «{quickCompleteTarget.fullName}»
                </h3>
              </div>
              <button
                onClick={() => setQuickCompleteTarget(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickCompleteSubmit} className="p-5 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                این پیگیری به عنوان تکمیل‌شده علامت‌گذاری شده و در سابقه پرونده مخاطب ماندگار می‌شود.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نتیجه و توضیحات پیگیری انجام‌شده
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="نتیجه تماس، توافقات صورت‌گرفته یا پاسخ مشتری..."
                  value={quickCompleteNote}
                  onChange={e => setQuickCompleteNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuickCompleteTarget(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>تأیید و ثبت در سابقه</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DUPLICATE SCANNER & MERGER ================= */}
      {showDuplicateScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    ابزار بررسی و ادغام موارد تکراری ({toPersianDigits(duplicateGroups.length)} گروه)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    مخاطبینی با شماره تلفن یا ایمیل یکسان برای یکپارچه‌سازی و جلوگیری از تداخل
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDuplicateScanner(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {duplicateGroups.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-bold text-slate-200">
                    هیچ مورد تکراری در بانک مخاطبین یافت نشد!
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    تمام مخاطبین دارای شماره تماس و ایمیل منحصر‌به‌فرد هستند.
                  </p>
                </div>
              ) : (
                duplicateGroups.map((group, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        <span>شاخص تشابه: {group.key}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {toPersianDigits(group.customers.length)} رکورد مشابه
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.customers.map((c, cIdx) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs"
                        >
                          <div>
                            <span className="font-bold text-white ml-2">{c.fullName}</span>
                            {c.companyName && (
                              <span className="text-[11px] text-slate-400">({c.companyName})</span>
                            )}
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              ثبت شده در: {formatToShamsi(c.createdAt)} | پیگیری:{' '}
                              {c.nextFollowUpDate ? formatToShamsi(c.nextFollowUpDate) : 'ندارد'}
                            </div>
                          </div>

                          {cIdx === 0 ? (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                              رکورد اصلی
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                              تکراری
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Merge button */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          const primary = group.customers[0];
                          const secondaryIds = group.customers.slice(1).map(c => c.id);
                          mergeCustomers(primary.id, secondaryIds);
                          showFeedback(`رکوردهای تکراری با موفقیت در «${primary.fullName}» ادغام شدند.`);
                        }}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <GitMerge className="w-3.5 h-3.5" />
                        <span>ادغام در رکورد اول و حذف تکراری‌ها</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setShowDuplicateScanner(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
