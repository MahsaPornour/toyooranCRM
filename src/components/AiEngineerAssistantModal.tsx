import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Cpu, 
  Wind, 
  Calculator, 
  Layers, 
  CheckCircle2, 
  RotateCcw,
  Loader2,
  FileText,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

interface AiEngineerAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote?: () => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  source?: string;
}

export const AiEngineerAssistantModal: React.FC<AiEngineerAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenQuote,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'سلام و احترام! من **مهندس هوشمند طیوران** هستم. در زمینه محاسبات تهویه سالن (CFM)، فرمولاسیون خوراک و ضریب تبدیل (FCR)، مشخصات فنی ماشین‌آلات پرس پلت و استانداردهای ساخت سوله آماده پاسخگویی تخصصی به شما می‌باشم.\n\nچگونه می‌توانم در پروژه شما کمکتان کنم؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'cfm-calc' | 'fcr-calc'>('chat');

  // CFM Calculator state
  const [shedLength, setShedLength] = useState<number>(80);
  const [shedWidth, setShedWidth] = useState<number>(12);
  const [shedHeight, setShedHeight] = useState<number>(3);
  const [targetAirSpeed, setTargetAirSpeed] = useState<number>(2.5);

  // FCR Calculator state
  const [feedConsumedKg, setFeedConsumedKg] = useState<number>(3800);
  const [liveWeightKg, setLiveWeightKg] = useState<number>(2200);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        sender: 'ai',
        text: data.reply || 'پاسخی از سرور هوش مصنوعی دریافت نشد.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        source: data.source,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        sender: 'ai',
        text: 'متأسفانه در برقراری ارتباط با سرور هوش مصنوعی خطایی رخ داد. لطفاً دوباره امتحان کنید.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // CFM Math
  const crossSectionArea = shedWidth * shedHeight;
  const cfmPerHour = crossSectionArea * targetAirSpeed * 3600;
  const fanCount140 = Math.ceil(cfmPerHour / 44500);
  const padAreaRequired = Math.ceil(cfmPerHour / (1.5 * 3600));

  // FCR Math
  const calculatedFcr = liveWeightKg > 0 ? (feedConsumedKg / liveWeightKg).toFixed(2) : '0';

  const quickPrompts = [
    'محاسبه تعداد هواکش ۱۴۰ برای سالن مرغداری گوشتی',
    'مشخصات فنی پرس پلت ۱۰ تن در ساعت گیربکسی',
    'استاندارد ابعاد و عایق ساندویچ پانل سوله مرغداری',
    'فرمول بهینه‌سازی ضریب تبدیل دان به گوشت',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60  animate-in fade-in duration-200">
      
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl h-[90vh] max-h-[750px] shadow-2xl flex flex-col overflow-hidden relative font-['Estedad',sans-serif]">
        
        {/* Modal Header */}
        <div className="bg-[#003F86] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  مشاور و مهندس هوشمند طیوران
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Gemini 3.7 AI
                </span>
              </div>
              <p className="text-xs text-blue-100 font-light">
                پاسخگویی به مسائل مهندسی سالن، ماشین‌آلات، جیره و تاسیسات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-[#003F86] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            گفتگوی آزاد با مهندس هوش مصنوعی
          </button>

          <button
            onClick={() => setActiveTab('cfm-calc')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cfm-calc'
                ? 'bg-[#003F86] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Wind className="w-4 h-4 text-amber-500" />
            محاسبه‌گر آنلاین تهویه سالن (CFM)
          </button>

          <button
            onClick={() => setActiveTab('fcr-calc')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fcr-calc'
                ? 'bg-[#003F86] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-500" />
            محاسبه‌گر ضریب تبدیل دان (FCR)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden flex flex-col bg-[#F8FAFC]">
          
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#003F86] text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                        <span className="font-bold">
                          {msg.sender === 'user' ? 'شما' : 'مهندس هوشمند طیوران'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div className="whitespace-pre-wrap font-normal">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-3xl rounded-bl-none p-4 shadow-sm flex items-center gap-3 text-sm text-slate-600">
                      <Loader2 className="w-5 h-5 animate-spin text-[#003F86]" />
                      <span>در حال تجزیه و تحلیل مهندسی و محاسبات تخصصی...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestions pills */}
              <div className="bg-white border-t border-slate-100 px-4 py-2 overflow-x-auto flex items-center gap-2">
                <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap">پرسش‌های متداول:</span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-xs bg-slate-100 hover:bg-amber-100 hover:text-slate-900 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 whitespace-nowrap transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="bg-white p-3 sm:p-4 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="سؤال فنی، ابعاد سالن، ظرفیت کارخانه یا نیاز خود را مطرح نمایید..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#003F86] text-slate-900"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm"
                >
                  <span>ارسال</span>
                  <Send className="w-4 h-4 transform rotate-180" />
                </button>
              </div>

            </div>
          )}

          {activeTab === 'cfm-calc' && (
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Wind className="w-6 h-6 text-[#003F86]" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">محاسبه تهویه تونلی تابستانه سالن مرغداری</h3>
                    <p className="text-xs text-slate-500">مبنای محاسبات بر اساس استاندارد جهانی سرعت جریان هوا ۲.۵ متر بر ثانیه</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">طول سالن (متر)</label>
                    <input
                      type="number"
                      value={shedLength}
                      onChange={(e) => setShedLength(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عرض سالن (متر)</label>
                    <input
                      type="number"
                      value={shedWidth}
                      onChange={(e) => setShedWidth(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ارتفاع متوسط (متر)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={shedHeight}
                      onChange={(e) => setShedHeight(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">سرعت هوای هدف (m/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={targetAirSpeed}
                      onChange={(e) => setTargetAirSpeed(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Calculation Outputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                    <span className="text-xs text-blue-800 font-semibold block mb-1">حجم هوای مورد نیاز</span>
                    <span className="text-xl font-black text-[#003F86] font-mono">{cfmPerHour.toLocaleString()}</span>
                    <span className="text-[11px] text-blue-600 block mt-0.5">متر مکعب بر ساعت (m³/h)</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <span className="text-xs text-amber-900 font-semibold block mb-1">تعداد هواکش ۱۴۰ طیوران</span>
                    <span className="text-2xl font-black text-amber-600 font-mono">{fanCount140} عدد</span>
                    <span className="text-[11px] text-amber-800 block mt-0.5">مدل گریز از مرکز دبی ۴۴,۵۰۰ m³/h</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                    <span className="text-xs text-emerald-800 font-semibold block mb-1">مساحت پد سلولزی مورد نیاز</span>
                    <span className="text-2xl font-black text-emerald-600 font-mono">{padAreaRequired} متر مربع</span>
                    <span className="text-[11px] text-emerald-700 block mt-0.5">ضخامت ۱۵ سانتی‌متر رزین‌دار</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      handleSendMessage(`لطفاً نقشه دقیق تهویه و لیست تجهیزات برای یک سالن به ابعاد ${shedLength}×${shedWidth} با ارتفاع ${shedHeight} را به من توضیح دهید.`);
                      setActiveTab('chat');
                    }}
                    className="bg-[#003F86] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-blue-900 transition-colors"
                  >
                    <span>تحلیل جامع با هوش مصنوعی</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </button>

                  {onOpenQuote && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenQuote();
                      }}
                      className="bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:bg-amber-300 transition-colors"
                    >
                      <span>استعلام قیمت این تجهیزات</span>
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fcr-calc' && (
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="w-6 h-6 text-[#003F86]" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">محاسبه ضریب تبدیل غذایی (FCR - Feed Conversion Ratio)</h3>
                    <p className="text-xs text-slate-500">شاخص سنجش کیفیت خوراک، سلامت گله و دقت سیستم دانخوری و آبخوری</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">کل دان مصرفی دوره (کیلوگرم)</label>
                    <input
                      type="number"
                      value={feedConsumedKg}
                      onChange={(e) => setFeedConsumedKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">کل وزن زنده تولیدی گله (کیلوگرم)</label>
                    <input
                      type="number"
                      value={liveWeightKg}
                      onChange={(e) => setLiveWeightKg(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xs text-amber-400 font-bold block mb-1">ضریب تبدیل محاسبه‌شده دوره شما:</span>
                    <span className="text-4xl font-black text-white font-mono tracking-tight">{calculatedFcr}</span>
                    <p className="text-xs text-slate-300 mt-2">
                      {Number(calculatedFcr) <= 1.65 
                        ? '🔥 عالی! گله شما در وضعیت بازدهی بسیار عالی و اقتصادی قرار دارد.'
                        : Number(calculatedFcr) <= 1.85
                        ? '⚡ نرمال. با اصلاح فرمول خوراک و کالیبراسیون دانخوری امکان کاهش ۰.۱ واحد FCR وجود دارد.'
                        : '⚠️ نیاز به بررسی دارد! هدررفت دان یا عدم تعادل ویتامینه و پروتئینی مشاهده می‌شود.'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      handleSendMessage(`ضریب تبدیل دوره ما ${calculatedFcr} شده است. چه راهکارهایی برای کاهش FCR و بهبود بازدهی مصرف دان پیشنهاد می‌دهید؟`);
                      setActiveTab('chat');
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap transition-colors"
                  >
                    <span>دریافت پروتکل کاهش FCR با AI</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
