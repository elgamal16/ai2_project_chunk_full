import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stepper } from '../../components/ui/Stepper';
import { DropZone } from './components/DropZone';
import { RecentRuns } from './components/RecentRuns';

export const UploadPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Stepper currentStep={1} />
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">
          {t('upload.title')}
        </h1>
        <p className="text-sm md:text-base text-on-surface-variant">
          {t('upload.subtitle')}
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <DropZone />
      </div>
      <div className="max-w-4xl mx-auto">
        <RecentRuns />
      </div>
    </div>
  );
};

