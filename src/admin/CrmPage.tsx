import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CrmApp } from '../crm';

interface CrmPageProps {
  onViewPublicSite?: () => void;
  onBackToAdmin?: () => void;
}

export const CrmPage: React.FC<CrmPageProps> = ({ onViewPublicSite, onBackToAdmin }) => {
  const navigate = useNavigate();

  const handleGoToAdmin = () => {
    if (onBackToAdmin) {
      onBackToAdmin();
    } else {
      navigate('/admin');
    }
  };

  const handleGoToSite = () => {
    if (onViewPublicSite) {
      onViewPublicSite();
    } else {
      navigate('/');
    }
  };

  return (
    <CrmApp
      standalone={true}
      onBackToAdmin={handleGoToAdmin}
      onViewPublicSite={handleGoToSite}
    />
  );
};

export default CrmPage;

