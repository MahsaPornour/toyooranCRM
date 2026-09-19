import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  UserCheck,
  Bot,
  Send,
  RefreshCw,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SecurityTab: React.FC = () => {
  const { adminUser, changeAdminPassword } = useData();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Bale Bot Status State
  const [baleStatus, setBaleStatus] = useState<{ configured: boolean; hasToken: boolean; hasChatId: boolean } | null>(null);
  const [testingBale, setTestingBale] = useState(false);
  const [baleTestResult, setBaleTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchBaleStatus();
  }, []);

  const fetchBaleStatus = async () => {
    try {
      const res = await fetch('/api/bale/status');
      if (res.ok) {
        const data = await res.json();
        setBaleStatus(data);
      }
    } catch {
      setBaleStatus({ configured: false, hasToken: false, hasChatId: false });
    }
  };

  const handleTestBale = async () => {
    setTestingBale(true);
    setBaleTestResult(null);
    try {
      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: 'تست ادمین سیستم',
          phoneNumber: '۰۹۱۲۰۰۰۰۰۰۰',
          companyName: 'طیوران صنعت پویا (آزمایشی)',
          subject: 'تست اتصال ربات بله',
          productName: 'تست خودکار',
          location: 'تهران',
          message: 'این یک پیام آزمایشی جهت بررسی اتصال فرم‌ها به ربات بله است.',
          source: 'پنل مدیریت ادمین',
          timestamp: new Date().toLocaleString('fa-IR')
        })
      });

      const data = await res.json();
      if (data.sentToBale) {
        setBaleTestResult({ success: true, message: 'پیام تست با موفقیت به ربات بله ارسال شد!' });
      } else {
        setBaleTestResult({ 
          success: false, 
          message: data.baleResult?.description || 'توکن ربات یا شناسه چت بله در متغیرهای محیطی (.env) تنظیم نشده است.' 
        });
      }
    } catch (err: any) {
      setBaleTestResult({ success: false, message: 'خطا در برقراری ارتباط با سرور: ' + (err?.message || '') });
    } finally {
      setTestingBale(false);
      fetchBaleStatus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'کلمه عبور جدید با تکرار آن یکسان نیست.' });
      return;
    }

    if (newPassword.length < 5) {
      setStatus({ type: 'error', message: 'کلمه عبور باید حداقل ۵ کاراکتر باشد.' });
      return;
    }

    const success = changeAdminPassword(oldPassword, newPassword);
    if (success) {
      setStatus({ type: 'success', message: 'کلمه عبور مدیریت با موفقیت تغییر یافت.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setStatus({ type: 'error', message: 'کلمه عبور فعلی نادرست است.' });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            <span>امنیت، کنترل دسترسی و تغییر کلمه عبور مدیریت</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت رمز ورود به درگاه ادمین و سطح دسترسی مدیران سامانه
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">تغییر کلمه عبور ادمین</h3>
          </div>

          {status && (
            <div className={`p-3.5 rounded-3xl text-xs flex items-center gap-2 ${
              status.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">کلمه عبور فعلی</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="کلمه عبور فعلی خود را وارد کنید"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">کلمه عبور جدید</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="حداقل ۵ کاراکتر"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">تکرار کلمه عبور جدید</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="مجدداً کلمه عبور جدید را وارد کنید"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 font-mono"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>ثبت و تغییر کلمه عبور</span>
            </button>
          </form>
        </div>

        {/* User Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">مشخصات نشست جاری</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">نام نمایشی:</span>
              <span className="text-white font-bold block mt-0.5">{adminUser?.displayName || 'مدیر سیستم'}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">نام کاربری:</span>
              <span className="text-amber-400 font-mono font-bold block mt-0.5">@{adminUser?.username || 'admin'}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[11px]">سطح دسترسی:</span>
              <span className="text-emerald-400 font-bold block mt-0.5">مدیر ارشد کل (Super Administrator)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bale Messenger Bot Integration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#003F86] text-amber-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>اتصال به ربات پیام‌رسان بله (Bale Messenger Bot)</span>
                {baleStatus?.configured ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    متصل و فعال
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                    نیازمند پیکربندی در .env
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ارسال آنی تمام فرم‌های ثبت‌شده سایت (مشاوره، استعلام قیمت، مشخصات متقاضی) به چت یا کانال بله
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestBale}
              disabled={testingBale}
              className="bg-[#003F86] hover:bg-blue-800 text-amber-300 hover:text-amber-200 border border-blue-700 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {testingBale ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>ارسال پیام تست به بله</span>
            </button>
          </div>
        </div>

        {baleTestResult && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            baleTestResult.success 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
          }`}>
            {baleTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
            <span>{baleTestResult.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>وضعیت متغیرهای محیطی</span>
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>توکن ربات (<code className="text-amber-300">BALE_BOT_TOKEN</code>):</span>
                <span className={`font-bold ${baleStatus?.hasToken ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {baleStatus?.hasToken ? '✓ تنظیم شده' : 'تنظیم نشده'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>شناسه دریافت‌کننده (<code className="text-amber-300">BALE_CHAT_ID</code>):</span>
                <span className={`font-bold ${baleStatus?.hasChatId ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {baleStatus?.hasChatId ? '✓ تنظیم شده' : 'تنظیم نشده'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>راهنمای راه‌اندازی ربات بله</span>
            </h4>
            <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px] leading-relaxed">
              <li>در پیام‌رسان بله به ربات <code className="text-amber-300">@BotFather</code> پیام داده و ربات جدید بسازید.</li>
              <li>توکن دریافتی را در متغیر <code className="text-amber-300">BALE_BOT_TOKEN</code> قرار دهید.</li>
              <li>شناسه کاربری یا کانال خود را در <code className="text-amber-300">BALE_CHAT_ID</code> وارد کنید.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};
