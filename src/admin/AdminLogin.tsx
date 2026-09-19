import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Turnstile } from '@marsidev/react-turnstile';

interface AdminLoginProps {
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
  const { login, verifyMfa } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (mfaRequired) {
      const result = await verifyMfa(mfaCode);
      if (!result.success) setError(result.error || 'کد MFA نامعتبر است.');
      setIsLoading(false);
      return;
    }
    const result = await login(username, password, turnstileToken);
    if (result.mfaRequired) { setMfaRequired(true); setError('کد برنامه Authenticator را وارد کنید.'); setIsLoading(false); return; }
    if (!result.success) { setError(result.error || 'اطلاعات ورود نامعتبر است.'); setIsLoading(false); }
  };

  const handleQuickFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#00224B] to-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-['Estedad',sans-serif]" dir="rtl">
      
      {/* Subtle Background Blueprint Grid */}
      <div className="absolute inset-0 bg-blueprint opacity-40 pointer-events-none" />
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Return to Public Site Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80  px-4 py-2 rounded-xl border border-slate-700/60 transition-all shadow-sm"
        >
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span>بازگشت به سایت عمومی</span>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#003F86] border-2 border-amber-400/80 shadow-xl mb-4 relative group">
            <div className="w-8 h-8 border-2 border-amber-400 rounded-lg transform rotate-45 flex items-center justify-center bg-[#003F86]">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FF9F14] rounded-full border-2 border-slate-900"></span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            طیوران صنعت پویا
          </h1>
          <p className="text-xs sm:text-sm text-blue-200/80 font-medium mt-1">
            سامانه مدیریت جامع و اختصاصی محتوا (Admin CMS)
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-900/90  border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white">ورود به پنل راهبری</span>
            </div>
            <span className="text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-mono font-medium">
              V3.0 SECURE
            </span>
          </div>

          {error && (
            <div className="mb-5 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-3xl text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!mfaRequired && <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نام کاربری مدیر
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors pl-10"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>}

            {!mfaRequired && <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                کلمه عبور امنیتی
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950/80 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition-colors pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>}

            {mfaRequired ? <div><label className="block text-xs font-bold text-slate-300 mb-1.5">کد شش‌رقمی MFA</label><input inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} required className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white" /></div> : (import.meta.env.VITE_TURNSTILE_SITE_KEY && import.meta.env.VITE_TURNSTILE_SITE_KEY !== 'AI_STUDIO_PREVIEW_DISABLED' ? <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={setTurnstileToken} onExpire={() => setTurnstileToken('')} /> : <p className="text-xs text-amber-300">CAPTCHA در Preview غیرفعال است.</p>)}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-amber-400 to-[#FF9F14] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/20 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>ورود به پنل مدیریت</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Credentials Helper */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={() => handleQuickFill('admin', 'ToyooranAdmin2025!Super')}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-3.5 py-2 rounded-xl font-bold transition-all shadow-sm"
              title="درج خودکار نام کاربری و کلمه عبور پیش‌فرض"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>درج خودکار اطلاعات ورود پیش‌فرض (admin)</span>
            </button>
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-500">ورود فقط با نشست امن backend و CAPTCHA معتبر امکان‌پذیر است.</p>

        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-500 mt-6 font-medium">
          دسترسی به این درگاه فقط مختص مدیران و کارشناسان شرکت طیوران صنعت پویا می‌باشد.
        </p>

      </div>
    </div>
  );
};
