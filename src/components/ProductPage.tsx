import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowRight, PhoneCall, Sparkles, Layers, Package, Zap, Settings } from 'lucide-react';
import { LazyImage } from './LazyImage';
import { NotFoundPage } from './NotFoundPage';
import { SEO } from './SEO';

export const ProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products } = useData();

  const product = products.find(p => p.id === productId || p.code === productId);

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <SEO 
        title={`${product.name} | Toyooran`}
        description={product.shortDescription || product.fullDescription}
        ogType="product"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#003F86] transition-colors mb-6 text-sm font-bold bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-slate-200/60"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به محصولات</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* 1. عکس محصول */}
            <div className="bg-slate-50 p-8 lg:p-12 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-l border-slate-100">
              <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-100 mb-6">
                <LazyImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover mix-blend-multiply"
                />
              </div>
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto w-full max-w-md pb-2 custom-scrollbar">
                  {product.gallery.map((img, idx) => (
                    <div key={idx} className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 border-slate-200 bg-white cursor-pointer hover:border-[#003F86] transition-colors">
                      <LazyImage
                        src={img}
                        alt={`${product.name} - ${idx + 1}`}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col h-full">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  {/* 4. دسته بندی */}
                  <span className="bg-blue-50 text-[#003F86] text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    {product.categoryTitle.replace(/ مرغداری$/, '')}
                  </span>
                  
                  {/* 2. کد محصول */}
                  <span className="font-mono text-xs font-bold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-amber-200">
                    <Package className="w-3.5 h-3.5" />
                    کد: {product.code}
                  </span>
                </div>
                
                {/* 3. نام محصول */}
                <h1 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-2">
                  {product.name}
                </h1>
                {product.nameEn && (
                  <h2 className="text-sm font-mono text-slate-400">
                    {product.nameEn}
                  </h2>
                )}
              </div>

              {/* 5. معرفی محصول */}
              <div className="mb-8">
                <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  معرفی محصول
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm lg:text-base font-medium text-justify">
                  {product.fullDescription}
                </p>
              </div>

              {/* 6. ویژگی‌های محصول */}
              {product.advantages && product.advantages.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#003F86]" />
                    ویژگی‌های محصول
                  </h3>
                  <ul className="grid grid-cols-1 gap-2.5">
                    {product.advantages.map((adv, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                        <div className="w-2 h-2 bg-[#003F86] rounded-full mt-2 shrink-0" />
                        <span className="text-sm text-slate-700 leading-relaxed font-medium">{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 7. مشخصات فنی محصول */}
              {product.specs && product.specs.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-500" />
                    مشخصات فنی
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-right text-sm">
                      <tbody>
                        {product.specs.map((spec, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-b-0 even:bg-slate-50/50">
                            <th className="py-3 px-4 font-bold text-slate-600 w-1/3 whitespace-nowrap bg-slate-50">{spec.label}</th>
                            <td className="py-3 px-4 text-slate-800 font-medium">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="flex-1 bg-[#003F86] hover:bg-blue-800 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20 flex justify-center items-center gap-2 group"
                >
                  <PhoneCall className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>استعلام قیمت و مشاوره</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
