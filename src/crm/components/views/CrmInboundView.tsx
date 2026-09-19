import React from 'react';
import { 
  Sparkles, 
  FileText, 
  MessageSquareText, 
  Phone, 
  Calendar, 
  Check, 
  ArrowRight,
  Building,
  UserPlus
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { formatPhoneNumberDisplay, toPersianDigits } from '../../utils/crmPhoneUtils';
import { formatToShamsi } from '../../utils/crmDateUtils';

export const CrmInboundView: React.FC = () => {
  const {
    quoteRequests,
    consultationRequests,
    convertInboundToCustomer,
    customers,
    openEditCustomerModal
  } = useCrm();

  const isAlreadyConverted = (phone?: string) => {
    if (!phone) return false;
    return customers.some(c => c.phoneNumber.includes(phone) || phone.includes(c.phoneNumber));
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info box */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">سرنخ‌های خودکار ورودی وب‌سایت</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            استعلام‌های ثبت‌شده در فرم‌های مشاوره مهندسی و پیش‌فاکتور آنلاین وب‌سایت را با یک کلیک به پرونده رسمی فروش در CRM تبدیل کنید.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Quote Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">استعلام‌های پیش‌فاکتور و کاتالوگ</h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              {toPersianDigits(quoteRequests.length)} مورد
            </span>
          </div>

          <div className="space-y-2.5">
            {quoteRequests.length === 0 ? (
              <div className="py-10 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
                هیچ استعلام قیمتی ثبت نشده است.
              </div>
            ) : (
              quoteRequests.map(item => {
                const formData = item.formData;
                const converted = isAlreadyConverted(formData.phoneNumber);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-white">{formData.fullName || 'کاربر وب‌سایت'}</h4>
                        {formData.companyName && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{formData.companyName}</div>
                        )}
                      </div>
                      <span className="font-mono text-xs text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {formatPhoneNumberDisplay(formData.phoneNumber)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 space-y-1">
                      {formData.projectType && <div>نوع پروژه: {formData.projectType}</div>}
                      {formData.capacity && <div>ظرفیت سالن: {toPersianDigits(formData.capacity)}</div>}
                      {formData.deliveryLocation && <div>محل تحویل: {formData.deliveryLocation}</div>}
                      {formData.additionalNotes && <div className="text-slate-400 mt-1 italic">«{formData.additionalNotes}»</div>}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500 text-[10px]">
                        {item.createdAt ? formatToShamsi(item.createdAt.split('T')[0]) : ''}
                      </span>

                      {converted ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>در CRM موجود است</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => convertInboundToCustomer(item, 'quote')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>تبدیل به مشتری CRM</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Section 2: Consultation Requests */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white">درخواست‌های مشاوره فنی و طراحی</h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              {toPersianDigits(consultationRequests.length)} مورد
            </span>
          </div>

          <div className="space-y-2.5">
            {consultationRequests.length === 0 ? (
              <div className="py-10 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-500">
                هیچ درخواست مشاوره‌ای ثبت نشده است.
              </div>
            ) : (
              consultationRequests.map(item => {
                const formData = item.formData;
                const converted = isAlreadyConverted(formData.phoneNumber);

                return (
                  <div
                    key={item.id}
                    className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-white">{formData.fullName || 'کاربر وب‌سایت'}</h4>
                        {formData.projectType && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{formData.projectType}</div>
                        )}
                      </div>
                      <span className="font-mono text-xs text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {formatPhoneNumberDisplay(formData.phoneNumber)}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 space-y-1">
                      {formData.projectCapacity && <div>ظرفیت سالن: {toPersianDigits(formData.projectCapacity)}</div>}
                      {formData.location && <div>موقعیت مزرعه: {formData.location}</div>}
                      {formData.message && <div className="text-slate-400 mt-1 italic">«{formData.message}»</div>}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500 text-[10px]">
                        {item.createdAt ? formatToShamsi(item.createdAt.split('T')[0]) : ''}
                      </span>

                      {converted ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                          <Check className="w-3.5 h-3.5" />
                          <span>در CRM موجود است</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => convertInboundToCustomer(item, 'consultation')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold transition-all shadow"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>تبدیل به مشتری CRM</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
