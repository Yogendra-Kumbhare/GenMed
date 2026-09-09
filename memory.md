# 🧠 Project Memory

> **Purpose:** Long-term memory for the GenericMed Patient & Caregiver Portal.
> AI assistants **must** read this file at the start of every session to understand the project's current state.
> Update this file whenever features, APIs, schemas, or business logic change.

---

## 📌 Project Overview

**GenericMed** is a Patient & Caregiver Web Portal that helps patients manage their medications, track doses, order refills, monitor delivery, and manage dependents — all while maximizing savings through generic drug substitution.

| Field             | Value                                                      |
| ----------------- | ---------------------------------------------------------- |
| **Product Name**  | GenericMed Patient & Caregiver Portal                      |
| **Type**          | Single Page Application (SPA)                              |
| **Target Users**  | Patients, Family Caregivers, Healthcare Proxies            |
| **Deployment**    | Google AI Studio / Cloud Run                               |
| **Repository**    | `Yogendra-Kumbhare/GenMed`                                 |
| **Current Phase** | Phase 2 — Backend & Auth (Active)                          |

---

## 🛠 Tech Stack

| Layer            | Technology                    | Version     |
| ---------------- | ----------------------------- | ----------- |
| **Framework**    | React                         | 19.x        |
| **Language**     | TypeScript                    | 5.8.x       |
| **Build Tool**   | Vite                          | 6.x         |
| **Styling**      | TailwindCSS                   | 4.x         |
| **Icons**        | lucide-react                  | 0.546.x     |
| **Animations**   | motion (Framer Motion)        | 12.x        |
| **AI**           | Google Gemini (`@google/genai`)| 2.4.x      |
| **Server**       | Express                       | 4.x         |
| **Database**     | PostgreSQL (Supabase)         | 15.x+       |
| **ORM**          | Prisma ORM                    | 6.x         |
| **Validation**   | Zod                           | 3.x         |
| **Auth**         | Custom JWT (`jsonwebtoken`)   | 9.x         |
| **Security**     | `bcryptjs`                    | 3.x         |
| **Dev Tooling**  | `concurrently`, `tsx`         | —           |
| **Env Config**   | dotenv                        | 17.x        |
| **Package Mgr**  | npm                           | —           |

### Key Configuration
- **Path alias:** `@/*` → project root (both `tsconfig.json` and `vite.config.ts`)
- **Dev client server:** `vite --port=3000 --host=0.0.0.0`
- **Dev API server:** `tsx watch src/server/index.ts` (port 3001)
- **Dev concurrent:** `npm run dev:all`
- **Dev proxy:** `/api` forwarded to `http://localhost:3001` via `vite.config.ts`
- **Build:** `vite build`
- **Lint:** `tsc --noEmit`
- **HMR:** Disabled via `DISABLE_HMR=true` env var in AI Studio

---

## ✅ Features Completed

### Authentication & Profile
- [x] Auth screen with login/signup flow (`AuthScreen.tsx`)
- [x] User profile modal with editable fields (`ProfileModal.tsx`)
- [x] User settings persistence to localStorage
- [x] Role support: Patient, Family Caregiver, Healthcare Proxy

### Dashboard
- [x] Today's dose schedule with time slots (Morning, Afternoon, Evening, Bedtime)
- [x] Dose status tracking (pending, taken, skipped)
- [x] Quick stats overview (active meds, adherence rate, etc.)
- [x] Navigation to all portal sections

### Medicine Cabinet
- [x] Full medication list with search/filter
- [x] Medication detail modal (`MedicationDetailModal.tsx`)
- [x] Add medication modal (`AddMedicationModal.tsx`)
- [x] Supply tracking (pills remaining, days left, refills)
- [x] Low supply alerts
- [x] Generic vs. brand pricing display

### Prescriptions
- [x] Prescription list with status filters (Active, Pending Renewal, Expiring Soon, Transferred)
- [x] Prescription details (doctor, clinic, Rx number, SIG, QR code)
- [x] Refill count tracking

