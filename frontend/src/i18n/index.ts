import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import hi from './locales/hi.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es }, hi: { translation: hi } },
  lng: (() => {
    try { return localStorage.getItem('genericmed_lang') ?? 'en'; } catch { return 'en'; }
  })(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
