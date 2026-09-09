import React, { useEffect, useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Stethoscope,
  Heart,
  CreditCard,
  Edit2,
  CheckCircle2,
  Settings,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile, PageId } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onNavigate,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...user });
      setIsEditing(false);
      setSavedSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-teal-600/20">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{user.email} • Member ID: {user.memberId}</p>
            </div>
          </div>
          <button
            id="close-profile-modal-btn"
            aria-label="Close profile"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Profile details updated successfully across your GenericMed portal.</span>
          </div>
        )}

        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Digital Rx Member Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-teal-300 font-bold block">
                  GenericMed Official Prescription Card
                </span>
                <span className="text-base font-bold tracking-tight">{user.name}</span>
                <span className="text-xs text-teal-200/80 block mt-0.5">
                  Texas Board of Pharmacy • License #PHY-89102
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-700/80 rounded text-teal-100 border border-teal-500/30 block">
                  VERIFIED PATIENT
                </span>
                <span className="text-[11px] font-mono text-teal-200 block mt-1">
                  ID: {user.memberId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-teal-700/60 font-mono text-[11px]">
              <div>
                <span className="text-teal-400 text-[10px] block">RxBIN:</span>
                <span className="font-bold">{user.rxBin}</span>
              </div>
              <div>
                <span className="text-teal-400 text-[10px] block">RxPCN:</span>
                <span className="font-bold">{user.rxPcn}</span>
              </div>
              <div>
                <span className="text-teal-400 text-[10px] block">RxGroup:</span>
                <span className="font-bold">{user.rxGroup}</span>
              </div>
            </div>
          </div>

          {/* Form or View Mode */}
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Patient Profile Information
                </h4>
                <button
                  id="edit-profile-btn"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" /> Phone Number
                  </span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">{user.phone}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" /> Date of Birth
                  </span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">{user.dob}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> Default Delivery Address
                  </span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                    {user.deliveryStreet}, {user.deliveryCity}, {user.deliveryState} {user.deliveryZip}
                  </span>
                </div>

                <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-100">
                  <span className="text-rose-700 text-[11px] font-bold block flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-600" /> Known Drug Allergies
                  </span>
                  <span className="font-bold text-rose-900 text-xs block mt-0.5">{user.allergies}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Heart className="w-3 h-3 text-slate-500" /> Emergency Contact
                  </span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                    {user.emergencyContact} • {user.emergencyPhone}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-slate-500" /> Primary Prescribing Doctor
                  </span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                    {user.primaryDoctor || 'Dr. Sarah Chen, MD'} ({user.doctorPhone || '(512) 555-0143'})
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-slate-500" /> Health Savings & Insurance Provider
                  </span>
                  <span className="font-semibold text-slate-800 text-xs block mt-0.5">
                    {user.insuranceOrHsaProvider || 'Optum Bank Health Savings Account'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Edit Profile Details
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'Patient' | 'Family Caregiver' | 'Healthcare Proxy',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  >
                    <option value="Patient">Patient</option>
                    <option value="Family Caregiver">Family Caregiver</option>
                    <option value="Healthcare Proxy">Healthcare Proxy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Known Drug Allergies
                  </label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Delivery Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryStreet}
                    onChange={(e) => setFormData({ ...formData, deliveryStreet: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Quick Options Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <button
              id="profile-goto-settings-btn"
              onClick={() => {
                onNavigate('settings');
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-teal-700" />
              <span>Full Settings & Dispensing Rules</span>
            </button>

            <button
              id="profile-logout-btn"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="py-2.5 px-4 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-700" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
