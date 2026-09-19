import React, { useState } from 'react';
import { 
  CopyCheck, 
  GitMerge, 
  AlertTriangle, 
  Check, 
  Building, 
  Phone, 
  Trash2, 
  ShieldCheck 
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { DuplicateGroup, CustomerContact } from '../../types/crm.types';
import { formatPhoneNumberDisplay, toPersianDigits } from '../../utils/crmPhoneUtils';
import { formatToShamsi } from '../../utils/crmDateUtils';

export const CrmDuplicatesView: React.FC = () => {
  const { duplicateGroups, mergeDuplicates } = useCrm();
  const [mergingPhone, setMergingPhone] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<{ [phone: string]: string }>({});

  const handleMergeGroup = async (group: DuplicateGroup) => {
    const targetId = selectedTargetId[group.normalizedPhone] || group.customers[0].id;
    const sourceIds = group.customers.map(c => c.id).filter(id => id !== targetId);

    if (sourceIds.length === 0) return;

    setMergingPhone(group.normalizedPhone);
    try {
      await mergeDuplicates(targetId, sourceIds);
    } finally {
      setMergingPhone(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Intro card */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CopyCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">اسکن و پاک‌سازی هوشمند مخاطبان تکراری</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              سیستم به صورت خودکار شماره‌های تلفن را فارغ از فرمت ذخیره‌سازی (+98، 0098، فاصله‌ها) ارزیابی کرده و موارد تکراری را نمایش می‌دهد.
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          تعداد گروه‌های تکراری: <span className="text-amber-400 font-bold font-mono">{toPersianDigits(duplicateGroups.length)}</span>
        </div>
      </div>

      {/* Duplicate Groups List */}
      <div className="space-y-4">
        {duplicateGroups.length === 0 ? (
          <div className="py-16 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl space-y-2">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">هیچ شماره یا پرونده تکراری در سیستم یافت نشد</h4>
            <p className="text-xs text-slate-400">بانک اطلاعاتی مشتریان و مزارع کاملاً پاک و یکتا است.</p>
          </div>
        ) : (
          duplicateGroups.map(group => {
            const currentTargetId = selectedTargetId[group.normalizedPhone] || group.customers[0].id;
            const isMerging = mergingPhone === group.normalizedPhone;

            return (
              <div
                key={group.normalizedPhone}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="text-xs font-bold text-white">شماره مشترک:</span>
                    <span className="font-mono text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {formatPhoneNumberDisplay(group.normalizedPhone)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({toPersianDigits(group.customers.length)} رکورد موازی)
                    </span>
                  </div>

                  <button
                    disabled={isMerging}
                    onClick={() => handleMergeGroup(group)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>{isMerging ? 'در حال ادغام...' : 'ادغام در پرونده اصلی'}</span>
                  </button>
                </div>

                {/* Customers Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.customers.map(c => {
                    const isTarget = currentTargetId === c.id;

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedTargetId(prev => ({ ...prev, [group.normalizedPhone]: c.id }))}
                        className={`p-3 rounded-xl border cursor-pointer transition-all space-y-2 relative ${
                          isTarget
                            ? 'bg-purple-950/30 border-purple-500/60 ring-1 ring-purple-500/40 shadow-md'
                            : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="radio"
                                checked={isTarget}
                                onChange={() => setSelectedTargetId(prev => ({ ...prev, [group.normalizedPhone]: c.id }))}
                                className="text-purple-500 focus:ring-0"
                              />
                              <h4 className="text-xs font-black text-white">{c.fullName}</h4>
                            </div>
                            {c.companyName && (
                              <div className="text-[11px] text-slate-400 mt-0.5 pr-5">
                                {c.companyName}
                              </div>
                            )}
                          </div>
                          {isTarget && (
                            <span className="text-[10px] bg-purple-500 text-white font-bold px-1.5 py-0.5 rounded">
                              پرونده اصلی
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-400 space-y-0.5 pr-5">
                          {c.province && <div>استان: {c.province}</div>}
                          {c.farmCapacity && <div>ظرفیت سالن: {toPersianDigits(c.farmCapacity)}</div>}
                          {c.dealValue && <div>ارزش: {toPersianDigits(c.dealValue)} تومان</div>}
                          {c.createdAt && <div>تاریخ ثبت: {formatToShamsi(c.createdAt.split('T')[0])}</div>}
                        </div>

                        {c.notes && (
                          <div className="text-[10px] text-slate-400 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/60 truncate">
                            {c.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
