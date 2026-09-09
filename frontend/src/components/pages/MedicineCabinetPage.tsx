import React, { useState } from 'react';
import {
  Pill,
  Search,
  Filter,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Plus,
  Info,
  Calendar,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Medication, Dependent, PageId } from '../../types';

interface MedicineCabinetPageProps {
  medications: Medication[];
  dependents: Dependent[];
  activeDependent: Dependent | null;
  onOpenRefill: (med: Medication) => void;
  onOpenDetail: (med: Medication) => void;
  onOpenAddMed: () => void;
  searchQuery: string;
}

export const MedicineCabinetPage: React.FC<MedicineCabinetPageProps> = ({
  medications,
  dependents,
  activeDependent,
  onOpenRefill,
  onOpenDetail,
  onOpenAddMed,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'prn' | 'low_supply'>('all');
  const [sortBy, setSortBy] = useState<'days' | 'name' | 'refills'>('days');
  const [localSearch, setLocalSearch] = useState('');

  // Combine queries
  const effectiveSearch = (searchQuery || localSearch).toLowerCase();

  // Filter list
  const filtered = medications.filter((med) => {
    // Dependent check
    if (activeDependent && med.dependentId !== activeDependent.id) {
      return false;
    }

    // Tab check
    if (activeTab === 'daily' && med.isAsNeeded) return false;
    if (activeTab === 'prn' && !med.isAsNeeded) return false;
    if (activeTab === 'low_supply' && !med.isLowSupply) return false;

    // Search check
    if (effectiveSearch) {
      const matchName = med.name.toLowerCase().includes(effectiveSearch);
      const matchGeneric = med.genericName.toLowerCase().includes(effectiveSearch);
      const matchBrand = med.brandEquivalent.toLowerCase().includes(effectiveSearch);
      const matchDoctor = med.prescribingDoctor.toLowerCase().includes(effectiveSearch);
      return matchName || matchGeneric || matchBrand || matchDoctor;
    }

    return true;
  });

  // Sort list
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'days') return a.daysSupplyLeft - b.daysSupplyLeft;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'refills') return b.refillsRemaining - a.refillsRemaining;
    return 0;
  });

  const lowSupplyTotal = medications.filter((m) => m.isLowSupply).length;

  return (
    <div id="medicine-cabinet-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              Prescriptions & Cabinet
            </span>
            {lowSupplyTotal > 0 && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                {lowSupplyTotal} Low Supply Alert
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Medicine Cabinet & Supply
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track daily medications, FDA bioequivalent generic ratings, pill counts, and 1-click refills.
          </p>
        </div>

        <button
          id="cabinet-add-med-btn"
          onClick={onOpenAddMed}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Med / Supplement</span>
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            id="tab-all-meds"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Medications ({medications.length})
          </button>
          <button
            id="tab-daily-meds"
            onClick={() => setActiveTab('daily')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'daily'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Daily Scheduled
          </button>
          <button
            id="tab-prn-meds"
            onClick={() => setActiveTab('prn')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'prn'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            As Needed (PRN)
          </button>
          <button
            id="tab-low-supply-meds"
            onClick={() => setActiveTab('low_supply')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'low_supply'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock (&lt; 7 Days)</span>
          </button>
        </div>

        {/* Sort & Search in Cabinet */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter cabinet..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="days">Sort: Days Left</option>
              <option value="name">Sort: Name A-Z</option>
              <option value="refills">Sort: Refills Left</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No medications match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try resetting your filter or searching for another term.
            </p>
          </div>
        ) : (
          sorted.map((med) => {
            const dependent = dependents.find((d) => d.id === med.dependentId);
            const isLow = med.daysSupplyLeft <= 7;
            const isMedium = med.daysSupplyLeft > 7 && med.daysSupplyLeft <= 14;

            return (
              <div
                key={med.id}
                id={`med-card-${med.id}`}
                className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between space-y-4 ${
                  isLow
                    ? 'border-amber-300 ring-1 ring-amber-300/40 shadow-xs'
                    : 'border-slate-200/90 hover:border-teal-400 shadow-2xs'
                }`}
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Visual Pill Indicator */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border border-slate-200 shadow-2xs shrink-0"
                        style={{ backgroundColor: med.color }}
                      >
                        <Pill className="w-5 h-5 text-slate-700" />
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {med.name}
                          </h3>
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 border border-teal-200">
                            {med.bioequivalenceRating}-Rated
                          </span>
                        </div>

                        <p className="text-xs text-teal-800 font-semibold mt-0.5">
                          Generic for <span className="underline decoration-teal-300">{med.brandEquivalent}</span>
                        </p>

                        {dependent && (
                          <span className="text-[10px] font-medium text-slate-500 mt-1 inline-block">
                            For: <strong className="text-slate-700">{dependent.name}</strong> ({dependent.relationship})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Savings pill */}
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block">
                        {med.savingsPercentage}% Cheaper
                      </span>
                      <span className="text-[10px] text-slate-400 line-through block mt-0.5">
                        ${med.priceBrand.toFixed(2)} brand
                      </span>
                    </div>
                  </div>

                  {/* Supply & Pill Count Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-medium">Remaining Supply:</span>
                      <span
                        className={`font-bold ${
                          isLow ? 'text-amber-700' : isMedium ? 'text-amber-600' : 'text-slate-900'
                        }`}
                      >
                        {med.daysSupplyLeft} days left ({med.pillsRemaining} pills)
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isLow ? 'bg-amber-500' : isMedium ? 'bg-amber-400' : 'bg-teal-700'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round((med.daysSupplyLeft / 90) * 100))}%`,
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                      <span>Refills Remaining: {med.refillsRemaining}</span>
                      <span>Rx: {med.rxNumber}</span>
                    </div>
                  </div>

                  {/* Clinical Dosage & Instructions */}
                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                      <span>{med.dosageInstructions}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5">
                      Prescribed by {med.prescribingDoctor} ({med.doctorClinic})
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    id={`view-detail-${med.id}`}
                    onClick={() => onOpenDetail(med)}
                    className="px-3 py-1.5 text-xs font-semibold text-teal-800 hover:text-teal-900 hover:bg-teal-50 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-teal-700" />
                    <span>FDA Monograph</span>
                  </button>

                  <button
                    id={`refill-btn-${med.id}`}
                    onClick={() => onOpenRefill(med)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs ${
                      isLow
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refill (${med.priceGeneric.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
