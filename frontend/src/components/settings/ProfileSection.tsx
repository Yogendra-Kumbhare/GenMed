/**
 * @file ProfileSection.tsx
 * Personal & Medical Info section of the Settings page.
 */
import React, { useState, useEffect } from 'react';
import { User, Heart, Stethoscope, Calendar } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileSectionProps {
  user: UserProfile;
  onChange: (updated: Partial<UserProfile>) => void;
}

export function ProfileSection({ user, onChange }: ProfileSectionProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dob);
  const [role, setRole] = useState(user.role);
  const [allergies, setAllergies] = useState(user.allergies);
  const [primaryCondition, setPrimaryCondition] = useState(
    user.primaryCondition || 'Cardiovascular & Metabolic Care'
  );
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact);
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone);
  const [primaryDoctor, setPrimaryDoctor] = useState(user.primaryDoctor || 'Dr. Sarah Chen, MD');
  const [doctorPhone, setDoctorPhone] = useState(user.doctorPhone || '(512) 555-0143');
  const [insuranceOrHsaProvider, setInsuranceOrHsaProvider] = useState(
    user.insuranceOrHsaProvider || 'Optum Bank HSA'
  );

  // Sync if parent user object changes (e.g., after API refresh)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setDob(user.dob);
    setRole(user.role);
    setAllergies(user.allergies);
    setPrimaryCondition(user.primaryCondition || 'Cardiovascular & Metabolic Care');
    setEmergencyContact(user.emergencyContact);
    setEmergencyPhone(user.emergencyPhone);
    setPrimaryDoctor(user.primaryDoctor || 'Dr. Sarah Chen, MD');
    setDoctorPhone(user.doctorPhone || '(512) 555-0143');
    setInsuranceOrHsaProvider(user.insuranceOrHsaProvider || 'Optum Bank HSA');
  }, [user]);

  // Propagate any field change up to the parent form
  const emit = (patch: Partial<UserProfile>) => {
    onChange({
      name,
      email,
      phone,
      dob,
      role,
      allergies,
      primaryCondition,
      emergencyContact,
      emergencyPhone,
      primaryDoctor,
      doctorPhone,
      insuranceOrHsaProvider,
      ...patch,
    });
  };

  const inputCls =
    'w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:border-teal-700 dark:focus:border-teal-500 focus:outline-none text-slate-900 dark:text-slate-100 text-xs';
  const labelCls = 'block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1';

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
        <User className="w-5 h-5 text-teal-700 dark:text-teal-400" />
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Primary Patient Profile</h2>
      </div>

      {/* Row 1: Name, Email, Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className={labelCls}>Full Legal Name</label>
          <input
            id="settings-patient-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); emit({ name: e.target.value }); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input
            id="settings-patient-email"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); emit({ email: e.target.value }); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Primary Mobile Phone</label>
          <input
            id="settings-patient-phone"
            type="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); emit({ phone: e.target.value }); }}
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 2: DOB, Role, Member ID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
        <div>
          <label className={labelCls}>Date of Birth</label>
          <input
            id="settings-patient-dob"
            type="date"
            value={dob}
            onChange={(e) => { setDob(e.target.value); emit({ dob: e.target.value }); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Account Role</label>
          <select
            id="settings-patient-role"
            value={role}
            onChange={(e) => {
              const v = e.target.value as typeof role;
              setRole(v);
              emit({ role: v });
            }}
            className={inputCls}
          >
            <option value="Patient">Patient (Self-Managed)</option>
            <option value="Family Caregiver">Family Caregiver (Dependents)</option>
            <option value="Healthcare Proxy">Healthcare Proxy / Guardian</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Rx Member ID</label>
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">
            {user.memberId} (RxBIN {user.rxBin})
          </div>
        </div>
      </div>

      {/* Row 3: Allergies, Primary Condition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
        <div>
          <label className={labelCls}>Documented Drug Allergies</label>
          <input
            id="settings-patient-allergies"
            type="text"
            value={allergies}
            onChange={(e) => { setAllergies(e.target.value); emit({ allergies: e.target.value }); }}
            className="w-full px-3 py-2 bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-amber-900 dark:text-amber-200 focus:border-teal-700 focus:outline-none font-medium text-xs"
          />
        </div>
        <div>
          <label className={labelCls}>Primary Health Focus / Condition</label>
          <input
            id="settings-patient-condition"
            type="text"
            value={primaryCondition}
            onChange={(e) => { setPrimaryCondition(e.target.value); emit({ primaryCondition: e.target.value }); }}
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 4: Emergency Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
        <div>
          <label className={labelCls}>Emergency Contact</label>
          <input
            id="settings-emergency-contact"
            type="text"
            value={emergencyContact}
            onChange={(e) => { setEmergencyContact(e.target.value); emit({ emergencyContact: e.target.value }); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Emergency Contact Phone</label>
          <input
            id="settings-emergency-phone"
            type="tel"
            value={emergencyPhone}
            onChange={(e) => { setEmergencyPhone(e.target.value); emit({ emergencyPhone: e.target.value }); }}
            className={inputCls}
          />
        </div>
      </div>

      {/* Row 5: Doctor, Insurance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
        <div>
          <label className={labelCls}>Primary Prescribing Physician</label>
          <input
            id="settings-primary-doctor"
            type="text"
            value={primaryDoctor}
            onChange={(e) => { setPrimaryDoctor(e.target.value); emit({ primaryDoctor: e.target.value }); }}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>HSA / Insurance Provider</label>
          <input
            id="settings-insurance-provider"
            type="text"
            value={insuranceOrHsaProvider}
            onChange={(e) => { setInsuranceOrHsaProvider(e.target.value); emit({ insuranceOrHsaProvider: e.target.value }); }}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
