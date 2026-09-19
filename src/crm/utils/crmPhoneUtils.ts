import { CustomerContact } from '../types/crm.types';

/**
 * Normalizes phone numbers to standard 11-digit Iranian format (09xxxxxxxxx)
 */
export function normalizePhoneNumber(phone: string | undefined | null): string {
  if (!phone) return '';
  // Convert Persian/Arabic digits to English
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  let clean = phone.replace(/[۰-۹]/g, w => persianDigits.indexOf(w).toString())
                   .replace(/[٠-٩]/g, w => arabicDigits.indexOf(w).toString())
                   .replace(/[\s\-\(\)\.]/g, ''); // Remove spaces, dashes, parens

  // Remove leading + or 00
  if (clean.startsWith('+98')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('0098')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('98') && clean.length === 12) {
    clean = '0' + clean.slice(2);
  } else if (clean.startsWith('9') && clean.length === 10) {
    clean = '0' + clean;
  }

  return clean;
}

/**
 * Formats a phone number for user-friendly display (e.g. 0912-345-6789)
 */
export function formatPhoneNumberDisplay(phone: string | undefined | null): string {
  if (!phone) return '-';
  const norm = normalizePhoneNumber(phone);
  if (norm.length === 11 && norm.startsWith('09')) {
    return `${norm.slice(0, 4)}-${norm.slice(4, 7)}-${norm.slice(7)}`;
  }
  return phone;
}

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n
    .toString()
    .replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
}

/**
 * Detects all groups of duplicate contacts by normalized phone number
 */
export function detectAllDuplicateGroups(customers: CustomerContact[]): { normalizedPhone: string; customers: CustomerContact[] }[] {
  const map: { [key: string]: CustomerContact[] } = {};

  (customers || []).forEach(c => {
    const norm = normalizePhoneNumber(c.phoneNumber);
    if (norm && norm.length >= 7) {
      if (!map[norm]) map[norm] = [];
      map[norm].push(c);
    }
  });

  return Object.keys(map)
    .filter(phone => map[phone].length > 1)
    .map(phone => ({
      normalizedPhone: phone,
      customers: map[phone]
    }));
}
