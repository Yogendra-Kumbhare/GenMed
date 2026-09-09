export type PageId =
  | 'dashboard'
  | 'cabinet'
  | 'prescriptions'
  | 'orders'
  | 'savings'
  | 'dependents'
  | 'notifications'
  | 'settings'
  | 'analytics';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  role: 'Patient' | 'Family Caregiver' | 'Healthcare Proxy';
  avatar?: string;
  allergies: string;
  primaryCondition?: string;
  emergencyContact: string;
  emergencyPhone: string;
  primaryDoctor?: string;
  doctorPhone?: string;
  deliveryStreet: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZip: string;
  insuranceOrHsaProvider?: string;
  memberId: string;
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
}

export interface UserSettings {
  autoRefill: boolean;
  bulkSupplyDefault: boolean;
  genericSubstitution: boolean;
  childCaps: boolean;
  smsDoseReminders: boolean;
  caregiverEscalation: boolean;
  deliverySms: boolean;
  emailStatements: boolean;
  twoFactorAuth: boolean;
}

export interface Dependent {
  id: string;
  name: string;
  relationship: 'Self' | 'Father' | 'Son' | 'Mother' | 'Daughter' | 'Spouse';
  age: number;
  dob: string;
  avatar: string;
  adherenceRate: number; // 0 - 100%
  activeMedsCount: number;
  urgentAlertsCount: number;
  primaryCondition: string;
  primaryDoctor: string;
  doctorPhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  hipaaAuthorized: boolean;
  notes?: string;
}

export type DoseStatus = 'pending' | 'taken' | 'skipped';

export interface TodayDose {
  id: string;
  medicationId: string;
  dependentId: string;
  timeSlot: 'Morning (8:00 AM)' | 'Afternoon (1:00 PM)' | 'Evening (8:00 PM)' | 'Bedtime (10:00 PM)';
  time: string;
  medicationName: string;
  genericName: string;
  brandEquivalent: string;
  dosage: string;
  instructions: string;
  pillColor: string;
  pillShape: 'round' | 'oval' | 'capsule' | 'inhaler';
  status: DoseStatus;
  takenAt?: string;
}

export interface Medication {
  id: string;
  dependentId: string;
  name: string;
  genericName: string;
  brandEquivalent: string;
  strength: string;
  form: 'Tablet' | 'Capsule' | 'Inhaler' | 'Solution' | 'Liquid';
  ndcNumber: string;
  bioequivalenceRating: 'AB' | 'AP' | 'AA';
  dosageInstructions: string;
  frequency: string;
  timing: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime' | 'As Needed')[];
  prescribingDoctor: string;
  doctorClinic: string;
  rxNumber: string;
  pillsRemaining: number;
  totalPills: number;
  daysSupplyLeft: number;
  refillsRemaining: number;
  lastRefillDate: string;
  nextRefillRecommendedDate: string;
  isLowSupply: boolean;
  isAsNeeded: boolean;
  color: string;
  shape: 'round' | 'oval' | 'capsule' | 'inhaler';
  priceGeneric: number;
  priceBrand: number;
  savingsPercentage: number;
  foodInstructions: 'Take with food' | 'Take on empty stomach' | 'Take before bedtime' | 'No specific food requirement';
  sideEffects: string[];
  warnings: string[];
}

export interface Prescription {
  id: string;
  rxNumber: string;
  dependentId: string;
  medicationName: string;
  genericName: string;
  brandEquivalent: string;
  strength: string;
  form: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorNpi: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  prescribedDate: string;
  expirationDate: string;
  refillsTotal: number;
  refillsRemaining: number;
  status: 'Active' | 'Pending Renewal' | 'Expiring Soon' | 'Transferred';
  sig: string; // dosage directions
  qtyPrescribed: number;
  daysSupply: number;
  genericSubstitutionPermitted: boolean;
  qrVerificationCode: string;
}

export interface OrderItem {
  id: string;
  medicationName: string;
  genericName: string;
  brandEquivalent: string;
  strength: string;
  quantity: number;
  daysSupply: number;
  batchNumber: string;
  expirationDate: string;
  priceGeneric: number;
  priceBrand: number;
  savedAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  status: 'Processing' | 'Pharmacist Review' | 'Dispensed & Packed' | 'Out for Delivery' | 'Delivered';
  carrier: string;
  trackingNumber: string;
  driverName?: string;
  driverPhone?: string;
  vehicleLocation?: { lat: number; lng: number; street: string; etaMinutes: number };
  temperatureControlled: boolean;
  tamperSealVerified: boolean;
  recipientName: string;
  recipientAddress: string;
  dependentId: string;
  items: OrderItem[];
  subtotal: number;
  genericDiscountSavings: number;
  shippingFee: number;
  tax: number;
  totalPaid: number;
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  type: 'dose_reminder' | 'refill_alert' | 'order_update' | 'caregiver_alert' | 'rx_renewal';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  dependentId: string;
  actionLabel?: string;
  actionTarget?: PageId;
  metadata?: Record<string, string>;
}

export interface DrugComparison {
  genericName: string;
  brandName: string;
  category: string;
  condition: string;
  genericPrice30Day: number;
  brandPrice30Day: number;
  genericPrice90Day: number;
  brandPrice90Day: number;
  savingsPercentage: number;
  commonDose: string;
  fdaBioequivalence: string;
}

// ── Phase 3 Types ─────────────────────────────────────────────────────────────

export type InteractionSeverity = 'minor' | 'moderate' | 'major' | 'contraindicated';

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  description: string;
  recommendation: string;
}

export interface InteractionCheckResult {
  interactions: DrugInteraction[];
  checkedMedications: string[];
}

export interface DailyAdherenceEntry {
  date: string;
  total: number;
  taken: number;
  skipped: number;
  pending: number;
}

export interface DependentAdherenceBreakdown {
  dependentId: string;
  name: string;
  total: number;
  taken: number;
  adherenceRate: number;
}

export interface AdherenceReport {
  period: { from: string; to: string; days: number };
  overallAdherenceRate: number;
  currentStreak: number;
  totalScheduled: number;
  totalTaken: number;
  daily: DailyAdherenceEntry[];
  dependentBreakdown: DependentAdherenceBreakdown[];
}

export type RefillUrgency = 'low' | 'medium' | 'high' | 'critical';

export interface RefillForecast {
  medicationId: string;
  medicationName: string;
  genericName: string;
  dependentId: string;
  dependentName: string;
  pillsRemaining: number;
  totalPills: number;
  supplyPercentage: number;
  daysSupplyLeft: number;
  runOutDate: string;
  refillByDate: string;
  refillsRemaining: number;
  needsRefillSoon: boolean;
  isLowSupply: boolean;
  urgency: RefillUrgency;
}

export interface RefillForecastReport {
  forecasts: RefillForecast[];
  urgentCount: number;
  criticalCount: number;
}

export interface ConsultationRecord {
  id: string;
  question: string;
  answer: string;
  medicationContext: string[];
  createdAt: string;
}

export interface OcrExtractedFields {
  medicationName: string;
  strength: string;
  form: string;
  doctorName: string;
  doctorNpi: string;
  clinicName: string;
  clinicPhone: string;
  sig: string;
  qtyPrescribed: number;
  refillsTotal: number;
  daysSupply: number;
}
