import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Camera,
  Sparkles,
  Building,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Prescription, Dependent } from '../../types';

interface UploadRxModalProps {
  isOpen: boolean;
  onClose: () => void;
  dependents: Dependent[];
  activeDependentId: string;
  onAddPrescription: (rx: Prescription) => void;
}

export const UploadRxModal: React.FC<UploadRxModalProps> = ({
  isOpen,
  onClose,
  dependents,
  activeDependentId,
  onAddPrescription,
}) => {
  const [selectedDependent, setSelectedDependent] = useState(
    activeDependentId === 'all' ? dependents[0]?.id || 'dep-self' : activeDependentId
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Extracted Rx fields
  const [doctorName, setDoctorName] = useState('Dr. Sarah Chen, MD');
  const [clinicName, setClinicName] = useState('Austin Medical Specialists');
  const [medicationName, setMedicationName] = useState('Atorvastatin Calcium');
  const [strength, setStrength] = useState('20mg');
  const [sig, setSig] = useState('Take 1 tablet daily at bedtime');
  const [qty, setQty] = useState('90');
  const [refills, setRefills] = useState('3');

  if (!isOpen) return null;

  const handleSimulateFileSelect = (sampleName: string, med: string, str: string) => {
    setFileName(sampleName);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setMedicationName(med);
      setStrength(str);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      rxNumber: `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      dependentId: selectedDependent,
      medicationName: `${medicationName} ${strength}`,
      genericName: medicationName,
      brandEquivalent: medicationName.includes('Atorvastatin') ? 'Lipitor' : 'Brand Equivalent',
      strength: strength,
      form: 'Oral Tablet',
      doctorName: doctorName,
      doctorSpecialty: 'Internal Medicine',
      doctorNpi: '1487920194',
      clinicName: clinicName,
      clinicAddress: '1200 Medical Pkwy, Austin, TX',
      clinicPhone: '(512) 555-0143',
      prescribedDate: new Date().toISOString().split('T')[0],
      expirationDate: '2027-09-07',
      refillsTotal: parseInt(refills) || 3,
      refillsRemaining: parseInt(refills) || 3,
      status: 'Active',
      sig: sig,
      qtyPrescribed: parseInt(qty) || 90,
      daysSupply: 90,
      genericSubstitutionPermitted: true,
      qrVerificationCode: `GM-RX-${Date.now()}-VERIFIED-AB`,
    };

    onAddPrescription(newRx);
    onClose();
  };

  return (
    <div
      id="upload-rx-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="upload-rx-modal-content"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Prescription / Electronic Rx</h3>
              <p className="text-xs text-slate-500">
                Auto-extracted and verified with your doctor by GenericMed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Target Dependent Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Prescription Belongs To
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

          {/* Upload Drop Area */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Prescription Document or Paper Photo
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-teal-600 rounded-xl p-6 text-center bg-slate-50/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center mb-2">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                {fileName ? fileName : 'Drag & drop your prescription image or PDF here'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports JPG, PNG, PDF (Max 15MB) • HIPAA 256-bit Encrypted
              </p>

              {/* Sample Quick Preset Buttons */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Quick test samples:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSimulateFileSelect('Dr_Chen_Atorvastatin_Rx.pdf', 'Atorvastatin Calcium', '20mg')
                  }
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-teal-800 rounded-md transition-all shadow-2xs"
                >
                  📄 Atorvastatin 20mg
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSimulateFileSelect('Cardiology_Lisinopril_Rx.pdf', 'Lisinopril', '10mg')
                  }
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-teal-800 rounded-md transition-all shadow-2xs"
                >
                  📄 Lisinopril 10mg
                </button>
              </div>
            </div>

            {isScanning && (
              <div className="mt-2 p-3 bg-teal-50 rounded-lg flex items-center gap-2 text-teal-800 text-xs font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Reading prescription metadata and verifying DEA/NPI...</span>
              </div>
            )}

            {scanComplete && (
              <div className="mt-2 p-2.5 bg-emerald-50 rounded-lg flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>OCR scan successful: Doctor credentials and prescription details extracted.</span>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Medication (Generic Name)
                </label>
                <input
                  type="text"
                  required
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Strength
                </label>
                <input
                  type="text"
                  required
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Doctor / Prescriber
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Clinic / Medical Center
                </label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Directions for Use (Sig)
              </label>
              <input
                type="text"
                required
                value={sig}
                onChange={(e) => setSig(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Quantity Prescribed
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Authorized Refills
                </label>
                <input
                  type="number"
                  value={refills}
                  onChange={(e) => setRefills(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-xs text-teal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <p className="text-[11px]">
              Generic substitution will be automatically evaluated under FDA AB-rating guidelines
              to guarantee bioequivalence and maximum cost savings.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs transition-colors"
            >
              Save & Verify Prescription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
