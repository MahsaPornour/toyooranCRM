import { 
  CustomerContact, 
  FollowUpRecord, 
  PipelineStage, 
  QuoteRequestItem, 
  ConsultationRequestItem 
} from '../../types';

export type {
  CustomerContact,
  FollowUpRecord,
  PipelineStage,
  QuoteRequestItem,
  ConsultationRequestItem
};

export type CrmSubTab = 'pipeline' | 'followups' | 'contacts' | 'inbound' | 'duplicates' | 'reports';

export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export interface PipelineStageConfig {
  id: PipelineStage;
  title: string;
  desc: string;
  color: string;
  badgeBg: string;
  borderCol: string;
}

export interface DuplicateGroup {
  normalizedPhone: string;
  customers: CustomerContact[];
}

export interface CrmStats {
  totalContacts: number;
  activeLeads: number;
  totalDealValue: number;
  wonDealValue: number;
  todayFollowUps: number;
  overdueFollowUps: number;
  duplicateCount: number;
  inboundLeadsCount: number;
}
