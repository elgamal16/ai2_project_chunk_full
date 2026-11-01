import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';

const STORAGE_KEY = 'churn_radar_lang';

export function getInitialLanguage(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // ignore localStorage errors in restricted environments
  }
  return 'en';
}

export function applyDocumentDirection(lang: string) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
}

export function setAppLanguage(lang: 'en' | 'ar') {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
  applyDocumentDirection(lang);
  void i18n.changeLanguage(lang);
}

const initialLang = getInitialLanguage();
applyDocumentDirection(initialLang);

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: initialLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

