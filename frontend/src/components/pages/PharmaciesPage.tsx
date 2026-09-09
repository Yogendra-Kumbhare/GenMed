import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Building2,
  Phone,
  Clock,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Percent,
  Sparkles,
  ShieldCheck,
  Navigation,
  FileText,
  Send,
  HelpCircle,
} from 'lucide-react';
import { PageId } from '../../types';

interface Pharmacy {
  id: string;
  name: string;
  chain: 'GenericMed Partner' | 'CVS Pharmacy' | 'Walgreens' | 'Walmart Pharmacy' | 'H-E-B Pharmacy';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  distanceMiles: number;
  isOpen24Hours: boolean;
  hoursToday: string;
  driveThruAvailable: boolean;
  genericDiscountSavingsRate: number; // e.g. 85 = 85% cheaper via GenericMed network
  inNetwork: boolean;
  rating: number;
  reviewsCount: number;
  latitude: number;
  longitude: number;
}

const SAMPLE_PHARMACIES: Pharmacy[] = [
  {
    id: 'ph-gm-austin',
    name: 'GenericMed Central Fulfillment Pharmacy #101',
    chain: 'GenericMed Partner',
    address: '9200 Innovation Blvd, Suite 100',
    city: 'Austin',
    state: 'TX',
    zip: '78758',
    phone: '(800) 436-6337',
    distanceMiles: 1.2,
    isOpen24Hours: true,
    hoursToday: 'Open 24 Hours (Free Express Delivery)',
    driveThruAvailable: true,
    genericDiscountSavingsRate: 85,
    inNetwork: true,
    rating: 4.9,
    reviewsCount: 342,
    latitude: 30.3842,
    longitude: -97.7124,
  },
  {
    id: 'ph-heb-slaughter',
    name: 'H-E-B Pharmacy #482',
    chain: 'H-E-B Pharmacy',
    address: '8801 S Congress Ave',
    city: 'Austin',
    state: 'TX',
    zip: '78748',
    phone: '(512) 555-0188',
    distanceMiles: 2.8,
    isOpen24Hours: false,
    hoursToday: '8:00 AM – 9:00 PM',
    driveThruAvailable: true,
    genericDiscountSavingsRate: 65,
    inNetwork: true,
    rating: 4.7,
    reviewsCount: 189,
    latitude: 30.1742,
    longitude: -97.7812,
  },
  {
    id: 'ph-walgreens-barton',
    name: 'Walgreens Pharmacy #1104',
    chain: 'Walgreens',
    address: '1920 Barton Springs Rd',
    city: 'Austin',
    state: 'TX',
    zip: '78704',
    phone: '(512) 555-0144',
    distanceMiles: 4.1,
    isOpen24Hours: true,
    hoursToday: 'Open 24 Hours',
    driveThruAvailable: true,
    genericDiscountSavingsRate: 40,
    inNetwork: false,
    rating: 4.2,
    reviewsCount: 210,
    latitude: 30.2612,
    longitude: -97.7681,
  },
  {
    id: 'ph-cvs-lamar',
    name: 'CVS Pharmacy #3819',
    chain: 'CVS Pharmacy',
    address: '2900 N Lamar Blvd',
    city: 'Austin',
    state: 'TX',
    zip: '78705',
    phone: '(512) 555-0192',
    distanceMiles: 5.3,
    isOpen24Hours: false,
    hoursToday: '8:00 AM – 8:00 PM',
    driveThruAvailable: false,
    genericDiscountSavingsRate: 35,
    inNetwork: false,
    rating: 4.0,
    reviewsCount: 154,
    latitude: 30.2981,
    longitude: -97.7491,
  },
];

interface PharmaciesPageProps {
  onNavigate: (page: PageId) => void;
  onOpenUploadRx: () => void;
}

