import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Building2, 
  Upload, 
  Sparkles,
  Phone,
  User,
  MapPin
} from 'lucide-react';
import { Product, ProductCategory, QuoteFormData } from '../../types';
import { CATEGORIES_DATA, PRODUCTS } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { sendNotificationToBale } from '../../utils/sendToBale';

interface QuoteModalProps {
  products?: Product[];
  initialProduct?: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  products = PRODUCTS,
  initialProduct,
  isOpen,
  onClose,
}) => {
  const { addQuoteRequest } = useData();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState<QuoteFormData>({
    projectType: 'مرغداری گوشتی',
    targetCategory: initialProduct?.category || 'feeding',
    selectedEquipment: initialProduct ? [initialProduct.name] : [],
    capacity: '',
    deliveryLocation: '',
    companyName: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    additionalNotes: '',
    hasAttachment: false,
  });

  useEffect(() => {
    if (initialProduct) {
      setFormData((prev) => ({
        ...prev,
        targetCategory: initialProduct.category,
        selectedEquipment: [initialProduct.name],
      }));
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  const projectTypes = [
    'مرغداری گوشتی',
    'مرغداری تخم‌گذار',
    'مرغ مادر و اجداد',
    'کارخانه خوراک و مکمل',
    'دامپروری و گاو شیری',
    'آبزیان و استخر پرورش',
    'سایر / در حال احداث',
  ];

  const relevantProducts = products.filter(
    (p) => formData.targetCategory === 'multiple' || p.category === formData.targetCategory
  );

  const toggleEquipment = (name: string) => {
    setFormData((prev) => {
      const exists = prev.selectedEquipment.includes(name);
      return {
        ...prev,
        selectedEquipment: exists
          ? prev.selectedEquipment.filter((item) => item !== name)
          : [...prev.selectedEquipment, name],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addQuoteRequest(formData);
    sendNotificationToBale({
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      companyName: formData.companyName,
      subject: `استعلام قیمت - ${formData.projectType}`,
      productName: formData.selectedEquipment?.join('، '),
      capacity: formData.capacity,
      location: formData.deliveryLocation,
      message: formData.additionalNotes,
      source: 'فرم استعلام قیمت'
    });
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85  flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                درخواست رسمی استعلام قیمت
              </h2>
              <span className="text-xs text-amber-400 font-medium">
                محاسبه دقیق بر اساس ظرفیت، مشخصات فنی و محل تحویل
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              درخواست استعلام قیمت شما با موفقیت ثبت گردید
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              کارشناسان واحد فروش طیوران صنعت پویا پس از بررسی فنی و محاسبه مقادیر، ظرف حداکثر ۲ ساعت کاری استعلام قیمت رسمی را از طریق واتس‌اپ و تماس با شماره <strong>{formData.phoneNumber}</strong> برای شما ارسال خواهند کرد.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="bg-[#003F86] text-white font-bold px-8 py-2.5 rounded-xl text-xs hover:bg-[#003366] transition-colors"
              >
                بازگشت به سایت
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${currentStep >= 1 ? 'bg-[#003F86] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  ۱
                </span>
                <span className={`text-xs font-bold ${currentStep === 1 ? 'text-[#003F86]' : 'text-slate-500'}`}>
                  انتخاب پروژه و تجهیزات
                </span>
              </div>
              <div className="w-8 h-0.5 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${currentStep >= 2 ? 'bg-[#003F86] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  ۲
                </span>
                <span className={`text-xs font-bold ${currentStep === 2 ? 'text-[#003F86]' : 'text-slate-500'}`}>
                  ظرفیت و محل تحویل
                </span>
              </div>
              <div className="w-8 h-0.5 bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${currentStep >= 3 ? 'bg-[#003F86] text-white' : 'bg-slate-200 text-slate-600'}`}>
                  ۳
                </span>
                <span className={`text-xs font-bold ${currentStep === 3 ? 'text-[#003F86]' : 'text-slate-500'}`}>
                  اطلاعات تماس
                </span>
              </div>
            </div>

            {/* STEP 1: Project Type & Equipment Category */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    ۱. نوع پروژه خود را انتخاب کنید:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {projectTypes.map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, projectType: type })}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-right border transition-all ${
                          formData.projectType === type
                            ? 'bg-blue-50 border-[#003F86] text-[#003F86] ring-2 ring-blue-100'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    ۲. دسته تجهیزات مورد نیاز:
                  </label>
                  <select
                    value={formData.targetCategory}
                    onChange={(e) => setFormData({ ...formData, targetCategory: e.target.value as ProductCategory })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                  >
                    {CATEGORIES_DATA.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    ۳. انتخاب تجهیزات خاص (اختیاری):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                    {relevantProducts.map((p) => {
                      const isSelected = formData.selectedEquipment.includes(p.name);
                      return (
                        <div
                          key={p.id}
                          onClick={() => toggleEquipment(p.name)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-amber-50 border-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="line-clamp-1">{p.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Capacity, Dimensions & Location */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ابعاد سالن یا ظرفیت پروژه (مثلا: ابعاد ۱۶×۱۰۰ یا ۳۰ هزار قطعه):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="مثال: ۲ سالن به متراژ ۱۲۰۰ متر یا ظرفیت ۵۰ هزار قطعه..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    محل تحویل و استان/شهر پروژه:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.deliveryLocation}
                    onChange={(e) => setFormData({ ...formData, deliveryLocation: e.target.value })}
                    placeholder="مثال: مازندران، بابل یا شهرک صنعتی..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    توضیحات تکمیلی یا مشخصات فنی خاص:
                  </label>
                  <textarea
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="نکات مربوط به نوع برق، سوخت گاز یا گازوئیل، اقلیم منطقه..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                  />
                </div>

                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-medium block">
                    امکان بارگذاری نقشه یا فایل سالن (اختیاری)
                  </span>
                  <span className="text-[10px] text-slate-400">فرمت‌های مجاز: PDF, DWG, JPG</span>
                </div>
              </div>
            )}

            {/* STEP 3: Contact Details */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      نام و نام خانوادگی: *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="نام متقاضی یا مدیر فارم..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      شماره تماس همراه (جهت ارسال واتس‌اپ): *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86] text-left font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    نام شرکت، مجتمع یا فارم (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="نام واحد پرورشی یا کشت و صنعت..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:bg-white focus:outline-none focus:border-[#003F86]"
                  />
                </div>

                <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100 text-[11px] text-[#003F86] leading-relaxed">
                  قیمت با فرمت رسمی شرکتی و شامل شرایط پرداخت، مدت تحویل و گارانتی به شماره همراه شما ارسال خواهد شد.
                </div>
              </div>
            )}

            {/* Navigation & Submit Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>مرحله قبل</span>
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="bg-[#003F86] hover:bg-[#003366] text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1 transition-colors shadow-sm"
                >
                  <span>مرحله بعد</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-7 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <span>ثبت درخواست استعلام قیمت</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
