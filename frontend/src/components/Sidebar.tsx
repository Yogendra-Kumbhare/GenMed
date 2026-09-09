import React from 'react';
import {
  LayoutDashboard,
  Pill,
  FileText,
  Truck,
  TrendingDown,
  Users,
  Bell,
  Settings,
  ShieldAlert,
  Headphones,
  Sparkles,
  X,
  BarChart2,
  MapPin,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageId } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  urgentRefillCount: number;
  activeOrdersCount: number;
  unreadNotifsCount: number;
  onOpenPharmacistModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  urgentRefillCount,
  activeOrdersCount,
  unreadNotifsCount,
  onOpenPharmacistModal,
}) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard' as PageId, label: t('nav.dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'cabinet' as PageId, label: t('nav.cabinet'), icon: Pill, badge: urgentRefillCount > 0 ? `${urgentRefillCount} refill` : null, badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700' },
    { id: 'prescriptions' as PageId, label: t('nav.prescriptions'), icon: FileText, badge: null },
    { id: 'orders' as PageId, label: t('nav.orders'), icon: Truck, badge: activeOrdersCount > 0 ? `${activeOrdersCount} live` : null, badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 animate-pulse dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700' },
    { id: 'savings' as PageId, label: t('nav.savings'), icon: TrendingDown, badge: '84% Avg', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700' },
    { id: 'dependents' as PageId, label: t('nav.dependents'), icon: Users, badge: '2 active', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600' },
    { id: 'notifications' as PageId, label: t('nav.notifications'), icon: Bell, badge: unreadNotifsCount > 0 ? `${unreadNotifsCount}` : null, badgeColor: 'bg-teal-700 text-white dark:bg-teal-600' },
    { id: 'pharmacies' as PageId, label: t('nav.pharmacies'), icon: MapPin, badge: null },
    { id: 'analytics' as PageId, label: t('nav.analytics'), icon: BarChart2, badge: null },
    { id: 'settings' as PageId, label: t('nav.settings'), icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/60 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                onNavigate('dashboard');
                onCloseMobile();
              }}
            >
              {/* Teal #0f766e Shield Logo */}
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm shadow-teal-700/20">
                <div className="relative">
                  <Pill className="w-5 h-5 -rotate-45" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-slate-900 tracking-tight">
                    Generic<span className="text-teal-700">Med</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    Rx
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                  Patient & Caregiver Portal
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border border-teal-100 dark:border-teal-800/50 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Cards */}
        <div className="p-3 space-y-3 border-t border-slate-100 dark:border-slate-700/60">
          {/* Theme + Language controls */}
          <div className="flex items-center justify-between px-1">
            <ThemeToggle variant="compact" />
            <LanguageSwitcher />
          </div>

          {/* Caregiver Synchronized Status Card */}
          <div id="sidebar-caregiver-card" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 bg-teal-100/60 dark:bg-teal-900/30 px-1.5 py-0.5 rounded">
                Caregiver Mode
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">Arthur & Leo Linked</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Caregiver permissions and dose adherence sync active.</p>
            <button onClick={() => { onNavigate('dependents'); onCloseMobile(); }} className="mt-2 text-[11px] font-semibold text-teal-700 dark:text-teal-400 hover:text-teal-800 flex items-center gap-1">
              <span>Manage Dependents</span> →
            </button>
          </div>

          {/* Quick 24/7 Clinical Pharmacy Support */}
          <div className="px-3 py-2.5 rounded-lg bg-teal-700 dark:bg-teal-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Headphones className="w-4 h-4 text-teal-200 shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">24/7 Pharmacy Help</p>
                <p className="text-[10px] text-teal-100 leading-tight">1-800-436-6337</p>
              </div>
            </div>
            <button id="sidebar-contact-pharmacy-btn" onClick={onOpenPharmacistModal} className="px-2 py-1 bg-white text-teal-900 rounded text-[10px] font-bold hover:bg-teal-50 transition-colors">
              Consult
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
