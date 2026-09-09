import React from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Truck,
  TrendingDown,
  ShieldCheck,
  Plus,
  ArrowRight,
  Sparkles,
  Heart,
  Calendar,
  ChevronRight,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import {
  Dependent,
  Medication,
  TodayDose,
  Order,
  PageId,
} from '../../types';

interface DashboardPageProps {
  activeDependent: Dependent | null;
  dependents: Dependent[];
  todayDoses: TodayDose[];
  medications: Medication[];
  orders: Order[];
  onToggleDoseStatus: (id: string, newStatus: 'taken' | 'skipped' | 'pending') => void;
  onNavigate: (page: PageId) => void;
  onOpenRefill: (med: Medication) => void;
  onOpenUploadRx: () => void;
  onOpenAddMed: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeDependent,
  dependents,
  todayDoses,
  medications,
  orders,
  onToggleDoseStatus,
  onNavigate,
  onOpenRefill,
  onOpenUploadRx,
  onOpenAddMed,
}) => {
  const todayLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  // Filter doses and meds based on activeDependent
  const filteredDoses = activeDependent
    ? todayDoses.filter((d) => d.dependentId === activeDependent.id)
    : todayDoses;

  const filteredMeds = activeDependent
    ? medications.filter((m) => m.dependentId === activeDependent.id)
    : medications;

  const lowSupplyMeds = filteredMeds.filter((m) => m.isLowSupply);
  const lowSupplyDate = lowSupplyMeds[0]
    ? new Date(Date.now() + lowSupplyMeds[0].daysSupplyLeft * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Active delivery
  const activeOrder = orders.find((o) => o.status === 'Out for Delivery') || orders[0];
  const linkedNames = dependents.filter((dependent) => dependent.relationship !== 'Self').map((dependent) => dependent.name.split(' ')[0]);

  // Dose stats
  const totalDoses = filteredDoses.length;
  const takenDoses = filteredDoses.filter((d) => d.status === 'taken').length;
  const doseCompletionPercent = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  return (
    <div id="dashboard-page" className="space-y-6 pb-12">
      {/* Top Welcome & Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              {activeDependent ? `${activeDependent.relationship} Profile` : 'Caregiver Overview'}
            </span>
            <span className="text-xs text-slate-500">{todayLabel}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            {activeDependent
              ? activeDependent.relationship === 'Self'
                ? `Good morning, ${activeDependent.name}`
                : `Caregiver Hub: ${activeDependent.name}`
              : 'Family Care & Medication Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {activeDependent
              ? `You have ${filteredDoses.length} scheduled doses today. All generic prescriptions are backed by FDA AB-ratings.`
              : `Unified view across ${linkedNames.length ? linkedNames.join(', ') : 'your linked family members'}. Caregiver synchronization active.`}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="dash-upload-rx-btn"
            onClick={onOpenUploadRx}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>Upload Rx</span>
          </button>
          <button
            id="dash-add-med-btn"
            onClick={onOpenAddMed}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Add Med / OTC</span>
          </button>
        </div>
      </div>

      {/* Urgent Refill Alerts Banner */}
      {lowSupplyMeds.length > 0 && (
        <div
          id="urgent-refill-banner"
          className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                  Refill Alert: {lowSupplyMeds[0].name}
                </h3>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                  {lowSupplyMeds[0].daysSupplyLeft} Days Left
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Supply runs out on{' '}
                <span className="font-semibold">{lowSupplyDate}</span>.
                Bioequivalent generic refill available with free next-day cold-chain shipping.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              id="urgent-refill-now-btn"
              onClick={() => onOpenRefill(lowSupplyMeds[0])}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Request 90-Day Refill (${lowSupplyMeds[0].priceGeneric.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}

      {/* Key Metrics Grid (4 items) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Prescriptions */}
        <div
          onClick={() => onNavigate('prescriptions')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Prescriptions</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {filteredMeds.length}
            </span>
            <span className="text-xs text-teal-700 font-semibold">All AB-Rated</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 group-hover:text-teal-700 font-medium">
            <span>Manage prescriptions</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Metric 2: Next Delivery */}
        <div
          onClick={() => onNavigate('orders')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Next Delivery</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              {activeOrder?.estimatedDelivery ?? 'No deliveries scheduled'}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${activeOrder ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
              {activeOrder?.status ?? 'All caught up'}
            </span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 group-hover:text-teal-700 font-medium">
            <span>Track vehicle live</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Metric 3: Total Generic Savings */}
        <div
          onClick={() => onNavigate('savings')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Generic Savings</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-teal-800">
              $1,428
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              84% Saved
            </span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 group-hover:text-teal-700 font-medium">
            <span>Brand price comparisons</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>

        {/* Metric 4: Adherence Score */}
        <div
          onClick={() => onNavigate('dependents')}
          className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-500 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Adherence Streak</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeDependent ? `${activeDependent.adherenceRate}%` : '92%'}
            </span>
            <span className="text-xs text-slate-500 font-medium">30-day streak</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 group-hover:text-teal-700 font-medium">
            <span>View caregiver adherence logs</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Main Row: Today's Schedule & Live Delivery Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule Timeline (2 Cols on desktop) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-700" />
                <h2 className="text-base font-bold text-slate-900">Today's Dose Schedule</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mark each dose as taken or skip with reason
              </p>
            </div>

            {/* Progress gauge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900">
                  {takenDoses} of {totalDoses} doses
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {doseCompletionPercent}% taken
                </span>
              </div>
              <div className="w-24 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-teal-700 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${doseCompletionPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Doses List */}
          <div className="space-y-3">
            {filteredDoses.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No doses scheduled for this profile today.
              </div>
            ) : (
              filteredDoses.map((dose) => {
                const isTaken = dose.status === 'taken';
                const isSkipped = dose.status === 'skipped';

                return (
                  <div
                    key={dose.id}
                    id={`dose-card-${dose.id}`}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isTaken
                        ? 'bg-slate-50/80 border-slate-200 opacity-80'
                        : isSkipped
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-white border-slate-200 hover:border-teal-400 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Pill Shape Visual */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 shrink-0 shadow-2xs"
                        style={{ backgroundColor: dose.pillColor }}
                      >
                        <Pill className="w-5 h-5 text-slate-700" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs sm:text-sm font-bold ${
                              isTaken ? 'line-through text-slate-500' : 'text-slate-900'
                            }`}
                          >
                            {dose.medicationName}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {dose.timeSlot}
                          </span>
                        </div>

                        <p className="text-[11px] text-teal-800 font-medium mt-0.5">
                          Generic for <span className="font-semibold">{dose.brandEquivalent}</span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1">{dose.instructions}</p>

                        {isTaken && dose.takenAt && (
                          <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Logged as taken at {dose.takenAt}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {isTaken ? (
                        <button
                          id={`undo-dose-${dose.id}`}
                          onClick={() => onToggleDoseStatus(dose.id, 'pending')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1"
                          title="Undo taken status"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Undo</span>
                        </button>
                      ) : isSkipped ? (
                        <button
                          id={`undo-skip-dose-${dose.id}`}
                          onClick={() => onToggleDoseStatus(dose.id, 'pending')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Unskip</span>
                        </button>
                      ) : (
                        <>
                          <button
                            id={`skip-dose-${dose.id}`}
                            onClick={() => onToggleDoseStatus(dose.id, 'skipped')}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            Skip
                          </button>
                          <button
                            id={`mark-taken-dose-${dose.id}`}
                            onClick={() => onToggleDoseStatus(dose.id, 'taken')}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Taken</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Delivery Spotlight Card (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          {activeOrder ? (
            <>
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Live Delivery Tracker</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Out for Delivery
              </span>
            </div>

            {/* Order Snippet */}
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-800">
                  {activeOrder.orderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Courier:</span>
                <span className="font-semibold text-slate-800">
                  {activeOrder.driverName || 'Marcus Torres (Van #14)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Estimated Arrival:</span>
                <span className="font-bold text-teal-700">
                  {activeOrder.estimatedDelivery}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-teal-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Cold-Chain Verified
                </span>
                <span className="text-slate-500 font-mono">Temp: 4.8°C</span>
              </div>
            </div>

            {/* Itemized preview */}
            <div className="mt-4 space-y-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Package Contents
              </span>
              {activeOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between text-slate-700">
                  <span className="truncate pr-2">{item.medicationName}</span>
                  <span className="font-semibold shrink-0 text-slate-900">
                    ${item.priceGeneric.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            id="dash-track-live-order-btn"
            onClick={() => onNavigate('orders')}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Real-Time Delivery Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
            </>
          ) : (
            <div className="py-12 text-center">
              <Truck className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 mt-3">No active deliveries</h3>
              <p className="text-xs text-slate-500 mt-1">New refill orders will appear here when they are on the way.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
