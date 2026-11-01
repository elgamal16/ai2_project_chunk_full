import React from 'react';
import { useTranslation } from 'react-i18next';
import { Radar } from 'lucide-react';
import { LanguageSwitch } from './LanguageSwitch';

export const TopBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="h-16 bg-surface-lowest border-b border-outline-variant/30 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-control bg-primary text-white flex items-center justify-center shrink-0">
          <Radar className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-base text-primary tracking-tight">
            {t('nav.brand')}
          </span>
          <span className="hidden sm:inline-block ms-2 text-xs text-on-surface-variant font-normal">
            AI 2 Retention Engine
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LanguageSwitch />
      </div>
    </header>
  );
};

