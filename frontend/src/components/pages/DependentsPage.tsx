import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Heart,
  PhoneCall,
  Clock,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Lock,
  X,
  Trash2,
} from 'lucide-react';
import { Dependent, Medication, PageId } from '../../types';

interface DependentsPageProps {
  dependents: Dependent[];
  medications: Medication[];
  activeDependentId: string | 'all';
  onSelectDependent: (id: string | 'all') => void;
  onNavigate: (page: PageId) => void;
  onAddDependent: (newDep: Dependent) => void;
  onRemoveDependent: (dependentId: string) => void;
}

export const DependentsPage: React.FC<DependentsPageProps> = ({
  dependents,
  medications,
  activeDependentId,
  onSelectDependent,
  onNavigate,
  onAddDependent,
  onRemoveDependent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<'Mother' | 'Daughter' | 'Spouse' | 'Father' | 'Son'>('Mother');
  const [newAge, setNewAge] = useState('74');
  const [newCondition, setNewCondition] = useState('Hypertension Management');
  const [newDoctor, setNewDoctor] = useState('Dr. Sarah Chen, MD');
  const [dependentPendingRemoval, setDependentPendingRemoval] = useState<Dependent | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDep: Dependent = {
      id: `dep-${Date.now()}`,
      name: newName,
      relationship: newRelationship,
      age: parseInt(newAge) || 70,
      dob: '1952-04-12',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      adherenceRate: 95,
      activeMedsCount: 1,
      urgentAlertsCount: 0,
      primaryCondition: newCondition,
      primaryDoctor: newDoctor,
      doctorPhone: '(512) 555-0143',
      emergencyContact: 'Eleanor Vance',
      emergencyPhone: '(512) 555-0112',
      hipaaAuthorized: true,
      notes: 'Added via Caregiver portal.',
    };

    onAddDependent(newDep);
    setShowAddModal(false);
    setNewName('');
  };

  const handleRemoveDependent = () => {
    if (!dependentPendingRemoval) return;
    onRemoveDependent(dependentPendingRemoval.id);
    setDependentPendingRemoval(null);
  };

  return (
    <div id="dependents-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              Caregiver Hub
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {dependents.length} Linked Profiles
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Caregiver Management & Dependents
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage prescriptions, dose adherence, refill orders, and emergency care authorizations for family members.
          </p>
        </div>

        <button
          id="add-dependent-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Dependents Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dependents.map((dep) => {
          const depMeds = medications.filter((m) => m.dependentId === dep.id);
          const isSelected = activeDependentId === dep.id;

          return (
            <div
              key={dep.id}
              id={`dependent-card-${dep.id}`}
              className={`p-6 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-5 ${
                isSelected
                  ? 'border-teal-700 ring-2 ring-teal-700/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={dep.avatar}
                      alt={dep.name}
                      className="w-13 h-13 rounded-2xl object-cover ring-2 ring-teal-700/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-slate-900">{dep.name}</h3>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
                          {dep.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {dep.age} years old • DOB: {dep.dob}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-700 text-white shadow-2xs">
                      Active
                    </span>
                  )}
                </div>

                {/* Primary Condition & Adherence */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Care Protocol
                    </span>
                    <span className="font-semibold text-slate-800">{dep.primaryCondition}</span>
                  </div>

                  {/* Adherence Rate Gauge */}
                  <div className="pt-2 border-t border-slate-200/70 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">30-Day Adherence:</span>
                      <span className="font-black text-teal-800">{dep.adherenceRate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-teal-700 h-2 rounded-full"
                        style={{ width: `${dep.adherenceRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Medication List Snippet */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">
                      Active Medications ({depMeds.length})
                    </span>
                    <button
                      onClick={() => {
                        onSelectDependent(dep.id);
                        onNavigate('cabinet');
                      }}
                      className="text-[11px] font-semibold text-teal-700 hover:underline"
                    >
                      View Cabinet →
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {depMeds.slice(0, 3).map((med) => (
                      <div
                        key={med.id}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Pill className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                          <span className="font-medium text-slate-800 truncate">{med.name}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            med.daysSupplyLeft <= 7
                              ? 'bg-amber-100 text-amber-800'
                              : 'text-slate-500'
                          }`}
                        >
                          {med.daysSupplyLeft}d left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Physician & Care Team */}
                <div className="mt-4 text-xs space-y-1 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Primary Doctor:</span>
                    <span className="font-semibold text-slate-800">{dep.primaryDoctor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Clinic Phone:</span>
                    <a
                      href={`tel:${dep.doctorPhone.replace(/\D/g, '')}`}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      {dep.doctorPhone}
                    </a>
                  </div>
                </div>

                {/* HIPAA Consent Badge */}
                <div className="mt-3 text-[11px] text-teal-900 bg-teal-50/80 p-2 rounded-lg border border-teal-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>HIPAA Caregiver Proxy Authorized & Signed</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  id={`switch-view-dep-${dep.id}`}
                  onClick={() => {
                    onSelectDependent(dep.id);
                    onNavigate('dashboard');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors text-center"
                >
                  Manage {dep.name.split(' ')[0]}'s Portal
                </button>
                {dep.relationship !== 'Self' && (
                  <button
                    type="button"
                    aria-label={`Remove ${dep.name} from your family members`}
                    onClick={() => setDependentPendingRemoval(dep)}
                    className="p-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Caregiver Audit & Adherence History Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Recent Caregiver Activity & Adherence Log</h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">
                  Arthur Vance: Morning Amlodipine Besylate 5mg Verified Taken
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Logged by Eleanor Vance (Caregiver) via mobile portal at 8:45 AM today.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">Today, 8:45 AM</span>
          </div>

          <div className="py-3 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">
                  Arthur Vance: Low Supply Warning Dispatched (6 Days Remaining)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Automated refill prompt routed to Eleanor Vance. Order queued for Texas pharmacy fulfillment.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">Yesterday, 4:12 PM</span>
          </div>

          <div className="py-3 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">
                  Leo Vance: Pediatric Asthma Rescue Inhaler Check-in
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Albuterol HFA canister verified at 140 puffs remaining. School nurse authorized on file.
                </p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">Sep 4, 2026</span>
          </div>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Link New Family Member / Care Recipient</h3>
              </div>
              <button
                aria-label="Close add family member form"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Margaret Vance"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value as typeof newRelationship)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Condition / Care Focus</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Osteoporosis & Thyroid Regulation"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Doctor</label>
                <input
                  type="text"
                  required
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>You will be designated as authorized caregiver proxy under HIPAA Privacy Rule 45 CFR § 164.502(g).</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs transition-colors"
                >
                  Save & Authorize Dependent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {dependentPendingRemoval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-50 text-red-700">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Remove family member?</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  This removes {dependentPendingRemoval.name}'s profile and the related medications, doses, prescriptions, orders, and notifications from this local portal.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDependentPendingRemoval(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Keep Member
              </button>
              <button
                type="button"
                onClick={handleRemoveDependent}
                className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
