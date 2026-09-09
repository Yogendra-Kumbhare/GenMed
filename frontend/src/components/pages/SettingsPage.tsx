/**
 * @file SettingsPage.tsx
 * Thin orchestrator for the Settings & Account Preferences page.
 * Business logic, state, and layout are delegated to focused sub-components
 * in src/components/settings/.
 *
 * Phase 4 refactor: 1119-line monolith → ~120-line orchestrator (ADR-015).
 */
import React, { useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { UserProfile, UserSettings } from '../../types';
import { ProfileSection } from '../settings/ProfileSection';
import { DeliverySection } from '../settings/DeliverySection';
import { PaymentSection } from '../settings/PaymentSection';
import { PharmacySection } from '../settings/PharmacySection';
import { NotificationSection } from '../settings/NotificationSection';
import { SecuritySection } from '../settings/SecuritySection';

interface SettingsPageProps {
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  settings: UserSettings;
  onUpdateSettings: (updated: UserSettings) => void;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  onUpdateProfile,
  settings,
  onUpdateSettings,
  onLogout,
}) => {
  // Accumulated profile changes from ProfileSection (partial diffs)
  const [profilePatch, setProfilePatch] = useState<Partial<UserProfile>>({});
  // Live settings state that sub-components push changes into
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSettingsChange = (patch: Partial<UserSettings>) => {
    setLocalSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Merge profile patch with existing user profile and save
    const updatedUser: UserProfile = { ...user, ...profilePatch };
    onUpdateProfile(updatedUser);
    onUpdateSettings(localSettings);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div id="settings-page" className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700">
              Account & Clinical Preferences
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">HIPAA Secure Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
            Portal Settings & Pharmacy Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Configure delivery addresses, HSA/FSA payment accounts, auto-refill policies, and caregiver permissions.
          </p>
        </div>

        {savedSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {/* All sections in one form so a single Save button commits everything */}
      <form onSubmit={handleSave} className="space-y-6">
        <ProfileSection user={user} onChange={setProfilePatch} />
        <DeliverySection onSaved={() => setSavedSuccess(true)} />
        <PaymentSection onSaved={() => setSavedSuccess(true)} />
        <PharmacySection settings={localSettings} onChange={handleSettingsChange} />
        <NotificationSection settings={localSettings} onChange={handleSettingsChange} />

        {/* Save Button Bar */}
        <div className="flex justify-end gap-3 items-center">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Changes saved!
            </span>
          )}
          <button
            type="submit"
            id="save-settings-btn"
            className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Preferences</span>
          </button>
        </div>
      </form>

      {/* Security section is outside the main form so logout/export don't submit */}
      <SecuritySection
        user={user}
        settings={localSettings}
        onChange={handleSettingsChange}
        onLogout={onLogout}
        exportData={{
          name: profilePatch.name ?? user.name,
          email: profilePatch.email ?? user.email,
          phone: profilePatch.phone ?? user.phone,
          allergies: profilePatch.allergies ?? user.allergies,
          autoRefill: localSettings.autoRefill,
          bulkSupplyDefault: localSettings.bulkSupplyDefault,
          genericSubstitution: localSettings.genericSubstitution,
          childCaps: localSettings.childCaps,
        }}
      />
    </div>
  );
};
