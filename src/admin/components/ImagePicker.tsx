import React, { useState } from 'react';
import { Image as ImageIcon, Link2, UploadCloud, CheckCircle2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ label, value, onChange }) => {
  const { mediaLibrary } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'library' | 'upload' | 'url'>('library');
  const [tempUrl, setTempUrl] = useState('');

  const handleSelectMedia = (url: string) => {
    onChange(url);
    setIsOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl) {
      onChange(tempUrl);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-400 mb-1">{label}</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-xs text-slate-300 font-mono focus:border-amber-400"
            dir="ltr"
            placeholder="https://..."
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setTempUrl(value || '');
            setIsOpen(true);
          }}
          className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>گالری تصاویر</span>
        </button>
      </div>

      {value && (
        <div className="mt-2 aspect-video w-full max-w-[200px] rounded-lg overflow-hidden border border-slate-700 relative group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/95 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500/90 hover:bg-red-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold"
            >
              حذف
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80  overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl my-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                انتخاب تصویر
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-slate-800">
              <button
                type="button"
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${mode === 'library' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                onClick={() => setMode('library')}
              >
                کتابخانه رسانه
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${mode === 'upload' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                onClick={() => setMode('upload')}
              >
                آپلود از سیستم
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition-colors ${mode === 'url' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
                onClick={() => setMode('url')}
              >
                لینک تصویر (URL)
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {mode === 'library' && (
                <div>
                  {mediaLibrary.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      کتابخانه رسانه خالی است. ابتدا در بخش رسانه‌ها تصاویری اضافه کنید.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {mediaLibrary.map(media => (
                        <div 
                          key={media.id}
                          onClick={() => handleSelectMedia(media.url)}
                          className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-800 hover:border-amber-400 cursor-pointer group transition-colors"
                        >
                          <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-amber-400 text-slate-950 px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg">انتخاب</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {mode === 'upload' && (
                <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950/50 hover:bg-slate-900/50 hover:border-amber-400/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-10 h-10 text-slate-500 mb-3" />
                  <p className="text-sm font-bold text-slate-300">برای انتخاب فایل از سیستم کلیک کنید</p>
                  <p className="text-[11px] text-slate-500 mt-2">تصویر به طور خودکار اضافه می‌شود</p>
                </div>
              )}

              {mode === 'url' && (
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">لینک مستقیم تصویر</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                          type="text"
                          required
                          value={tempUrl}
                          onChange={(e) => setTempUrl(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-xs text-white font-mono focus:border-amber-400"
                          dir="ltr"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCustomUrlSubmit}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0"
                      >
                        تایید و انتخاب
                      </button>
                    </div>
                  </div>
                  {tempUrl && (
                    <div className="mt-4">
                      <p className="text-[10px] text-slate-500 mb-2">پیش‌نمایش:</p>
                      <img src={tempUrl} alt="Preview" className="h-40 rounded-xl border border-slate-700 object-cover" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
