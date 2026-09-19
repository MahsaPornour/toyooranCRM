import React from 'react';
import { CrmApp } from '../../crm';
import { AdminTab } from '../AdminSidebar';

interface CrmTabProps {
  onNavigateTab?: (tab: AdminTab) => void;
  selectedCustomerId?: string | null;
  onClearSelectedCustomer?: () => void;
}

/**
 * CrmTab is now a lightweight wrapper that embeds the isolated CRM Module
 * into the Admin Panel.
 */
export const CrmTab: React.FC<CrmTabProps> = ({
  onNavigateTab,
  selectedCustomerId = null
}) => {
  return (
    <div className="space-y-4">
      <CrmApp
        standalone={false}
        onNavigateTab={onNavigateTab}
        initialSelectedCustomerId={selectedCustomerId}
      />
    </div>
  );
};

export default CrmTab;
