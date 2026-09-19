import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Service, ServiceWorkflowStep } from '../../types';

export const ServicesTab: React.FC = () => {
  const { services, addService, updateService, deleteService } = useData();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    tagline: '',
    iconName: 'Wrench',
    problemSolved: '',
    whatWeProvide: ['طراحی و مشاوره تخصصی مهندسی'],
    workflow: [
      { stepNumber: 1, title: 'مشاوره و بررسی نیاز', description: 'بررسی ابعاد سالن و الزامات اقلیمی', deliverable: 'گزارش امکان‌سنجی' },
      { stepNumber: 2, title: 'طراحی و نقشه محاسباتی', description: 'ترسیم خطوط و تجهیزات', deliverable: 'نقشه فنی مهندسی' }
    ],
    suitableFor: ['مرغداری‌های گوشتی و تخم‌گذار'],
    relatedEquipmentCategories: ['feeding', 'ventilation'],
    sampleProjectIds: [],
    faqs: []
  });

  const openCreateModal = () => {
    setFormData({
      id: `srv-${Date.now()}`,
      title: '',
      tagline: '',
      iconName: 'Wrench',
      problemSolved: 'چالش هدررفت انرژی و استهلاک تجهیزات',
      whatWeProvide: ['محاسبه دقیق سیستم تهویه', 'طراحی خطوط اتوماسیون دانخوری'],
      workflow: [
        { stepNumber: 1, title: 'مشاوره و ممیزی میدانی', description: 'بازدید حضوری یا بررسی نقشه سالن', deliverable: 'طرح اولیه' },
        { stepNumber: 2, title: 'تأمین و نصب ماشین‌آلات', description: 'استقرار استاندارد تیم اجرایی', deliverable: 'راه‌اندازی گام به گام' },
        { stepNumber: 3, title: 'پشتیبانی و خدمات پس از فروش', description: 'پایش دوره‌ای و تأمین قطعات', deliverable: 'گارانتی رسمی' }
      ],
      suitableFor: ['مرغداری‌های گوشتی', 'کارخانجات خوراک', 'فارم‌های تخم‌گذار'],
      relatedEquipmentCategories: ['feeding', 'machinery'],
      sampleProjectIds: [],
      faqs: []
    });
    setIsCreating(true);
    setEditingService(null);
  };

  const openEditModal = (s: Service) => {
    setFormData(JSON.parse(JSON.stringify(s)));
    setEditingService(s);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const fullService: Service = {
      id: formData.id || `srv-${Date.now()}`,
      title: formData.title,
      tagline: formData.tagline || '',
      iconName: formData.iconName || 'Wrench',
      problemSolved: formData.problemSolved || '',
      whatWeProvide: formData.whatWeProvide || [],
      workflow: formData.workflow || [],
      suitableFor: formData.suitableFor || [],
      relatedEquipmentCategories: formData.relatedEquipmentCategories || [],
      sampleProjectIds: formData.sampleProjectIds || [],
      faqs: formData.faqs || []
    };

    if (isCreating) {
      addService(fullService);
    } else if (editingService) {
      updateService(editingService.id, fullService);
    }

    setIsCreating(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>مدیریت خدمات و مهندسی سوله ({services.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ویرایش مراحل فرآیند کاری (Workflow)، خدمات مهندسی، مشاوره ممیزی و ساخت سوله
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن خدمت جدید</span>
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-amber-400/90 font-medium mt-0.5">{s.tagline}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4 text-amber-400" />
                </div>
              </div>

              <div className="mt-3 bg-slate-950/85 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-slate-400 text-[11px] block">مسئله‌ای که حل می‌کنیم:</span>
                <p className="line-clamp-2">{s.problemSolved}</p>
              </div>

              <div className="mt-3">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">مراحل فرآیند اجرا ({s.workflow.length} مرحله):</span>
                <div className="flex flex-wrap gap-1.5">
                  {s.workflow.map((w, wIdx) => (
                    <span key={wIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-lg font-medium">
                      {w.stepNumber}. {w.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono">ID: {s.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(s)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                  title="ویرایش خدمت"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(s.id)}
                  className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs"
                  title="حذف خدمت"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>تایید حذف خدمت</span>
            </h3>
            <p className="text-xs text-slate-300">آیا از حذف این خدمت اطمینان دارید؟</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  deleteService(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-black"
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <span>{isCreating ? 'افزودن خدمت جدید' : `ویرایش خدمت: ${formData.title}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingService(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان خدمت مهندسی</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: طراحی، ساخت و تجهیز صفر تا صد سوله و سالن"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">شعار / زیرعنوان کوتاه</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="مثال: مهندسی سازه مدرن و بهداشتی بر اساس استانداردهای روز"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">مسئله‌ای که این خدمت حل می‌کند</label>
                <textarea
                  value={formData.problemSolved || ''}
                  onChange={(e) => setFormData({ ...formData, problemSolved: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>ذخیره خدمت</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
