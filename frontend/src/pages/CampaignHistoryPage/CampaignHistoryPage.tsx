import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorBanner } from '../../components/ui/ErrorBanner';
import { CampaignList } from './components/CampaignList';
import { CampaignDetail } from './components/CampaignDetail';
import { useCampaigns } from './hooks/useCampaigns';

export const CampaignHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    campaigns,
    isLoading,
    error,
    selectedId,
    setSelectedId,
    detail,
    isDetailLoading,
  } = useCampaigns();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">{t('history.title')}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">{t('history.subtitle')}</p>
        </div>
        <Link to="/campaign">
          <Button variant="primary" size="sm">
            <Send className="w-4 h-4 me-1.5" />
            {t('nav.campaign')}
          </Button>
        </Link>
      </div>

      {error && <ErrorBanner message={error.message} />}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton height={40} />
          <Skeleton height={200} />
        </div>
      ) : (
        <div className="space-y-6">
          <CampaignList
            campaigns={campaigns}
            selectedId={selectedId}
            onSelectCampaign={(id) => setSelectedId(id)}
          />

          {selectedId && (
            <CampaignDetail
              detail={detail}
              isLoading={isDetailLoading}
              onClose={() => setSelectedId(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

