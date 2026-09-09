import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Heart,
  Clock,
  ShieldCheck,
  CheckCheck,
  Trash2,
  ExternalLink,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { NotificationItem, PageId, Dependent } from '../../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
  dependents: Dependent[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onNavigate: (page: PageId) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications,
  dependents,
  onMarkAllAsRead,
  onMarkAsRead,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'doses' | 'orders' | 'refills' | 'caregiver'>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = notifications.filter((notif) => {
    if (unreadOnly && notif.isRead) return false;
    if (activeFilter === 'doses' && notif.type !== 'dose_reminder') return false;
    if (activeFilter === 'orders' && notif.type !== 'order_update') return false;
    if (activeFilter === 'refills' && notif.type !== 'refill_alert' && notif.type !== 'rx_renewal') return false;
    if (activeFilter === 'caregiver' && notif.type !== 'caregiver_alert') return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div id="notifications-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
              Communication Center
            </span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
            Notifications & Clinical Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Refill prompts, live courier delivery tracking, dose reminders, and caregiver escalation alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            id="mark-all-read-btn"
            onClick={onMarkAllAsRead}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-teal-700" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Alerts ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('refills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'refills'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Refill Warnings
          </button>
          <button
            onClick={() => setActiveFilter('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'orders'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Orders & Couriers
          </button>
          <button
            onClick={() => setActiveFilter('doses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'doses'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dose Reminders
          </button>
          <button
            onClick={() => setActiveFilter('caregiver')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'caregiver'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Caregiver Alerts
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none shrink-0 px-2">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded border-slate-300 text-teal-700 focus:ring-teal-600"
          />
          <span>Unread Only</span>
        </label>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No notifications in this filter</h3>
            <p className="text-xs text-slate-500 mt-1">
              You are completely caught up with all clinical and delivery alerts.
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const dependent = dependents.find((d) => d.id === notif.dependentId);

            return (
              <div
                key={notif.id}
                id={`notif-card-${notif.id}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.isRead
                    ? 'bg-white border-teal-300 shadow-xs ring-1 ring-teal-300/30'
                    : 'bg-white/80 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Indicator */}
                  <div className="mt-0.5 shrink-0">
                    {notif.type === 'refill_alert' && (
                      <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                    )}
                    {notif.type === 'order_update' && (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                        <Truck className="w-5 h-5" />
                      </div>
                    )}
                    {notif.type === 'caregiver_alert' && (
                      <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 flex items-center justify-center">
                        <Heart className="w-5 h-5" />
                      </div>
                    )}
                    {notif.type === 'dose_reminder' && (
                      <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                    )}
                    {notif.type === 'rx_renewal' && (
                      <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300 text-teal-800 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className={`text-xs sm:text-sm font-bold ${
                          !notif.isRead ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
                      )}
                      {dependent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {dependent.name}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!notif.isRead && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      Dismiss
                    </button>
                  )}

                  {notif.actionLabel && notif.actionTarget && (
                    <button
                      onClick={() => {
                        onMarkAsRead(notif.id);
                        onNavigate(notif.actionTarget!);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <span>{notif.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
