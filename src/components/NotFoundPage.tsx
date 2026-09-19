import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-9xl font-black text-slate-200">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-4 mb-6">
        صفحه مورد نظر یافت نشد
      </h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
        ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه از سایت حذف شده باشد.
      </p>
      <Link 
        to="/"
        className="flex items-center gap-2 bg-[#003F86] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
      >
        <Home className="w-5 h-5" />
        <span>بازگشت به صفحه اصلی</span>
      </Link>
    </div>
  );
};
