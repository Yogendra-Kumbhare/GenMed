/**
 * @file NotificationSection.tsx
 * Communication & Alert Preferences section of the Settings page.
 * Also hosts the Language Switcher and Theme Toggle controls.
 */
import React from 'react';
import { Bell, Globe, Palette } from 'lucide-react';
import { UserSettings } from '../../types';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { ThemeToggle } from '../ThemeToggle';
import { PushToggle } from '../PushNotificationManager';

interface NotificationSectionProps {
  settings: UserSettings;
  onChange: (patch: Partial<UserSettings>) => void;
}

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}

function ToggleRow({ label, description, checked, onChange, id }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between pt-3 first:pt-1">
      <div>
        <label htmlFor={id} className="font-bold text-slate-900 dark:text-slate-100 block cursor-pointer">
          {label}
        </label>
        <span className="text-slate-500 dark:text-slate-400 text-[11px]">{description}</span>
      </div>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-teal-700 focus:ring-teal-600 cursor-pointer shrink-0"
      />
    </div>
  );
}

export function NotificationSection({ settings, onChange }: NotificationSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
        <Bell className="w-5 h-5 text-teal-700 dark:text-teal-400" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Communication & Alert Preferences</h2>
      </div>

      <div className="space-y-0 text-xs divide-y divide-slate-100 dark:divide-slate-800">
        <ToggleRow
          id="settings-sms-reminders"
          label="SMS Dose Time Reminders"
          description="Receive an automated text when a scheduled dose is due."
          checked={settings.smsDoseReminders}
          onChange={(v) => onChange({ smsDoseReminders: v })}
        />
        <ToggleRow
          id="settings-caregiver-escalation"
          label="Caregiver Escalation Ping"
          description="Alert Eleanor if Arthur or Leo misses a maintenance dose by 2 hours."
          checked={settings.caregiverEscalation}
          onChange={(v) => onChange({ caregiverEscalation: v })}
        />
        <ToggleRow
          id="settings-delivery-sms"
          label="Live Courier GPS Alerts"
          description="Real-time SMS updates when courier van is within 30 minutes of drop-off."
          checked={settings.deliverySms}
          onChange={(v) => onChange({ deliverySms: v })}
        />
        <ToggleRow
          id="settings-email-statements"
          label="Monthly Email Statements"
          description="Receive monthly savings reports and refill summaries via email."
          checked={settings.emailStatements}
          onChange={(v) => onChange({ emailStatements: v })}
        />

        {/* Push Notifications */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 block">Browser Push Notifications</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              Dose reminders and order updates sent directly to your browser or home screen.
            </span>
          </div>
          <PushToggle />
        </div>
      </div>

      {/* Appearance & Language */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Appearance & Language</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">Color Theme</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Light, Dark, or follow system preference.</span>
          </div>
          <ThemeToggle variant="full" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block">Language</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">English, Español, or हिन्दी.</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
