import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Project,
  Service,
  Article,
  CategoryItem,
  CompanyInfo,
  HeroCmsContent,
  AiAdvisorConfig,
  QuoteRequestItem,
  ConsultationRequestItem,
  AdminUser,
  QuoteFormData,
  ConsultationFormData,
  CustomerContact,
  MediaItem
} from '../types';
import {
  PRODUCTS,
  PROJECTS,
  SERVICES,
  ARTICLES,
  CATEGORIES_DATA,
  COMPANY_INFO,
  DEFAULT_HERO_CMS,
  DEFAULT_AI_CONFIG,
  INITIAL_QUOTES,
  INITIAL_CONSULTATIONS,
  INITIAL_MEDIA,
  INITIAL_CUSTOMERS
} from '../data/mockData';
import { findDuplicateCustomer } from '../utils/phoneUtils';

interface DataContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  replaceAllProducts: (newProducts: Product[]) => void;

  // Projects
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Services
  services: Service[];
  addService: (service: Service) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Articles
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;

  // Categories
  categories: CategoryItem[];
  addCategory: (category: CategoryItem) => void;
  updateCategory: (id: string, category: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  setCategories: React.Dispatch<React.SetStateAction<CategoryItem[]>>;

  // Company Info & CMS
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  heroCms: HeroCmsContent;
  updateHeroCms: (cms: Partial<HeroCmsContent>) => void;
  aiConfig: AiAdvisorConfig;
  updateAiConfig: (config: Partial<AiAdvisorConfig>) => void;

  // Quotes & Inquiries
  quoteRequests: QuoteRequestItem[];
  addQuoteRequest: (formData: QuoteFormData) => string;
  updateQuoteStatus: (id: string, status: QuoteRequestItem['status']) => void;
  updateQuoteAdminNotes: (id: string, notes: string) => void;
  updateQuoteFollowUp: (id: string, followUp: {
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
    nextFollowUpNote?: string;
    followUpPriority?: 'high' | 'medium' | 'low';
    followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
  }) => void;
  deleteQuoteRequest: (id: string) => void;

  consultationRequests: ConsultationRequestItem[];
  addConsultationRequest: (formData: ConsultationFormData) => string;
  updateConsultationStatus: (id: string, status: ConsultationRequestItem['status']) => void;
  updateConsultationAdminNotes: (id: string, notes: string) => void;
  updateConsultationFollowUp: (id: string, followUp: {
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
    nextFollowUpNote?: string;
    followUpPriority?: 'high' | 'medium' | 'low';
    followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
  }) => void;
  deleteConsultationRequest: (id: string) => void;

  // Customers & Follow-up Reminders
  customers: CustomerContact[];
  addCustomer: (customer: CustomerContact) => { success: boolean; duplicate?: CustomerContact; message?: string };
  updateCustomer: (id: string, customer: Partial<CustomerContact>) => void;
  deleteCustomer: (id: string) => void;
  completeFollowUp: (customerId: string, note?: string) => void;
  rescheduleFollowUp: (customerId: string, newDate: string, newTime?: string, newNote?: string, priority?: 'high' | 'medium' | 'low') => void;
  mergeCustomers: (targetId: string, sourceIds: string[]) => void;
  importLeadToCustomer: (params: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    companyName?: string;
    role?: string;
    notes?: string;
    source: string;
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
    nextFollowUpNote?: string;
    followUpPriority?: 'high' | 'medium' | 'low';
  }) => { success: boolean; customer: CustomerContact; wasDuplicate: boolean };

  // Media Library
  mediaLibrary: MediaItem[];
  addMedia: (media: MediaItem) => void;
  deleteMedia: (id: string) => void;

  // Authentication
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, turnstileToken?: string) => Promise<{ success: boolean; mfaRequired?: boolean; error?: string }>;
  verifyMfa: (token: string) => Promise<{ success: boolean; error?: string }>;
  hasAdminPassword: boolean;
  logout: () => void;
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; error?: string };

  // System & Backup
  resetToDefaults: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonData: string) => { success: boolean; error?: string };
}

