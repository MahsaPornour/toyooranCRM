import React, { useState } from 'react';
import { Image as ImageIcon, Copy, Check, Plus, ExternalLink, Trash2, X, Link2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const MediaTab: React.FC = () => {
  const { mediaLibrary, addMedia, deleteMedia } = useData();
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl && newTitle) {
      addMedia({
        id: 'img-' + Date.now(),
        url: newUrl,
        title: newTitle,
        createdAt: new Date().toISOString()
      });
      setNewUrl('');
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>کتابخانه تصاویر و رسانه‌ها (Media Library)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت متمرکز تمامی تصاویر. این تصاویر در سراسر سایت قابل انتخاب خواهند بود.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن تصویر جدید</span>
        </button>
      </div>

      {/* Grid of Images */}
      {mediaLibrary.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
          <ImageIcon className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-300 mb-1">کتابخانه خالی است</h3>
          <p className="text-xs text-slate-500">برای شروع، روی دکمه افزودن کلیک کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mediaLibrary.map((asset) => (
            <div key={asset.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between group">
              <div className="relative h-44">
                <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 gap-2">
                  <button
                    onClick={() => handleCopy(asset.url)}
                    className="bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transform scale-95 group-hover:scale-100 transition-transform w-full justify-center"
                  >
                    {copiedUrl === asset.url ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl === asset.url ? 'کپی شد!' : 'کپی آدرس تصویر'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('آیا از حذف این تصویر اطمینان دارید؟')) {
                        deleteMedia(asset.id);
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transform scale-95 group-hover:scale-100 transition-transform w-full justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف تصویر</span>
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-xs font-bold text-white line-clamp-1">{asset.title}</h3>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-500">{new Date(asset.createdAt).toLocaleDateString('fa-IR')}</span>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>لینک اصلی</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80  overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                افزودن تصویر جدید
              </h3>
              <button 
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMedia} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">عنوان تصویر *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:border-amber-400"
                  placeholder="مثال: عکس ماشین‌آلات صنعتی"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">آدرس اینترنتی تصویر (URL) *</label>
                <div className="relative">
                  <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input
                    type="url"
                    required
                    dir="ltr"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-2.5 text-xs text-white font-mono focus:border-amber-400"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {newUrl && (
                <div className="mt-4">
                  <p className="text-[10px] text-slate-500 mb-2">پیش‌نمایش تصویر:</p>
                  <img src={newUrl} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-700" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1e293b/475569?text=Invalid+Image+URL';
                  }} />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors"
                >
                  افزودن به کتابخانه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
