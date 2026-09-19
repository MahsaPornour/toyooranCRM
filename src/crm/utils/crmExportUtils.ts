import { CustomerContact } from '../types/crm.types';

export function exportContactsToCsv(customers: CustomerContact[]): void {
  const headers = [
    'شناسه',
    'نام و نام خانوادگی',
    'شماره تماس',
    'نام واحد / فارم',
    'استان',
    'ظرفیت سالن (قطعه)',
    'مرحله فروش',
    'ارزش معامله (تومان)',
    'موعد پیگیری بعدی',
    'اولویت پیگیری',
    'برچسب‌ها',
    'تاریخ ثبت'
  ];

  const rows = (customers || []).map(c => [
    `"${c.id || ''}"`,
    `"${(c.fullName || '').replace(/"/g, '""')}"`,
    `"${c.phoneNumber || ''}"`,
    `"${(c.companyName || '').replace(/"/g, '""')}"`,
    `"${(c.province || '').replace(/"/g, '""')}"`,
    `"${c.farmCapacity || ''}"`,
    `"${c.pipelineStage || 'new_lead'}"`,
    `"${c.dealValue || ''}"`,
    `"${c.nextFollowUpDate || ''} ${c.nextFollowUpTime || ''}"`,
    `"${c.followUpPriority || 'medium'}"`,
    `"${(c.tags || []).join(', ')}"`,
    `"${c.createdAt || ''}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `crm_customers_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
