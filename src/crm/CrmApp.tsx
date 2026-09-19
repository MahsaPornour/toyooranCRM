import React, { useEffect } from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { CrmHeader } from './components/common/CrmHeader';
import { CrmNavTabs } from './components/common/CrmNavTabs';
import { CrmPipelineView } from './components/views/CrmPipelineView';
import { CrmFollowUpsView } from './components/views/CrmFollowUpsView';
import { CrmContactsView } from './components/views/CrmContactsView';
import { CrmInboundView } from './components/views/CrmInboundView';
import { CrmDuplicatesView } from './components/views/CrmDuplicatesView';
import { CrmReportsView } from './components/views/CrmReportsView';
import { CustomerModal } from './components/modals/CustomerModal';
import { toPersianDigits } from './utils/crmPhoneUtils';

interface CrmAppProps {
  standalone?: boolean;
  onBackToAdmin?: () => void;
  onViewPublicSite?: () => void;
  onNavigateTab?: (tab: any) => void;
  initialSelectedCustomerId?: string | null;
}

const CrmMainWorkspace: React.FC<{ standalone?: boolean }> = ({ standalone = true }) => {
  const { activeTab, customers, quoteRequests, consultationRequests } = useCrm();

  return (
    <div className="space-y-4">
      {/* Navigation tabs */}
      <CrmNavTabs />

      {/* Main Active View */}
      <div className="min-h-[500px]">
        {activeTab === 'pipeline' && <CrmPipelineView />}
        {activeTab === 'followups' && <CrmFollowUpsView />}
        {activeTab === 'contacts' && <CrmContactsView />}
        {activeTab === 'inbound' && <CrmInboundView />}
        {activeTab === 'duplicates' && <CrmDuplicatesView />}
        {activeTab === 'reports' && <CrmReportsView />}
      </div>

      {/* Standalone Footer */}
      {standalone && (
        <footer className="border-t border-slate-800/80 py-4 px-2 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ماژول CRM مستقل و برخط
            </span>
            <span>•</span>
            <span>مجموع مخاطبین: {toPersianDigits((customers || []).length)}</span>
            <span>•</span>
            <span>استعلام‌های وب‌سایت: {toPersianDigits(((quoteRequests || []).length + (consultationRequests || []).length))}</span>
          </div>
        </footer>
      )}

      {/* Modals */}
      <CustomerModal />
    </div>
  );
};

export const CrmApp: React.FC<CrmAppProps> = ({
  standalone = true,
  onBackToAdmin,
  onViewPublicSite,
  initialSelectedCustomerId
}) => {
  useEffect(() => {
    if (standalone) {
      const prev = document.title;
      document.title = 'صفحه CRM | طیوران صنعت پویا';
      return () => {
        document.title = prev;
      };
    }
  }, [standalone]);

  const content = (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 ${standalone ? '' : 'p-0'}`}>
      {standalone && (
        <CrmHeader
          onBackToAdmin={onBackToAdmin}
          onViewPublicSite={onViewPublicSite}
        />
      )}

      <main className={`flex-1 w-full max-w-[1650px] mx-auto ${standalone ? 'p-3 sm:p-6 lg:p-8' : 'p-2'}`}>
        <CrmMainWorkspace standalone={standalone} />
      </main>
    </div>
  );

  return (
    <CrmProvider>
      {content}
    </CrmProvider>
  );
};

export default CrmApp;
