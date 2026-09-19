import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { OverviewTab } from './tabs/OverviewTab';
import { ProductsTab } from './tabs/ProductsTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ServicesTab } from './tabs/ServicesTab';
import { ArticlesTab } from './tabs/ArticlesTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { QuotesTab } from './tabs/QuotesTab';
import { ConsultationsTab } from './tabs/ConsultationsTab';
import { CustomersTab } from './tabs/CustomersTab';
import { CrmTab } from './tabs/CrmTab';
import { CompanyCmsTab } from './tabs/CompanyCmsTab';
import { HeroCmsTab } from './tabs/HeroCmsTab';
import { AiConfigTab } from './tabs/AiConfigTab';
import { MediaTab } from './tabs/MediaTab';
import { BackupTab } from './tabs/BackupTab';
import { SecurityTab } from './tabs/SecurityTab';
import { CustomerContact } from '../types';
import { ExternalLink, LayoutDashboard, UserCheck } from 'lucide-react';

interface AdminPanelProps {
  onViewPublicSite: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onViewPublicSite }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');

  const handleSelectCustomer = (customer: CustomerContact) => {
    setSelectedCustomerId(customer.id);
    setCurrentTab('crm');
  };

  const handleSearchCustomer = (query: string) => {
    setCustomerSearchQuery(query);
    setCurrentTab('crm');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-['Estedad',sans-serif] flex flex-col" dir="rtl">
      
      {/* Top Navigation Bar with Persian Calendar & Customer Search Box */}
      <AdminHeader 
        onViewPublicSite={onViewPublicSite}
        onSelectTab={setCurrentTab}
        onSelectCustomer={handleSelectCustomer}
        onSearchCustomer={handleSearchCustomer}
      />

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar */}
        <AdminSidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/90">
          <div className="max-w-7xl mx-auto">
            {/* Quick In-App Tab Bar */}
            <div className="flex items-center justify-between gap-3 pb-3 mb-6 border-b border-slate-800/70 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentTab === 'overview'
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>داشبورد اصلی</span>
                </button>

                <button
                  onClick={() => setCurrentTab('crm')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentTab === 'crm'
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>صفحه CRM</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                </button>

                {currentTab !== 'overview' && currentTab !== 'crm' && (
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800/50 text-slate-300 border border-slate-700/50">
                    تب جاری: {currentTab}
                  </span>
                )}
              </div>

              {/* Direct Open in New Browser Tab */}
              <a
                href="/crm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-400/90 hover:text-amber-300 font-bold flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/30 transition-all shrink-0"
                title="باز کردن صفحه CRM در یک تب جدید مرورگر"
              >
                <span>باز کردن صفحه CRM در تب جدید مرورگر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {currentTab === 'overview' && <OverviewTab onNavigateTab={setCurrentTab} />}
            {currentTab === 'crm' && (
              <CrmTab 
                onNavigateTab={setCurrentTab}
                selectedCustomerId={selectedCustomerId}
                onClearSelectedCustomer={() => setSelectedCustomerId(null)}
              />
            )}
            {currentTab === 'products' && <ProductsTab />}
            {currentTab === 'projects' && <ProjectsTab />}
            {currentTab === 'services' && <ServicesTab />}
            {currentTab === 'articles' && <ArticlesTab />}
            {currentTab === 'categories' && <CategoriesTab />}
            {currentTab === 'quotes' && <QuotesTab />}
            {currentTab === 'consultations' && <ConsultationsTab />}
            {currentTab === 'customers' && (
              <CustomersTab 
                initialSearchTerm={customerSearchQuery}
                selectedCustomerId={selectedCustomerId}
                onClearSelectedCustomer={() => setSelectedCustomerId(null)}
              />
            )}
            {currentTab === 'company' && <CompanyCmsTab />}
            {currentTab === 'hero' && <HeroCmsTab />}
            {currentTab === 'ai' && <AiConfigTab />}
            {currentTab === 'media' && <MediaTab />}
            {currentTab === 'backup' && <BackupTab />}
            {currentTab === 'security' && <SecurityTab />}
          </div>
        </main>

      </div>

    </div>
  );
};
