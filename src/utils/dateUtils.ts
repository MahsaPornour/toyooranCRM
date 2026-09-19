import { toPersianDigits } from './phoneUtils';

/**
 * تبدیل تاریخ میلادی یا ISO به فرمت تاریخ شمسی فارسی
 */
export function formatToShamsi(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * نمایش تاریخ و ساعت شمسی
 */
export function formatToShamsiDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return String(dateInput);

    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return String(dateInput);
  }
}

/**
 * دریافت تاریخ کامل و رسمی امروز طبق تقویم شمسی (مثال: یکشنبه، ۲۴ شهریور ۱۴۰۵)
 */
export function getTodayShamsiFullDate(date: Date = new Date()): {
  fullText: string;
  weekday: string;
  day: string;
  month: string;
  year: string;
} {
  try {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const fullText = formatter.format(date);

    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(date);

    const weekday = parts.find(p => p.type === 'weekday')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    return { fullText, weekday, day, month, year };
  } catch {
    return {
      fullText: formatToShamsi(date),
      weekday: '',
      day: '',
      month: '',
      year: '',
    };
  }
}

/**
 * وضعیت موعد پیگیری نسبت به زمان جاری
 */
export type FollowUpUrgency = 'overdue' | 'today' | 'upcoming' | 'none';

export function getFollowUpUrgency(
  followUpDate?: string,
  followUpTime?: string,
  status?: string
): {
  urgency: FollowUpUrgency;
  daysDiff: number;
  label: string;
  badgeColorClass: string;
} {
  if (!followUpDate || status === 'completed' || status === 'cancelled') {
    return {
      urgency: 'none',
      daysDiff: 0,
      label: status === 'completed' ? 'تکمیل شده' : 'بدون پیگیری',
      badgeColorClass: 'bg-slate-800 text-slate-400 border-slate-700',
    };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(followUpDate);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const pastDays = Math.abs(diffDays);
      return {
        urgency: 'overdue',
        daysDiff: diffDays,
        label: pastDays === 1 ? 'دیروز (معوقه)' : `${toPersianDigits(pastDays)} روز گذشته (معوقه)`,
        badgeColorClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      };
    }

    if (diffDays === 0) {
      const timeStr = followUpTime ? ` - ساعت ${toPersianDigits(followUpTime)}` : '';
      return {
        urgency: 'today',
        daysDiff: 0,
        label: `امروز${timeStr}`,
        badgeColorClass: 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-sm font-black',
      };
    }

    if (diffDays === 1) {
      return {
        urgency: 'upcoming',
        daysDiff: 1,
        label: 'فردا',
        badgeColorClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      };
    }

    return {
      urgency: 'upcoming',
      daysDiff: diffDays,
      label: `${toPersianDigits(diffDays)} روز دیگر`,
      badgeColorClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    };
  } catch {
    return {
      urgency: 'none',
      daysDiff: 0,
      label: followUpDate,
      badgeColorClass: 'bg-slate-800 text-slate-400 border-slate-700',
    };
  }
}

/**
 * دریافت تاریخ امروز به فرمت YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ایجاد تاریخ با اضافه کردن روز به تاریخ جاری (برای دکمه‌های سریع)
 */
export function addDaysToToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
