import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  X, 
  Save, 
  AlertCircle,
  Calendar,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Article } from '../../types';
import { ImagePicker } from '../components/ImagePicker';

export const ArticlesTab: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    category: 'technical-guide',
    categoryLabel: 'راهنمای فنی مهندسی',
    readTime: '۶ دقیقه',
    date: '۱۴۰۳/۰۸/۰۱',
    summary: '',
    content: ['متن پاراگراف اول...'],
    relatedProductIds: []
  });

  const categoriesList = [
    { value: 'technical-guide', label: 'راهنمای فنی مهندسی' },
    { value: 'product-guide', label: 'راهنمای ماشین‌آلات و کاتالوگ' },
    { value: 'article', label: 'مقاله تخصصی پرورش طیور' },
    { value: 'faq', label: 'سوالات متداول و پرسش و پاسخ' },
  ];

  const openCreateModal = () => {
    const now = new Date();
    const jalaliDate = now.toLocaleDateString('fa-IR');
    setFormData({
      id: `art-${Date.now()}`,
      title: '',
      category: 'technical-guide',
      categoryLabel: 'راهنمای فنی مهندسی',
      readTime: '۵ دقیقه',
      date: jalaliDate,
      summary: '',
      content: [''],
      relatedProductIds: []
    });
    setIsCreating(true);
    setEditingArticle(null);
  };

  const openEditModal = (a: Article) => {
    setFormData(JSON.parse(JSON.stringify(a)));
    setEditingArticle(a);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const matchedCat = categoriesList.find(c => c.value === formData.category);

    const fullArticle: Article = {
      id: formData.id || `art-${Date.now()}`,
      title: formData.title,
      category: (formData.category as any) || 'technical-guide',
      categoryLabel: matchedCat ? matchedCat.label : 'مقاله فنی',
      readTime: formData.readTime || '۵ دقیقه',
      date: formData.date || '۱۴۰۳/۰۸/۰۱',
      summary: formData.summary || '',
      content: (formData.content || []).filter(c => c.trim().length > 0),
      relatedProductIds: formData.relatedProductIds || []
    };

    if (isCreating) {
      addArticle(fullArticle);
    } else if (editingArticle) {
      updateArticle(editingArticle.id, fullArticle);
    }

    setIsCreating(false);
    setEditingArticle(null);
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>مجله فنی و پایگاه دانش تخصصی ({articles.length})</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت مقالات علمی، راهنماهای تهویه، استانداردهای ضریب تبدیل و آموزش تجهیزات
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن مقاله جدید</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در عنوان مقاله، چکیده یا محتوا..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 pl-10 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-amber-400"
        >
          <option value="all">همه دسته‌بندی‌ها ({articles.length})</option>
          {categoriesList.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      <div className="space-y-3">
        {filteredArticles.map((art) => (
          <div key={art.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {art.categoryLabel}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {art.date}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {art.readTime}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{art.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{art.summary}</p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                <button
                  onClick={() => openEditModal(art)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center gap-1"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>ویرایش</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(art.id)}
                  className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded-xl text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>{art.content.length} پاراگراف محتوا</span>
              <span className="font-mono">ID: {art.id}</span>
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
              <span>تایید حذف مقاله</span>
            </h3>
            <p className="text-xs text-slate-300">آیا از حذف این مقاله اطمینان دارید؟</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  deleteArticle(deleteConfirmId);
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
      {(isCreating || editingArticle) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80  flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>{isCreating ? 'افزودن مقاله جدید' : `ویرایش مقاله: ${formData.title}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingArticle(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان مقاله تخصصی</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: روش‌های بهینه‌سازی ضریب تبدیل با بشقاب پروانه‌ای FDA"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">دسته‌بندی موضوعی</label>
                  <select
                    value={formData.category || 'technical-guide'}
                    onChange={(e) => {
                      const val = e.target.value;
                      const label = categoriesList.find(c => c.value === val)?.label || val;
                      setFormData({ ...formData, category: val, categoryLabel: label });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">زمان تخمینی مطالعه</label>
                  <input
                    type="text"
                    value={formData.readTime || ''}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="مثال: ۶ دقیقه"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">تاریخ انتشار (شمسی)</label>
                  <input
                    type="text"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="۱۴۰۳/۰۸/۰۱"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImagePicker
                  label="تصویر اصلی مقاله"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                />
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">برچسب‌ها (با کاما جدا کنید)</label>
                  <input
                    type="text"
                    value={formData.tags?.join('، ') || ''}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value.split('،').map(t => t.trim()).filter(Boolean) })}
                    placeholder="تهویه، مرغداری، تجهیزات"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">تگ‌ها را با کامای فارسی (،) جدا کنید</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">چکیده / خلاصه مقدماتی</label>
                <textarea
                  value={formData.summary || ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 leading-relaxed"
                />
              </div>

              {/* Multi-Paragraph Content Builder */}
              <div className="bg-slate-950/60 p-4 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400">پاراگراف‌های بدنه مقاله</label>
                  <button
                    type="button"
                    onClick={() => {
                      const cur = formData.content || [];
                      setFormData({ ...formData, content: [...cur, ''] });
                    }}
                    className="text-[11px] bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-amber-400" />
                    <span>افزودن بلاک محتوا</span>
                  </button>
                </div>
                
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 mb-3 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-amber-400 font-bold mb-1 block">راهنمای استفاده از کدهای ویژه در محتوا:</span>
                  <ul className="list-disc pr-4 space-y-1">
                    <li><strong className="text-slate-200">تیتر دوم:</strong> شروع متن با <code className="text-amber-300 bg-slate-800 px-1 rounded">## </code> (مثال: ## ویژگی‌های دستگاه)</li>
                    <li><strong className="text-slate-200">تیتر سوم:</strong> شروع متن با <code className="text-amber-300 bg-slate-800 px-1 rounded">### </code> (مثال: ### مشخصات فنی)</li>
                    <li><strong className="text-slate-200">آیتم لیست:</strong> شروع متن با <code className="text-amber-300 bg-slate-800 px-1 rounded">- </code> (مثال: - بازدهی بالا)</li>
                    <li><strong className="text-slate-200">عکس داخل متن:</strong> استفاده از فرمت <code className="text-amber-300 bg-slate-800 px-1 rounded">[IMG|آدرس عکس|متن زیر عکس]</code></li>
                    <li><strong className="text-slate-200">بنر CTA (دعوت به اقدام):</strong> استفاده از فرمت <code className="text-amber-300 bg-slate-800 px-1 rounded">[CTA|متن دکمه|لینک]</code> (مثال: [CTA|مشاوره رایگان|/contact])</li>
                    <li><strong className="text-slate-200">پاراگراف عادی:</strong> فقط متن خود را بنویسید.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  {formData.content?.map((paragraph, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2">
                      <span className="text-[10px] text-slate-500 font-mono pt-2">{pIdx + 1}</span>
                      <textarea
                        value={paragraph}
                        onChange={(e) => {
                          const updated = [...(formData.content || [])];
                          updated[pIdx] = e.target.value;
                          setFormData({ ...formData, content: updated });
                        }}
                        rows={3}
                        placeholder="متن این پاراگراف..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (formData.content || []).filter((_, idx) => idx !== pIdx);
                          setFormData({ ...formData, content: updated });
                        }}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg shrink-0 mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingArticle(null);
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
                  <span>ذخیره مقاله</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
