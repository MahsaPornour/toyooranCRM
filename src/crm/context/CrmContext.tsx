import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { 
  CustomerContact, 
  FollowUpRecord, 
  PipelineStage, 
  QuoteRequestItem, 
  ConsultationRequestItem,
  CrmSubTab,
  PriorityFilter,
  CrmStats,
  DuplicateGroup
} from '../types/crm.types';
import { detectAllDuplicateGroups, normalizePhoneNumber } from '../utils/crmPhoneUtils';
import { getFollowUpUrgency, formatToShamsiDateTime } from '../utils/crmDateUtils';

interface CrmContextType {
  // State
  customers: CustomerContact[];
  quoteRequests: QuoteRequestItem[];
  consultationRequests: ConsultationRequestItem[];
  activeTab: CrmSubTab;
  setActiveTab: (tab: CrmSubTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  stageFilter: string;
  setStageFilter: (stage: string) => void;
  priorityFilter: PriorityFilter;
  setPriorityFilter: (p: PriorityFilter) => void;
  provinceFilter: string;
  setProvinceFilter: (prov: string) => void;
  
  // Selected Customer Modal
  selectedCustomer: CustomerContact | null;
  setSelectedCustomer: (customer: CustomerContact | null) => void;
  isCustomerModalOpen: boolean;
  setIsCustomerModalOpen: (open: boolean) => void;
  openNewCustomerModal: (prefillStage?: PipelineStage) => void;
  openEditCustomerModal: (customer: CustomerContact) => void;
  closeCustomerModal: () => void;

  // Actions
  addCustomer: (customer: Omit<CustomerContact, 'id' | 'createdAt'>) => Promise<CustomerContact>;
  updateCustomer: (id: string, updates: Partial<CustomerContact>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  addFollowUpLog: (customerId: string, record: Omit<FollowUpRecord, 'id'>, customNotes?: string) => Promise<void>;
  updatePipelineStage: (customerId: string, stage: PipelineStage) => Promise<void>;
  convertInboundToCustomer: (
    inbound: QuoteRequestItem | ConsultationRequestItem, 
    type: 'quote' | 'consultation'
  ) => Promise<CustomerContact>;
  mergeDuplicates: (targetId: string, sourceIds: string[]) => Promise<void>;

  // Calculated Stats
  stats: CrmStats;
  duplicateGroups: DuplicateGroup[];
  filteredCustomers: CustomerContact[];
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    customers = [],
    addCustomer: baseAddCustomer,
    updateCustomer: baseUpdateCustomer,
    deleteCustomer: baseDeleteCustomer,
    addCustomerFollowUp: baseAddCustomerFollowUp,
    quoteRequests = [],
    consultationRequests = [],
    addNotification
  } = useData();

  // Internal Navigation & Filter State
  const [activeTab, setActiveTab] = useState<CrmSubTab>('pipeline');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');

  // Customer Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerContact | null>(null);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);

  const openNewCustomerModal = useCallback((prefillStage: PipelineStage = 'new_lead') => {
    setSelectedCustomer({
      id: '',
      fullName: '',
      phoneNumber: '',
      companyName: '',
      role: 'مالک فارم / مدیر تولید',
      source: 'manual',
      notes: '',
      createdAt: new Date().toISOString(),
      pipelineStage: prefillStage,
      dealValue: '',
      farmCapacity: '',
      province: 'مازندران',
      tags: ['مشتری جدید'],
      followUpPriority: 'medium',
      followUpStatus: 'none',
      followUpHistory: []
    });
    setIsCustomerModalOpen(true);
  }, []);

  const openEditCustomerModal = useCallback((customer: CustomerContact) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(true);
  }, []);

  const closeCustomerModal = useCallback(() => {
    setSelectedCustomer(null);
    setIsCustomerModalOpen(false);
  }, []);

  // CRUD Operations Wrapper
  const addCustomer = useCallback(async (customerData: Omit<CustomerContact, 'id' | 'createdAt'>): Promise<CustomerContact> => {
    const newCustomer = await baseAddCustomer(customerData);
    addNotification?.({
      type: 'success',
      message: `مخاطب جدید «${customerData.fullName}» با موفقیت افزوده شد.`
    });
    return newCustomer;
  }, [baseAddCustomer, addNotification]);

