// UI Sync triggered
export type PageSection = 'home' | 'projects' | 'products' | 'services' | 'knowledge' | 'about' | 'contact' | 'magazine-article' | 'rnd';

export type ProductCategory = 
  | 'heating'
  | 'ventilation'
  | 'drinking'
  | 'cooling'
  | 'inlet'
  | 'feeding'
  | 'cage'
  | 'silo'
  | 'other';

export interface CategoryItem {
  id: ProductCategory | string;
  title: string;
  titleEn?: string;
  description: string;
  icon: string;
  iconName?: string;
  productCount?: number;
  badge?: string;
  image?: string;
}

export type CategoryInfo = CategoryItem;

export interface ProjectCaseStudy {
  problem: string;
  clientNeed: string;
  solution: string;
  processSteps: { title: string; desc: string }[];
  equipmentList: string[];
  results: { label: string; value: string; detail: string }[];
}

export interface Project {
  id: string;
  title: string;
  type: 'broiler' | 'layer' | 'breeder' | 'feed_mill' | 'agriculture' | string;
  typeTitle: string;
  capacity: string;
  location: string;
  year: string;
  image: string;
  servicesProvided: string[];
  equipmentSummary: string[];
  keyOutcome: string;
  caseStudy?: ProjectCaseStudy;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  isFeatured?: boolean;
  id: string;
  code: string;
  name: string;
  nameEn?: string;
  category: ProductCategory;
  categoryTitle: string;
  isIndustrialMachine?: boolean;
  shortDescription: string;
  fullDescription: string;
  image: string;
  gallery?: string[];
  advantages: string[];
  applications: string[];
  specs: ProductSpec[];
  models?: string[];
  catalogPdfName?: string;
  relatedProjectIds?: string[];
  relatedArticleIds?: string[];
  faqs?: { q: string; a: string }[];
}

export interface ServiceWorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  deliverable: string;
}

export interface Service {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  problemSolved: string;
  whatWeProvide: string[];
  workflow: ServiceWorkflowStep[];
  suitableFor: string[];
  relatedEquipmentCategories: string[];
  sampleProjectIds: string[];
  faqs: { q: string; a: string }[];
}

export interface Article {
  id: string;
  title: string;
  category: 'article' | 'technical-guide' | 'product-guide' | 'faq' | string;
  categoryLabel: string;
  readTime: string;
  date: string;
  summary: string;
  content: string[];
  image?: string;
  tags?: string[];
  relatedProductIds: string[];
  relatedServiceId?: string;
}

export interface CompanyInfo {
  nameFa?: string;
  nameEn?: string;
  tagline?: string;
  subTagline?: string;
  experienceYears?: string;
  completedProjects?: string;
  activeProvinces?: string;
  customerSatisfaction?: string;
  phone: string;
  salesPhone?: string;
  directSalesPhone?: string;
  supportPhone?: string;
  technicalSupportPhone?: string;
  email: string;
  website?: string;
  address: string;
  rdAddress?: string;
  factoryAddress: string;
  workingHours: string;
  fdaLicense?: string;
  fdaLicenseText?: string;
  socialLinks?: {
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
    linkedin?: string;
    bale?: string;
    eitaa?: string;
    rubika?: string;
    aparat?: string;
    youtube?: string;
  };
  locations?: {
    id: string;
    title: string;
    type: 'headquarter' | 'factory' | 'branch' | 'rd';
    address: string;
    mapEmbedUrl?: string;
  }[];
}

export interface HeroCms {
  title: string;
  subtitle: string;
  pillText?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  backgroundImage?: string;
}

export type HeroCmsContent = HeroCms;

export interface QuoteFormData {
  projectType: string;
  targetCategory: ProductCategory | 'multiple' | string;
  selectedEquipment: string[];
  capacity: string;
  deliveryLocation: string;
  companyName: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  additionalNotes: string;
  hasAttachment?: boolean;
}

export interface FollowUpRecord {
  id: string;
  date: string; // ISO or date string
  note: string;
  performedBy?: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority?: 'high' | 'medium' | 'low';
}

export interface QuoteRequestItem {
  id: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'contacted' | 'completed' | 'archived';
  formData: QuoteFormData;
  adminNotes?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  nextFollowUpNote?: string;
  followUpPriority?: 'high' | 'medium' | 'low';
  followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
}

export type QuoteRequest = QuoteRequestItem;

export interface ConsultationFormData {
  fullName: string;
  phoneNumber: string;
  requestType: 'project-design' | 'equipment-selection' | 'efficiency-audit' | 'after-sales' | 'technical-inquiry' | string;
  projectType: string;
  projectCapacity: string;
  location: string;
  message: string;
}

export interface ConsultationRequestItem {
  id: string;
  createdAt: string;
  status: 'new' | 'in_progress' | 'contacted' | 'completed' | 'archived';
  formData: ConsultationFormData;
  adminNotes?: string;
  nextFollowUpDate?: string;
  nextFollowUpTime?: string;
  nextFollowUpNote?: string;
  followUpPriority?: 'high' | 'medium' | 'low';
  followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
}

export type ConsultationRequest = ConsultationRequestItem;

export interface AiAdvisorConfig {
  systemPrompt: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
}

export interface AdminUser {
  username: string;
  displayName: string;
  role: 'superadmin' | 'editor';
}


export type PipelineStage = 
  | 'new_lead'
  | 'contacted'
  | 'consulting'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface CustomerContact {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  companyName?: string;
  role?: string;
  source: 'quote' | 'consultation' | 'manual' | string;
  notes?: string;
  createdAt: string;
  // Follow-up reminder fields
  nextFollowUpDate?: string; // YYYY-MM-DD
  nextFollowUpTime?: string; // HH:mm
  nextFollowUpNote?: string;
  followUpPriority?: 'high' | 'medium' | 'low';
  followUpStatus?: 'pending' | 'completed' | 'cancelled' | 'none';
  lastFollowUpDate?: string;
  followUpHistory?: FollowUpRecord[];
  tags?: string[];
  // CRM Pipeline & Project fields
  pipelineStage?: PipelineStage | string;
  dealValue?: string;
  farmCapacity?: string;
  province?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  createdAt: string;
}
