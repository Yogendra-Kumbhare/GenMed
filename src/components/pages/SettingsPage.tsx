import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  ShieldCheck,
  FileDown,
  CheckCircle2,
  Save,
  Plus,
  X,
  Trash2,
  Lock,
  LogOut,
  Stethoscope,
  Heart,
  Calendar,
} from 'lucide-react';
import { UserProfile, UserSettings } from '../../types';

interface DeliveryAddress {
  id: string;
  label: string;
  recipientName: string;
  street: string;
  cityStateZip: string;
  notes?: string;
  isDefault: boolean;
}

interface PaymentAccount {
  id: string;
  type: 'HSA / FSA Pre-Tax' | 'Credit Card' | 'Debit Card';
  title: string;
  last4: string;
  expiry: string;
  isPrimary: boolean;
  notes?: string;
}

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
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [dob, setDob] = useState(user.dob);
  const [role, setRole] = useState(user.role);
  const [allergies, setAllergies] = useState(user.allergies);
  const [primaryCondition, setPrimaryCondition] = useState(user.primaryCondition || 'Cardiovascular & Metabolic Care');
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact);
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone);
  const [primaryDoctor, setPrimaryDoctor] = useState(user.primaryDoctor || 'Dr. Sarah Chen, MD');
  const [doctorPhone, setDoctorPhone] = useState(user.doctorPhone || '(512) 555-0143');
  const [insuranceOrHsaProvider, setInsuranceOrHsaProvider] = useState(user.insuranceOrHsaProvider || 'Optum Bank HSA');

  // Pharmacy Toggles
  const [autoRefill, setAutoRefill] = useState(settings.autoRefill);
  const [bulkSupplyDefault, setBulkSupplyDefault] = useState(settings.bulkSupplyDefault);
  const [genericSubstitution, setGenericSubstitution] = useState(settings.genericSubstitution);
  const [childCaps, setChildCaps] = useState(settings.childCaps);

  // Notification Toggles
  const [smsDoseReminders, setSmsDoseReminders] = useState(settings.smsDoseReminders);
  const [caregiverEscalation, setCaregiverEscalation] = useState(settings.caregiverEscalation);
  const [deliverySms, setDeliverySms] = useState(settings.deliverySms);
  const [emailStatements, setEmailStatements] = useState(settings.emailStatements);
  const [twoFactorAuth, setTwoFactorAuth] = useState(settings.twoFactorAuth);

  // Sync state if user prop changes
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

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Delivery Addresses State
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([
    {
      id: 'addr-1',
      label: 'Default Home',
      recipientName: 'Eleanor Vance (Residence)',
      street: '4218 Shady Hollow Dr',
      cityStateZip: 'Austin, TX 78739',
      notes: 'Gate code on file • Ring doorbell',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Arthur (Father)',
      recipientName: 'Arthur Vance (Oak Crest Residence)',
      street: '2804 Oak Crest Terrace',
      cityStateZip: 'Austin, TX 78704',
      notes: 'Senior Assisted Living Suite #204',
      isDefault: false,
    },
  ]);

  // Payment Methods State
  const [payments, setPayments] = useState<PaymentAccount[]>([
    {
      id: 'pay-1',
      type: 'HSA / FSA Pre-Tax',
      title: 'Optum Bank Health Savings Card',
      last4: '4109',
      expiry: '08/29',
      isPrimary: true,
      notes: 'Zero sales tax on all generic prescriptions',
    },
    {
      id: 'pay-2',
      type: 'Credit Card',
      title: 'Chase Sapphire Visa (Backup)',
      last4: '8831',
      expiry: '11/28',
      isPrimary: false,
    },
  ]);

  // Modal States
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Form states for new address
  const [addrLabel, setAddrLabel] = useState('Work Office');
  const [addrRecipient, setAddrRecipient] = useState('Eleanor Vance');
  const [addrStreet, setAddrStreet] = useState('100 Congress Ave, Suite 1200');
  const [addrCity, setAddrCity] = useState('Austin');
  const [addrState, setAddrState] = useState('TX');
  const [addrZip, setAddrZip] = useState('78701');
  const [addrNotes, setAddrNotes] = useState('Front desk security acceptance');
  const [addrDefault, setAddrDefault] = useState(false);

  // Form states for new payment
  const [payType, setPayType] = useState<'HSA / FSA Pre-Tax' | 'Credit Card' | 'Debit Card'>('HSA / FSA Pre-Tax');
  const [payTitle, setPayTitle] = useState('Fidelity Health HSA Debit');
  const [payCardNumber, setPayCardNumber] = useState('4712 9012 3844 7192');
  const [payExpiry, setPayExpiry] = useState('06/30');
  const [payPrimary, setPayPrimary] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: UserProfile = {
      ...user,
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
    };
    onUpdateProfile(updatedUser);

    const updatedSettings: UserSettings = {
      autoRefill,
      bulkSupplyDefault,
      genericSubstitution,
      childCaps,
      smsDoseReminders,
      caregiverEscalation,
      deliverySms,
      emailStatements,
      twoFactorAuth,
    };
    onUpdateSettings(updatedSettings);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: addrLabel || 'Secondary Address',
      recipientName: addrRecipient,
      street: addrStreet,
      cityStateZip: `${addrCity}, ${addrState} ${addrZip}`,
      notes: addrNotes,
      isDefault: addrDefault,
    };

    if (addrDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }

    setShowAddAddressModal(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDeleteAddress = (id: string) => {
    if (addresses.length <= 1) return;
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = payCardNumber.replace(/\s+/g, '');
    const last4 = cleanNum.slice(-4) || '9912';

    const newPay: PaymentAccount = {
      id: `pay-${Date.now()}`,
      type: payType,
      title: payTitle,
      last4: last4,
      expiry: payExpiry,
      isPrimary: payPrimary,
      notes: payType === 'HSA / FSA Pre-Tax' ? 'Pre-tax medical savings card' : undefined,
    };

    if (payPrimary) {
      setPayments((prev) => prev.map((p) => ({ ...p, isPrimary: false })).concat(newPay));
    } else {
      setPayments((prev) => [...prev, newPay]);
    }

    setShowAddPaymentModal(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSetPrimaryPayment = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => ({
        ...p,
        isPrimary: p.id === id,
      }))
    );
  };

  const handleDeletePayment = (id: string) => {
    if (payments.length <= 1) return;
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const handleExportData = () => {
    const exportRecord = {
      portal: 'GenericMed Patient & Caregiver Web Portal',
      exportDate: new Date().toISOString(),
      patient: {
        legalName: name,
        email: email,
        phone: phone,
        allergies: allergies,
      },
      dispensingRules: {
        autoRefill,
        bulkSupplyDefault,
        genericSubstitution,
        childCaps,
      },
      registeredDeliveryAddresses: addresses,
      linkedPaymentAccounts: payments.map((p) => ({
        title: p.title,
        type: p.type,
        last4: p.last4,
        isPrimary: p.isPrimary,
      })),
      compliance: {
        hipaaEncrypted: true,
        securityStandard: 'AES-256 GCM',
        ncpdpVerified: true,
        texasPharmacyBoardLicense: 'PHY-89102',
      },
    };

    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportRecord, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `GenericMed-HIPAA-Records-${name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice(
      'Medical & prescription history exported as encrypted JSON document (HIPAA 256-bit compliant).'
    );
    setTimeout(() => setExportNotice(null), 5000);
  };

  return (
    <div id="settings-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              Account & Clinical Preferences
            </span>
            <span className="text-xs font-semibold text-slate-500">HIPAA Secure Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Portal Settings & Pharmacy Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure delivery addresses, HSA/FSA payment accounts, auto-refill policies, and caregiver permissions.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preferences Saved Successfully</span>
          </div>
        )}
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-teal-700 hover:text-teal-900 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal & Medical Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Primary Patient Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                id="settings-patient-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
              <input
                id="settings-patient-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Mobile Phone</label>
              <input
                id="settings-patient-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Date of Birth</label>
              <input
                id="settings-patient-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Role</label>
              <select
                id="settings-patient-role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as 'Patient' | 'Family Caregiver' | 'Healthcare Proxy')
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              >
                <option value="Patient">Patient (Self-Managed)</option>
                <option value="Family Caregiver">Family Caregiver (Dependents)</option>
                <option value="Healthcare Proxy">Healthcare Proxy / Guardian</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Rx Member ID</label>
              <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg font-mono font-bold text-slate-700">
                {user.memberId} (RxBIN {user.rxBin})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Documented Drug Allergies</label>
              <input
                id="settings-patient-allergies"
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3 py-2 bg-amber-50/60 border border-amber-200 rounded-lg text-amber-900 focus:border-teal-700 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Health Focus / Condition</label>
              <input
                id="settings-patient-condition"
                type="text"
                value={primaryCondition}
                onChange={(e) => setPrimaryCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Contact</label>
              <input
                id="settings-emergency-contact"
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Contact Phone</label>
              <input
                id="settings-emergency-phone"
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Prescribing Physician</label>
              <input
                id="settings-primary-doctor"
                type="text"
                value={primaryDoctor}
                onChange={(e) => setPrimaryDoctor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">HSA / Insurance Provider</label>
              <input
                id="settings-insurance-provider"
                type="text"
                value={insuranceOrHsaProvider}
                onChange={(e) => setInsuranceOrHsaProvider(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Addresses */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">Registered Delivery Addresses</h2>
            </div>
            <button
              type="button"
              id="add-address-btn"
              onClick={() => setShowAddAddressModal(true)}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-xl relative transition-all ${
                  addr.isDefault
                    ? 'border-2 border-teal-700 bg-teal-50/30'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      addr.isDefault
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {addr.label} {addr.isDefault && '• Default'}
                  </span>
                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[11px] text-teal-700 hover:underline font-semibold"
                      >
                        Set Default
                      </button>
                    )}
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="font-bold text-slate-900 mt-2">{addr.recipientName}</p>
                <p className="text-slate-600">{addr.street}</p>
                <p className="text-slate-600">{addr.cityStateZip}</p>
                {addr.notes && (
                  <span className="text-[11px] text-teal-800 font-semibold block pt-1">
                    {addr.notes}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods & Pre-Tax HSA/FSA */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-teal-700" />
              <h2 className="text-sm font-bold text-slate-900">Payment & HSA / FSA Accounts</h2>
            </div>
            <button
              type="button"
              id="link-card-btn"
              onClick={() => setShowAddPaymentModal(true)}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Link New Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {payments.map((card) => (
              <div
                key={card.id}
                className={`p-4 rounded-xl relative transition-all ${
                  card.isPrimary
                    ? 'border-2 border-teal-700 bg-teal-50/30'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      card.type === 'HSA / FSA Pre-Tax'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {card.type} {card.isPrimary && '• Primary'}
                  </span>
                  <div className="flex items-center gap-2">
                    {!card.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryPayment(card.id)}
                        className="text-[11px] text-teal-700 hover:underline font-semibold"
                      >
                        Make Primary
                      </button>
                    )}
                    {payments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePayment(card.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove payment method"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="font-bold text-slate-900 mt-2">{card.title}</p>
                <p className="text-slate-600 font-mono">•••• •••• •••• {card.last4}</p>
                <p className="text-slate-500 text-[11px]">Expires {card.expiry}</p>
                {card.notes && (
                  <p className="text-[11px] text-emerald-700 font-semibold pt-1">{card.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacy Refill & Generic Substitution Policies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Pharmacy & Dispensing Rules</h2>
          </div>

          <div className="space-y-4 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-bold text-slate-900 block">
                  Automatic Low-Supply Refill Trigger
                </span>
                <span className="text-slate-500 text-[11px]">
                  Automatically queue a 90-day refill when 7 days of supply remain.
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoRefill}
                onChange={(e) => setAutoRefill(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-bold text-slate-900 block">
                  90-Day Bulk Supply Priority
                </span>
                <span className="text-slate-500 text-[11px]">
                  Default to 90-day fills for maintenance medications to maximize generic savings.
                </span>
              </div>
              <input
                type="checkbox"
                checked={bulkSupplyDefault}
                onChange={(e) => setBulkSupplyDefault(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-bold text-slate-900 block">
                  Always Substitute FDA AB-Rated Generic
                </span>
                <span className="text-slate-500 text-[11px]">
                  Ensure pharmacist dispenses equivalent generic without unnecessary brand markups.
                </span>
              </div>
              <input
                type="checkbox"
                checked={genericSubstitution}
                onChange={(e) => setGenericSubstitution(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-bold text-slate-900 block">Child-Resistant Packaging</span>
                <span className="text-slate-500 text-[11px]">
                  Safety caps fitted on all bottles dispatched from central facility.
                </span>
              </div>
              <input
                type="checkbox"
                checked={childCaps}
                onChange={(e) => setChildCaps(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Notifications & Caregiver Escalation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Bell className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Communication & Alert Preferences</h2>
          </div>

          <div className="space-y-4 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-bold text-slate-900 block">SMS Dose Time Reminders</span>
                <span className="text-slate-500 text-[11px]">
                  Receive an automated text when a scheduled dose is due.
                </span>
              </div>
              <input
                type="checkbox"
                checked={smsDoseReminders}
                onChange={(e) => setSmsDoseReminders(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-bold text-slate-900 block">Caregiver Escalation Ping</span>
                <span className="text-slate-500 text-[11px]">
                  Alert Eleanor if Arthur or Leo misses a maintenance dose by 2 hours.
                </span>
              </div>
              <input
                type="checkbox"
                checked={caregiverEscalation}
                onChange={(e) => setCaregiverEscalation(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="font-bold text-slate-900 block">Live Courier GPS Alerts</span>
                <span className="text-slate-500 text-[11px]">
                  Real-time SMS updates when courier van is within 30 minutes of drop-off.
                </span>
              </div>
              <input
                type="checkbox"
                checked={deliverySms}
                onChange={(e) => setDeliverySms(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Data Export & Privacy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <FileDown className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Data & Compliance Export</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-slate-900">Download Complete Medication & Refill History</p>
              <p className="text-slate-500 text-[11px]">
                Export all prescription records, batch numbers, and NPI identifiers in certified PDF or JSON.
              </p>
            </div>
            <button
              type="button"
              id="export-records-btn"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors shrink-0 flex items-center gap-2"
            >
              <FileDown className="w-4 h-4 text-teal-700" />
              <span>Export Records (JSON/PDF)</span>
            </button>
          </div>
        </div>

        {/* Account Security & Sign Out */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Lock className="w-5 h-5 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">Account Security & Access</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                <span className="text-slate-500 text-[11px]">
                  Require an SMS verification code when accessing your prescription portal on new devices.
                </span>
              </div>
              <input
                id="settings-2fa-toggle"
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="font-bold text-slate-900 block">Active Portal Session</span>
                <span className="text-slate-500 text-[11px]">
                  Logged in as {user.name} ({user.email}) • Session encrypted via TLS 1.3 AES-256
                </span>
              </div>
              <button
                type="button"
                id="settings-logout-btn"
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end gap-3 items-center">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Changes saved to account!
            </span>
          )}
          <button
            type="submit"
            id="save-settings-btn"
            className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Preferences</span>
          </button>
        </div>
      </form>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Add New Delivery Address</h3>
              </div>
              <button
                onClick={() => setShowAddAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Address Label</label>
                <input
                  type="text"
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  placeholder="e.g. Work Office, Vacation Home"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={addrRecipient}
                  onChange={(e) => setAddrRecipient(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={addrZip}
                    onChange={(e) => setAddrZip(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Delivery Notes / Gate Code
                </label>
                <input
                  type="text"
                  value={addrNotes}
                  onChange={(e) => setAddrNotes(e.target.value)}
                  placeholder="Gate code, door ring instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addrDefault}
                  onChange={(e) => setAddrDefault(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span className="text-slate-700 font-semibold">Set as primary delivery address</span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Payment Card Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">Link Pre-Tax HSA / Credit Card</h3>
              </div>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Account Type</label>
                <select
                  value={payType}
                  onChange={(e) =>
                    setPayType(e.target.value as 'HSA / FSA Pre-Tax' | 'Credit Card' | 'Debit Card')
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                >
                  <option value="HSA / FSA Pre-Tax">HSA / FSA Pre-Tax Healthcare Card (Tax-Free)</option>
                  <option value="Credit Card">Visa / Mastercard / Amex Credit Card</option>
                  <option value="Debit Card">Personal Checking Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Nickname / Bank</label>
                <input
                  type="text"
                  value={payTitle}
                  onChange={(e) => setPayTitle(e.target.value)}
                  placeholder="e.g. Fidelity HSA, Chase Freedom"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={payCardNumber}
                  onChange={(e) => setPayCardNumber(e.target.value)}
                  placeholder="•••• •••• •••• ••••"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:border-teal-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={payExpiry}
                    onChange={(e) => setPayExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:border-teal-700 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">CVC Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    defaultValue="821"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:border-teal-700 focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={payPrimary}
                  onChange={(e) => setPayPrimary(e.target.checked)}
                  className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span className="text-slate-700 font-semibold">Make primary payment for automatic refills</span>
              </label>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold shadow-xs"
                >
                  Link Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
