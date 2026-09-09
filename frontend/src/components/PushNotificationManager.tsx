import React, { useEffect, useState } from 'react';
import { Bell, BellOff, BellRing, X } from 'lucide-react';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export function PushNotificationManager() {
  const [permission, setPermission] = useState<PermissionState>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !window.Notification || !('serviceWorker' in navigator)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission as PermissionState);

    // Show the opt-in banner once after login if not yet decided
    const dismissed = localStorage.getItem('genericmed_push_dismissed');
    if (!dismissed && Notification.permission === 'default') {
      setTimeout(() => setShowBanner(true), 3000);
    }
  }, []);

  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) return;
    setLoading(true);
    try {
      // Get VAPID public key from server
      const keyRes = await fetch('/api/push/vapid-public-key');
      if (!keyRes.ok) throw new Error('VAPID key unavailable');
      const { publicKey } = (await keyRes.json()) as { publicKey: string };

      // Request browser notification permission
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);
      if (result !== 'granted') return;

      // Get the active service worker registration
      const reg = await navigator.serviceWorker.ready;
      const pushSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to server
      const token = localStorage.getItem('genericmed_token');
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscription: pushSub }),
      });

      setSubscribed(true);
      setShowBanner(false);
    } catch (err) {
      console.error('Push subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const pushSub = await reg.pushManager.getSubscription();
      if (pushSub) await pushSub.unsubscribe();
      const token = localStorage.getItem('genericmed_token');
      await fetch('/api/push/unsubscribe', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribed(false);
    } catch (err) {
      console.error('Push unsubscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    setShowBanner(false);
    localStorage.setItem('genericmed_push_dismissed', 'true');
  };

  if (permission === 'unsupported') return null;

  // Opt-in banner
  if (showBanner && permission === 'default') {
    return (
      <div
        role="alert"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-300"
      >
        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-700 flex items-center justify-center shrink-0">
          <BellRing className="w-4 h-4 text-teal-700 dark:text-teal-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Enable Dose Reminders</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Get push notifications for upcoming doses and order updates.
          </p>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={subscribe}
              disabled={loading}
              className="px-3 py-1.5 text-[11px] font-bold bg-teal-700 hover:bg-teal-800 text-white rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? 'Enabling…' : 'Enable'}
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={dismiss} aria-label="Dismiss notification banner" className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
}

/**
 * Exported toggle for use in Settings page.
 */
export function PushToggle() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const supported = 'Notification' in window && 'serviceWorker' in navigator;

  const toggle = async () => {
    if (subscribed) {
      setLoading(true);
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
        const token = localStorage.getItem('genericmed_token');
        await fetch('/api/push/unsubscribe', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        setSubscribed(false);
      } finally { setLoading(false); }
    } else {
      setLoading(true);
      try {
        const keyRes = await fetch('/api/push/vapid-public-key');
        const { publicKey } = (await keyRes.json()) as { publicKey: string };
        const result = await Notification.requestPermission();
        if (result !== 'granted') { setLoading(false); return; }
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(publicKey) });
        const token = localStorage.getItem('genericmed_token');
        await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ subscription: sub }) });
        setSubscribed(true);
      } finally { setLoading(false); }
    }
  };

  if (!supported) return <span className="text-xs text-slate-400">Not supported in this browser</span>;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-pressed={subscribed}
      className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
        subscribed
          ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-700'
          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-400'
      }`}
    >
      {subscribed ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
      {loading ? 'Please wait…' : subscribed ? 'Notifications On' : 'Enable Notifications'}
    </button>
  );
}

// Utility: convert VAPID base64 public key to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
