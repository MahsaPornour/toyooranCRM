import React from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Building, 
  MapPin, 
  Trash2, 
  Edit3, 
  Filter,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { CustomerContact } from '../../types/crm.types';
import { PIPELINE_STAGES, PROVINCES_LIST } from '../common/crmConstants';
import { formatPhoneNumberDisplay, toPersianDigits } from '../../utils/crmPhoneUtils';
import { formatToShamsi } from '../../utils/crmDateUtils';

export const CrmContactsView: React.FC = () => {
  const {
    filteredCustomers,
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    provinceFilter,
    setProvinceFilter,
    openNewCustomerModal,
    openEditCustomerModal,
    deleteCustomer
  } = useCrm();

  const getStageBadge = (stageId?: string) => {
    const s = PIPELINE_STAGES.find(item => item.id === stageId) || PIPELINE_STAGES[0];
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badgeBg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${s.color.replace('text-', 'bg-')}`} />
        {s.title}
      </span>
    );
  };

  const handleDelete = async (e: React.MouseEvent, c: CustomerContact) => {
    e.stopPropagation();
    if (window.confirm(`آیا از حذف پرونده «${c.fullName}» اطمینان دارید؟`)) {
      await deleteCustomer(c.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام، تلفن، فارم، برچسب‌ها یا استان..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stage Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">همه مراحل فروش</option>
              {PIPELINE_STAGES.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900">{s.title}</option>
              ))}
            </select>
          </div>

          {/* Province Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">همه استان‌ها</option>
              {PROVINCES_LIST.map(p => (
                <option key={p} value={p} className="bg-slate-900">{p}</option>
              ))}
            </select>
          </div>

          {/* New Customer Button */}
          <button
            onClick={() => openNewCustomerModal('new_lead')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>مخاطب جدید</span>
          </button>
        </div>

      </div>

      {/* Table & Cards Container */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold">
                <th className="p-3.5">نام مشتری / فارم</th>
                <th className="p-3.5">شماره تماس</th>
                <th className="p-3.5">استان / موقعیت</th>
                <th className="p-3.5">ظرفیت سالن</th>
                <th className="p-3.5">مرحله فروش</th>
                <th className="p-3.5">ارزش معامله</th>
                <th className="p-3.5">پیگیری بعدی</th>
                <th className="p-3.5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    هیچ مشتری یا فارمی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    onClick={() => openEditCustomerModal(customer)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-white hover:text-amber-400 transition-colors">
                        {customer.fullName}
                      </div>
                      {customer.companyName && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-500" />
                          <span>{customer.companyName}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <a
                        href={`tel:${customer.phoneNumber}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-mono text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                        <span>{formatPhoneNumberDisplay(customer.phoneNumber)}</span>
                      </a>
                    </td>

                    <td className="p-3.5">
                      {customer.province ? (
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
                          {customer.province}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {customer.farmCapacity ? (
                        <span className="text-blue-300 font-mono text-[11px]">
                          {toPersianDigits(customer.farmCapacity)} قطعه
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {getStageBadge(customer.pipelineStage)}
                    </td>

                    <td className="p-3.5 font-mono text-amber-400">
                      {customer.dealValue ? `${toPersianDigits(customer.dealValue)} تومان` : '-'}
                    </td>

                    <td className="p-3.5 text-[11px] text-slate-400">
                      {customer.nextFollowUpDate ? formatToShamsi(customer.nextFollowUpDate) : '-'}
                    </td>

                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditCustomerModal(customer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-all"
                          title="ویرایش پرونده"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, customer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
                          title="حذف مخاطب"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
