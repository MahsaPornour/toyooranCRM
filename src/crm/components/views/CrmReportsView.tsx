import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Calculator, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  Sparkles 
} from 'lucide-react';
import { useCrm } from '../../hooks/useCrm';
import { PIPELINE_STAGES } from '../common/crmConstants';
import { toPersianDigits } from '../../utils/crmPhoneUtils';

export const CrmReportsView: React.FC = () => {
  const { customers, stats, openNewCustomerModal } = useCrm();

  // Farm Calculator State
  const [calcCapacity, setCalcCapacity] = useState<number>(30000);
  const [calcBirdType, setCalcBirdType] = useState<'broiler' | 'layer' | 'breeder'>('broiler');
  const [calcTierLevel, setCalcTierLevel] = useState<'standard' | 'advanced' | 'fully_automated'>('advanced');

  // Estimate formulas
  const perBirdCost = calcBirdType === 'broiler' 
    ? (calcTierLevel === 'standard' ? 45000 : calcTierLevel === 'advanced' ? 75000 : 115000)
    : calcBirdType === 'layer'
    ? (calcTierLevel === 'standard' ? 95000 : calcTierLevel === 'advanced' ? 140000 : 210000)
    : (calcTierLevel === 'standard' ? 120000 : calcTierLevel === 'advanced' ? 180000 : 260000);

  const estimatedTotalCost = calcCapacity * perBirdCost;

  // Province Distribution
  const provinceCounts = (customers || []).reduce<{ [key: string]: number }>((acc, c) => {
    const prov = c.province || 'نامشخص';
    acc[prov] = (acc[prov] || 0) + 1;
    return acc;
  }, {});

  const sortedProvinces: [string, number][] = (Object.entries(provinceCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Conversion rate
  const wonCount = (customers || []).filter(c => c.pipelineStage === 'won').length;
  const lostCount = (customers || []).filter(c => c.pipelineStage === 'lost').length;
  const closedCount = wonCount + lostCount;
  const winRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;

  const handleCreateLeadFromEstimate = () => {
    openNewCustomerModal('proposal');
  };

  return (
    <div className="space-y-6">
      
      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold">ارزش کل فرصت‌های فعال</span>
            <div className="text-base font-black text-white mt-0.5 font-mono">
              {toPersianDigits(stats.totalDealValue.toLocaleString())} <span className="text-xs font-normal text-slate-400">تومان</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold">قراردادهای قطعی و موفق</span>
            <div className="text-base font-black text-emerald-400 mt-0.5 font-mono">
              {toPersianDigits(stats.wonDealValue.toLocaleString())} <span className="text-xs font-normal text-slate-400">تومان</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold">نرخ موفقیت معامله (Win Rate)</span>
            <div className="text-base font-black text-white mt-0.5 font-mono">
              {toPersianDigits(winRate)}%
            </div>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold">پرونده‌های فعال در چرخه فروش</span>
            <div className="text-base font-black text-purple-300 mt-0.5 font-mono">
              {toPersianDigits(stats.activeLeads)} <span className="text-xs font-normal text-slate-400">فارم</span>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Distribution Bars */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black text-white">توزیع پرونده‌ها در قیف فروش</h3>
            </div>
            <span className="text-xs text-slate-400">
              کل مزارع: {toPersianDigits(customers.length)}
            </span>
          </div>

          <div className="space-y-3">
            {PIPELINE_STAGES.map(stage => {
              const count = (customers || []).filter(c => (c.pipelineStage || 'new_lead') === stage.id).length;
              const pct = customers.length > 0 ? Math.round((count / customers.length) * 100) : 0;

              return (
                <div key={stage.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-bold">{stage.title}</span>
                    <span className="font-mono text-slate-400">
                      {toPersianDigits(count)} پرونده ({toPersianDigits(pct)}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${stage.color.replace('text-', 'bg-')} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic Top Provinces */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-black text-white">قطب‌های برتر مزارع مرغداری</h3>
            </div>

            <div className="mt-4 space-y-3">
              {sortedProvinces.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">اطلاعات استانی ثبت نشده است.</div>
              ) : (
                sortedProvinces.map(([prov, cnt], i) => (
                  <div key={prov} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                        {toPersianDigits(i + 1)}
                      </span>
                      <span className="text-white font-bold">{prov}</span>
                    </div>
                    <span className="font-mono text-amber-400 font-bold">
                      {toPersianDigits(cnt)} فارم
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
            تمرکز پروژه‌های تجهیز و اتوماسیون در استان‌های شمالی و مرکزی کشور دارای بالاترین ضریب فروش است.
          </div>
        </div>

      </div>

      {/* Farm Equipment Cost Estimator Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">ماشین‌حساب مهندسی برآورد تجهیزات سالن مرغداری</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تخمین هوشمند ارزش ریالی خطوط اتوماسیون، تهویه، دانخوری بشقابی و آبخوری نیپل بر اساس ظرفیت گله.
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateLeadFromEstimate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت به عنوان پیش‌فاکتور جدید در CRM</span>
          </button>
        </div>

        {/* Inputs & Calculation grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Capacity Input */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <label className="text-xs text-slate-400 font-bold">ظرفیت گله سالن (تعداد قطعه):</label>
            <input
              type="number"
              step="5000"
              min="5000"
              max="200000"
              value={calcCapacity}
              onChange={(e) => setCalcCapacity(Number(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-amber-300 font-bold focus:outline-none focus:border-amber-400"
            />
            <div className="text-[10px] text-slate-500">
              {toPersianDigits(calcCapacity.toLocaleString())} قطعه پرورشی
            </div>
          </div>

          {/* Bird Type */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <label className="text-xs text-slate-400 font-bold">نوع سالن و گله:</label>
            <select
              value={calcBirdType}
              onChange={(e) => setCalcBirdType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="broiler">مرغ گوشتی (بستر/قفس)</option>
              <option value="layer">مرغ تخم‌گذار (قفس باطری/اتومات)</option>
              <option value="breeder">مرغ مادر / گوشتی سنگین</option>
            </select>
            <div className="text-[10px] text-slate-500">استانداردهای تهویه و خطوط تغذیه</div>
          </div>

          {/* Automation Tier */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <label className="text-xs text-slate-400 font-bold">سطح مکانیزاسیون و تجهیزات:</label>
            <select
              value={calcTierLevel}
              onChange={(e) => setCalcTierLevel(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="standard">استاندارد (خط دانخوری + نیپل + تهویه تونلی)</option>
              <option value="advanced">پیشرفته (پدلینگ سلولزی + اینلت + اتوماسیون)</option>
              <option value="fully_automated">فول‌اتوماتیک لوکس (سنسورهای هوشمند + کنترل اقلیم اقلیمی کامل)</option>
            </select>
            <div className="text-[10px] text-slate-500">ضمانت رسمی و خدمات پس از فروش پویا</div>
          </div>

        </div>

        {/* Result Banner */}
        <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400">تخمین اولیه حجم سرمایه‌گذاری تجهیزات سالن:</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1">
              {toPersianDigits(estimatedTotalCost.toLocaleString())} <span className="text-sm font-normal text-slate-400">تومان</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-left sm:text-right">
            میانگین هزینه به ازای هر قطعه: <span className="font-mono text-white font-bold">{toPersianDigits(perBirdCost.toLocaleString())} تومان</span>
          </div>
        </div>

      </div>

    </div>
  );
};
