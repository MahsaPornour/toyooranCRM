import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Building, 
  Search,
  Plus,
  RotateCcw,
  Check
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { CustomerContact } from '../../types/crm.types';
import { formatPhoneNumberDisplay, toPersianDigits } from '../../utils/crmPhoneUtils';
import { formatToShamsi, getFollowUpUrgency, addDaysToToday, getTodayDateString } from '../../utils/crmDateUtils';

export const CrmFollowUpsView: React.FC = () => {
  const {
    customers,
    updateCustomer,
    addFollowUpLog,
    openEditCustomerModal
  } = useCrm();

  const [subFilter, setSubFilter] = useState<'today' | 'overdue' | 'future' | 'completed'>('today');
  const [search, setSearch] = useState<string>('');
  const [quickLogNote, setQuickLogNote] = useState<{ [id: string]: string }>({});
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  const categorized = useMemo(() => {
    const todayList: CustomerContact[] = [];
    const overdueList: CustomerContact[] = [];
    const futureList: CustomerContact[] = [];
    const completedList: CustomerContact[] = [];

    (customers || []).forEach(c => {
      if (c.followUpStatus === 'completed') {
        completedList.push(c);
        return;
      }
      if (!c.nextFollowUpDate) return;

      const u = getFollowUpUrgency(c.nextFollowUpDate, c.nextFollowUpTime, c.followUpStatus);
      if (u.urgency === 'today') {
        todayList.push(c);
      } else if (u.urgency === 'overdue') {
        overdueList.push(c);
      } else {
        futureList.push(c);
      }
    });

    return { todayList, overdueList, futureList, completedList };
  }, [customers]);

  const currentList = useMemo(() => {
    let list: CustomerContact[] = [];
    if (subFilter === 'today') list = categorized.todayList;
    else if (subFilter === 'overdue') list = categorized.overdueList;
    else if (subFilter === 'future') list = categorized.futureList;
    else if (subFilter === 'completed') list = categorized.completedList;

    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(c => 
      (c.fullName || '').toLowerCase().includes(q) ||
      (c.phoneNumber || '').includes(q) ||
      (c.companyName || '').toLowerCase().includes(q) ||
      (c.nextFollowUpNote || '').toLowerCase().includes(q)
    );
  }, [categorized, subFilter, search]);

  const handlePostpone = async (customerId: string, days: number) => {
    const newDate = addDaysToToday(days);
    await updateCustomer(customerId, {
      nextFollowUpDate: newDate,
      followUpStatus: 'pending'
    });
  };

  const handleSaveQuickLog = async (customerId: string) => {
    const note = quickLogNote[customerId]?.trim();
    if (!note) return;

    await addFollowUpLog(customerId, {
      date: new Date().toISOString(),
      note,
      status: 'completed',
      priority: 'medium'
    });

    // Update customer status to completed
    await updateCustomer(customerId, {
      followUpStatus: 'completed',
      lastFollowUpDate: getTodayDateString()
    });

    setQuickLogNote(prev => ({ ...prev, [customerId]: '' }));
    setActiveLogId(null);
  };

  return (
    <div className="space-y-4">
      {/* Sub-Tabs and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSubFilter('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subFilter === 'today'
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>موعد امروز</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20">
              {toPersianDigits(categorized.todayList.length)}
            </span>
          </button>

          <button
            onClick={() => setSubFilter('overdue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subFilter === 'overdue'
                ? 'bg-rose-500 text-white font-black'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>معوقه و فوری</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20">
              {toPersianDigits(categorized.overdueList.length)}
            </span>
          </button>

          <button
            onClick={() => setSubFilter('future')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subFilter === 'future'
                ? 'bg-blue-500 text-white font-black'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>موعد آینده</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20">
              {toPersianDigits(categorized.futureList.length)}
            </span>
          </button>

          <button
            onClick={() => setSubFilter('completed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              subFilter === 'completed'
                ? 'bg-emerald-500 text-white font-black'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>انجام‌شده</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20">
              {toPersianDigits(categorized.completedList.length)}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی پیگیری..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

      </div>

      {/* List Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {currentList.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl">
            <CheckCircle2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">هیچ مورد پیگیری در این دسته وجود ندارد.</p>
          </div>
        ) : (
          currentList.map(customer => {
            const isLogging = activeLogId === customer.id;

            return (
              <div
                key={customer.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 transition-all"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        onClick={() => openEditCustomerModal(customer)}
                        className="text-sm font-black text-white hover:text-amber-400 cursor-pointer transition-colors"
                      >
                        {customer.fullName}
                      </h4>
                      {customer.companyName && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{customer.companyName}</span>
                        </div>
                      )}
                    </div>

                    <a
                      href={`tel:${customer.phoneNumber}`}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-bold transition-all"
                      title="تماس مستقیم"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{formatPhoneNumberDisplay(customer.phoneNumber)}</span>
                    </a>
                  </div>

                  {/* Scheduled date & time */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs">
                    <span className="text-slate-400">موعد تماس:</span>
                    <span className="font-bold text-amber-300">
                      {formatToShamsi(customer.nextFollowUpDate)}
                    </span>
                    {customer.nextFollowUpTime && (
                      <span className="font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {customer.nextFollowUpTime}
                      </span>
                    )}
                  </div>

                  {/* Follow-up Note */}
                  {customer.nextFollowUpNote && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      {customer.nextFollowUpNote}
                    </div>
                  )}
                </div>

                {/* Quick Logging Drawer or Buttons */}
                <div className="pt-2 border-t border-slate-800/60 space-y-2">
                  {isLogging ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={quickLogNote[customer.id] || ''}
                        onChange={(e) => setQuickLogNote(prev => ({ ...prev, [customer.id]: e.target.value }))}
                        placeholder="خلاصه مکالمه و نتیجه تماس با مشتری را بنویسید..."
                        className="w-full bg-slate-950 border border-amber-400/40 rounded-xl p-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setActiveLogId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          انصراف
                        </button>
                        <button
                          onClick={() => handleSaveQuickLog(customer.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>ثبت و تکمیل</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-1 flex-wrap">
                      <button
                        onClick={() => setActiveLogId(customer.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ثبت نتیجه تماس</span>
                      </button>

                      {/* Postpone buttons */}
                      <div className="flex items-center gap-1 text-[10px]">
                        <span className="text-slate-500">تعویق:</span>
                        <button
                          onClick={() => handlePostpone(customer.id, 1)}
                          className="px-1.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                          title="انتقال به فردا"
                        >
                          +۱ روز
                        </button>
                        <button
                          onClick={() => handlePostpone(customer.id, 3)}
                          className="px-1.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                          title="انتقال به ۳ روز بعد"
                        >
                          +۳ روز
                        </button>
                        <button
                          onClick={() => handlePostpone(customer.id, 7)}
                          className="px-1.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800"
                          title="انتقال به ۱ هفته بعد"
                        >
                          +۱ هفته
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
