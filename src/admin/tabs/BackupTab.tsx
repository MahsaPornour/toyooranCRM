import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  FileJson,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const BackupTab: React.FC = () => {
  const { 
    products, 
    projects, 
    services, 
    articles, 
    categories, 
    quoteRequests, 
    consultationRequests, 
    companyInfo, 
    heroCms, 
    aiConfig,
    resetToFactoryDefaults 
  } = useData();

  const [resetConfirmModal, setResetConfirmModal] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJson = () => {
    const backupData = {
      version: '3.2.0',
      exportedAt: new Date().toISOString(),
      products,
      projects,
      services,
      articles,
      categories,
      quoteRequests,
      consultationRequests,
      companyInfo,
      heroCms,
      aiConfig
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Toyooran_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.products && parsed.projects) {
            localStorage.setItem('toyooran_products_v3', JSON.stringify(parsed.products));
            if (parsed.projects) localStorage.setItem('toyooran_projects_v3', JSON.stringify(parsed.projects));
            if (parsed.services) localStorage.setItem('toyooran_services_v3', JSON.stringify(parsed.services));
            if (parsed.articles) localStorage.setItem('toyooran_articles_v3', JSON.stringify(parsed.articles));
            if (parsed.categories) localStorage.setItem('toyooran_categories_v3', JSON.stringify(parsed.categories));
            if (parsed.companyInfo) localStorage.setItem('toyooran_company_info_v3', JSON.stringify(parsed.companyInfo));
            if (parsed.heroCms) localStorage.setItem('toyooran_hero_cms_v3', JSON.stringify(parsed.heroCms));
            if (parsed.aiConfig) localStorage.setItem('toyooran_ai_config_v3', JSON.stringify(parsed.aiConfig));
            
            setImportStatus('فایل پشتیبان با موفقیت بارگذاری شد. صفحه در حال بارگذاری مجدد است...');
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          } else {
            setImportStatus('ساختار فایل JSON معتبر نیست.');
          }
        } catch (err) {
          setImportStatus('خطا در خواندن فایل پشتیبان.');
        }
      };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <span>پشتیبان‌گیری (Backup)، خروجی داده و بازنشانی اطلاعات</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            دانلود نسخه پشتیبان کامل از تمامی محصولات، سفارشات، مقالات و تنظیمات سایت
          </p>
        </div>
      </div>

      {importStatus && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 p-3.5 rounded-3xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Grid of 3 Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Export JSON Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-white">خروجی و دانلود پشتیبان (Export JSON)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              دانلود یک فایل استاندارد JSON شامل کل دیتابیس محصولات، استعلام قیمتها، مقالات و تنظیمات.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <FileJson className="w-4 h-4" />
            <span>دانلود فایل پشتیبان (JSON)</span>
          </button>
        </div>

        {/* Import JSON Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-white">بازیابی از فایل پشتیبان (Import)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              بارگذاری فایل پشتیبان JSON قبلی جهت بازگردانی تمامی اطلاعات سایت.
            </p>
          </div>

          <label className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-600 cursor-pointer transition-colors">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>انتخاب و بارگذاری فایل</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
        </div>

        {/* Reset to Factory Defaults */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-rose-400" />
            </div>
            <h3 className="text-sm font-bold text-white">بازنشانی به دیتای اولیه کارخانه (Reset)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              بازنشانی کامل کاتالوگ، مقالات و پروژه‌ها به دیتای پیش‌فرض استاندارد شرکت طیوران صنعت پویا.
            </p>
          </div>

          <button
            onClick={() => setResetConfirmModal(true)}
            className="w-full bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/40 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بازنشانی به حالت کارخانه</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal */}
      {resetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>هشدار بازنشانی دیتای سامانه</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              آیا مطمئن هستید؟ با این اقدام، تمامی تغییرات محتوا، محصولات اضافه شده و درخواست‌ها ریست شده و به حالت دمو اولیه شرکت بازخواهد گشت.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  resetToFactoryDefaults();
                  setResetConfirmModal(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md"
              >
                تایید و بازنشانی کامل
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
