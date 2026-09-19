import { CustomerContact } from '../types';

/**
 * تبدیل اعداد فارسی و عربی به اعداد انگلیسی
 */
export function toEnglishDigits(str: string): string {
  if (!str) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let result = str;
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), i.toString());
    result = result.replace(new RegExp(arabicDigits[i], 'g'), i.toString());
  }
  return result;
}

/**
 * تبدیل اعداد انگلیسی به اعداد فارسی
 */
export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  const str = n.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d, 10)]);
}

/**
 * نرمال‌سازی شماره تلفن:
 * - تبدیل ارقام فارسی و عربی به انگلیسی
 * - حذف فواصل، خط تیره، پرانتز و کاراکترهای متفرقه
 * - استانداردسازی پیش‌شماره‌های ایران (+98, 0098, 98 -> 0)
 * مثلا: +98 912 345 6789 -> 09123456789
 *       9123456789 -> 09123456789
 *       ۰۹۱۲۳۴۵۶۷۸۹ -> 09123456789
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = toEnglishDigits(phone).replace(/[^\d+]/g, '').trim();

  // اگر با +98 شروع شود
  if (cleaned.startsWith('+98')) {
    cleaned = '0' + cleaned.slice(3);
  }
  // اگر با 0098 شروع شود
  else if (cleaned.startsWith('0098')) {
    cleaned = '0' + cleaned.slice(4);
  }
  // اگر با 98 شروع شود و طول ۱۲ رقم باشد (مثلا 989123456789)
  else if (cleaned.startsWith('98') && cleaned.length >= 11) {
    cleaned = '0' + cleaned.slice(2);
  }
  // اگر با 9 شروع شود و طول ۱۰ رقم باشد (مثلا 9123456789)
  else if (cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }

  // حذف کاراکترهای غیرعددی باقی‌مانده
  cleaned = cleaned.replace(/[^\d]/g, '');

  return cleaned;
}

/**
 * بررسی یکسان بودن دو شماره تلفن
 */
export function arePhonesEqual(phoneA: string, phoneB: string): boolean {
  const normA = normalizePhoneNumber(phoneA);
  const normB = normalizePhoneNumber(phoneB);
  if (!normA || !normB) return false;
  return normA === normB;
}

/**
 * نمایش زیبای شماره تلفن به صورت بخش‌بندی شده
 */
export function formatPhoneNumberDisplay(phone: string): string {
  const norm = normalizePhoneNumber(phone);
  if (norm.length === 11 && norm.startsWith('09')) {
    // 0912 345 6789
    return `${norm.slice(0, 4)} ${norm.slice(4, 7)} ${norm.slice(7)}`;
  }
  if (norm.length === 11 && norm.startsWith('0')) {
    // تلفن ثابت: 051 3666 5600
    return `${norm.slice(0, 3)} ${norm.slice(3, 7)} ${norm.slice(7)}`;
  }
  return phone;
}

/**
 * نرمال‌سازی ایمیل
 */
export function normalizeEmail(email?: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * جستجوی مخاطب تکراری در لیست مخاطبین:
 * بررسی تطابق شماره تلفن یا ایمیل با سایر مخاطبین
 */
export function findDuplicateCustomer(
  customers: CustomerContact[],
  phoneNumber: string,
  email?: string,
  excludeId?: string
): CustomerContact | null {
  const normPhone = normalizePhoneNumber(phoneNumber);
  const normEmail = normalizeEmail(email);

  if (!normPhone && !normEmail) return null;

  for (const customer of customers) {
    if (excludeId && customer.id === excludeId) continue;

    // بررسی شماره تماس
    if (normPhone) {
      const cNormPhone = normalizePhoneNumber(customer.phoneNumber);
      if (cNormPhone && cNormPhone === normPhone) {
        return customer;
      }
    }

    // بررسی ایمیل
    if (normEmail && customer.email) {
      const cNormEmail = normalizeEmail(customer.email);
      if (cNormEmail && cNormEmail === normEmail) {
        return customer;
      }
    }
  }

  return null;
}

/**
 * گروه‌بندی مخاطبین تکراری موجود در دیتابیس
 */
export interface DuplicateGroup {
  key: string;
  type: 'phone' | 'email';
  customers: CustomerContact[];
}

export function detectAllDuplicateGroups(customers: CustomerContact[]): DuplicateGroup[] {
  const phoneMap = new Map<string, CustomerContact[]>();
  const emailMap = new Map<string, CustomerContact[]>();

  for (const c of customers) {
    const p = normalizePhoneNumber(c.phoneNumber);
    if (p && p.length >= 8) {
      const list = phoneMap.get(p) || [];
      list.push(c);
      phoneMap.set(p, list);
    }

    const e = normalizeEmail(c.email);
    if (e) {
      const list = emailMap.get(e) || [];
      list.push(c);
      emailMap.set(e, list);
    }
  }

  const groups: DuplicateGroup[] = [];

  phoneMap.forEach((list, key) => {
    if (list.length > 1) {
      groups.push({ key, type: 'phone', customers: list });
    }
  });

  emailMap.forEach((list, key) => {
    if (list.length > 1) {
      // اگر از قبل تمام اعضا در گروه شماره تلفن نبودند اضافه کن
      const alreadyCovered = groups.some(g => 
        g.customers.length === list.length && 
        g.customers.every(item => list.some(l => l.id === item.id))
      );
      if (!alreadyCovered) {
        groups.push({ key, type: 'email', customers: list });
      }
    }
  });

  return groups;
}
