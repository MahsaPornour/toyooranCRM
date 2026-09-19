import React, { useState } from 'react';
import { 
  Building, 
  Save, 
  MapPin, 
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { CompanyInfo } from '../../types';

export const CompanyCmsTab: React.FC = () => {
  const { companyInfo, updateCompanyInfo } = useData();
  const [companyForm, setCompanyForm] = useState<CompanyInfo>({ ...companyInfo });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(companyForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl sticky top-0 z-10 shadow-lg shadow-slate-950/20">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-400" />
            <span>تنظیمات عمومی شرکت و اطلاعات تماس</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ویرایش نام شرکت، اطلاعات تماس، شبکه‌های اجتماعی و آدرس دفاتر
          </p>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-amber-400 to-[#FF9F14] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>ذخیره تنظیمات شرکت</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-3xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>تغییرات با موفقیت ذخیره شد.</span>
        </div>
      )}

      {/* General Company Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">نام شرکت (فارسی)</label>
            <input
              type="text"
              value={companyForm.nameFa}
              onChange={(e) => setCompanyForm({ ...companyForm, nameFa: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">نام شرکت (English)</label>
            <input
              type="text"
              value={companyForm.nameEn}
              onChange={(e) => setCompanyForm({ ...companyForm, nameEn: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              dir="ltr"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-slate-300 mb-1">شعار اصلی (Tagline)</label>
            <input
              type="text"
              value={companyForm.tagline}
              onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-xs font-bold text-slate-300 mb-1">معرفی کوتاه (Sub Tagline)</label>
            <textarea
              value={companyForm.subTagline || ''}
              onChange={(e) => setCompanyForm({ ...companyForm, subTagline: e.target.value })}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-400"
            />
          </div>
          
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">سال‌های تجربه</label>
              <input
                type="text"
                value={companyForm.experienceYears}
                onChange={(e) => setCompanyForm({ ...companyForm, experienceYears: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center focus:border-amber-400"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">پروژه‌های موفق</label>
              <input
                type="text"
                value={companyForm.completedProjects}
                onChange={(e) => setCompanyForm({ ...companyForm, completedProjects: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center focus:border-amber-400"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">پوشش جغرافیایی</label>
              <input
                type="text"
                value={companyForm.activeProvinces}
                onChange={(e) => setCompanyForm({ ...companyForm, activeProvinces: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">رضایت مشتری</label>
              <input
                type="text"
                value={companyForm.customerSatisfaction}
                onChange={(e) => setCompanyForm({ ...companyForm, customerSatisfaction: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-center focus:border-amber-400"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">تلفن تماس (مشاوره رایگان)</label>
            <input
              type="text"
              value={companyForm.phone}
              onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">ایمیل سازمانی</label>
            <input
              type="email"
              value={companyForm.email}
              onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              dir="ltr"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">ساعات کاری مجموعه</label>
            <input
              type="text"
              value={companyForm.workingHours}
              onChange={(e) => setCompanyForm({ ...companyForm, workingHours: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">اینستاگرام</label>
            <input
              type="text"
              value={companyForm.socialLinks?.instagram || ''}
              onChange={(e) => setCompanyForm({ 
                ...companyForm, 
                socialLinks: { ...companyForm.socialLinks, instagram: e.target.value } 
              })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              placeholder="https://instagram.com/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">تلگرام</label>
            <input
              type="text"
              value={companyForm.socialLinks?.telegram || ''}
              onChange={(e) => setCompanyForm({ 
                ...companyForm, 
                socialLinks: { ...companyForm.socialLinks, telegram: e.target.value } 
              })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              placeholder="https://t.me/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">آپارات</label>
            <input
              type="text"
              value={companyForm.socialLinks?.aparat || ''}
              onChange={(e) => setCompanyForm({ 
                ...companyForm, 
                socialLinks: { ...companyForm.socialLinks, aparat: e.target.value } 
              })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              placeholder="https://aparat.com/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">یوتیوب</label>
            <input
              type="text"
              value={companyForm.socialLinks?.youtube || ''}
              onChange={(e) => setCompanyForm({ 
                ...companyForm, 
                socialLinks: { ...companyForm.socialLinks, youtube: e.target.value } 
              })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              placeholder="https://youtube.com/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">لینکدین</label>
            <input
              type="text"
              value={companyForm.socialLinks?.linkedin || ''}
              onChange={(e) => setCompanyForm({ 
                ...companyForm, 
                socialLinks: { ...companyForm.socialLinks, linkedin: e.target.value } 
              })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              placeholder="https://linkedin.com/..."
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">روبیکا</label>
            <input
              type="text"
              value={companyForm.socialLinks?.rubika || ''}
              onChange={(e) => setCompanyForm({ 
                ...companyForm, 
                socialLinks: { ...companyForm.socialLinks, rubika: e.target.value } 
              })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
              placeholder="https://rubika.ir/..."
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Branches & Locations */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">مدیریت آدرس‌ها و دفاتر مجموعه</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const newLocs = [...(companyForm.locations || [])];
              newLocs.push({
                id: 'loc-' + Date.now(),
                title: 'دفتر جدید',
                type: 'branch',
                address: '',
                mapEmbedUrl: ''
              });
              setCompanyForm({ ...companyForm, locations: newLocs });
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن آدرس جدید</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {(!companyForm.locations || companyForm.locations.length === 0) && (
            <div className="text-center text-slate-500 text-xs py-4">هیچ آدرسی ثبت نشده است.</div>
          )}
          {companyForm.locations?.map((loc, idx) => (
            <div key={loc.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-700 relative group">
              <button
                type="button"
                onClick={() => {
                  const newLocs = [...(companyForm.locations || [])];
                  newLocs.splice(idx, 1);
                  setCompanyForm({ ...companyForm, locations: newLocs });
                }}
                className="absolute top-3 left-3 w-7 h-7 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                title="حذف این آدرس"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">عنوان دفتر / کارخانه</label>
                <input
                  type="text"
                  value={loc.title}
                  onChange={(e) => {
                    const newLocs = [...(companyForm.locations || [])];
                    newLocs[idx] = { ...newLocs[idx], title: e.target.value };
                    setCompanyForm({ ...companyForm, locations: newLocs });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400 pr-10"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">نوع مرکز</label>
                <select
                  value={loc.type}
                  onChange={(e) => {
                    const newLocs = [...(companyForm.locations || [])];
                    newLocs[idx] = { ...newLocs[idx], type: e.target.value as any };
                    setCompanyForm({ ...companyForm, locations: newLocs });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-amber-400"
                >
                  <option value="headquarter">دفتر مرکزی</option>
                  <option value="factory">کارخانه صنعتی</option>
                  <option value="rd">دفتر تحقیق و توسعه (R&D)</option>
                  <option value="branch">شعبه / نمایندگی</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">آدرس کامل</label>
                <textarea
                  value={loc.address}
                  onChange={(e) => {
                    const newLocs = [...(companyForm.locations || [])];
                    newLocs[idx] = { ...newLocs[idx], address: e.target.value };
                    setCompanyForm({ ...companyForm, locations: newLocs });
                  }}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-amber-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">لینک Embed نقشه (Google Maps iframe src)</label>
                <input
                  type="text"
                  value={loc.mapEmbedUrl || ''}
                  onChange={(e) => {
                    const newLocs = [...(companyForm.locations || [])];
                    newLocs[idx] = { ...newLocs[idx], mapEmbedUrl: e.target.value };
                    setCompanyForm({ ...companyForm, locations: newLocs });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] font-mono text-slate-300 focus:border-amber-400"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800"><button type="submit" className="bg-gradient-to-r from-amber-400 to-[#FF9F14] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"><Save className="w-5 h-5" /><span>ذخیره کلیه تنظیمات</span></button></div>
    </form>
  );
};
