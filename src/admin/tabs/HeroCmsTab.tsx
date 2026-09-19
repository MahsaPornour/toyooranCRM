import React, { useState } from 'react';
import { Save, Layers, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImagePicker } from '../components/ImagePicker';
import { HeroCms } from '../../types';

export const HeroCmsTab: React.FC = () => {
  const { heroCms, updateHeroCms } = useData();
  const [heroForm, setHeroForm] = useState<HeroCms>({ ...heroCms });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroCms(heroForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>تنظیمات هیرو و بنر اصلی سایت</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ویرایش متن هدر اصلی و تصاویر پس‌زمینه لندینگ
          </p>
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r from-amber-400 to-[#FF9F14] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>ذخیره تنظیمات هیرو</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-3xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>تغییرات هیرو با موفقیت ذخیره شد. این تغییرات فوراً در سایت اعمال می‌شوند.</span>
        </div>
      )}

      {/* Hero Banner CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">متن نشانک بالای تیتر (Pill)</label>
            <input
              type="text"
              value={heroForm.pillText || ''}
              onChange={(e) => setHeroForm({ ...heroForm, pillText: e.target.value })}
              placeholder="پیشگام در طراحی سالن و تجهیزات مدرن مرغداری"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:border-amber-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">تیتر اصلی هیرو (H1)</label>
            <input
              type="text"
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:border-amber-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">توضیحات زیر تیتر</label>
            <textarea
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">متن دکمه اصلی (CTA)</label>
            <input
              type="text"
              value={heroForm.ctaPrimaryText}
              onChange={(e) => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">متن دکمه دوم (CTA)</label>
            <input
              type="text"
              value={heroForm.ctaSecondaryText}
              onChange={(e) => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
            />
          </div>

          <div className="md:col-span-2 pt-2 border-t border-slate-800 mt-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>تصاویر پس‌زمینه (نمایش به صورت اسلایدشو محو شونده)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImagePicker
                label="تصویر اول"
                value={(heroForm.backgroundImages && heroForm.backgroundImages[0]) || heroForm.backgroundImage || ''}
                onChange={(url) => {
                  const newImages = [...(heroForm.backgroundImages || [heroForm.backgroundImage || ''])];
                  newImages[0] = url;
                  setHeroForm({ ...heroForm, backgroundImages: newImages, backgroundImage: url });
                }}
              />
              <ImagePicker
                label="تصویر دوم"
                value={(heroForm.backgroundImages && heroForm.backgroundImages[1]) || ''}
                onChange={(url) => {
                  const newImages = [...(heroForm.backgroundImages || [heroForm.backgroundImage || ''])];
                  newImages[1] = url;
                  setHeroForm({ ...heroForm, backgroundImages: newImages });
                }}
              />
              <ImagePicker
                label="تصویر سوم"
                value={(heroForm.backgroundImages && heroForm.backgroundImages[2]) || ''}
                onChange={(url) => {
                  const newImages = [...(heroForm.backgroundImages || [heroForm.backgroundImage || ''])];
                  newImages[2] = url;
                  setHeroForm({ ...heroForm, backgroundImages: newImages });
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-3">
              نکته: تصاویر به صورت خودکار هر ۵ ثانیه با افکت تاریک شدن ملایم تغییر می‌کنند. اگر فقط یک عکس انتخاب کنید، اسلایدشو متوقف می‌شود.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t border-slate-800"><button type="submit" className="bg-gradient-to-r from-amber-400 to-[#FF9F14] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-8 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"><Save className="w-5 h-5" /><span>ذخیره تنظیمات هیرو</span></button></div>
    </form>
  );
};
