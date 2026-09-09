import React from 'react';
import {
  X,
  Pill,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Medication } from '../../types';
import { DrugInteractionChecker } from '../DrugInteractionChecker';

interface MedicationDetailModalProps {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRefill: (med: Medication) => void;
  /** All active medication names for interaction checking */
  allMedicationNames?: string[];
  /** Patient allergies for AI context */
  allergies?: string;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  medication,
  isOpen,
  onClose,
  onOpenRefill,
  allMedicationNames = [],
  allergies,
}) => {
  if (!isOpen || !medication) return null;

  return (
    <div
      id="med-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="med-detail-modal-content"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs border border-slate-200 shrink-0"
              style={{ backgroundColor: medication.color }}
            >
              <Pill className="w-6 h-6 text-slate-700" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900">{medication.name}</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-700 text-white">
                  FDA {medication.bioequivalenceRating}-Rated
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {medication.form}
                </span>
              </div>
              <p className="text-xs text-teal-800 font-medium mt-0.5">
                Generic equivalent to <span className="font-bold">{medication.brandEquivalent}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                NDC: <span className="font-mono">{medication.ndcNumber}</span> • Rx: {medication.rxNumber}
              </p>
            </div>
          </div>
          <button
            aria-label="Close medication details"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Bioequivalence & Cost Savings Highlight Banner */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-teal-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>FDA Orange Book Therapeutic Bioequivalence</span>
              </div>
              <p className="text-xs text-teal-800 leading-relaxed max-w-md">
                This generic formulation contains the exact same active pharmaceutical ingredient, dosage strength,
                and bioavailability profile as {medication.brandEquivalent}.
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0 bg-white/80 px-3 py-2 rounded-lg border border-teal-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Your Generic Savings
              </span>
              <span className="text-lg font-black text-emerald-700">
                {medication.savingsPercentage}% Off
              </span>
              <span className="text-[11px] text-slate-500 block line-through">
                ${medication.priceBrand.toFixed(2)} retail
              </span>
            </div>
          </div>

          {/* Dosing & Instructions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Administration & Schedule</span>
              </div>
              <p className="text-slate-700 font-medium">{medication.dosageInstructions}</p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">Frequency:</span> {medication.frequency}
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">Food Instruction:</span> {medication.foodInstructions}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-700" />
                <span>Cabinet Supply & Refill Status</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Days Remaining:</span>
                <span
                  className={`font-bold ${
                    medication.daysSupplyLeft <= 7 ? 'text-amber-600' : 'text-slate-900'
                  }`}
                >
                  {medication.daysSupplyLeft} days ({medication.pillsRemaining} pills)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Authorized Refills:</span>
                <span className="font-bold text-slate-900">{medication.refillsRemaining} refills</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">Prescriber:</span> {medication.prescribingDoctor} ({medication.doctorClinic})
              </div>
            </div>
          </div>

          {/* Warnings & Side Effects */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Precautions & Safety Guidance</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                {medication.warnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                <Info className="w-3.5 h-3.5 text-sky-500" />
                <span>Known Mild Side Effects</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {medication.sideEffects.map((effect, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Drug Interaction Checker — Phase 3 */}
          {allMedicationNames.length >= 2 && (
            <DrugInteractionChecker
              medicationNames={allMedicationNames}
              focusMedication={medication.name}
              allergies={allergies}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-500">Generic Price: </span>
            <span className="font-bold text-teal-800 text-sm">
              ${medication.priceGeneric.toFixed(2)}
            </span>
            <span className="text-slate-400 text-[11px]"> / 90-day</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Close
            </button>
            <button
              id="detail-modal-refill-btn"
              onClick={() => {
                onClose();
                onOpenRefill(medication);
              }}
              className="px-5 py-2 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Request Refill Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
