import React from 'react';
import { 
  Users, 
  Search, 
  Building, 
  Phone, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  DollarSign, 
  Tag, 
  AlertCircle,
  Sparkles,
  Plus
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { PipelineStage, CustomerContact } from '../../types/crm.types';
import { PIPELINE_STAGES } from '../common/crmConstants';
import { formatPhoneNumberDisplay, toPersianDigits } from '../../utils/crmPhoneUtils';
import { formatToShamsi, getFollowUpUrgency } from '../../utils/crmDateUtils';

export const CrmPipelineView: React.FC = () => {
  const {
    filteredCustomers,
    updatePipelineStage,
    openEditCustomerModal,
    openNewCustomerModal,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter
  } = useCrm();

  const getStageCustomers = (stageId: PipelineStage) => {
    return filteredCustomers.filter(c => (c.pipelineStage || 'new_lead') === stageId);
  };

  const handleMoveStage = async (e: React.MouseEvent, customer: CustomerContact, direction: 'next' | 'prev') => {
    e.stopPropagation();
    const currentIndex = PIPELINE_STAGES.findIndex(s => s.id === (customer.pipelineStage || 'new_lead'));
    if (currentIndex === -1) return;

    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < PIPELINE_STAGES.length) {
      await updatePipelineStage(customer.id, PIPELINE_STAGES[newIndex].id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام مشتری، شماره تماس، فارم یا استان..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Priority Filter Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-xs text-slate-400 ml-1">اولویت:</span>
          {(['all', 'high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                priorityFilter === p
                  ? 'bg-slate-700 text-amber-400 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {p === 'all' ? 'همه' : p === 'high' ? 'فوری' : p === 'medium' ? 'متوسط' : 'عادی'}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Container (Horizontal Scroll for 7 stages) */}
      <div className="flex items-start gap-3.5 overflow-x-auto pb-4 scrollbar-thin">
        {PIPELINE_STAGES.map((stage, idx) => {
          const stageCustomers = getStageCustomers(stage.id);
          const stageTotalValue = stageCustomers.reduce((sum, c) => {
            const v = parseFloat((c.dealValue || '0').replace(/[^0-9.]/g, '')) || 0;
            return sum + v;
          }, 0);

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80 bg-slate-900/70 border border-slate-800/90 rounded-2xl flex flex-col max-h-[750px] shadow-lg shadow-black/20"
            >
              {/* Column Header */}
              <div className={`p-3.5 border-b border-slate-800/80 rounded-t-2xl ${stage.borderCol} border-t-2`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color.replace('text-', 'bg-')}`} />
                    <h3 className="text-xs font-black text-white">{stage.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}>
                    {toPersianDigits(stageCustomers.length)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 truncate">{stage.desc}</p>

                {stageTotalValue > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="text-[10px] text-slate-500">ارزش کل مرحله:</span>
                    <span className="font-mono text-amber-400 font-bold">
                      {toPersianDigits(stageTotalValue.toLocaleString())} <span className="text-[9px] text-slate-400 font-normal">تومان</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Cards Scroll Area */}
              <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto min-h-[140px] max-h-[620px]">
                {stageCustomers.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-slate-800/60 rounded-xl">
                    <p className="text-[11px] text-slate-500">بدون پرونده</p>
                  </div>
                ) : (
                  stageCustomers.map(customer => {
                    const urgency = customer.nextFollowUpDate
                      ? getFollowUpUrgency(customer.nextFollowUpDate, customer.nextFollowUpTime, customer.followUpStatus)
                      : null;

                    return (
                      <div
                        key={customer.id}
                        onClick={() => openEditCustomerModal(customer)}
                        className="group bg-slate-950/80 hover:bg-slate-950 border border-slate-800/90 hover:border-amber-400/50 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md hover:shadow-amber-500/5 space-y-2.5"
                      >
                        {/* Top: Customer Name & Phone */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                              {customer.fullName}
                            </h4>
                            {customer.companyName && (
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                <Building className="w-3 h-3 text-slate-500" />
                                <span className="truncate max-w-[150px]">{customer.companyName}</span>
                              </div>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {formatPhoneNumberDisplay(customer.phoneNumber)}
                          </span>
                        </div>

                        {/* Capacity & Value Badges */}
                        <div className="flex items-center flex-wrap gap-1.5 text-[10px]">
                          {customer.farmCapacity && (
                            <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded">
                              ظرفیت: {toPersianDigits(customer.farmCapacity)} قطعه
                            </span>
                          )}
                          {customer.province && (
                            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                              {customer.province}
                            </span>
                          )}
                          {customer.dealValue && (
                            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono">
                              {toPersianDigits(customer.dealValue)} تومان
                            </span>
                          )}
                        </div>

                        {/* Follow-up Note & Urgency */}
                        {customer.nextFollowUpDate && (
                          <div className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg ${
                            urgency?.urgency === 'today'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : urgency?.urgency === 'overdue'
                              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-900 text-slate-400'
                          }`}>
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {formatToShamsi(customer.nextFollowUpDate)} {customer.nextFollowUpTime || ''}
                            </span>
                          </div>
                        )}

                        {/* Stage Mover Buttons */}
                        <div className="pt-1.5 border-t border-slate-900 flex items-center justify-between text-[11px]">
                          <button
                            disabled={idx === 0}
                            onClick={(e) => handleMoveStage(e, customer, 'prev')}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 rounded hover:bg-slate-800"
                            title="مرحله قبلی"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          
                          <span className="text-[9px] text-slate-500">تغییر مرحله</span>

                          <button
                            disabled={idx === PIPELINE_STAGES.length - 1}
                            onClick={(e) => handleMoveStage(e, customer, 'next')}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 rounded hover:bg-slate-800"
                            title="مرحله بعدی"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Add Card Button */}
              <div className="p-2 border-t border-slate-800/80 bg-slate-950/40 rounded-b-2xl">
                <button
                  onClick={() => openNewCustomerModal(stage.id)}
                  className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-all font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت در این مرحله</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
