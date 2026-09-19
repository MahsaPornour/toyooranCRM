import React, { useState } from 'react';
import { 
  Bot, 
  Save, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Cpu,
  MessageSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AiAdvisorConfig } from '../../types';

export const AiConfigTab: React.FC = () => {
  const { aiConfig, updateAiConfig } = useData();
  const [formData, setFormData] = useState<AiAdvisorConfig>({ ...aiConfig });
  const [newSuggestion, setNewSuggestion] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAiConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addSuggestion = () => {
    if (newSuggestion.trim()) {
      setFormData({
        ...formData,
        suggestedQuestions: [...formData.suggestedQuestions, newSuggestion.trim()]
      });
      setNewSuggestion('');
    }
  };

  const removeSuggestion = (idx: number) => {
    setFormData({
      ...formData,
      suggestedQuestions: formData.suggestedQuestions.filter((_, i) => i !== idx)
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
        <div>
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            <span>تنظیمات دستیار هوش مصنوعی و مشاور فنی مهندسی</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            شخصی‌سازی پرامپت مهندسی، سوالات پرتکرار و پیام خوش‌آمدگویی هوش مصنوعی
          </p>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-amber-400 to-[#FF9F14] hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>ذخیره تنظیمات هوش مصنوعی</span>
        </button>
      </div>

      {saved && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-3xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>پیکربندی هوش مصنوعی با موفقیت بروزرسانی شد.</span>
        </div>
      )}

      {/* System Prompt */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Cpu className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">دستورالعمل سیستمی و پرامپت تخصصی (System Prompt)</h3>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            شخصیت مهندسی هوش مصنوعی و قوانین پاسخ‌دهی به مشتریان
          </label>
          <textarea
            value={formData.systemPrompt}
            onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
            rows={5}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:border-amber-400 leading-relaxed font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">پیام خوش‌آمدگویی اولیه دستیار</label>
          <input
            type="text"
            value={formData.welcomeMessage}
            onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
          />
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">پیشنهادات سوال سریع برای کاربران</h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSuggestion}
            onChange={(e) => setNewSuggestion(e.target.value)}
            placeholder="افزودن پیشنهاد جدید، مثلا: تفاوت بشقاب پروانه‌ای و معمولی چیست؟"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400"
          />
          <button
            type="button"
            onClick={addSuggestion}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>افزودن</span>
          </button>
        </div>

        <div className="space-y-2">
          {formData.suggestedQuestions.map((q, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
              <span>{q}</span>
              <button
                type="button"
                onClick={() => removeSuggestion(idx)}
                className="p-1 text-rose-400 hover:bg-rose-950/40 rounded-lg"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </form>
  );
};