### Orders & Tracking
- [x] Order history with status timeline
- [x] Order detail view with item breakdown
- [x] Status tracking: Processing → Pharmacist Review → Dispensed & Packed → Out for Delivery → Delivered
- [x] Temperature control and tamper seal indicators
- [x] Driver info and vehicle location (mock)

### Savings
- [x] Generic vs. brand price comparison table
- [x] Savings calculator
- [x] Drug comparison data with FDA bioequivalence ratings

### Dependents
- [x] Dependent list with adherence rates
- [x] Add and remove dependent profiles (with confirmation and local persistence)
- [x] Per-dependent medication and alert views
- [x] HIPAA authorization tracking
- [x] Relationship types: Self, Father, Mother, Son, Daughter, Spouse

### Notifications
- [x] Notification center with type filters
- [x] Types: dose_reminder, refill_alert, order_update, caregiver_alert, rx_renewal
- [x] Read/unread status management
- [x] Action buttons linking to relevant pages

### Settings
- [x] Auto-refill toggle
- [x] Bulk supply default
- [x] Generic substitution preference
- [x] Child safety caps
- [x] SMS dose reminders
- [x] Caregiver escalation
- [x] Delivery SMS notifications
- [x] Email statements
- [x] Two-factor authentication toggle

### Modals
- [x] Refill Modal (`RefillModal.tsx`)
- [x] Upload Rx Modal (`UploadRxModal.tsx`)
- [x] Pharmacist Consult Modal — AI-powered (`PharmacistConsultModal.tsx`)

### Layout
- [x] Responsive header with search, notifications, profile
- [x] Collapsible sidebar navigation
- [x] Mobile-friendly layout

---

## 🔲 Feature Status (Phase 2 In Progress)

### High Priority
- [x] Backend architecture design (PostgreSQL, Supabase, Prisma ORM, Express REST API)
- [x] Architecture Decision Records (ADR-008 through ADR-012)
- [~] Database schema definition (`prisma/schema.prisma`); seed script remains
- [~] JWT authentication (`requireAuth`); role-specific authorization remains
- [~] Zod validation for authentication and medications; remaining endpoint schemas remain
- [~] Express REST API: health, authentication, and medication listing/creation endpoints
- [~] Vite dev proxy; frontend API client integration remains
- [ ] Real-time order tracking with WebSockets

### Medium Priority
- [ ] Medication interaction checker
- [ ] Adherence analytics with charts/graphs
- [ ] Multi-language support (i18n)
- [ ] Dark mode toggle
- [ ] Push notifications (browser + mobile)
- [ ] Medication schedule PDF export
- [ ] Insurance claim submission

### Low Priority
- [ ] Caregiver delegation workflow
- [ ] Pharmacy network finder
- [ ] Telehealth integration
- [ ] Wearable device integration (Apple Health, Google Fit)
- [ ] Unit / integration / E2E test suite

---

## 🔌 API Endpoints & RBAC Authorization

> **Current Status:** Express REST API with Zod validation and JWT + Role-Based Access Control.

### Authentication
| Method | Endpoint              | Description                  | Auth / Roles | Zod Schema |
| ------ | --------------------- | ---------------------------- | ------------ | ---------- |
| POST   | `/api/auth/login`     | Login with email + password  | Public       | `loginSchema` |
| POST   | `/api/auth/register`  | Create new account           | Public       | `registerSchema` |
| POST   | `/api/auth/logout`    | Invalidate session           | Bearer Token | — |
| GET    | `/api/auth/me`        | Get current user profile     | Bearer Token | — |
| PUT    | `/api/auth/profile`   | Update user profile          | Bearer Token | `profileUpdateSchema` |
| PUT    | `/api/auth/settings`  | Update user preferences      | Bearer Token | `settingsUpdateSchema` |

### Medications
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| GET    | `/api/medications`              | List all medications         | All Roles    | — |
| GET    | `/api/medications/:id`          | Get medication detail        | All Roles    | — |
| POST   | `/api/medications`              | Add new medication           | Patient, Caregiver, Proxy | `medicationCreateSchema` |
| PUT    | `/api/medications/:id`          | Update medication & refills  | Patient, Caregiver, Proxy | `medicationUpdateSchema` |
| DELETE | `/api/medications/:id`          | Remove medication            | Patient, Caregiver, Proxy | — |

