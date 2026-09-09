/**
 * @file PharmacySection.tsx
 * Pharmacy & Dispensing Rules toggle section of the Settings page.
 */
import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { UserSettings } from '../../types';

interface PharmacySectionProps {
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

export function PharmacySection({ settings, onChange }: PharmacySectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Pharmacy & Dispensing Rules</h2>
      </div>

      <div className="space-y-0 text-xs divide-y divide-slate-100 dark:divide-slate-800">
        <ToggleRow
          id="settings-auto-refill"
          label="Automatic Low-Supply Refill Trigger"
          description="Automatically queue a 90-day refill when 7 days of supply remain."
          checked={settings.autoRefill}
          onChange={(v) => onChange({ autoRefill: v })}
        />
        <ToggleRow
          id="settings-bulk-supply"
          label="90-Day Bulk Supply Priority"
          description="Default to 90-day fills for maintenance medications to maximize generic savings."
          checked={settings.bulkSupplyDefault}
          onChange={(v) => onChange({ bulkSupplyDefault: v })}
        />
        <ToggleRow
          id="settings-generic-sub"
          label="Always Substitute FDA AB-Rated Generic"
          description="Ensure pharmacist dispenses equivalent generic without unnecessary brand markups."
          checked={settings.genericSubstitution}
          onChange={(v) => onChange({ genericSubstitution: v })}
        />
        <ToggleRow
          id="settings-child-caps"
          label="Child-Resistant Packaging"
          description="Safety caps fitted on all bottles dispatched from central facility."
          checked={settings.childCaps}
          onChange={(v) => onChange({ childCaps: v })}
        />
      </div>
    </div>
  );
}
