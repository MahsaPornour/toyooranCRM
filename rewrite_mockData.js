import fs from 'fs';

const mockDataContent = `import { 
  Article, 
  Product, 
  CompanyInfo, 
  Project, 
  CategoryInfo, 
  Service,
  HeroCmsContent,
  AiAdvisorConfig,
  QuoteRequest,
  ConsultationRequest,
  MediaItem
} from '../types';

export const CATEGORIES_DATA: CategoryInfo[] = [
  { id: 'heating', title: 'سیستم‌های گرمایشی', description: 'انواع هیترها و سیستم‌های گرمایشی صنعتی', icon: 'Flame' },
  { id: 'ventilation', title: 'تهویه و هواکش', description: 'هواکش‌های صنعتی و سیستم‌های سیرکوله', icon: 'Fan' },
  { id: 'drinking', title: 'آبخوری', description: 'سیستم‌های آبخوری نیپل و اتوماتیک', icon: 'Droplets' },
  { id: 'cooling', title: 'سرمایشی', description: 'پدهای سلولزی و سیستم‌های خنک‌کننده', icon: 'Wind' },
  { id: 'feeding', title: 'دانخوری', description: 'دانخوری‌های بشقابی و زنجیری', icon: 'Wheat' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    code: 'TS-001',
    name: 'هیتر کابینتی 250 هزار',
    category: 'heating',
    categoryTitle: 'گرمایشی',
    isIndustrialMachine: true,
    shortDescription: 'هیتر کابینتی با راندمان بالا و مشعل ایران رادیاتور',
    fullDescription: 'این هیتر با استفاده از جدیدترین تکنولوژی‌های احتراق دارای راندمان بالای 90 درصد بوده و برای سالن‌های مرغداری و گلخانه‌ها ایده‌آل است. بدنه دوجداره عایق و کوره‌های استیل از ویژگی‌های بارز این محصول است.',
    image: '/images/products/TS-001.webp',
    advantages: ['راندمان احتراق بالا', 'بدنه عایق دوجداره', 'ترموستات محیطی', 'طول عمر بالای کوره'],
    applications: ['سالن‌های پرورش طیور', 'گلخانه‌های صنعتی', 'سالن‌های قارچ'],
    specs: [{ label: 'ظرفیت حرارتی', value: '250,000 کیلوکالری' }, { label: 'نوع سوخت', value: 'گاز/گازوئیل' }, { label: 'جنس کوره', value: 'استیل نگیر 304' }]
  },
  {
    id: 'p2',
    code: 'TS-002',
    name: 'هواکش صنعتی 140x140',
    category: 'ventilation',
    categoryTitle: 'تهویه',
    shortDescription: 'هواکش 140 سانتی‌متری با موتور دمنده قدرتمند و پره‌های استیل',
    fullDescription: 'هواکش‌های سایز بزرگ با قدرت تخلیه هوای بسیار بالا برای ایجاد فشار منفی و تهویه تونلی در سالن‌های صنعتی و مرغداری. دارای دمپر اتوماتیک با سیستم گریز از مرکز.',
    image: '/images/products/TS-002.webp',
    advantages: ['موتور پرقدرت', 'پره‌های استیل ضدزنگ', 'دمپر اتوماتیک', 'صدا و لرزش کم'],
    applications: ['مرغداری‌های گوشتی و تخم‌گذار', 'سالن‌های صنعتی بزرگ'],
    specs: [{ label: 'ابعاد', value: '140x140 سانتی‌متر' }, { label: 'قدرت موتور', value: '1.5 اسب بخار' }, { label: 'ظرفیت هوادهی', value: '44000 مترمکعب در ساعت' }]
  },
  {
    id: 'p3',
    code: 'TS-003',
    name: 'سیستم آبخوری نیپل',
    category: 'drinking',
    categoryTitle: 'آبخوری',
    shortDescription: 'سیستم کامل آبخوری نیپل شامل لوله، نیپل استیل و فشارشکن',
    fullDescription: 'آبخوری‌های نیپل با کیفیت بالای استیل، بدون چکه و با قابلیت تنظیم فشار آب. تضمین بهداشت آب مصرفی طیور و جلوگیری از خیس شدن بستر.',
    image: '/images/products/TS-003.webp',
    advantages: ['جلوگیری از خیس شدن بستر', 'توزیع یکنواخت آب', 'شستشوی آسان', 'نیپل‌های استیل 360 درجه'],
    applications: ['پرورش مرغ گوشتی', 'پرورش بوقلمون (با نیپل مخصوص)'],
    specs: [{ label: 'جنس نیپل', value: 'استیل ضد زنگ' }, { label: 'ظرفیت هر نیپل', value: '12 الی 15 قطعه مرغ' }]
  },
  {
    id: 'p4',
    code: 'TS-004',
    name: 'پد سلولزی ضخامت 10',
    category: 'cooling',
    categoryTitle: 'سرمایشی',
    shortDescription: 'پد سلولزی با قدرت جذب آب بالا و راندمان خنک‌کنندگی عالی',
    fullDescription: 'پدهای سلولزی با استفاده از کاغذ کرافت فنلاندی، مقاومت بالایی در برابر رسوب‌گذاری دارند و با ایجاد سطح تماس گسترده بین آب و هوا، بالاترین راندمان سرمایش تبخیری را ایجاد می‌کنند.',
    image: '/images/products/TS-004.webp',
    advantages: ['راندمان تبخیر بالا', 'کاغذ کرافت باکیفیت', 'عمر مفید طولانی', 'شستشوی راحت'],
    applications: ['سیستم پد و فن مرغداری', 'گلخانه‌ها'],
    specs: [{ label: 'ضخامت', value: '10 سانتی‌متر' }, { label: 'ارتفاع', value: '1.5 / 2 متر' }, { label: 'عرض', value: '60 سانتی‌متر' }]
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: 'اصول تهویه تونلی در مرغداری‌های مدرن',
    category: 'technical-guide',
    categoryLabel: 'مقاله آموزشی',
    readTime: '۸ دقیقه مطالعه',
    date: '۱۴۰۲/۱۲/۱۵',
    summary: 'تهویه تونلی یکی از موثرترین روش‌ها برای کنترل دمای سالن در فصول گرم است. در این مقاله به بررسی اصول طراحی و اجرای آن می‌پردازیم.',
    content: ['تهویه تونلی با ایجاد جریان هوای سریع با سرعت بیش از ۲.۵ متر بر ثانیه باعث ایجاد اثر بادبزنی (Wind Chill) روی پرندگان می‌شود...'],
    image: '/images/article_ventilation_1787987977267.jpg',
    relatedProductIds: ['p2', 'p4']
  },
  {
    id: 'a2',
    title: 'نکات کلیدی در مدیریت گرمایش زمستانه',
    category: 'technical-guide',
    categoryLabel: 'مقاله آموزشی',
    readTime: '۵ دقیقه مطالعه',
    date: '۱۴۰۲/۱۰/۲۰',
    summary: 'چگونه بدون اتلاف انرژی، گرمای یکنواخت و مناسبی را در سالن تامین کنیم؟',
    content: ['استفاده از هیترهای با راندمان بالا و تنظیم صحیح ترموستات‌ها نقش حیاتی در کاهش مصرف سوخت دارد...'],
    image: '/images/article_heating_1787988003088.jpg',
    relatedProductIds: ['p1']
  },
  {
    id: 'a3',
    title: 'اهمیت بهداشت آب در پرورش طیور',
    category: 'technical-guide',
    categoryLabel: 'مقاله آموزشی',
    readTime: '۶ دقیقه مطالعه',
    date: '۱۴۰۲/۰۹/۰۵',
    summary: 'کیفیت آب مصرفی تاثیر مستقیمی بر ضریب تبدیل و سلامت گله دارد.',
    content: ['سیستم‌های آبخوری نیپل به دلیل بسته بودن مسیر آب، مانع از آلودگی‌های ثانویه می‌شوند...'],
    image: '/images/article_design_1787987990156.jpg',
    relatedProductIds: ['p3']
  }
];

export const COMPANY_INFO: CompanyInfo = {
  nameFa: 'شرکت تجهیزات طیوران',
  phone: '021-12345678',
  email: 'info@toyooran.com',
  address: 'تهران، خیابان آزادی',
  factoryAddress: 'شهرک صنعتی شمس‌آباد',
  workingHours: '۸ الی ۱۷'
};
export const PROJECTS: Project[] = [];
export const SERVICES: Service[] = [];

export const DEFAULT_HERO_CMS: HeroCmsContent = {
  title: 'تجهیزات مدرن مرغداری',
  subtitle: 'با بیش از دو دهه تجربه در طراحی و تولید تجهیزات',
};
export const DEFAULT_AI_CONFIG: AiAdvisorConfig = { systemPrompt: '', welcomeMessage: '', suggestedQuestions: [] };
export const INITIAL_QUOTES: QuoteRequest[] = [];
export const INITIAL_CONSULTATIONS: ConsultationRequest[] = [];
export const INITIAL_MEDIA: MediaItem[] = [];
`;

fs.writeFileSync('src/data/mockData.ts', mockDataContent);
