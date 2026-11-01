import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { setAppLanguage } from '../../i18n';

export const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('ar') ? 'ar' : 'en';

  const handleToggle = () => {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    setAppLanguage(nextLang);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-control text-sm font-medium text-on-surface hover:bg-surface-container transition-colors min-h-[44px] min-w-[44px] border border-outline-variant/40"
      aria-label={currentLang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      <Globe className="w-4 h-4 text-primary-container" />
      <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
};