export const PharmaciesPage: React.FC<PharmaciesPageProps> = ({ onNavigate, onOpenUploadRx }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'inNetwork' | 'open24h'>('all');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(SAMPLE_PHARMACIES[0]);

  // Transfer Rx Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFromChain, setTransferFromChain] = useState('CVS Pharmacy');
  const [transferRxNumber, setTransferRxNumber] = useState('');
  const [transferDrugName, setTransferDrugName] = useState('');
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  const filteredPharmacies = SAMPLE_PHARMACIES.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.zip.includes(searchQuery);

    if (!matchesSearch) return false;
    if (filterType === 'inNetwork') return p.inNetwork;
    if (filterType === 'open24h') return p.isOpen24Hours;
    return true;
  });

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRxNumber.trim() || !transferDrugName.trim()) return;
    setTransferSubmitted(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Module 5.1 — Pharmacy Network
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1.5">
            Partner Pharmacy Locator & Prescription Transfer
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Locate 85% discount in-network GenericMed dispensing hubs or transfer existing prescriptions from CVS, Walgreens, or Walmart in 1-click.
          </p>
        </div>

        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="py-3 px-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transfer Existing Rx</span>
        </button>
      </div>

      {/* Main Grid: Search & Pharmacy List + Interactive Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Pharmacy Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pharmacy name, address, or ZIP code (e.g. 78758)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Filter:</span>
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'all'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All (4)
              </button>
              <button
                onClick={() => setFilterType('inNetwork')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'inNetwork'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                GenericMed Partner (85% Off)
              </button>
              <button
                onClick={() => setFilterType('open24h')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === 'open24h'
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                Open 24 Hours
              </button>
            </div>
          </div>

          {/* Pharmacy Cards List */}
          <div className="space-y-3">
            {filteredPharmacies.map((pharmacy) => (
              <div
                key={pharmacy.id}
                onClick={() => setSelectedPharmacy(pharmacy)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedPharmacy.id === pharmacy.id
                    ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-500 ring-2 ring-teal-500/20 shadow-md'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{pharmacy.name}</h3>
                      {pharmacy.inNetwork && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                          <Percent className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          Save {pharmacy.genericDiscountSavingsRate}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>
                        {pharmacy.address}, {pharmacy.city}, {pharmacy.state} {pharmacy.zip} ({pharmacy.distanceMiles} miles away)
                      </span>
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                    {pharmacy.distanceMiles} mi
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {pharmacy.hoursToday}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {pharmacy.phone}
                    </span>
                  </div>

                  <span className="font-bold text-teal-700 dark:text-teal-400 hover:underline">
                    View Map & Direct Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Pharmacy Detail & Transfer Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/50 px-2.5 py-1 rounded-lg border border-teal-200 dark:border-teal-800">
                Selected Pharmacy Details
              </span>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ★ {selectedPharmacy.rating} ({selectedPharmacy.reviewsCount} reviews)
              </span>
            </div>

            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-slate-100">{selectedPharmacy.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedPharmacy.address}, {selectedPharmacy.city}, {selectedPharmacy.state} {selectedPharmacy.zip}
              </p>
            </div>

            {/* Map Preview Box */}
            <div className="relative h-44 rounded-2xl bg-teal-950 overflow-hidden border border-teal-800 flex items-center justify-center p-4 text-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 opacity-90" />
              <div className="relative z-10 space-y-2">
                <Navigation className="w-8 h-8 text-teal-400 mx-auto animate-bounce" />
                <p className="text-xs font-bold text-white">Interactive Map Location</p>
                <p className="text-[11px] text-teal-200/70">
                  Lat: {selectedPharmacy.latitude} • Lng: {selectedPharmacy.longitude}
                </p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${selectedPharmacy.name} ${selectedPharmacy.address} ${selectedPharmacy.city} ${selectedPharmacy.state}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* In-Network Discount Highlight */}
            {selectedPharmacy.inNetwork ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Verified GenericMed Tier-1 Dispensing Hub</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                  Prescriptions filled at this location receive max 85% generic discount pricing + HSA/FSA pre-tax auto-billing.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Out-of-Network Retail Pharmacy</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  Retail prices apply here. Transfer your prescription to GenericMed to instantly save up to 85%.
                </p>
              </div>
            )}

            {/* Quick Action Button */}
            <button
              onClick={() => {
                setTransferFromChain(selectedPharmacy.chain);
                setIsTransferModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer Prescription from {selectedPharmacy.chain}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Prescription Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-teal-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  Transfer Prescription to GenericMed
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsTransferModalOpen(false);
                  setTransferSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {transferSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  Transfer Request Submitted!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  Our licensed pharmacist is contacting <strong>{transferFromChain}</strong> to pull Rx #{transferRxNumber || 'GM-9981'}.
                  You will receive an SMS confirmation once verified.
                </p>
                <button
                  onClick={() => {
                    setIsTransferModalOpen(false);
                    setTransferSubmitted(false);
                  }}
                  className="mt-2 py-2.5 px-6 rounded-xl bg-teal-700 text-white text-xs font-bold"
                >
                  Close & View Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Pharmacy Chain *
                  </label>
                  <select
                    value={transferFromChain}
                    onChange={(e) => setTransferFromChain(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                  >
                    <option value="CVS Pharmacy">CVS Pharmacy</option>
                    <option value="Walgreens">Walgreens</option>
                    <option value="Walmart Pharmacy">Walmart Pharmacy</option>
                    <option value="H-E-B Pharmacy">H-E-B Pharmacy</option>
                    <option value="Other Retail Pharmacy">Other Retail Pharmacy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={transferDrugName}
                    onChange={(e) => setTransferDrugName(e.target.value)}
                    placeholder="e.g. Atorvastatin 20mg or Lipitor"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current Rx Number (on prescription bottle label) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transferRxNumber}
                    onChange={(e) => setTransferRxNumber(e.target.value)}
                    placeholder="e.g. RX-849201"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300">
                  🔒 HIPAA Compliant — GenericMed pharmacists handle all communication with your old pharmacy directly. No doctor visit required for active refills.
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-teal-700 text-white font-bold shadow-md shadow-teal-700/20"
                  >
                    Submit 1-Click Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