const DataContext = createContext<DataContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'toyooran_products_v5',
  PROJECTS: 'toyooran_projects_v3',
  SERVICES: 'toyooran_services_v3',
  ARTICLES: 'toyooran_articles_v3',
  CATEGORIES: 'toyooran_categories_v4',
  COMPANY_INFO: 'toyooran_company_v5',
  HERO_CMS: 'toyooran_hero_cms_v3',
  AI_CONFIG: 'toyooran_ai_config_v3',
  QUOTES: 'toyooran_quotes_v3',
  CONSULTATIONS: 'toyooran_consultations_v3',
  ADMIN_USER: 'toyooran_admin_session_v3',
  ADMIN_PASSWORD: 'toyooran_admin_password_hash_v3',
  CUSTOMERS: 'toyooran_customers_v3',
  MEDIA: 'toyooran_media_v3',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or Defaults
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  const [services, setServices] = useState<Service[]>(SERVICES);

  const [articles, setArticles] = useState<Article[]>(ARTICLES);

  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORIES_DATA as CategoryItem[]);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => { const saved = localStorage.getItem(STORAGE_KEYS.COMPANY_INFO); if (saved) { const parsed = JSON.parse(saved); if (!parsed.locations || parsed.locations.length === 0) return COMPANY_INFO as CompanyInfo; return parsed; } return COMPANY_INFO as CompanyInfo; });

  const [heroCms, setHeroCms] = useState<HeroCmsContent>(DEFAULT_HERO_CMS);

  const [aiConfig, setAiConfig] = useState<AiAdvisorConfig>(DEFAULT_AI_CONFIG);

  const [quoteRequests, setQuoteRequests] = useState<QuoteRequestItem[]>(INITIAL_QUOTES);

  const [consultationRequests, setConsultationRequests] = useState<ConsultationRequestItem[]>(INITIAL_CONSULTATIONS);

  const [customers, setCustomers] = useState<CustomerContact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
    return INITIAL_CUSTOMERS;
  });
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(INITIAL_MEDIA);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch {}
  }, [customers]);

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [hasAdminPassword] = useState(true);

  const [adminDataReady, setAdminDataReady] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const refreshCsrf = async () => { const response = await fetch('/api/auth/csrf', { credentials: 'include' }); const result = await response.json(); setCsrfToken(result.token || ''); return result.token || ''; };
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(response => response.ok ? response.json() : null)
      .then(async result => { if (result?.admin) { await refreshCsrf(); setAdminUser({ username: result.admin.username, displayName: 'مدیریت کل سیستم', role: 'superadmin' }); } })
      .catch(() => undefined);
  }, []);
  const saveAdminState = (key: string, value: unknown) => {
    if (adminUser && adminDataReady && csrfToken) void fetch(`/api/admin/state/${key}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken }, body: JSON.stringify({ value }) });
  };
  useEffect(() => {
    if (!adminUser) { setAdminDataReady(false); return; }
    const keys = ['products', 'projects', 'services', 'articles', 'categories', 'companyInfo', 'heroCms', 'aiConfig', 'quotes', 'consultations', 'customers', 'media'];
    Promise.all(keys.map(async key => [key, await fetch(`/api/admin/state/${key}`, { credentials: 'include' }).then(response => response.ok ? response.json() : { value: null })] as const))
      .then(entries => {
        const state = Object.fromEntries(entries);
        if (state.products.value) setProducts(state.products.value);
        if (state.projects.value) setProjects(state.projects.value);
        if (state.services.value) setServices(state.services.value);
        if (state.articles.value) setArticles(state.articles.value);
        if (state.categories.value) setCategories(state.categories.value);
        if (state.companyInfo.value) setCompanyInfo(state.companyInfo.value);
        if (state.heroCms.value) setHeroCms(state.heroCms.value);
        if (state.aiConfig.value) setAiConfig(state.aiConfig.value);
        if (state.quotes.value) setQuoteRequests(state.quotes.value);
        if (state.consultations.value) setConsultationRequests(state.consultations.value);
        if (state.customers.value) setCustomers(state.customers.value);
        if (state.media.value) setMediaLibrary(state.media.value);
        setAdminDataReady(true);
      }).catch(() => setAdminDataReady(true));
  }, [adminUser]);
  useEffect(() => { saveAdminState('products', products); }, [products, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('projects', projects); }, [projects, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('services', services); }, [services, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('articles', articles); }, [articles, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('categories', categories); }, [categories, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('companyInfo', companyInfo); }, [companyInfo, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('heroCms', heroCms); }, [heroCms, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('aiConfig', aiConfig); }, [aiConfig, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('quotes', quoteRequests); }, [quoteRequests, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('consultations', consultationRequests); }, [consultationRequests, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('customers', customers); }, [customers, adminUser, adminDataReady]);
  useEffect(() => { saveAdminState('media', mediaLibrary); }, [mediaLibrary, adminUser, adminDataReady]);
  // Product CRUD
  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const replaceAllProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Project CRUD
  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Service CRUD
  const addService = (service: Service) => {
    setServices(prev => [service, ...prev]);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Article CRUD
  const addArticle = (article: Article) => {
    setArticles(prev => [article, ...prev]);
  };

  const updateArticle = (id: string, updated: Partial<Article>) => {
    setArticles(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // Category CRUD
  const addCategory = (category: CategoryItem) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id: string, updated: Partial<CategoryItem>) => {
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Company info and CMS
  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setCompanyInfo(prev => ({ ...prev, ...info }));
  };

  const updateHeroCms = (cms: Partial<HeroCmsContent>) => {
    setHeroCms(prev => ({ ...prev, ...cms }));
  };

  const updateAiConfig = (config: Partial<AiAdvisorConfig>) => {
    setAiConfig(prev => ({ ...prev, ...config }));
  };

  // Quote Submissions
  const addQuoteRequest = (formData: QuoteFormData): string => {
    const id = `quote-${Date.now()}`;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fa-IR')} - ${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;
    const newRequest: QuoteRequestItem = {
      id,
      createdAt: dateStr,
      status: 'new',
      formData,
      adminNotes: ''
    };
    setQuoteRequests(prev => [newRequest, ...prev]);
    return id;
  };

  const updateQuoteStatus = (id: string, status: QuoteRequestItem['status']) => {
    setQuoteRequests(prev => prev.map(q => (q.id === id ? { ...q, status } : q)));
  };

  const updateQuoteAdminNotes = (id: string, adminNotes: string) => {
    setQuoteRequests(prev => prev.map(q => (q.id === id ? { ...q, adminNotes } : q)));
  };

  const updateQuoteFollowUp = (id: string, followUp: {
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
    nextFollowUpNote?: string;
    followUpPriority?: 'high' | 'medium' | 'low';
    followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
  }) => {
    setQuoteRequests(prev => prev.map(q => (q.id === id ? { ...q, ...followUp } : q)));
  };

  const deleteQuoteRequest = (id: string) => {
    setQuoteRequests(prev => prev.filter(q => q.id !== id));
  };

  // Consultation Submissions
  const addConsultationRequest = (formData: ConsultationFormData): string => {
    const id = `cons-${Date.now()}`;
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('fa-IR')} - ${now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;
    const newRequest: ConsultationRequestItem = {
      id,
      createdAt: dateStr,
      status: 'new',
      formData,
      adminNotes: ''
    };
    setConsultationRequests(prev => [newRequest, ...prev]);
    return id;
  };

  const updateConsultationStatus = (id: string, status: ConsultationRequestItem['status']) => {
    setConsultationRequests(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
  };

  const updateConsultationAdminNotes = (id: string, adminNotes: string) => {
    setConsultationRequests(prev => prev.map(c => (c.id === id ? { ...c, adminNotes } : c)));
  };

  const updateConsultationFollowUp = (id: string, followUp: {
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
    nextFollowUpNote?: string;
    followUpPriority?: 'high' | 'medium' | 'low';
    followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
  }) => {
    setConsultationRequests(prev => prev.map(c => (c.id === id ? { ...c, ...followUp } : c)));
  };

  const deleteConsultationRequest = (id: string) => {
    setConsultationRequests(prev => prev.filter(c => c.id !== id));
  };

  // Customer Management & Duplicate Prevention & Follow-up Reminders
  const addCustomer = (customer: CustomerContact): { success: boolean; duplicate?: CustomerContact; message?: string } => {
    const dup = findDuplicateCustomer(customers, customer.phoneNumber, customer.email);
    if (dup) {
      return {
        success: false,
        duplicate: dup,
        message: `این مخاطب قبلاً با نام «${dup.fullName}» و شماره تماس «${dup.phoneNumber}» در سیستم ثبت شده است.`
      };
    }
    setCustomers(prev => [customer, ...prev]);
    return { success: true };
  };

  const updateCustomer = (id: string, updates: Partial<CustomerContact>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const completeFollowUp = (customerId: string, note?: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const historyItem = {
        id: 'fh-' + Date.now(),
        date: new Date().toISOString(),
        note: note || c.nextFollowUpNote || 'پیگیری با موفقیت انجام شد.',
        performedBy: adminUser?.displayName || 'مدیر سیستم',
        status: 'completed' as const,
        priority: c.followUpPriority || 'medium'
      };
      return {
        ...c,
        followUpStatus: 'completed',
        lastFollowUpDate: new Date().toISOString(),
        followUpHistory: [historyItem, ...(c.followUpHistory || [])]
      };
    }));
  };

  const rescheduleFollowUp = (
    customerId: string,
    newDate: string,
    newTime?: string,
    newNote?: string,
    priority?: 'high' | 'medium' | 'low'
  ) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const historyItem = c.nextFollowUpDate ? {
        id: 'fh-' + Date.now(),
        date: new Date().toISOString(),
        note: `برنامه‌ریزی پیگیری: موعد مقرر ${newDate}${newTime ? ' ساعت ' + newTime : ''}. ${newNote || c.nextFollowUpNote || ''}`,
        performedBy: adminUser?.displayName || 'مدیر سیستم',
        status: 'pending' as const,
        priority: priority || c.followUpPriority || 'medium'
      } : undefined;

      return {
        ...c,
        nextFollowUpDate: newDate,
        nextFollowUpTime: newTime !== undefined ? newTime : c.nextFollowUpTime,
        nextFollowUpNote: newNote !== undefined ? newNote : c.nextFollowUpNote,
        followUpPriority: priority || c.followUpPriority || 'medium',
        followUpStatus: 'pending',
        followUpHistory: historyItem ? [historyItem, ...(c.followUpHistory || [])] : c.followUpHistory
      };
    }));
  };

  const mergeCustomers = (targetId: string, sourceIds: string[]) => {
    setCustomers(prev => {
      const target = prev.find(c => c.id === targetId);
      if (!target) return prev;
      const sources = prev.filter(c => sourceIds.includes(c.id));

      const combinedNotes = [
        target.notes,
        ...sources.map(s => `[ادغام از ${s.fullName}]: ${s.notes || ''}`)
      ].filter(Boolean).join('\n---\n');

      const combinedHistory = [
        ...(target.followUpHistory || []),
        ...sources.flatMap(s => s.followUpHistory || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const updatedTarget: CustomerContact = {
        ...target,
        notes: combinedNotes,
        followUpHistory: combinedHistory,
        email: target.email || sources.find(s => s.email)?.email,
        companyName: target.companyName || sources.find(s => s.companyName)?.companyName,
        role: target.role || sources.find(s => s.role)?.role,
        nextFollowUpDate: target.nextFollowUpDate || sources.find(s => s.nextFollowUpDate)?.nextFollowUpDate,
        nextFollowUpNote: target.nextFollowUpNote || sources.find(s => s.nextFollowUpNote)?.nextFollowUpNote,
      };

      return prev.filter(c => !sourceIds.includes(c.id)).map(c => (c.id === targetId ? updatedTarget : c));
    });
  };

  const importLeadToCustomer = (params: {
    fullName: string;
    phoneNumber: string;
    email?: string;
    companyName?: string;
    role?: string;
    notes?: string;
    source: string;
    nextFollowUpDate?: string;
    nextFollowUpTime?: string;
    nextFollowUpNote?: string;
    followUpPriority?: 'high' | 'medium' | 'low';
  }): { success: boolean; customer: CustomerContact; wasDuplicate: boolean } => {
    const existing = findDuplicateCustomer(customers, params.phoneNumber, params.email);
    if (existing) {
      const updatedNotes = existing.notes
        ? `${existing.notes}\n---\n[استعلام جدید از ${params.source}]: ${params.notes || ''}`
        : (params.notes || '');

      const updatedCustomer: CustomerContact = {
        ...existing,
        notes: updatedNotes,
        companyName: existing.companyName || params.companyName,
        email: existing.email || params.email,
        role: existing.role || params.role,
        nextFollowUpDate: params.nextFollowUpDate || existing.nextFollowUpDate,
        nextFollowUpTime: params.nextFollowUpTime || existing.nextFollowUpTime,
        nextFollowUpNote: params.nextFollowUpNote || existing.nextFollowUpNote,
        followUpStatus: params.nextFollowUpDate ? 'pending' : existing.followUpStatus,
        followUpPriority: params.followUpPriority || existing.followUpPriority || 'medium'
      };

      updateCustomer(existing.id, updatedCustomer);
      return { success: true, customer: updatedCustomer, wasDuplicate: true };
    }

    const newCust: CustomerContact = {
      id: 'cust-' + Date.now(),
      fullName: params.fullName,
      phoneNumber: params.phoneNumber,
      email: params.email,
      companyName: params.companyName || '',
      role: params.role || '',
      source: params.source,
      notes: params.notes || '',
      createdAt: new Date().toISOString(),
      nextFollowUpDate: params.nextFollowUpDate,
      nextFollowUpTime: params.nextFollowUpTime,
      nextFollowUpNote: params.nextFollowUpNote,
      followUpStatus: params.nextFollowUpDate ? 'pending' : 'none',
      followUpPriority: params.followUpPriority || 'medium',
      followUpHistory: []
    };

    setCustomers(prev => [newCust, ...prev]);
    return { success: true, customer: newCust, wasDuplicate: false };
  };

  const addMedia = (media: MediaItem) => setMediaLibrary(prev => [media, ...prev]);
  const deleteMedia = (id: string) => setMediaLibrary(prev => prev.filter(m => m.id !== id));

  // Authentication is performed by the backend; no password or session token is stored in the browser.
  const login = async (username: string, password: string, turnstileToken?: string) => {
    const response = await fetch('/api/auth/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password, turnstileToken }) });
    const result = await response.json();
    if (response.ok) {
      if (result.mfaRequired) return { success: false, mfaRequired: true };
      await refreshCsrf();
      setAdminUser({ username, displayName: username === 'admin' ? 'مدیریت کل سیستم' : 'مدیر مهندسی و فروش', role: 'superadmin' });
      return { success: true };
    }
    return { success: false, error: result.error || 'ورود ناموفق بود.' };
  };

  const verifyMfa = async (token: string) => {
    const tokenValue = csrfToken || await refreshCsrf();
    const response = await fetch('/api/auth/mfa/verify', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': tokenValue }, body: JSON.stringify({ token }) });
    const result = await response.json();
    if (response.ok) { setAdminUser({ username: 'admin', displayName: 'مدیریت کل سیستم', role: 'superadmin' }); return { success: true }; }
    return { success: false, error: result.error || 'کد MFA نامعتبر است.' };
  };

  const logout = () => { void fetch('/api/auth/logout', { method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': csrfToken } }); setAdminUser(null); };

  const changePassword = async (_oldPassword: string, _newPassword: string) => {
    return { success: false, error: 'تغییر رمز فقط از طریق endpoint امن backend انجام می‌شود.' };
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setProducts(PRODUCTS);
    setProjects(PROJECTS);
    setServices(SERVICES);
    setArticles(ARTICLES);
    setCategories(CATEGORIES_DATA as CategoryItem[]);
    setCompanyInfo(COMPANY_INFO as CompanyInfo);
    setHeroCms(DEFAULT_HERO_CMS);
    setAiConfig(DEFAULT_AI_CONFIG);
    setQuoteRequests(INITIAL_QUOTES);
    setConsultationRequests(INITIAL_CONSULTATIONS);
  };

  // Backup Export/Import
  const exportBackupJson = () => {
    const backupData = {
      version: '3.1.0',
      exportedAt: new Date().toISOString(),
      products,
      projects,
      services,
      articles,
      categories,
      companyInfo,
      heroCms,
      aiConfig,
      quoteRequests,
      consultationRequests,
      customers,
    };
    return JSON.stringify(backupData, null, 2);
  };

  const importBackupJson = (jsonData: string) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.projects) setProjects(parsed.projects);
      if (parsed.services) setServices(parsed.services);
      if (parsed.articles) setArticles(parsed.articles);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo);
      if (parsed.heroCms) setHeroCms(parsed.heroCms);
      if (parsed.aiConfig) setAiConfig(parsed.aiConfig);
      if (parsed.quoteRequests) setQuoteRequests(parsed.quoteRequests);
      if (parsed.consultationRequests) setConsultationRequests(parsed.consultationRequests);
      if (parsed.customers) setCustomers(parsed.customers);
      return { success: true };
    } catch {
      return { success: false, error: 'فایل بکاپ نامعتبر یا دارای فرمت نادرست است.' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        replaceAllProducts,
        projects,
        addProject,
        updateProject,
        deleteProject,
        services,
        addService,
        updateService,
        deleteService,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        setCategories,
        companyInfo,
        updateCompanyInfo,
        heroCms,
        updateHeroCms,
        aiConfig,
        updateAiConfig,
        quoteRequests,
        addQuoteRequest,
        updateQuoteStatus,
        updateQuoteAdminNotes,
        updateQuoteFollowUp,
        deleteQuoteRequest,
        consultationRequests,
        addConsultationRequest,
        updateConsultationStatus,
        updateConsultationAdminNotes,
        updateConsultationFollowUp,
        deleteConsultationRequest,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        completeFollowUp,
        rescheduleFollowUp,
        mergeCustomers,
        importLeadToCustomer,
        mediaLibrary,
        addMedia,
        deleteMedia,
        adminUser,
        isAuthenticated: !!adminUser,
        login,
        verifyMfa,
        hasAdminPassword,
        logout,
        changePassword,
        resetToDefaults,
        exportBackupJson,
        importBackupJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