### Doses
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| GET    | `/api/doses/today`              | Get today's dose schedule    | All Roles    | — |
| PATCH  | `/api/doses/:id/status`         | Update dose status           | All Roles    | `doseStatusUpdateSchema` |

### Prescriptions
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| GET    | `/api/prescriptions`            | List all prescriptions       | All Roles    | — |
| GET    | `/api/prescriptions/:id`        | Get prescription detail      | All Roles    | — |
| POST   | `/api/prescriptions`            | Upload/create prescription   | Patient, Caregiver, Proxy | `prescriptionCreateSchema` |

### Orders
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| GET    | `/api/orders`                   | List all orders              | All Roles    | — |
| GET    | `/api/orders/:id`               | Get order detail + tracking  | All Roles    | — |
| POST   | `/api/orders`                   | Place refill order           | Patient, Caregiver, Proxy | `orderCreateSchema` |

### Dependents
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| GET    | `/api/dependents`               | List all dependents          | All Roles    | — |
| POST   | `/api/dependents`               | Add dependent                | Caregiver, Proxy, Patient | `dependentCreateSchema` |
| PUT    | `/api/dependents/:id`           | Update dependent             | Caregiver, Proxy, Patient | `dependentUpdateSchema` |
| DELETE | `/api/dependents/:id`           | Remove dependent             | Caregiver, Proxy, Patient | — |

### Notifications
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| GET    | `/api/notifications`            | List notifications           | All Roles    | — |
| PATCH  | `/api/notifications/:id/read`   | Mark as read                 | All Roles    | — |
| POST   | `/api/notifications/read-all`   | Mark all as read             | All Roles    | — |

### AI
| Method | Endpoint                        | Description                  | Auth / Roles | Zod Schema |
| ------ | ------------------------------- | ---------------------------- | ------------ | ---------- |
| POST   | `/api/ai/consult`               | Pharmacist AI consultation   | Bearer Token | `aiConsultSchema` |

---

## 🗄 Database Schema Summary

> **Current Status:** Defined via **Prisma ORM** (`prisma/schema.prisma`) for PostgreSQL hosted on **Supabase**. Supports connection pooling via `DATABASE_URL` and direct migrations via `DIRECT_URL`.

### Core Tables

