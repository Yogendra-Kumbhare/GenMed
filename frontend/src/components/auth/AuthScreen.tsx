import React, { useState } from 'react';
import {
  Pill,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Heart,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Building,
  CreditCard,
} from 'lucide-react';
import { UserProfile, UserSettings } from '../../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  demoUser: UserProfile;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, demoUser }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('eleanor.vance@example.com');
  const [loginPassword, setLoginPassword] = useState('patient123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regRole, setRegRole] = useState<'Patient' | 'Family Caregiver' | 'Healthcare Proxy'>('Patient');
  const [regStreet, setRegStreet] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('TX');
  const [regZip, setRegZip] = useState('');
  const [regAllergies, setRegAllergies] = useState('None');
  const [regPrimaryCondition, setRegPrimaryCondition] = useState('');
  const [regEmergencyContact, setRegEmergencyContact] = useState('');
  const [regEmergencyPhone, setRegEmergencyPhone] = useState('');
  const [regPrimaryDoctor, setRegPrimaryDoctor] = useState('');
  const [regInsuranceProvider, setRegInsuranceProvider] = useState('HSA / FSA Pre-Tax Eligible');
  const [regConsentHipaa, setRegConsentHipaa] = useState(true);
  const [regGenericOptIn, setRegGenericOptIn] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

  // Quick fill sample data for fast testing of registration
  const handlePrefillRegistration = () => {
    setRegName('David Miller');
    setRegEmail('david.miller@example.com');
    setRegPassword('securePass99!');
    setRegConfirmPassword('securePass99!');
    setRegPhone('(512) 555-0842');
    setRegDob('1979-08-19');
    setRegRole('Family Caregiver');
    setRegStreet('1402 Barton Springs Rd');
    setRegCity('Austin');
    setRegState('TX');
    setRegZip('78704');
    setRegAllergies('Sulfa antibiotics');
    setRegPrimaryCondition('Cardiovascular & Wellness');
    setRegEmergencyContact('Sarah Miller (Spouse)');
    setRegEmergencyPhone('(512) 555-0843');
    setRegPrimaryDoctor('Dr. Kenneth Adams, MD');
    setRegInsuranceProvider('Optum Bank HSA & Aetna');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both your email and password.');
      return;
    }

    // Check saved users in localStorage or match demo user
    try {
      const storedUsersRaw = localStorage.getItem('genericmed_registered_users');
      const storedUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const matched = storedUsers.find(
        (u) => u.email.toLowerCase() === loginEmail.toLowerCase().trim()
      );

      if (matched) {
        onLoginSuccess(matched);
        return;
      }
    } catch {
      // ignore
    }

    // Match demo user or default login
    if (
      loginEmail.toLowerCase().includes('eleanor') ||
      loginEmail.toLowerCase() === demoUser.email.toLowerCase() ||
      loginEmail.includes('@')
    ) {
      const userToLogin: UserProfile = {
        ...demoUser,
        email: loginEmail.trim(),
      };
      onLoginSuccess(userToLogin);
    } else {
      setLoginError('Invalid credentials. You can use the Quick 1-Click Demo Login or Register.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('Full legal name is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Please provide a valid email address.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (!regPhone.trim()) {
      setRegError('Phone number is required for HIPAA delivery & dose SMS.');
      return;
    }
    if (!regStreet.trim() || !regCity.trim() || !regZip.trim()) {
      setRegError('Please complete your prescription delivery street, city, and ZIP code.');
      return;
    }
    if (!regConsentHipaa) {
      setRegError('Please accept the HIPAA privacy and pharmacy consent.');
      return;
    }

    const newUserId = `usr-${Date.now()}`;
    const randomMemberSuffix = Math.floor(100000 + Math.random() * 900000);
    const newProfile: UserProfile = {
      id: newUserId,
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      dob: regDob || '1985-05-15',
      role: regRole,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200`,
      allergies: regAllergies.trim() || 'None reported',
      primaryCondition: regPrimaryCondition.trim() || 'Preventative & Chronic Health Maintenance',
      emergencyContact: regEmergencyContact.trim() || 'Family Member',
      emergencyPhone: regEmergencyPhone.trim() || regPhone.trim(),
      primaryDoctor: regPrimaryDoctor.trim() || 'Dr. Rebecca Stone, MD',
      doctorPhone: '(512) 555-0100',
      deliveryStreet: regStreet.trim(),
      deliveryCity: regCity.trim(),
      deliveryState: regState.trim() || 'TX',
      deliveryZip: regZip.trim(),
      insuranceOrHsaProvider: regInsuranceProvider.trim() || 'HSA / FSA Pre-Tax Cash Eligible',
      memberId: `GMP-TX-${randomMemberSuffix}`,
      rxBin: '004336',
      rxPcn: 'ADV',
      rxGroup: 'RXGENMED',
    };

    // Save to localStorage
    try {
      const storedUsersRaw = localStorage.getItem('genericmed_registered_users');
      const storedUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      storedUsers.push(newProfile);
      localStorage.setItem('genericmed_registered_users', JSON.stringify(storedUsers));
    } catch {
      // ignore
    }

    onLoginSuccess(newProfile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-slate-800 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-teal-500 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-600 blur-3xl" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/50 mb-3 ring-4 ring-teal-500/20">
            <Pill className="w-8 h-8 -rotate-45" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Generic<span className="text-teal-400">Med</span> Pharmacy
          </h1>
          <p className="text-xs sm:text-sm text-teal-200/80 mt-1 max-w-sm mx-auto">
            Direct-to-consumer generic prescriptions with verified cold-chain delivery & family caregiver controls.
          </p>

          <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-teal-300 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              State Board Licensed #PHY-89102
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-teal-300" />
              HIPAA 256-Bit Encrypted
            </span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100/90 overflow-hidden">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
            <button
              id="auth-tab-login"
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError(null);
                setForgotNotice(null);
              }}
              className={`py-3.5 text-xs sm:text-sm font-bold transition-colors text-center ${
                mode === 'login'
                  ? 'bg-white text-teal-800 border-b-2 border-teal-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              Sign In to Patient Portal
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setMode('register');
                setRegError(null);
              }}
              className={`py-3.5 text-xs sm:text-sm font-bold transition-colors text-center ${
                mode === 'register'
                  ? 'bg-white text-teal-800 border-b-2 border-teal-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <div className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Welcome Back</h2>
                  <p className="text-xs text-slate-500">Access your medications, refills, and caregiver profiles.</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Rx Portal v2.4
                </span>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              {forgotNotice && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center justify-between gap-2">
                  <span>{forgotNotice}</span>
                  <button
                    onClick={() => setForgotNotice(null)}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    OK
                  </button>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address or Member ID
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="login-email-input"
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. eleanor.vance@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() =>
                        setForgotNotice(`Password reset instructions sent to ${loginEmail || 'your email'}.`)
                      }
                      className="text-[11px] text-teal-700 hover:text-teal-800 hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="login-password-input"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-teal-700 focus:ring-teal-600"
                    />
                    <span>Remember this secure device</span>
                  </label>
                  <span className="text-[11px] text-slate-400">HIPAA Compliant</span>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In to GenericMed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Login Shortcut */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
                  Instant Test & Demo Credentials
                </p>
                <div className="space-y-2">
                  <button
                    id="demo-login-eleanor-btn"
                    type="button"
                    onClick={() => onLoginSuccess(demoUser)}
                    className="w-full p-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2 text-left">
                      <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center text-[10px] font-bold">
                        EV
                      </div>
                      <div>
                        <span className="block font-bold">Eleanor Vance (Primary Account)</span>
                        <span className="text-[10px] text-teal-700 block">
                          Family Caregiver • Arthur (Father) & Leo (Son) linked
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                      1-Click Sign In
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <div className="p-6 sm:p-8 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Register New Patient Account</h2>
                  <p className="text-xs text-slate-500">
                    Provide your details to set up your prescription profile and pharmacy dispensing record.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrefillRegistration}
                  className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 flex items-center gap-1 shrink-0"
                  title="Auto-fill sample registration data for quick testing"
                >
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  <span>Auto-Fill Demo</span>
                </button>
              </div>

              {regError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{regError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Step 1: Login Credentials */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <User className="w-4 h-4 text-teal-700" />
                    <span>1. Account Credentials & Contact</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        id="reg-name-input"
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="First and last name"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="reg-email-input"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password *</label>
                      <div className="relative">
                        <input
                          id="reg-password-input"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        id="reg-confirm-password-input"
                        type={showRegPassword ? 'text' : 'password'}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Mobile Phone (SMS) *
                      </label>
                      <input
                        id="reg-phone-input"
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="(512) 555-0199"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Date of Birth *
                      </label>
                      <input
                        id="reg-dob-input"
                        type="date"
                        required
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Account Role *</label>
                      <select
                        id="reg-role-select"
                        value={regRole}
                        onChange={(e) =>
                          setRegRole(e.target.value as 'Patient' | 'Family Caregiver' | 'Healthcare Proxy')
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      >
                        <option value="Patient">Patient (Self-Managed)</option>
                        <option value="Family Caregiver">Family Caregiver (Dependents)</option>
                        <option value="Healthcare Proxy">Healthcare Proxy / Guardian</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2: Prescription Delivery Address */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <MapPin className="w-4 h-4 text-teal-700" />
                    <span>2. Prescription Shipping & Delivery Address</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      id="reg-street-input"
                      type="text"
                      required
                      value={regStreet}
                      onChange={(e) => setRegStreet(e.target.value)}
                      placeholder="e.g. 4218 Shady Hollow Dr"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">City *</label>
                      <input
                        id="reg-city-input"
                        type="text"
                        required
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        placeholder="Austin"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">State *</label>
                      <input
                        id="reg-state-input"
                        type="text"
                        required
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        placeholder="TX"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">ZIP Code *</label>
                      <input
                        id="reg-zip-input"
                        type="text"
                        required
                        value={regZip}
                        onChange={(e) => setRegZip(e.target.value)}
                        placeholder="78739"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Clinical & Safety Details */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                    <span>3. Clinical Safety & Medical Profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Known Drug Allergies
                      </label>
                      <input
                        id="reg-allergies-input"
                        type="text"
                        value={regAllergies}
                        onChange={(e) => setRegAllergies(e.target.value)}
                        placeholder="e.g. Penicillin, Sulfa, or None"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Primary Health Focus / Condition
                      </label>
                      <input
                        id="reg-condition-input"
                        type="text"
                        value={regPrimaryCondition}
                        onChange={(e) => setRegPrimaryCondition(e.target.value)}
                        placeholder="e.g. Hypertension, Diabetes, Maintenance"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Emergency Contact (Name & Relationship)
                      </label>
                      <input
                        id="reg-emergency-name-input"
                        type="text"
                        value={regEmergencyContact}
                        onChange={(e) => setRegEmergencyContact(e.target.value)}
                        placeholder="e.g. Mark Vance (Spouse)"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Emergency Contact Phone
                      </label>
                      <input
                        id="reg-emergency-phone-input"
                        type="tel"
                        value={regEmergencyPhone}
                        onChange={(e) => setRegEmergencyPhone(e.target.value)}
                        placeholder="(512) 555-0199"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Primary Prescribing Physician
                      </label>
                      <input
                        id="reg-physician-input"
                        type="text"
                        value={regPrimaryDoctor}
                        onChange={(e) => setRegPrimaryDoctor(e.target.value)}
                        placeholder="Dr. Sarah Chen, MD"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        HSA / FSA or Insurance Card
                      </label>
                      <input
                        id="reg-insurance-input"
                        type="text"
                        value={regInsuranceProvider}
                        onChange={(e) => setRegInsuranceProvider(e.target.value)}
                        placeholder="Optum Bank HSA / Cash Pay"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Consents */}
                <div className="space-y-2 text-xs text-slate-600 bg-teal-50/60 p-3.5 rounded-xl border border-teal-100">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      id="reg-consent-hipaa"
                      type="checkbox"
                      checked={regConsentHipaa}
                      onChange={(e) => setRegConsentHipaa(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                    />
                    <span>
                      I agree to HIPAA electronic prescription dispensing, verified cold-chain pharmacy delivery, and
                      patient privacy policies under Texas Pharmacy Board License #PHY-89102.
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      id="reg-consent-generic"
                      type="checkbox"
                      checked={regGenericOptIn}
                      onChange={(e) => setRegGenericOptIn(e.target.checked)}
                      className="mt-0.5 rounded text-teal-700 focus:ring-teal-600"
                    />
                    <span>
                      Enable automatic FDA Orange Book AB-rated generic bioequivalent substitutions for up to 85% price
                      reduction.
                    </span>
                  </label>
                </div>

                <button
                  id="reg-submit-btn"
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Account & Enter Portal</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Disclaimer */}
        <p className="mt-4 text-center text-[11px] text-teal-200/70">
          GenericMed Central Pharmacy LLC • 9200 Innovation Blvd, Austin, TX 78758 • 1-800-436-6337
        </p>
      </div>
    </div>
  );
};
