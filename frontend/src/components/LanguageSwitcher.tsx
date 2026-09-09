import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'hi', label: 'हिन्दी' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    try { localStorage.setItem('genericmed_lang', code); } catch { /* ignore */ }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
      <select
        value={i18n.language}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Select language"
        className="text-xs font-semibold bg-transparent text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-teal-600 dark:focus:border-teal-500 cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
