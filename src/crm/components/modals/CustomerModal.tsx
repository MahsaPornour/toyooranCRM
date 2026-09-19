import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Phone, 
  Building, 
  User, 
  MapPin, 
  Clock, 
  Calendar, 
  Tag, 
  CheckSquare, 
  DollarSign, 
  Layers,
  MessageSquare,
  Plus,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { CustomerContact, PipelineStage } from '../../types/crm.types';
import { PIPELINE_STAGES, PROVINCES_LIST } from '../common/crmConstants';
import { formatPhoneNumberDisplay, toPersianDigits } from '../../utils/crmPhoneUtils';
import { formatToShamsiDateTime, formatToShamsi, getTodayDateString } from '../../utils/crmDateUtils';

export const CustomerModal: React.FC = () => {
  const {
    isCustomerModalOpen,
    closeCustomerModal,
    selectedCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addFollowUpLog
  } = useCrm();

  const [form, setForm] = useState<Partial<CustomerContact>>({});
  const [newLogNote, setNewLogNote] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');

  useEffect(() => {
    if (selectedCustomer) {
      setForm({ ...selectedCustomer });
    } else {
      setForm({});
    }
    setNewLogNote('');
    setNewTagInput('');
  }, [selectedCustomer]);

  if (!isCustomerModalOpen || !form) return null;

  const isNew = !form.id;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phoneNumber) {
      alert('لطفاً نام مشتری و شماره تماس را وارد فرمایید.');
      return;
    }

    if (isNew) {
      await addCustomer({
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        email: form.email || '',
        companyName: form.companyName || '',
        role: form.role || 'مدیر فارم',
        source: form.source || 'manual',
        notes: form.notes || '',
        pipelineStage: form.pipelineStage || 'new_lead',
        dealValue: form.dealValue || '',
        farmCapacity: form.farmCapacity || '',
        province: form.province || 'مازندران',
        tags: form.tags || ['مشتری جدید'],
        nextFollowUpDate: form.nextFollowUpDate || '',
        nextFollowUpTime: form.nextFollowUpTime || '10:00',
        nextFollowUpNote: form.nextFollowUpNote || '',
        followUpPriority: form.followUpPriority || 'medium',
        followUpStatus: form.nextFollowUpDate ? 'pending' : 'none',
        followUpHistory: form.followUpHistory || []
      });
    } else {
      await updateCustomer(form.id!, form);
    }
    closeCustomerModal();
  };

  const handleDelete = async () => {
    if (form.id && window.confirm(`آیا از حذف پرونده «${form.fullName}» اطمینان دارید؟`)) {
      await deleteCustomer(form.id);
      closeCustomerModal();
    }
  };

  const handleAddLog = async () => {
    if (!newLogNote.trim() || !form.id) return;

    const logText = newLogNote.trim();
    const nowIso = new Date().toISOString();
    const shamsiDateTime = formatToShamsiDateTime(nowIso);
    const newNoteLine = `[گزارش تماس - ${shamsiDateTime}]: ${logText}`;

    // Auto-update the "توضیحات" (notes) section with the call report and its timestamp
    const currentNotes = (form.notes || '').trim();
    const updatedNotes = currentNotes ? `${currentNotes}\n${newNoteLine}` : newNoteLine;

    const newHistoryItem = {
      id: `fh-${Date.now()}`,
      date: nowIso,
      note: logText,
      status: 'completed' as const,
      priority: form.followUpPriority || 'medium'
    };

    const updatedHistory = [newHistoryItem, ...(form.followUpHistory || [])];

    // Immediately reflect in form state so it appears in the textarea and history list
    setForm(prev => ({
      ...prev,
      notes: updatedNotes,
      followUpHistory: updatedHistory,
      lastFollowUpDate: nowIso
    }));

    // Persist via CrmContext
    await addFollowUpLog(
      form.id,
      {
        date: nowIso,
        note: logText,
        status: 'completed',
        priority: form.followUpPriority || 'medium'
      },
      updatedNotes
    );

    setNewLogNote('');
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const currentTags = form.tags || [];
    if (!currentTags.includes(newTagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...currentTags, newTagInput.trim()] }));
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setForm(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isNew ? 'ثبت مخاطب و پرونده جدید فروش' : `پرونده مشتری: ${form.fullName || ''}`}
              </h3>
              <p className="text-xs text-slate-400">
                مشخصات فارم، مرحله معامله، خط لوله فروش و سوابق پیگیری
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && form.phoneNumber && (
              <a
                href={`tel:${form.phoneNumber}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono hover:bg-emerald-500/20 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{formatPhoneNumberDisplay(form.phoneNumber)}</span>
              </a>
            )}

            <button
              onClick={closeCustomerModal}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-thin">
          <form id="customer-form" onSubmit={handleSave} className="space-y-6">
            
            {/* Grid 1: Basic Info */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>مشخصات تماس و هویت مخاطب</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="مثال: حاج رضا حسینی"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">شماره تماس همراه *</label>
                  <input
                    type="tel"
                    required
                    value={form.phoneNumber || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">نام واحد پرورش / فارم / شرکت</label>
                  <input
                    type="text"
                    value={form.companyName || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="مثال: مرغداری سپید بال شمال"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Grid 2: Pipeline & Farm Specs */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>اطلاعات فارم و خط لوله فروش (Pipeline)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">مرحله فعلی فروش</label>
                  <select
                    value={form.pipelineStage || 'new_lead'}
                    onChange={(e) => setForm(prev => ({ ...prev, pipelineStage: e.target.value as PipelineStage }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {PIPELINE_STAGES.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">استان محل سالن</label>
                  <select
                    value={form.province || 'مازندران'}
                    onChange={(e) => setForm(prev => ({ ...prev, province: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {PROVINCES_LIST.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ظرفیت سالن (تعداد قطعه)</label>
                  <input
                    type="text"
                    value={form.farmCapacity || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, farmCapacity: e.target.value }))}
                    placeholder="مثال: ۳۵,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ارزش معامله (تومان)</label>
                  <input
                    type="text"
                    value={form.dealValue || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, dealValue: e.target.value }))}
                    placeholder="مثال: ۸۵۰,۰۰۰,۰۰۰"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Grid 3: Next Follow-up Reminder */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>تنظیم یادآور و موعد تماس بعدی</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">تاریخ تماس بعدی</label>
                  <input
                    type="date"
                    value={form.nextFollowUpDate || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, nextFollowUpDate: e.target.value, followUpStatus: 'pending' }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ساعت تماس</label>
                  <input
                    type="time"
                    value={form.nextFollowUpTime || '10:00'}
                    onChange={(e) => setForm(prev => ({ ...prev, nextFollowUpTime: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اولویت پیگیری</label>
                  <select
                    value={form.followUpPriority || 'medium'}
                    onChange={(e) => setForm(prev => ({ ...prev, followUpPriority: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="high">فوری / حساس</option>
                    <option value="medium">معمولی</option>
                    <option value="low">کم‌اهمیت</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">هدف و یادداشت پیگیری بعدی</label>
                <input
                  type="text"
                  value={form.nextFollowUpNote || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, nextFollowUpNote: e.target.value }))}
                  placeholder="مثال: ارسال کاتالوگ فن ۱۴۰ و استعلام پیش‌پرداخت"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Tags & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="customer-modal-notes" className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>توضیحات و یادداشت‌های پرونده</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const stamp = `\n[یادداشت مورخ ${formatToShamsiDateTime(new Date())}]: `;
                      setForm(prev => ({
                        ...prev,
                        notes: prev.notes ? `${prev.notes.trim()}${stamp}` : stamp.trim()
                      }));
                    }}
                    className="text-[10px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                    title="درج برچسب تاریخ و ساعت فعلی"
                  >
                    <Clock className="w-3 h-3" />
                    <span>درج تاریخ و ساعت</span>
                  </button>
                </div>
                <textarea
                  id="customer-modal-notes"
                  rows={4}
                  value={form.notes || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="توضیحات کلی فارم و گزارش‌های مذاکره (گزارش‌های تماس با تاریخ و ساعت به‌طور خودکار در اینجا درج می‌شوند)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  💡 پس از ثبت هر گزارش تماس، تاریخ و ساعت مذاکره به انتهای توضیحات اضافه می‌گردد.
                </span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">برچسب‌ها (Tags)</label>
                <div className="flex items-center gap-1.5 mb-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="افزودن برچسب..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold"
                  >
                    افزودن
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(form.tags || []).map(t => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-lg"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </form>

          {/* Section: Call History & Logs (Only for existing customers) */}
          {!isNew && (
            <div className="border-t border-slate-800 pt-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>تاریخچه مذاکرات و سوابق تماس</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-normal">
                  {toPersianDigits((form.followUpHistory || []).length)} رکورد تماس ثبت‌شده
                </span>
              </div>

              {/* Add new log field */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newLogNote}
                  onChange={(e) => setNewLogNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLog();
                    }
                  }}
                  placeholder="ثبت خلاصه تماس یا توافقات مذاکره با مشتری (اینتر جهت ثبت سریع)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={handleAddLog}
                  disabled={!newLogNote.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 rounded-xl text-xs font-bold transition-all shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت در تاریخچه و توضیحات</span>
                </button>
              </div>

              {/* Log items list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(form.followUpHistory || []).length === 0 ? (
                  <p className="text-xs text-slate-500 py-3">هنوز تماسی برای این پرونده ثبت نشده است.</p>
                ) : (
                  (form.followUpHistory || []).map(record => (
                    <div
                      key={record.id}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-300 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="text-slate-200">{record.note}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {formatToShamsiDateTime(record.date)}
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Buttons */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف پرونده</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeCustomerModal}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-all"
            >
              انصراف
            </button>

            <button
              type="submit"
              form="customer-form"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-400/20"
            >
              <Save className="w-4 h-4" />
              <span>{isNew ? 'ثبت نهایی مخاطب' : 'ذخیره تغییرات'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
