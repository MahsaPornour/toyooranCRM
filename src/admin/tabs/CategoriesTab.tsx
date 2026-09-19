import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  Sparkles,
  Package
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImagePicker } from '../components/ImagePicker';
import { CategoryInfo, ProductCategory } from '../../types';

export const CategoriesTab: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useData();
  const [editingCat, setEditingCat] = useState<CategoryInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<CategoryInfo>>({
    id: 'custom-cat' as ProductCategory,
    title: '',
    titleEn: '',
    description: '',
    badge: 'تجهیزات صنعتی',
    iconName: 'Package',
    image: '/images/equipment-1.jpg'
  });

  const openCreateModal = () => {
    setFormData({
      id: `cat-${Date.now()}` as ProductCategory,
      title: '',
      titleEn: '',
      description: '',
      badge: 'تجهیزات صنعتی',
      iconName: 'Package',
      image: '/images/equipment-1.jpg'
    });
    setIsCreating(true);
    setEditingCat(null);
  };

  const openEditModal = (c: CategoryInfo) => {
    setFormData(JSON.parse(JSON.stringify(c)));
    setEditingCat(c);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.id) return;

    const fullCat: CategoryInfo = {
      id: formData.id as ProductCategory,
      title: formData.title,
      titleEn: formData.titleEn || '',
      description: formData.description || '',
      badge: formData.badge || 'تجهیزات',
      icon: formData.iconName || 'Package',
      iconName: formData.iconName || 'Package',
      image: formData.image || '/images/equipment-1.jpg'
    };

    if (isCreating) {
      addCategory(fullCat);
    } else if (editingCat) {
      updateCategory(editingCat.id, fullCat);
    }

    setIsCreating(false);
    setEditingCat(null);
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>مدیریت دسته‌بندی‌های کاتالوگ ({categories.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            دسته‌بندی‌های اصلی تجهیزات، ماشین‌آلات خوراک، تهویه، سوله، داروها و نشان‌ها
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن دسته‌بندی جدید</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const productCount = products.filter(p => p.category === c.id).length;
          return (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                    {c.titleEn && <span className="text-[10px] text-slate-400 font-mono block">{c.titleEn}</span>}
                  </div>
                  <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                    {c.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">
                  {productCount} محصول در این دسته
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    title="ویرایش دسته"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(c.id)}
                    className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs"
                    title="حذف دسته"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>تایید حذف دسته</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              آیا از حذف این دسته‌بندی اطمینان دارید؟
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-black"
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editingCat) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>{isCreating ? 'افزودن دسته‌بندی جدید' : `ویرایش: ${formData.title}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingCat(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شناسه یکتا (ID لاتین)</label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value as ProductCategory })}
                  placeholder="machinery, feeding, etc."
                  required
                  disabled={!isCreating}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان فارسی دسته‌بندی</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: ماشین‌آلات خط تولید پلت"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان انگلیسی</label>
                <input
                  type="text"
                  value={formData.titleEn || ''}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Feed Machinery"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">برچسب نشان (Badge)</label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="تولید انحصاری"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">توضیحات دسته‌بندی</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCat(null);
                  }}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره دسته</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