  const updateCustomer = useCallback(async (id: string, updates: Partial<CustomerContact>): Promise<void> => {
    await baseUpdateCustomer(id, updates);
    // If selected customer is currently open, keep it updated
    setSelectedCustomer(prev => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  }, [baseUpdateCustomer]);

  const deleteCustomer = useCallback(async (id: string): Promise<void> => {
    await baseDeleteCustomer(id);
    if (selectedCustomer?.id === id) {
      closeCustomerModal();
    }
    addNotification?.({
      type: 'info',
      message: 'پرونده مخاطب از سیستم حذف شد.'
    });
  }, [baseDeleteCustomer, selectedCustomer, closeCustomerModal, addNotification]);

  const addFollowUpLog = useCallback(async (
    customerId: string, 
    record: Omit<FollowUpRecord, 'id'>, 
    customNotes?: string
  ): Promise<void> => {
    const targetCustomer = customers.find(c => c.id === customerId);
    if (!targetCustomer) return;

    const recordDate = record.date || new Date().toISOString();
    const formattedDateTime = formatToShamsiDateTime(recordDate);
    const newLogLine = `[گزارش تماس - ${formattedDateTime}]: ${record.note}`;

    const updatedNotes = customNotes !== undefined
      ? customNotes
      : (targetCustomer.notes && targetCustomer.notes.trim()
          ? `${targetCustomer.notes.trim()}\n${newLogLine}`
          : newLogLine);

    const newHistoryItem: FollowUpRecord = {
      id: `fh-${Date.now()}`,
      date: recordDate,
      note: record.note,
      status: record.status || 'completed',
      priority: record.priority || targetCustomer.followUpPriority || 'medium'
    };

    const updatedHistory = [newHistoryItem, ...(targetCustomer.followUpHistory || [])];

    if (typeof baseAddCustomerFollowUp === 'function') {
      try {
        await baseAddCustomerFollowUp(customerId, record);
      } catch (e) {
        console.warn('baseAddCustomerFollowUp error, using baseUpdateCustomer', e);
      }
    }

    await baseUpdateCustomer(customerId, {
      notes: updatedNotes,
      followUpHistory: updatedHistory,
      lastFollowUpDate: recordDate
    });

    setSelectedCustomer(prev => {
      if (prev && prev.id === customerId) {
        return {
          ...prev,
          notes: updatedNotes,
          followUpHistory: updatedHistory,
          lastFollowUpDate: recordDate
        };
      }
      return prev;
    });

    addNotification?.({
      type: 'success',
      message: `گزارش تماس با درج تاریخ (${formattedDateTime}) در سوابق و توضیحات ثبت گردید.`
    });
  }, [customers, baseAddCustomerFollowUp, baseUpdateCustomer, addNotification]);

  const updatePipelineStage = useCallback(async (customerId: string, stage: PipelineStage): Promise<void> => {
    await baseUpdateCustomer(customerId, { pipelineStage: stage });
  }, [baseUpdateCustomer]);

  // Convert Website Inbound Lead to CRM Customer
  const convertInboundToCustomer = useCallback(async (
    inbound: QuoteRequestItem | ConsultationRequestItem,
    type: 'quote' | 'consultation'
  ): Promise<CustomerContact> => {
    const isQuote = type === 'quote';
    const data = inbound.formData as any;
    
    const newCustomerData: Omit<CustomerContact, 'id' | 'createdAt'> = {
      fullName: data.fullName || 'سرنخ ورودی وب‌سایت',
      phoneNumber: data.phoneNumber || '',
      email: data.email || '',
      companyName: data.companyName || '',
      role: 'مشتری وب‌سایت',
      source: isQuote ? 'استعلام قیمت سایت' : 'درخواست مشاوره فنی سایت',
      notes: `ثبت اولیه از فرم وب‌سایت: ${data.additionalNotes || data.message || 'بدون یادداشت'}\nظرفیت: ${data.capacity || data.projectCapacity || 'مشخص نشده'}\nموقعیت: ${data.deliveryLocation || data.location || ''}`,
      pipelineStage: 'new_lead',
      dealValue: '',
      farmCapacity: data.capacity || data.projectCapacity || '',
      province: data.deliveryLocation || data.location || '',
      tags: [isQuote ? 'استعلام سایت' : 'مشاوره سایت', 'سرنخ جدید'],
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      nextFollowUpTime: '10:00',
      nextFollowUpNote: 'تماس اولیه جهت ارزیابی نیاز و معرفی تجهیزات',
      followUpPriority: 'high',
      followUpStatus: 'pending',
      followUpHistory: [
        {
          id: `fup_${Date.now()}`,
          date: new Date().toISOString(),
          note: `ثبت فرم ورودی وب‌سایت (${isQuote ? 'استعلام قیمت کاتالوگ' : 'درخواست مشاوره تخصصی'})`,
          status: 'completed',
          priority: 'high'
        }
      ]
    };

    const created = await baseAddCustomer(newCustomerData);
    addNotification?.({
      type: 'success',
      message: `سرنخ «${newCustomerData.fullName}» با موفقیت به مشتریان CRM اضافه شد.`
    });
    return created;
  }, [baseAddCustomer, addNotification]);

  // Merge duplicate contacts
  const mergeDuplicates = useCallback(async (targetId: string, sourceIds: string[]): Promise<void> => {
    const target = customers.find(c => c.id === targetId);
    if (!target) return;

    const sources = customers.filter(c => sourceIds.includes(c.id));
    
    // Combine notes and follow-ups
    const combinedNotes = [
      target.notes,
      ...sources.map(s => `[ادغام از ${s.fullName} - ${s.phoneNumber}]: ${s.notes || ''}`)
    ].filter(Boolean).join('\n---\n');

    const combinedTags = Array.from(new Set([
      ...(target.tags || []),
      ...sources.flatMap(s => s.tags || [])
    ]));

    const combinedHistory = [
      ...(target.followUpHistory || []),
      ...sources.flatMap(s => s.followUpHistory || [])
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Update target
    await baseUpdateCustomer(targetId, {
      notes: combinedNotes,
      tags: combinedTags,
      followUpHistory: combinedHistory,
      farmCapacity: target.farmCapacity || sources.find(s => s.farmCapacity)?.farmCapacity,
      dealValue: target.dealValue || sources.find(s => s.dealValue)?.dealValue,
      province: target.province || sources.find(s => s.province)?.province,
      companyName: target.companyName || sources.find(s => s.companyName)?.companyName
    });

    // Delete merged sources
    for (const s of sources) {
      await baseDeleteCustomer(s.id);
    }

    addNotification?.({
      type: 'success',
      message: `تعداد ${sources.length} مخاطب تکراری در پرونده «${target.fullName}» با موفقیت ادغام شدند.`
    });
  }, [customers, baseUpdateCustomer, baseDeleteCustomer, addNotification]);

  // Detected duplicate groups
  const duplicateGroups = useMemo(() => {
    return detectAllDuplicateGroups(customers);
  }, [customers]);

  // Calculated Stats
  const stats = useMemo<CrmStats>(() => {
    const safeList = customers || [];
    let dealSum = 0;
    let wonSum = 0;
    let todayFup = 0;
    let overdueFup = 0;

    safeList.forEach(c => {
      // Deal values
      const val = parseFloat((c.dealValue || '0').replace(/[^0-9.]/g, '')) || 0;
      if (c.pipelineStage === 'won') {
        wonSum += val;
      } else if (c.pipelineStage !== 'lost') {
        dealSum += val;
      }

      // Follow-up urgency
      if (c.followUpStatus !== 'completed' && c.nextFollowUpDate) {
        const u = getFollowUpUrgency(c.nextFollowUpDate, c.nextFollowUpTime, c.followUpStatus);
        if (u.urgency === 'today') todayFup++;
        if (u.urgency === 'overdue') overdueFup++;
      }
    });

    const activeStages = ['new_lead', 'contacted', 'consulting', 'proposal', 'negotiation'];
    const activeLeads = safeList.filter(c => activeStages.includes(c.pipelineStage || 'new_lead')).length;

    return {
      totalContacts: safeList.length,
      activeLeads,
      totalDealValue: dealSum,
      wonDealValue: wonSum,
      todayFollowUps: todayFup,
      overdueFollowUps: overdueFup,
      duplicateCount: duplicateGroups.reduce((acc, g) => acc + g.customers.length, 0),
      inboundLeadsCount: (quoteRequests?.length || 0) + (consultationRequests?.length || 0)
    };
  }, [customers, duplicateGroups, quoteRequests, consultationRequests]);

  // Filtered customers for contacts and pipeline
  const filteredCustomers = useMemo(() => {
    return (customers || []).filter(c => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (c.fullName || '').toLowerCase().includes(q);
        const matchPhone = (c.phoneNumber || '').includes(q) || normalizePhoneNumber(c.phoneNumber).includes(normalizePhoneNumber(q));
        const matchCompany = (c.companyName || '').toLowerCase().includes(q);
        const matchProvince = (c.province || '').toLowerCase().includes(q);
        const matchNotes = (c.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCompany && !matchProvince && !matchNotes) {
          return false;
        }
      }

      // Stage Filter
      if (stageFilter !== 'all') {
        if ((c.pipelineStage || 'new_lead') !== stageFilter) return false;
      }

      // Priority Filter
      if (priorityFilter !== 'all') {
        if ((c.followUpPriority || 'medium') !== priorityFilter) return false;
      }

      // Province Filter
      if (provinceFilter !== 'all') {
        if (c.province !== provinceFilter) return false;
      }

      return true;
    });
  }, [customers, searchQuery, stageFilter, priorityFilter, provinceFilter]);

  return (
    <CrmContext.Provider
      value={{
        customers,
        quoteRequests,
        consultationRequests,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        stageFilter,
        setStageFilter,
        priorityFilter,
        setPriorityFilter,
        provinceFilter,
        setProvinceFilter,
        selectedCustomer,
        setSelectedCustomer,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        openNewCustomerModal,
        openEditCustomerModal,
        closeCustomerModal,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addFollowUpLog,
        updatePipelineStage,
        convertInboundToCustomer,
        mergeDuplicates,
        stats,
        duplicateGroups,
        filteredCustomers
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};
