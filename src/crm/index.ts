/**
 * Dedicated CRM Module (Independent Architecture)
 * Contains isolated types, context, views, components, and utilities
 */

export { CrmApp, default } from './CrmApp';
export { CrmProvider, useCrm } from './context/CrmContext';
export * from './types/crm.types';
export * from './utils/crmPhoneUtils';
export * from './utils/crmDateUtils';
export * from './utils/crmExportUtils';