```
users
├── id (UUID, PK)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── phone (VARCHAR)
├── dob (DATE)
├── role (ENUM: Patient, Family Caregiver, Healthcare Proxy)
├── avatar_url (VARCHAR, nullable)
├── allergies (TEXT)
├── primary_condition (VARCHAR, nullable)
├── emergency_contact (VARCHAR)
├── emergency_phone (VARCHAR)
├── primary_doctor (VARCHAR, nullable)
├── doctor_phone (VARCHAR, nullable)
├── delivery_address (JSONB)
├── insurance_info (JSONB)
├── settings (JSONB)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

dependents
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── name (VARCHAR)
├── relationship (ENUM: Self, Father, Mother, Son, Daughter, Spouse)
├── age (INT)
├── dob (DATE)
├── avatar_url (VARCHAR)
├── primary_condition (VARCHAR)
├── primary_doctor (VARCHAR)
├── doctor_phone (VARCHAR)
├── emergency_contact (VARCHAR)
├── emergency_phone (VARCHAR)
├── hipaa_authorized (BOOLEAN)
├── notes (TEXT, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

medications
├── id (UUID, PK)
├── dependent_id (UUID, FK → dependents)
├── name (VARCHAR)
├── generic_name (VARCHAR)
├── brand_equivalent (VARCHAR)
├── strength (VARCHAR)
├── form (ENUM: Tablet, Capsule, Inhaler, Solution, Liquid)
├── ndc_number (VARCHAR)
├── bioequivalence_rating (ENUM: AB, AP, AA)
├── dosage_instructions (TEXT)
├── frequency (VARCHAR)
├── timing (VARCHAR[])
├── prescribing_doctor (VARCHAR)
├── doctor_clinic (VARCHAR)
├── rx_number (VARCHAR)
├── pills_remaining (INT)
├── total_pills (INT)
├── days_supply_left (INT)
├── refills_remaining (INT)
├── last_refill_date (DATE)
├── next_refill_date (DATE)
├── is_low_supply (BOOLEAN)
├── is_as_needed (BOOLEAN)
├── color (VARCHAR)
├── shape (ENUM: round, oval, capsule, inhaler)
├── price_generic (DECIMAL)
├── price_brand (DECIMAL)
├── food_instructions (VARCHAR)
├── side_effects (TEXT[])
├── warnings (TEXT[])
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

prescriptions
├── id (UUID, PK)
├── dependent_id (UUID, FK → dependents)
├── medication_id (UUID, FK → medications, nullable)
├── rx_number (VARCHAR, UNIQUE)
├── doctor_name (VARCHAR)
├── doctor_specialty (VARCHAR)
├── doctor_npi (VARCHAR)
├── clinic_name (VARCHAR)
├── clinic_address (VARCHAR)
├── clinic_phone (VARCHAR)
├── prescribed_date (DATE)
├── expiration_date (DATE)
├── refills_total (INT)
├── refills_remaining (INT)
├── status (ENUM: Active, Pending Renewal, Expiring Soon, Transferred)
├── sig (TEXT)
├── qty_prescribed (INT)
├── days_supply (INT)
├── generic_substitution_permitted (BOOLEAN)
├── qr_verification_code (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

orders
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── dependent_id (UUID, FK → dependents)
├── order_number (VARCHAR, UNIQUE)
├── order_date (TIMESTAMP)
├── estimated_delivery (TIMESTAMP)
├── delivered_at (TIMESTAMP, nullable)
├── status (ENUM: Processing, Pharmacist Review, Dispensed & Packed, Out for Delivery, Delivered)
├── carrier (VARCHAR)
├── tracking_number (VARCHAR)
├── driver_name (VARCHAR, nullable)
├── driver_phone (VARCHAR, nullable)
├── vehicle_location (JSONB, nullable)
├── temperature_controlled (BOOLEAN)
├── tamper_seal_verified (BOOLEAN)
├── recipient_name (VARCHAR)
├── recipient_address (TEXT)
├── subtotal (DECIMAL)
├── generic_discount_savings (DECIMAL)
├── shipping_fee (DECIMAL)
├── tax (DECIMAL)
├── total_paid (DECIMAL)
├── payment_method (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

order_items
├── id (UUID, PK)
├── order_id (UUID, FK → orders)
├── medication_name (VARCHAR)
├── generic_name (VARCHAR)
├── brand_equivalent (VARCHAR)
├── strength (VARCHAR)
├── quantity (INT)
├── days_supply (INT)
├── batch_number (VARCHAR)
├── expiration_date (DATE)
├── price_generic (DECIMAL)
├── price_brand (DECIMAL)
├── saved_amount (DECIMAL)
└── created_at (TIMESTAMP)

doses
├── id (UUID, PK)
├── medication_id (UUID, FK → medications)
├── dependent_id (UUID, FK → dependents)
├── scheduled_date (DATE)
├── time_slot (ENUM: Morning, Afternoon, Evening, Bedtime)
├── time (TIME)
├── status (ENUM: pending, taken, skipped)
├── taken_at (TIMESTAMP, nullable)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

notifications
├── id (UUID, PK)
├── user_id (UUID, FK → users)
├── dependent_id (UUID, FK → dependents)
├── type (ENUM: dose_reminder, refill_alert, order_update, caregiver_alert, rx_renewal)
├── title (VARCHAR)
├── message (TEXT)
├── is_read (BOOLEAN, DEFAULT false)
├── action_label (VARCHAR, nullable)
├── action_target (VARCHAR, nullable)
├── metadata (JSONB, nullable)
├── created_at (TIMESTAMP)
└── read_at (TIMESTAMP, nullable)
```

---

## 💡 Important Business Logic

