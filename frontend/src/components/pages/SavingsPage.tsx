import React, { useState } from 'react';
import {
  TrendingDown,
  DollarSign,
  Sparkles,
  ShieldCheck,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  PieChart,
  Percent,
  Award,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { DRUG_COMPARISONS } from '../../data/mockData';
import { PageId } from '../../types';

interface SavingsPageProps {
  onNavigate: (page: PageId) => void;
  onOpenUploadRx: () => void;
}

export const SavingsPage: React.FC<SavingsPageProps> = ({ onNavigate, onOpenUploadRx }) => {
  const [supplyPeriod, setSupplyPeriod] = useState<'30' | '90'>('90');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Cardiovascular / Cholesterol',
    'Cardiovascular / Blood Pressure',
    'Endocrine / Diabetes',
    'Mental Health / Neurology',
    'Respiratory / Allergy',
    'Gastroenterology',
  ];

  const filteredComparisons = DRUG_COMPARISONS.filter((item) => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.genericName.toLowerCase().includes(q) ||
        item.brandName.toLowerCase().includes(q) ||
        item.condition.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="savings-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              Value & Cost Transparency
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Gold Tier Smart Saver
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
            Generic Savings & Drug Price Comparator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real prices, zero hidden pharmacy markups, and verified FDA AB-rated therapeutic equivalence.
          </p>
        </div>

        <button
          onClick={onOpenUploadRx}
          className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Switch Your Brand Rx to Generic</span>
        </button>
      </div>

      {/* Savings Summary Hero Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-teal-800 text-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">
              Total Saved to Date
            </span>
            <DollarSign className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="text-3xl font-black text-white">$1,428.50</div>
          <p className="text-[11px] text-teal-100/90 pt-1">
            Across 18 generic refills vs retail brand pharmacy cash prices.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Discount
            </span>
            <Percent className="w-5 h-5 text-teal-700" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">84% Off</div>
          <p className="text-[11px] text-slate-500 pt-1">
            Patients save an average of $118 per 90-day maintenance prescription.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Projected Annual Savings
            </span>
            <TrendingDown className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">$2,150.00</div>
          <p className="text-[11px] text-slate-500 pt-1">
            Estimated annual savings for Eleanor, Arthur, and Leo combined.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Saver Tier
            </span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-xl font-black text-slate-900">Gold Status</div>
          <p className="text-[11px] text-emerald-700 font-semibold pt-1">
            Free priority cold-chain shipping & 24/7 pharmacist on duty.
          </p>
        </div>
      </div>

      {/* Category Savings Breakdown Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Household Savings by Therapeutic Class</h3>
            <p className="text-xs text-slate-500">Distribution of savings across your family's care plans</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
            $1,428.50 Total Household Benefit
          </span>
        </div>

        {/* Multi-segment visual bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
          <div
            className="bg-teal-700 h-full"
            style={{ width: '52%' }}
            title="Cardiovascular: $740 (52%)"
          />
          <div
            className="bg-emerald-600 h-full"
            style={{ width: '27%' }}
            title="Endocrine / Diabetes: $380 (27%)"
          />
          <div
            className="bg-sky-600 h-full"
            style={{ width: '13%' }}
            title="Mental Health: $188 (13%)"
          />
          <div
            className="bg-amber-500 h-full"
            style={{ width: '8%' }}
            title="Respiratory: $120 (8%)"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-teal-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Cardiovascular</span>
              <span className="text-[11px] text-slate-500 block">$740 (52%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Diabetes / Metabolic</span>
              <span className="text-[11px] text-slate-500 block">$380 (27%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-sky-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Mental Health</span>
              <span className="text-[11px] text-slate-500 block">$188 (13%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Respiratory / Allergy</span>
              <span className="text-[11px] text-slate-500 block">$120 (8%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Brand vs Generic Price Comparator Tool */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold text-slate-900">
                Interactive Brand vs. Generic Price Comparator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare retail brand pricing against GenericMed certified generic formulations.
            </p>
          </div>

          {/* Supply Duration Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setSupplyPeriod('30')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                supplyPeriod === '30'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30-Day Supply
            </button>
            <button
              onClick={() => setSupplyPeriod('90')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                supplyPeriod === '90'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>90-Day Bulk Supply</span>
              <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded bg-amber-400 text-slate-950">
                Max Savings
              </span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search drug (e.g. Lipitor, Metformin, Crestor)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-700 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Drug Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComparisons.map((drug, idx) => {
            const is90 = supplyPeriod === '90';
            const genericPrice = is90 ? drug.genericPrice90Day : drug.genericPrice30Day;
            const brandPrice = is90 ? drug.brandPrice90Day : drug.brandPrice30Day;
            const savedAmount = brandPrice - genericPrice;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-teal-400 hover:shadow-2xs transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                        {drug.condition}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {drug.genericName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Brand Equivalent:{' '}
                        <strong className="text-slate-800 font-semibold">{drug.brandName}</strong>
                      </p>
                    </div>

                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      {drug.savingsPercentage}% Off
                    </span>
                  </div>

                  {/* Price Comparison Block */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-500">GenericMed Cash Price:</span>
                      <span className="text-base font-black text-teal-800">
                        ${genericPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-[11px] text-slate-500">
                      <span>Retail Brand Price:</span>
                      <span className="line-through text-slate-400">
                        ${brandPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-200 flex justify-between items-baseline font-bold text-emerald-700 text-xs">
                      <span>You Save:</span>
                      <span>${savedAmount.toFixed(2)} / {supplyPeriod} days</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span>{drug.fdaBioequivalence}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Dose: {drug.commonDose}</span>
                  <button
                    onClick={() => onNavigate('cabinet')}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    <span>View in Cabinet</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
