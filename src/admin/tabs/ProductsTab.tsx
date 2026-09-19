import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  Layers,
  Sparkles,
  Check, FileText,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImagePicker } from '../components/ImagePicker';
import { Product, ProductCategory } from '../../types';

export const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, replaceAllProducts, categories } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // فرم ساده شده برای 5 فیلد اصلی
  const [formData, setFormData] = useState<Partial<Product>>({
    code: '',
    name: '',
    category: 'heating',
    categoryTitle: 'ماشین‌آلات خط تولید خوراک و مکمل',
    fullDescription: '',
    image: '/images/equipment-1.jpg',
    advantages: [],
  });

  const [advantageInput, setAdvantageInput] = useState('');

  const openCreateModal = () => {
    setFormData({
      id: `prod-${Date.now()}`,
      code: 'TY-PROD-' + Math.floor(100 + Math.random() * 900),
      name: '',
      category: 'heating',
      categoryTitle: 'ماشین‌آلات خط تولید خوراک و مکمل',
      fullDescription: '',
      image: '/images/equipment-1.jpg',
      advantages: [],
      // Keep other unused required fields empty/default for TS interface
      shortDescription: '',
      applications: [],
      specs: [],
      models: [],
    });
    setIsCreating(true);
    setEditingProduct(null);
  };

  const openEditModal = (p: Product) => {
    setFormData(JSON.parse(JSON.stringify(p)));
    setEditingProduct(p);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    const matchedCat = categories.find(c => c.id === formData.category);
    const categoryTitle = matchedCat ? matchedCat.title : 'سایر تجهیزات';

    const fullProduct: Product = {
      id: formData.id || `prod-${Date.now()}`,
      code: formData.code || 'TY-PROD',
      name: formData.name,
      category: (formData.category as ProductCategory) || 'heating',
      categoryTitle: categoryTitle,
      fullDescription: formData.fullDescription || '',
      image: formData.image || '/images/equipment-1.jpg',
      advantages: formData.advantages || [],
      
      // Preserve other fields if editing, else default
      shortDescription: formData.fullDescription || '',
      applications: editingProduct?.applications || [],
      specs: editingProduct?.specs || [],
      models: editingProduct?.models || [],
    };

    if (isCreating) {
      addProduct(fullProduct);
    } else if (editingProduct) {
      updateProduct(editingProduct.id, fullProduct);
    }

    setIsCreating(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>مدیریت محصولات ({products.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ویرایش ۵ مشخصه اصلی محصولات برای نمایش در صفحه محصول
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس نام محصول و کد فنی..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 pl-10 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="w-full md:w-64">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white transition-colors"
          >
            <option value="all">همه دسته‌بندی‌ها</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
                    <div className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured || false}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
                      />
                      <label htmlFor="isFeatured" className="text-xs font-bold text-slate-300 select-none cursor-pointer">
                        نمایش به عنوان محصول پرفروش (پیشنهاد ویژه در صفحه اصلی)
                      </label>
                    </div>
      </div>

      {/* Product List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-800/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold">تصویر</th>
                <th className="py-3 px-4 font-bold">کد محصول</th>
                <th className="py-3 px-4 font-bold">نام محصول</th>
                <th className="py-3 px-4 font-bold">دسته‌بندی</th>
                <th className="py-3 px-4 font-bold text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-screen" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                    {product.code}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-200">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700 text-[10px]">
                      {product.categoryTitle}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors"
                        title="ویرایش"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === product.id ? (
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="w-7 h-7 rounded-lg bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                          title="انصراف"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : null}

                      <button
                        onClick={() => deleteConfirmId === product.id ? deleteProduct(product.id) : setDeleteConfirmId(product.id)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          deleteConfirmId === product.id 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'
                        }`}
                        title={deleteConfirmId === product.id ? "تایید حذف" : "حذف"}
                      >
                        {deleteConfirmId === product.id ? <Check className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    محصولی با این مشخصات یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80  flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90  z-10 rounded-t-3xl">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                {isCreating ? 'افزودن محصول جدید' : `ویرایش محصول: ${formData.name}`}
              </h3>
              <button
                onClick={() => { setIsCreating(false); setEditingProduct(null); }}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="productForm" onSubmit={handleSave} className="space-y-8">
                
                {/* بخش 1: اطلاعات پایه */}
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-4 border-b border-slate-700/50 pb-2">
                    <Layers className="w-3.5 h-3.5" />
                    ۱. مشخصات پایه (نام، کد، دسته‌بندی)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">کد محصول (Code)</label>
                      <input
                        type="text"
                        required
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white"
                        placeholder="مثال: TY-100"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">نام محصول</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white"
                        placeholder="مثال: هیتر کابینتی 200 هزار"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی کاتالوگ</label>
                      <select
                        required
                        value={formData.category || 'heating'}
                        onChange={(e) => {
                          const catId = e.target.value as ProductCategory;
                          const matchedCat = categories.find(c => c.id === catId);
                          setFormData({ 
                            ...formData, 
                            category: catId,
                            categoryTitle: matchedCat ? matchedCat.title : ''
                          });
                        }}
                        className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* بخش 2: تصویر */}
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-4 border-b border-slate-700/50 pb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    ۲. تصویر محصول
                  </h4>
                  <ImagePicker
                    value={formData.image || ''}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label="انتخاب یا آپلود تصویر محصول"
                  />
                </div>

                {/* بخش 3: معرفی محصول */}
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-4 border-b border-slate-700/50 pb-2">
                    <FileText className="w-3.5 h-3.5" />
                    ۳. معرفی محصول (توضیحات)
                  </h4>
                  <textarea
                    required
                    value={formData.fullDescription || ''}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white h-24 custom-scrollbar"
                    placeholder="توضیحات جامع درباره محصول و کاربرد آن بنویسید..."
                  />
                </div>

                {/* بخش 4: ویژگی‌ها */}
                <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-4 border-b border-slate-700/50 pb-2">
                    <Check className="w-3.5 h-3.5" />
                    ۴. ویژگی‌های محصول
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={advantageInput}
                        onChange={(e) => setAdvantageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (advantageInput.trim()) {
                              setFormData({
                                ...formData,
                                advantages: [...(formData.advantages || []), advantageInput.trim()]
                              });
                              setAdvantageInput('');
                            }
                          }
                        }}
                        className="flex-1 bg-slate-800 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2.5 text-xs text-white"
                        placeholder="افزودن ویژگی جدید (اینتر بزنید)..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (advantageInput.trim()) {
                            setFormData({
                              ...formData,
                              advantages: [...(formData.advantages || []), advantageInput.trim()]
                            });
                            setAdvantageInput('');
                          }
                        }}
                        className="bg-amber-400 text-slate-900 px-3 rounded-xl font-bold text-xs"
                      >
                        افزودن
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.advantages?.map((adv, idx) => (
                        <div key={idx} className="bg-slate-800 border border-slate-700 text-white text-[11px] px-2.5 py-1.5 rounded-lg flex items-center gap-2">
                          <span>{adv}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const arr = [...(formData.advantages || [])];
                              arr.splice(idx, 1);
                              setFormData({ ...formData, advantages: arr });
                            }}
                            className="text-slate-400 hover:text-rose-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-900/90  rounded-b-3xl sticky bottom-0 flex justify-end gap-3 z-10">
              <button
                type="button"
                onClick={() => { setIsCreating(false); setEditingProduct(null); }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                form="productForm"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