### Dose Scheduling
- Doses are organized into 4 time slots: **Morning (8:00 AM)**, **Afternoon (1:00 PM)**, **Evening (8:00 PM)**, **Bedtime (10:00 PM)**.
- Each dose has a status: `pending` → `taken` or `skipped`.
- "As Needed" medications appear separately and are not auto-scheduled.
- Adherence rate = (taken doses / total scheduled doses) × 100.

### Supply & Refill Logic
- A medication is flagged as `isLowSupply` when `daysSupplyLeft` is critically low.
- `refillsRemaining` tracks how many refills the prescription allows.
- `nextRefillRecommendedDate` is calculated based on current supply rate.
- Auto-refill (if enabled in settings) should trigger when supply drops below threshold.

### Generic Savings Calculation
- `savingsPercentage` = ((priceBrand - priceGeneric) / priceBrand) × 100.
- All medications track both generic and brand pricing.
- `DrugComparison` type includes 30-day and 90-day pricing for both.
- FDA bioequivalence rating (AB, AP, AA) is displayed for transparency.

### Dependent Management
- Each user can manage multiple dependents.
- Medications and doses are scoped per dependent via `dependentId`.
- HIPAA authorization (`hipaaAuthorized`) must be flagged for non-self dependents.
- Caregiver escalation alerts are sent when a dependent misses doses.

### Order Lifecycle
```
Processing → Pharmacist Review → Dispensed & Packed → Out for Delivery → Delivered
```
- Temperature-controlled shipments are flagged.
- Tamper seal verification is tracked on delivery.
- Each order tracks generic discount savings separately.

### Notification Types
| Type               | Trigger                                    |
| ------------------ | ------------------------------------------ |
| `dose_reminder`    | Upcoming dose time                         |
| `refill_alert`     | Low supply threshold reached               |
| `order_update`     | Order status change                        |
| `caregiver_alert`  | Dependent missed dose or health event      |
| `rx_renewal`       | Prescription expiring soon                 |

### Authentication & Roles
| Role                 | Capabilities                                |
| -------------------- | ------------------------------------------- |
| Patient              | Full self-management                        |
| Family Caregiver     | Manage dependents, receive alerts           |
| Healthcare Proxy     | Full access to dependent records (HIPAA)    |

---

## ⚠️ Known Issues

| #  | Issue                                           | Severity | Status   |
| -- | ----------------------------------------------- | -------- | -------- |
| 1  | No backend — all data resets on localStorage clear | High   | By design (Phase 1) |
| 2  | No real authentication — auth screen is cosmetic | High    | Planned for Phase 2  |
| 3  | Order tracking map is mock (no live GPS)         | Medium   | Planned  |
| 4  | No test suite                                    | Medium   | Planned  |
| 5  | Large `App.tsx` (625 lines) — needs splitting    | Low      | Backlog  |
| 6  | Settings page is very large (47KB) — needs refactor | Low   | Backlog  |

---

## 🗺 Future Roadmap

### Phase 2 — Backend & Auth
- [ ] Set up Express API with database (PostgreSQL or Firestore)
- [ ] Implement JWT authentication
- [ ] Migrate mock data to database seeding
- [ ] Connect frontend to live API endpoints
- [ ] Real-time notifications via WebSocket

### Phase 3 — Intelligence & Analytics
- [ ] Medication interaction checker (AI-powered)
- [ ] Adherence analytics dashboard with charts
- [ ] Smart refill predictions
- [ ] Pharmacist consultation history
- [ ] Prescription OCR upload

### Phase 4 — Scale & Polish
- [ ] Multi-language (i18n) support
- [ ] Dark mode
- [ ] PWA / mobile app wrapper
- [ ] Push notifications
- [ ] HIPAA compliance audit
- [ ] Performance optimization & code splitting
- [ ] Comprehensive test suite (Vitest + Playwright)

### Phase 5 — Ecosystem
- [ ] Pharmacy network integration
- [ ] Insurance/HSA claim submission
- [ ] Telehealth video calls
- [ ] Wearable device sync
- [ ] Caregiver collaboration features
