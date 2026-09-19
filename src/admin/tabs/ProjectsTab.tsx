import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  MapPin,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ImagePicker } from '../components/ImagePicker';
import { Project } from '../../types';

export const ProjectsTab: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    type: 'broiler',
    typeTitle: 'مرغداری گوشتی مدرن',
    capacity: '۳۰,۰۰۰ قطعه',
    location: 'مازندران',
    year: '۱۴۰۲',
    image: '/images/poultry-1.jpg',
    servicesProvided: ['طراحی و نقشه محاسباتی سوله', 'نصب تجهیزات دانخوری و آبخوری'],
    equipmentSummary: ['بشقاب پروانه‌ای Butterfly Concepts', 'جت هیتر ۱۰۰'],
    keyOutcome: 'کاهش ضریب تبدیل FCR به ۱.۵۲ و صرفه‌جویی انرژی'
  });

  const projectTypes = [
    { value: 'broiler', label: 'مرغداری گوشتی' },
    { value: 'layer', label: 'فارم تخم‌گذار' },
    { value: 'breeder', label: 'مادر و اجداد' },
    { value: 'feed_mill', label: 'کارخانه خوراک' },
    { value: 'agriculture', label: 'کشاورزی و سیلو' },
  ];

  const openCreateModal = () => {
    setFormData({
      id: `proj-${Date.now()}`,
      title: '',
      type: 'broiler',
      typeTitle: 'مرغداری گوشتی مدرن',
      capacity: '۴۰,۰۰۰ قطعه',
      location: 'خراسان رضوی',
      year: '۱۴۰۳',
      image: '/images/poultry-1.jpg',
      servicesProvided: ['مشاوره و طراحی سازه سبک', 'نصب خط دانخوری بشقابی FDA', 'سیستم تهویه هوشمند'],
      equipmentSummary: ['بشقاب پروانه‌ای Butterfly Concepts', 'جت هیتر ۱۰۰ کیلوکالری', 'هواکش ۱۴۰'],
      keyOutcome: 'بهبود ضریب تبدیل خوراک و کاهش ۳۰ درصدی تلفات هفته اول',
      caseStudy: {
        problem: 'چالش هدررفت بالای دان با سینی‌های دستی سنتی و افت دما در انتهای سالن.',
        clientNeed: 'نوسازی کامل خطوط دانخوری با تاییدیه بهداشتی FDA و بهینه‌سازی تهویه.',
        solution: 'نصب خطوط تمام اتوماتیک بشقاب پروانه‌ای و جت هیترهای با راندمان بالا.',
        processSteps: [
          { title: 'بررسی میدانی و محاسبه ابعاد', desc: 'محاسبه دقیق ظرفیت سالن و خطوط' },
          { title: 'نصب و راه‌اندازی خطوط اتوماسیون', desc: 'استقرار بدون وقفه در دوره پرورش' }
        ],
        equipmentList: ['بشقاب پروانه‌ای پویا', 'جت هیتر ۵۰'],
        results: [
          { label: 'ضریب تبدیل (FCR)', value: '۱.۵۴', detail: 'بهبود ۰.۱۵ واحدی' },
          { label: 'کاهش پرت دان', value: '۱۵٪', detail: 'صرفه‌جویی مستقیم در هر دوره' }
        ]
      }
    });
    setIsCreating(true);
    setEditingProject(null);
  };

  const openEditModal = (p: Project) => {
    setFormData(JSON.parse(JSON.stringify(p)));
    setEditingProject(p);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const matchedType = projectTypes.find(t => t.value === formData.type);

    const fullProj: Project = {
      id: formData.id || `proj-${Date.now()}`,
      title: formData.title,
      type: (formData.type as any) || 'broiler',
      typeTitle: matchedType ? matchedType.label : 'پروژه صنعتی',
      capacity: formData.capacity || '',
      location: formData.location || '',
      year: formData.year || '۱۴۰۳',
      image: formData.image || '/images/poultry-1.jpg',
      servicesProvided: formData.servicesProvided || [],
      equipmentSummary: formData.equipmentSummary || [],
      keyOutcome: formData.keyOutcome || '',
      caseStudy: formData.caseStudy
    };

    if (isCreating) {
      addProject(fullProj);
    } else if (editingProject) {
      updateProject(editingProject.id, fullProj);
    }

    setIsCreating(false);
    setEditingProject(null);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.capacity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>مدیریت پروژه‌ها و نمونه‌کارهای اجرا شده ({projects.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ثبت پروژه‌های احداث شده، مطالعات موردی، سالن‌های مرغداری و کارخانجات خوراک
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن پروژه جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در عنوان پروژه، موقعیت مکانی یا ظرفیت..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 pl-10 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-amber-400"
        >
          <option value="all">همه انواع پروژه ({projects.length})</option>
          {projectTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col hover:border-slate-700 transition-all">
            <div className="relative h-44">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              <span className="absolute top-3 right-3 bg-[#003F86]/90  text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                {p.typeTitle}
              </span>
              <span className="absolute bottom-3 right-3 text-xs font-black text-white">
                {p.capacity}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xs font-bold text-white leading-snug">{p.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {p.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    سال {p.year}
                  </span>
                </div>
              </div>

              {p.keyOutcome && (
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <span className="font-bold text-amber-400 block mb-0.5">نتیجه اصلی:</span>
                  <span className="line-clamp-2">{p.keyOutcome}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono">ID: {p.id}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs"
                    title="ویرایش پروژه"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(p.id)}
                    className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs"
                    title="حذف پروژه"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              <span>تایید حذف پروژه</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              آیا از حذف این پروژه اطمینان دارید؟
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  deleteProject(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-md"
              >
                حذف قطعی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>{isCreating ? 'افزودن پروژه جدید' : `ویرایش پروژه: ${formData.title}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان کامل پروژه</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: مجتمع پرورش مرغ گوشتی فارم نوین"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نوع پروژه</label>
                  <select
                    value={formData.type || 'broiler'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  >
                    {projectTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">ظرفیت پروژه</label>
                  <input
                    type="text"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="مثال: ۵۰,۰۰۰ قطعه"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">موقعیت / شهر</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="مثال: مازندران، آمل"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <ImagePicker
                  label="تصویر پروژه"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">نتیجه یا شاخص کلیدی دست‌یافته</label>
                <input
                  type="text"
                  value={formData.keyOutcome || ''}
                  onChange={(e) => setFormData({ ...formData, keyOutcome: e.target.value })}
                  placeholder="مثال: ضریب تبدیل ۱.۵۲ و صرفه‌جویی ۲۰ درصدی سوخت"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProject(null);
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
                  <span>ذخیره پروژه</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
