import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Menu, CheckCircle2, X, Loader2 } from 'lucide-react';
import {
  PageId,
  Dependent,
  Medication,
  TodayDose,
  Prescription,
  Order,
  NotificationItem,
  UserProfile,
  UserSettings,
} from './types';
import {
  INITIAL_DEPENDENTS,
  INITIAL_TODAY_DOSES,
  INITIAL_MEDICATIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_USER_PROFILE,
  DEFAULT_USER_SETTINGS,
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Code-split page components — each loads only when first navigated to
const DashboardPage = lazy(() => import('./components/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MedicineCabinetPage = lazy(() => import('./components/pages/MedicineCabinetPage').then(m => ({ default: m.MedicineCabinetPage })));
const PrescriptionsPage = lazy(() => import('./components/pages/PrescriptionsPage').then(m => ({ default: m.PrescriptionsPage })));
const OrdersTrackingPage = lazy(() => import('./components/pages/OrdersTrackingPage').then(m => ({ default: m.OrdersTrackingPage })));
const SavingsPage = lazy(() => import('./components/pages/SavingsPage').then(m => ({ default: m.SavingsPage })));
const DependentsPage = lazy(() => import('./components/pages/DependentsPage').then(m => ({ default: m.DependentsPage })));
const NotificationsPage = lazy(() => import('./components/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const AnalyticsPage = lazy(() => import('./components/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const PharmaciesPage = lazy(() => import('./components/pages/PharmaciesPage').then(m => ({ default: m.PharmaciesPage })));
import { RefillModal } from './components/modals/RefillModal';
import { UploadRxModal } from './components/modals/UploadRxModal';
import { MedicationDetailModal } from './components/modals/MedicationDetailModal';
import { AddMedicationModal } from './components/modals/AddMedicationModal';
import { PharmacistConsultModal } from './components/modals/PharmacistConsultModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { ProfileModal } from './components/modals/ProfileModal';
import { PushNotificationManager } from './components/PushNotificationManager';

function readStoredState<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  // Authentication & Profile States
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('genericmed_current_user');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_USER_PROFILE;
  });

  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem('genericmed_user_settings');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return DEFAULT_USER_SETTINGS;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const authFlag = localStorage.getItem('genericmed_is_authenticated');
    return authFlag === 'true';
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  // Navigation & View state
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeDependentId, setActiveDependentId] = useState<string | 'all'>('dep-self');
  const [globalSearch, setGlobalSearch] = useState('');

  // Core Data States with demo data
  const [dependents, setDependents] = useState<Dependent[]>(() => readStoredState('genericmed_dependents', INITIAL_DEPENDENTS));
  const [medications, setMedications] = useState<Medication[]>(() => readStoredState('genericmed_medications', INITIAL_MEDICATIONS));
  const [todayDoses, setTodayDoses] = useState<TodayDose[]>(() => readStoredState('genericmed_today_doses', INITIAL_TODAY_DOSES));
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => readStoredState('genericmed_prescriptions', INITIAL_PRESCRIPTIONS));
  const [orders, setOrders] = useState<Order[]>(() => readStoredState('genericmed_orders', INITIAL_ORDERS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => readStoredState('genericmed_notifications', INITIAL_NOTIFICATIONS));

  useEffect(() => {
    try {
      localStorage.setItem('genericmed_dependents', JSON.stringify(dependents));
      localStorage.setItem('genericmed_medications', JSON.stringify(medications));
      localStorage.setItem('genericmed_today_doses', JSON.stringify(todayDoses));
      localStorage.setItem('genericmed_prescriptions', JSON.stringify(prescriptions));
      localStorage.setItem('genericmed_orders', JSON.stringify(orders));
      localStorage.setItem('genericmed_notifications', JSON.stringify(notifications));
    } catch {
      // The portal remains usable if browser storage is unavailable.
    }
  }, [dependents, medications, todayDoses, prescriptions, orders, notifications]);

  // Modal States
  const [refillMedication, setRefillMedication] = useState<Medication | null>(null);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);

  const [detailMedication, setDetailMedication] = useState<Medication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isUploadRxOpen, setIsUploadRxOpen] = useState(false);
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isPharmacistModalOpen, setIsPharmacistModalOpen] = useState(false);

  // Active dependent helper
  const activeDependent =
    activeDependentId === 'all'
      ? null
      : dependents.find((d) => d.id === activeDependentId) || null;

  // Dose toggling
  const handleToggleDoseStatus = (
    doseId: string,
    newStatus: 'taken' | 'skipped' | 'pending'
  ) => {
    setTodayDoses((prev) =>
      prev.map((dose) => {
        if (dose.id === doseId) {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...dose,
            status: newStatus,
            takenAt: newStatus === 'taken' ? timeStr : undefined,
          };
        }
        return dose;
      })
    );
  };

  // Open refill for a medication
  const handleOpenRefill = (med: Medication) => {
    setRefillMedication(med);
    setIsRefillModalOpen(true);
  };

  const handleOpenRefillByName = (medName: string) => {
    const med = medications.find(
      (m) =>
        m.name.toLowerCase().includes(medName.toLowerCase()) ||
        medName.toLowerCase().includes(m.genericName.toLowerCase())
    );
    if (med) {
      handleOpenRefill(med);
    } else {
      handleOpenRefill(medications[0]);
    }
  };

  // Confirm and dispatch refill order
  const handleConfirmRefill = (newOrderData: Partial<Order>) => {
    const refillQuantity = newOrderData.items?.[0]?.quantity ?? 90;
    const fullOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderData.orderNumber || `GM-${Math.floor(10000 + Math.random() * 90000)}`,
      orderDate: newOrderData.orderDate || new Date().toISOString().split('T')[0],
      estimatedDelivery: newOrderData.estimatedDelivery || 'Tomorrow by 2:00 PM',
      status: 'Processing',
      carrier: newOrderData.carrier || 'GenericMed Express Delivery',
      trackingNumber: newOrderData.trackingNumber || `GMP-TX-${Date.now()}`,
      driverName: 'Marcus Torres',
      driverPhone: '(512) 555-0391',
      vehicleLocation: {
        lat: 30.2672,
        lng: -97.7431,
        street: '4th St & Congress Ave, Austin TX',
        etaMinutes: 24,
      },
      temperatureControlled: true,
      tamperSealVerified: true,
      recipientName: newOrderData.recipientName || 'Eleanor Vance',
      recipientAddress: newOrderData.recipientAddress || '4218 Shady Hollow Dr, Austin, TX 78739',
      dependentId: newOrderData.dependentId || 'dep-self',
      items: newOrderData.items || [],
      subtotal: newOrderData.subtotal || 11.4,
      genericDiscountSavings: newOrderData.genericDiscountSavings || 234.6,
      shippingFee: 0,
      tax: 0,
      totalPaid: newOrderData.totalPaid || 11.4,
      paymentMethod: 'HSA / FSA Card ending in 4109',
    };

    setOrders((prev) => [fullOrder, ...prev]);

    // Update medication days supply & reset low supply
    if (refillMedication) {
      setMedications((prev) =>
        prev.map((m) => {
          if (m.id === refillMedication.id) {
            return {
              ...m,
              daysSupplyLeft: m.daysSupplyLeft + refillQuantity,
              pillsRemaining: m.pillsRemaining + refillQuantity,
              isLowSupply: false,
              refillsRemaining: Math.max(0, m.refillsRemaining - 1),
            };
          }
          return m;
        })
      );
    }

    // Add a notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'order_update',
      title: `Order ${fullOrder.orderNumber} Dispatched`,
      message: `Refill confirmed. Pharmacist packing with cold-chain sensor. Arriving tomorrow.`,
      timestamp: 'Just now',
      isRead: false,
      dependentId: fullOrder.dependentId,
      actionLabel: 'Track Delivery',
      actionTarget: 'orders',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Prescription
  const handleAddPrescription = (newRx: Prescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);

    // Also add to medications cabinet
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      dependentId: newRx.dependentId,
      name: newRx.medicationName,
      genericName: newRx.genericName,
      brandEquivalent: newRx.brandEquivalent,
      strength: newRx.strength,
      form: 'Tablet',
      ndcNumber: '50090-2810-0',
      bioequivalenceRating: 'AB',
      dosageInstructions: newRx.sig,
      frequency: 'Daily',
      timing: ['Morning'],
      prescribingDoctor: newRx.doctorName,
      doctorClinic: newRx.clinicName,
      rxNumber: newRx.rxNumber,
      pillsRemaining: newRx.qtyPrescribed,
      totalPills: newRx.qtyPrescribed,
      daysSupplyLeft: newRx.daysSupply,
      refillsRemaining: newRx.refillsRemaining,
      lastRefillDate: newRx.prescribedDate,
      nextRefillRecommendedDate: '2026-12-01',
      isLowSupply: false,
      isAsNeeded: false,
      color: '#ffffff',
      shape: 'oval',
      priceGeneric: 11.4,
      priceBrand: 140.0,
      savingsPercentage: 92,
      foodInstructions: 'Take with food',
      sideEffects: ['Mild headache', 'Drowsiness'],
      warnings: ['Keep stored at room temperature.'],
    };
    setMedications((prev) => [newMed, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'rx_renewal',
      title: `Prescription ${newRx.rxNumber} Verified`,
      message: `Dr. ${newRx.doctorName} prescription for ${newRx.medicationName} added with ${newRx.refillsRemaining} refills.`,
      timestamp: 'Just now',
      isRead: false,
      dependentId: newRx.dependentId,
      actionLabel: 'View Rx',
      actionTarget: 'prescriptions',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Add Medication
  const handleAddMedication = (newMed: Medication) => {
    setMedications((prev) => [newMed, ...prev]);
  };

  // Add Dependent
  const handleAddDependent = (newDep: Dependent) => {
    setDependents((prev) => [...prev, newDep]);
  };

  const handleRemoveDependent = (dependentId: string) => {
    setDependents((prev) => prev.filter((dependent) => dependent.id !== dependentId));
    setMedications((prev) => prev.filter((medication) => medication.dependentId !== dependentId));
    setTodayDoses((prev) => prev.filter((dose) => dose.dependentId !== dependentId));
    setPrescriptions((prev) => prev.filter((prescription) => prescription.dependentId !== dependentId));
    setOrders((prev) => prev.filter((order) => order.dependentId !== dependentId));
    setNotifications((prev) => prev.filter((notification) => notification.dependentId !== dependentId));
    if (activeDependentId === dependentId) {
      setActiveDependentId('all');
    }
  };

  // Auth & Profile handlers
  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('genericmed_current_user', JSON.stringify(user));
      localStorage.setItem('genericmed_is_authenticated', 'true');
    } catch {
      // ignore
    }

    // Sync self dependent so cabinet and prescriptions show the user's name
    setDependents((prev) =>
      prev.map((d) =>
        d.id === 'dep-self'
          ? {
              ...d,
              name: user.name,
              dob: user.dob,
              primaryCondition: user.primaryCondition || d.primaryCondition,
              primaryDoctor: user.primaryDoctor || d.primaryDoctor,
              doctorPhone: user.doctorPhone || d.doctorPhone,
              emergencyContact: user.emergencyContact || d.emergencyContact,
            }
          : d
      )
    );

    setWelcomeToast(`Welcome back, ${user.name}!`);
    setTimeout(() => setWelcomeToast(null), 4500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('genericmed_is_authenticated', 'false');
    } catch {
      // ignore
    }
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('genericmed_current_user', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setDependents((prev) =>
      prev.map((d) =>
        d.id === 'dep-self'
          ? {
              ...d,
              name: updated.name,
              dob: updated.dob,
              primaryCondition: updated.primaryCondition || d.primaryCondition,
              primaryDoctor: updated.primaryDoctor || d.primaryDoctor,
              doctorPhone: updated.doctorPhone || d.doctorPhone,
              emergencyContact: updated.emergencyContact || d.emergencyContact,
            }
          : d
      )
    );
  };

  const handleUpdateSettings = (updated: UserSettings) => {
    setUserSettings(updated);
    try {
      localStorage.setItem('genericmed_user_settings', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Notifications
  const handleMarkAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkNotifAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Counts for sidebar badges
  const urgentRefillCount = medications.filter((m) => m.isLowSupply).length;
  const activeOrdersCount = orders.filter((order) => order.status !== 'Delivered').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Unauthenticated view guard
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onLoginSuccess={handleLoginSuccess}
        demoUser={DEFAULT_USER_PROFILE}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-200 antialiased flex flex-col selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-800 dark:selection:text-teal-100">
      {/* Welcome Toast Notification */}
      {welcomeToast && (
        <div
          id="welcome-toast"
          className="fixed top-4 right-4 z-50 bg-teal-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-teal-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{welcomeToast}</span>
          <button
            onClick={() => setWelcomeToast(null)}
            className="p-1 hover:bg-teal-700 rounded-lg text-teal-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        urgentRefillCount={urgentRefillCount}
        activeOrdersCount={activeOrdersCount}
        unreadNotifsCount={unreadNotifsCount}
        onOpenPharmacistModal={() => setIsPharmacistModalOpen(true)}
      />

      {/* Main Layout Container (Offset by Sidebar on lg screens) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 bg-slate-50/70 dark:bg-slate-950">
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-slate-700 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900 tracking-tight">
              Generic<span className="text-teal-700">Med</span>
            </span>
            <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
              Portal
            </span>
          </div>

          <button
            onClick={() => setIsPharmacistModalOpen(true)}
            className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200"
          >
            24/7 Rx Help
          </button>
        </div>

        {/* Global Desktop Header */}
        <Header
          currentUser={currentUser}
          onOpenProfileModal={() => setIsProfileModalOpen(true)}
          onLogout={handleLogout}
          dependents={dependents}
          activeDependentId={activeDependentId}
          onSelectDependent={(id) => setActiveDependentId(id)}
          notifications={notifications}
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenPharmacistModal={() => setIsPharmacistModalOpen(true)}
          searchQuery={globalSearch}
          setSearchQuery={setGlobalSearch}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64 gap-3 text-slate-500 dark:text-slate-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
              Loading…
            </div>
          }>
          {currentPage === 'dashboard' && (
            <DashboardPage
              activeDependent={activeDependent}
              dependents={dependents}
              todayDoses={todayDoses}
              medications={medications}
              orders={orders}
              onToggleDoseStatus={handleToggleDoseStatus}
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRefill={handleOpenRefill}
              onOpenUploadRx={() => setIsUploadRxOpen(true)}
              onOpenAddMed={() => setIsAddMedOpen(true)}
            />
          )}

          {currentPage === 'cabinet' && (
            <MedicineCabinetPage
              medications={medications}
              dependents={dependents}
              activeDependent={activeDependent}
              onOpenRefill={handleOpenRefill}
              onOpenDetail={(med) => {
                setDetailMedication(med);
                setIsDetailModalOpen(true);
              }}
              onOpenAddMed={() => setIsAddMedOpen(true)}
              searchQuery={globalSearch}
            />
          )}

          {currentPage === 'prescriptions' && (
            <PrescriptionsPage
              prescriptions={prescriptions}
              dependents={dependents}
              activeDependent={activeDependent}
              onOpenUploadRx={() => setIsUploadRxOpen(true)}
              onOpenRefillByName={handleOpenRefillByName}
            />
          )}

          {currentPage === 'orders' && (
            <OrdersTrackingPage
              orders={orders}
              dependents={dependents}
              activeDependent={activeDependent}
              onReorder={(order) => {
                const med = medications.find((m) => m.name.includes(order.items[0]?.genericName));
                if (med) handleOpenRefill(med);
                else handleOpenRefill(medications[0]);
              }}
            />
          )}

          {currentPage === 'savings' && (
            <SavingsPage
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenUploadRx={() => setIsUploadRxOpen(true)}
            />
          )}

          {currentPage === 'dependents' && (
            <DependentsPage
              dependents={dependents}
              medications={medications}
              activeDependentId={activeDependentId}
              onSelectDependent={(id) => setActiveDependentId(id)}
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddDependent={handleAddDependent}
              onRemoveDependent={handleRemoveDependent}
            />
          )}

          {currentPage === 'notifications' && (
            <NotificationsPage
              notifications={notifications}
              dependents={dependents}
              onMarkAllAsRead={handleMarkAllNotifsAsRead}
              onMarkAsRead={handleMarkNotifAsRead}
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              user={currentUser}
              onUpdateProfile={handleUpdateProfile}
              settings={userSettings}
              onUpdateSettings={handleUpdateSettings}
              onLogout={handleLogout}
            />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsPage
              dependents={dependents}
              activeDependent={activeDependent}
            />
          )}

          {currentPage === 'pharmacies' && (
            <PharmaciesPage
              onNavigate={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenUploadRx={() => setIsUploadRxOpen(true)}
            />
          )}
          </Suspense>
        </main>
      </div>

      {/* Interactive Global Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
      />

      <RefillModal
        medication={refillMedication}
        isOpen={isRefillModalOpen}
        onClose={() => {
          setIsRefillModalOpen(false);
          setRefillMedication(null);
        }}
        onConfirmRefill={handleConfirmRefill}
        recipientName={activeDependent ? activeDependent.name : 'Eleanor Vance'}
        recipientAddress={
          activeDependent?.relationship === 'Father'
            ? '2804 Oak Crest Terrace, Austin, TX 78704'
            : '4218 Shady Hollow Dr, Austin, TX 78739'
        }
      />

      <MedicationDetailModal
        medication={detailMedication}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailMedication(null);
        }}
        onOpenRefill={handleOpenRefill}
        allMedicationNames={medications.map((m) => m.name)}
        allergies={currentUser.allergies}
      />

      <UploadRxModal
        isOpen={isUploadRxOpen}
        onClose={() => setIsUploadRxOpen(false)}
        dependents={dependents}
        activeDependentId={activeDependentId === 'all' ? 'dep-self' : activeDependentId}
        onAddPrescription={handleAddPrescription}
      />

      <AddMedicationModal
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        dependents={dependents}
        activeDependentId={activeDependentId === 'all' ? 'dep-self' : activeDependentId}
        onAddMedication={handleAddMedication}
      />

      <PharmacistConsultModal
        isOpen={isPharmacistModalOpen}
        onClose={() => setIsPharmacistModalOpen(false)}
        medicationNames={medications.map((m) => m.name)}
      />

      {/* Push notification opt-in banner */}
      <PushNotificationManager />
    </div>
  );
}
