import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  /** compact = icon-only cycle button; full = three-option segmented control */
  variant?: 'compact' | 'full';
}

const OPTIONS: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun className="w-3.5 h-3.5" />, label: 'Light' },
  { value: 'system', icon: <Monitor className="w-3.5 h-3.5" />, label: 'System' },
  { value: 'dark', icon: <Moon className="w-3.5 h-3.5" />, label: 'Dark' },
];

export function ThemeToggle({ variant = 'compact' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  if (variant === 'compact') {
    const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[1];
    const next = OPTIONS[(OPTIONS.indexOf(current) + 1) % OPTIONS.length];
    return (
      <button
        onClick={() => setTheme(next.value)}
        aria-label={`Switch to ${next.label} theme`}
        title={`Current: ${current.label} — click for ${next.label}`}
        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        {current.icon}
      </button>
    );
  }

  return (
    <div
      className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl"
      role="radiogroup"
      aria-label="Theme"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={theme === opt.value}
          onClick={() => setTheme(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            theme === opt.value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  );
}
