import React, { useState } from 'react';
import {
  Search,
  Bell,
  PhoneCall,
  User,
  CheckCircle2,
  ChevronDown,
  AlertTriangle,
  Heart,
  ShieldCheck,
  X,
  Clock,
  Settings,
  LogOut,
  CreditCard,
} from 'lucide-react';
import { Dependent, NotificationItem, PageId, UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentUser: UserProfile;
  onOpenProfileModal: () => void;
  onLogout: () => void;
  dependents: Dependent[];
  activeDependentId: string | 'all';
  onSelectDependent: (id: string | 'all') => void;
  notifications: NotificationItem[];
  onNavigate: (page: PageId) => void;
  onOpenPharmacistModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenProfileModal,
  onLogout,
  dependents,
  activeDependentId,
  onSelectDependent,
  notifications,
  onNavigate,
  onOpenPharmacistModal,
  searchQuery,
  setSearchQuery,
}) => {
  const [showDependentMenu, setShowDependentMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const currentDependent =
    activeDependentId === 'all'
      ? null
      : dependents.find((d) => d.id === activeDependentId) || dependents[0];

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg relative">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="header-global-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medications, prescriptions, orders, or doctors..."
              className="w-full pl-10 pr-9 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/70 dark:hover:bg-slate-700/70 focus:bg-white dark:focus:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-600/15 transition-all"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & Profile Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (compact) */}
          <div className="hidden md:block">
            <ThemeToggle variant="compact" />
          </div>

          {/* Language Switcher */}
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          {/* Pharmacist Consultation Button */}
          <button
            id="pharmacist-consult-btn"
            onClick={onOpenPharmacistModal}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-700 transition-colors"
            title="Speak with on-duty licensed clinical pharmacist"
          >
            <PhoneCall className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400 animate-pulse" />
            <span>Duty Pharmacist (24/7)</span>
          </button>

          {/* Active Patient / Caregiver Dependent Switcher */}
          <div className="relative">
            <button
              id="dependent-switcher-btn"
              onClick={() => setShowDependentMenu(!showDependentMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-teal-500 bg-white hover:bg-slate-50 transition-all text-left"
            >
              <div className="relative">
                {currentDependent ? (
                  <img
                    src={currentDependent.avatar}
                    alt={currentDependent.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-teal-600/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                    All
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentDependent ? currentDependent.name : 'All Family Members'}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                    {currentDependent ? currentDependent.relationship : 'Caregiver'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  {currentDependent
                    ? `${currentDependent.activeMedsCount} active meds`
                    : 'Unified Care View'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {showDependentMenu && (
              <div
                id="dependent-switcher-dropdown"
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Profile
                  </span>
                  <span className="text-[10px] text-teal-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> HIPAA Verified
                  </span>
                </div>

                <div className="py-1">
                  <button
                    id="select-profile-all"
                    onClick={() => {
                      onSelectDependent('all');
                      setShowDependentMenu(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                      activeDependentId === 'all'
                        ? 'bg-teal-50 text-teal-900'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center text-xs font-bold">
                      All
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">Entire Household (All)</div>
                      <div className="text-[11px] text-slate-500">
                        Unified caregiver overview for all dependents
                      </div>
                    </div>
                    {activeDependentId === 'all' && (
                      <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                    )}
                  </button>

                  {dependents.map((dep) => {
                    const isSelected = activeDependentId === dep.id;
                    return (
                      <button
                        key={dep.id}
                        id={`select-profile-${dep.id}`}
                        onClick={() => {
                          onSelectDependent(dep.id);
                          setShowDependentMenu(false);
                        }}
                        className={`w-full px-3 py-2 flex items-center gap-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-teal-50 text-teal-900'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <img
                          src={dep.avatar}
                          alt={dep.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold truncate">{dep.name}</span>
                            <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600 font-medium">
                              {dep.relationship}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {dep.activeMedsCount} meds • {dep.adherenceRate}% adherence
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 px-3">
                  <button
                    id="manage-dependents-shortcut-btn"
                    onClick={() => {
                      onNavigate('dependents');
                      setShowDependentMenu(false);
                    }}
                    className="w-full text-center text-xs font-semibold text-teal-700 hover:text-teal-800 py-1"
                  >
                    Manage Caregiver Profiles & Authorizations →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-600 hover:text-teal-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="View clinical notifications & refill alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span
                  id="header-unread-badge"
                  className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse"
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifMenu && (
              <div
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    id="view-all-notifs-btn"
                    onClick={() => {
                      onNavigate('notifications');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        if (notif.actionTarget) onNavigate(notif.actionTarget);
                        setShowNotifMenu(false);
                      }}
                      className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {notif.type === 'refill_alert' && (
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          {notif.type === 'order_update' && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                          )}
                          {notif.type === 'caregiver_alert' && (
                            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          {notif.type === 'dose_reminder' && (
                            <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                          )}
                          {notif.type === 'rx_renewal' && (
                            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {notif.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      onNavigate('notifications');
                      setShowNotifMenu(false);
                    }}
                    className="text-xs text-teal-700 font-semibold hover:underline"
                  >
                    Open Notification Center
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Trigger & Dropdown */}
          <div className="relative">
            <button
              id="header-profile-menu-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full border border-slate-200 hover:border-teal-500 bg-white hover:bg-slate-50 transition-all text-left"
              title="User Account & Profile Options"
            >
              <div className="w-8 h-8 rounded-full bg-teal-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-800 block leading-tight truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-teal-700 font-semibold block leading-none">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div
                id="header-profile-dropdown"
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                      {currentUser.memberId}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                    {currentUser.email}
                  </span>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-teal-800 bg-teal-50 px-2 py-1 rounded-md border border-teal-200">
                    <ShieldCheck className="w-3 h-3 text-teal-700 shrink-0" />
                    <span className="font-semibold">RxBIN {currentUser.rxBin} • PCN {currentUser.rxPcn}</span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5 text-xs">
                  <button
                    id="profile-dropdown-view-btn"
                    onClick={() => {
                      onOpenProfileModal();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:text-teal-900 hover:bg-teal-50 flex items-center gap-2.5 font-semibold transition-colors"
                  >
                    <User className="w-4 h-4 text-teal-700" />
                    <span>View Profile & Digital Rx Card</span>
                  </button>

                  <button
                    id="profile-dropdown-settings-btn"
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:text-teal-900 hover:bg-teal-50 flex items-center gap-2.5 font-semibold transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Portal Settings & Pharmacy Rules</span>
                  </button>

                  <button
                    id="profile-dropdown-dependents-btn"
                    onClick={() => {
                      onNavigate('dependents');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg text-slate-700 hover:text-teal-900 hover:bg-teal-50 flex items-center gap-2.5 font-semibold transition-colors"
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Caregiver Dependents</span>
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-100 p-1">
                  <button
                    id="profile-dropdown-logout-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left rounded-lg text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 font-bold transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
