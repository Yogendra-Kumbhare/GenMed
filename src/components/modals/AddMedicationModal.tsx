import React, { useState } from 'react';
import { X, Plus, Pill, ShieldCheck, Heart } from 'lucide-react';
import { Medication, Dependent } from '../../types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dependents: Dependent[];
  activeDependentId: string;
  onAddMedication: (med: Medication) => void;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  dependents,
  activeDependentId,
  onAddMedication,
}) => {
  const [selectedDependent, setSelectedDependent] = useState(
    activeDependentId === 'all' ? dependents[0]?.id || 'dep-self' : activeDependentId
  );
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('');
  const [brandEquivalent, setBrandEquivalent] = useState('');
  const [form, setForm] = useState<'Tablet' | 'Capsule' | 'Inhaler' | 'Solution'>('Tablet');
  const [frequency, setFrequency] = useState('Once daily (Morning)');
  const [pillsRemaining, setPillsRemaining] = useState('30');
  const [doctor, setDoctor] = useState('Dr. Sarah Chen, MD');
  const [instructions, setInstructions] = useState('Take with a glass of water');
  const [isAsNeeded, setIsAsNeeded] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      dependentId: selectedDependent,
      name: `${name} ${strength}`,
      genericName: name,
      brandEquivalent: brandEquivalent || 'Brand Equivalent',
      strength: strength || 'Standard',
      form: form,
      ndcNumber: '50090-1120-1',
      bioequivalenceRating: 'AB',
      dosageInstructions: instructions,
      frequency: frequency,
      timing: frequency.includes('Morning') ? ['Morning'] : ['Evening'],
      prescribingDoctor: doctor,
      doctorClinic: 'Austin Regional Care',
      rxNumber: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      pillsRemaining: parseInt(pillsRemaining) || 30,
      totalPills: 90,
      daysSupplyLeft: parseInt(pillsRemaining) || 30,
      refillsRemaining: 3,
      lastRefillDate: new Date().toISOString().split('T')[0],
      nextRefillRecommendedDate: '2026-10-07',
      isLowSupply: (parseInt(pillsRemaining) || 30) <= 7,
      isAsNeeded: isAsNeeded,
      color: '#ffffff',
      shape: 'round',
      priceGeneric: 10.5,
      priceBrand: 110.0,
      savingsPercentage: 90,
      foodInstructions: 'No specific food requirement',
      sideEffects: ['Mild nausea', 'Headache'],
      warnings: ['Keep stored at room temperature away from moisture.'],
    };

    onAddMedication(newMed);
    onClose();
  };

  return (
    <div
      id="add-medication-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="add-medication-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Medication / OTC Supplement</h3>
              <p className="text-xs text-slate-500">Log to schedule dose reminders & track supply</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Belongs To Profile
            </label>
            <select
              value={selectedDependent}
              onChange={(e) => setSelectedDependent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-700"
            >
              {dependents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.relationship})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Generic Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Omeprazole"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Dosage Strength
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 20mg"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Brand Equivalent (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Prilosec"
                value={brandEquivalent}
                onChange={(e) => setBrandEquivalent(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Form
              </label>
              <select
                value={form}
                onChange={(e) => setForm(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Solution">Solution</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              >
                <option value="Once daily (Morning)">Once daily (Morning)</option>
                <option value="Once daily (Evening)">Once daily (Evening)</option>
                <option value="Twice daily">Twice daily</option>
                <option value="As Needed (PRN)">As Needed (PRN)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Current Pills in Bottle
              </label>
              <input
                type="number"
                value={pillsRemaining}
                onChange={(e) => setPillsRemaining(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Instructions
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="asNeededCheck"
              checked={isAsNeeded}
              onChange={(e) => setIsAsNeeded(e.target.checked)}
              className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
            />
            <label htmlFor="asNeededCheck" className="text-xs text-slate-700 font-medium">
              Take As Needed (PRN) rather than fixed daily schedule
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs transition-colors"
            >
              Add to Cabinet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
