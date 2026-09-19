import { PipelineStageConfig } from '../../types/crm.types';

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: 'new_lead', title: 'سرنخ جدید', desc: 'استعلام سایت و تماس اولیه', color: 'text-amber-400', badgeBg: 'bg-amber-500/10 text-amber-300', borderCol: 'border-amber-500/30' },
  { id: 'contacted', title: 'ارزیابی و صلاحیت‌سنجی', desc: 'احراز نیاز، ظرفیت فارم و شرایط', color: 'text-blue-400', badgeBg: 'bg-blue-500/10 text-blue-300', borderCol: 'border-blue-500/30' },
  { id: 'consulting', title: 'مشاوره فنی و طراحی', desc: 'محاسبه تهویه، چیدمان خطوط و ابعاد', color: 'text-purple-400', badgeBg: 'bg-purple-500/10 text-purple-300', borderCol: 'border-purple-500/30' },
  { id: 'proposal', title: 'پیش‌فاکتور و استعلام', desc: 'صدور پیش‌فاکتور رسمی و قیمت', color: 'text-cyan-400', badgeBg: 'bg-cyan-500/10 text-cyan-300', borderCol: 'border-cyan-500/30' },
  { id: 'negotiation', title: 'مذاکره نهایی و مالی', desc: 'توافق پرداخت، زمان تحویل و قرارداد', color: 'text-orange-400', badgeBg: 'bg-orange-500/10 text-orange-300', borderCol: 'border-orange-500/30' },
  { id: 'won', title: 'قرارداد و تحویل موفق', desc: 'تسویه، ارسال تجهیزات و گارانتی', color: 'text-emerald-400', badgeBg: 'bg-emerald-500/10 text-emerald-300', borderCol: 'border-emerald-500/30' },
  { id: 'lost', title: 'عدم توافق / لغو', desc: 'انصراف مشتری یا عدم تایید فنی/مالی', color: 'text-slate-400', badgeBg: 'bg-slate-800 text-slate-400', borderCol: 'border-slate-800' }
];

export const PROVINCES_LIST = [
  'مازندران',
  'گلستان',
  'گیلان',
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'آذربایجان شرقی',
  'آذربایجان غربی',
  'کرمانشاه',
  'کردستان',
  'همدان',
  'مرکزی',
  'قزوین',
  'سمنان',
  'یزد',
  'کرمان',
  'قم',
  'زنجان',
  'لرستان',
  'سایر استان‌ها'
];
