# 📝 Changelog

> **Purpose:** Chronological history of all changes to the GenericMed Patient & Caregiver Portal.
> Follow [Keep a Changelog](https://keepachangelog.com/) conventions.
> AI assistants **must** add an entry here for every `feat`, `fix`, or breaking change.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

_Upcoming changes that haven't been tagged in a release yet._

---

## [0.5.0] — 2026-09-09

> Phase 4 — Scale & Polish complete.

### Added
- **Modular Settings Architecture (ADR-015)**: Split `SettingsPage.tsx` from 1119 lines into 6 sub-components (`ProfileSection`, `DeliverySection`, `PaymentSection`, `PharmacySection`, `NotificationSection`, `SecuritySection`) in `src/components/settings/`.
- **Dark Mode Coverage & Toolbar Integration**: Added full Tailwind `dark:` variant support across Header, Sidebar, pages, modals, and dropdowns. Integrated `ThemeToggle` (compact) and `LanguageSwitcher` into `Header.tsx`.
- **Accessibility & ARIA Audit**: Enhanced modal dialog accessibility (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), added `aria-label` to all icon-only buttons, and configured `aria-live` regions for status updates.
- **Comprehensive Vitest & Testing Suite**: Established unit and component test infrastructure (`src/test/setup.ts`, `businessLogic.test.ts`, `ThemeToggle.test.tsx`, `LanguageSwitcher.test.tsx`, `PushNotificationManager.test.tsx`). Verified 100% test pass rate (33/33 tests).
- **Progressive Web App & Push Notifications**: PWA manifest and service worker integration verified; `PushNotificationManager` banner and settings toggle wired.

---

## [0.4.0] — 2026-09-09

> Phase 3 — Intelligence & Analytics complete.

### Added

#### Drug Interaction Checker (3.1)
- `POST /api/ai/interactions` — Gemini-powered drug-drug interaction analysis returning severity-ranked results (minor / moderate / major / contraindicated)
- `DrugInteractionChecker` component (`src/components/DrugInteractionChecker.tsx`) embedded in `MedicationDetailModal` — checks current medication against all others on demand
- Offline-fallback demo interactions when API is unavailable
- `interactionCheckSchema` Zod validation

#### Adherence Analytics (3.2)
- `GET /api/analytics/adherence` — server-side Prisma aggregate returning daily breakdown, overall rate, current streak, and per-dependent summary
- `AnalyticsPage.tsx` — new page with Recharts v3 area chart (daily taken/skipped), bar chart (per-dependent rate), streak card, and summary stat tiles
- `analytics` added to `PageId` type; Analytics entry added to Sidebar navigation
- `adherenceQuerySchema` Zod validation (dependentId + days params)
- Offline mock data fallback so page renders without a live backend

#### Smart Refill Forecast (3.3)
- `GET /api/analytics/refill-forecast` — per-medication run-out date prediction, urgency tiers (critical / high / medium / low), 14-day refill threshold
- Refill forecast table embedded in `AnalyticsPage` with supply percentage bar, urgency badge, and refill-by date
- `refillForecastQuerySchema` Zod validation

#### Pharmacist Consultation History (3.4)
- `Consultation` model added to `prisma/schema.prisma` (userId FK, question, answer, medicationContext string array)
- `GET /POST /DELETE /api/consultations` — list, save, and remove consultation records
- `PharmacistConsultModal` updated with Consult / History tab bar — history tab shows expandable records with delete
- Consultation auto-saved on callback submission; medication context forwarded to pharmacist
- `consultationCreateSchema` Zod validation

#### Prescription OCR (3.5)
- `POST /api/ai/ocr` — Gemini multimodal (image/pdf → structured JSON) extracting medication name, strength, form, doctor, clinic, sig, qty, refills, days supply
- `UploadRxModal` now has a real `<input type="file">` Browse File button that triggers OCR and auto-populates all form fields
- `ocrSchema` Zod validation (base64 + mimeType)

#### Infrastructure & Types
- `prisma.config.ts` created for Prisma v7 connection adapter pattern
- `@prisma/adapter-pg` and `pg` added for PostgreSQL direct connection
- `src/server/db/client.ts` updated to use `PrismaPg` adapter
- `prisma/schema.prisma` migrated to Prisma v7 multi-line enum syntax
- `UserRole` type moved to local middleware definition (removed `@prisma/client` import from auth middleware)
- `prisma.config.ts` excluded from `tsconfig.json` compilation
- `recharts@3.1.0` added as production dependency
- Phase 3 types added to `src/types.ts`: `DrugInteraction`, `InteractionSeverity`, `AdherenceReport`, `DailyAdherenceEntry`, `DependentAdherenceBreakdown`, `RefillForecast`, `RefillForecastReport`, `ConsultationRecord`, `OcrExtractedFields`, `RefillUrgency`
- Express JSON body limit increased to `10mb` for base64 OCR payloads
- `aiConsultSchema`, `ocrSchema`, `adherenceQuerySchema`, `refillForecastQuerySchema`, `consultationCreateSchema` added to `src/server/validators/schemas.ts`

---

## [0.2.0] — 2026-09-09

> Phase 2 — Backend & Auth complete.

### Added

#### Database
- PostgreSQL schema via Prisma ORM covering all 8 core models: `User`, `Dependent`, `Medication`, `Dose`, `Prescription`, `Order`, `OrderItem`, `Notification`
- Prisma migration setup with `DATABASE_URL` (pooler) and `DIRECT_URL` (direct) Supabase connection support
- Seed script (`prisma/seed.ts`) bootstrapping the database from existing `mockData.ts`

#### API Server
- Express REST API with full CRUD coverage across all entity groups: auth, medications, doses, prescriptions, orders, dependents, notifications, and AI consult
- Centralized error handling middleware — Zod validation errors return structured 400 responses; Prisma unique constraint violations return 409
- Global `ZodError` and Prisma `P2002` error handlers in `src/server/index.ts`
- Zod validation schemas for all request bodies and params (`src/server/validators/schemas.ts`)
- `/api/health` endpoint for liveness checks

#### Authentication & Security
- JWT access token generation and validation (`jsonwebtoken`, 15-minute expiry)
- JWT refresh token flow for session continuity
- `bcryptjs` password hashing (12 salt rounds) on register
- `requireAuth` middleware validating `Authorization: Bearer <token>` on all protected routes
- `requireRole` RBAC middleware enforcing role boundaries (`Patient`, `Family Caregiver`, `Healthcare Proxy`)
- `AuthScreen.tsx` connected to live `/api/auth/register` and `/api/auth/login` endpoints
- Logout clears token from localStorage and invalidates client session

#### Frontend Integration
- Typed API client (`src/services/api.ts`) with `Authorization` header injection and 401 auto-redirect
- All 8 pages refactored from `useState` + mock imports to `useEffect` + API calls
- Loading skeleton states added to all pages
- Error boundary and inline error states for failed API responses
- Optimistic updates for dose taken/skipped actions (instant UI feedback, rollback on failure)
- localStorage retained as offline fallback only; primary state sourced from API

#### Real-Time
- WebSocket server integrated into Express for live notification delivery
- Dose reminder push at scheduled times (Morning 8 AM, Afternoon 1 PM, Evening 8 PM, Bedtime 10 PM)
- Live order status updates broadcast to connected clients on status change

#### Developer Experience
- `concurrently` script (`npm run dev:all`) starts Vite client and Express API simultaneously
- Vite dev proxy forwards `/api/*` to `http://localhost:3001` — eliminates CORS in development
- `tsx watch` enables hot-reload for the Express server during development
- `.env.example` updated with all required variables: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `PORT`, `GEMINI_API_KEY`, `APP_URL`
- Architecture Decision Records ADR-008 through ADR-012 added to `decisions.md`

### Changed
- `App.tsx` state initialization now hydrates from API on mount instead of `mockData.ts`
- `AuthScreen.tsx` auth flow wired to real backend — cosmetic-only login replaced with live registration and login
- `mockData.ts` retained for seeding only; no longer imported by application components

### Removed
- Direct `mockData.ts` imports from all page and modal components (replaced by API responses)

---

## [0.1.0] — 2026-09-08

### Added

#### Authentication & Profile
- Auth screen with login and signup flow
- Profile modal with editable user fields (name, email, phone, DOB, role, allergies, emergency contacts, delivery address, insurance info)
- User settings persistence via localStorage
- Role support: Patient, Family Caregiver, Healthcare Proxy

#### Dashboard
- Today's dose schedule organized by time slots (Morning, Afternoon, Evening, Bedtime)
- Dose status tracking with pending/taken/skipped states
- Quick stats overview panel
- Navigation hub to all portal sections

#### Medicine Cabinet
- Full medication list view with search and filter capabilities
- Medication detail modal with drug info, supply status, pricing, side effects, and warnings
- Add medication modal for manual entry
- Supply tracking (pills remaining, days supply left, refills remaining)
- Low supply visual alerts
- Generic vs. brand pricing comparison per medication

#### Prescriptions
- Prescription list with status filters (Active, Pending Renewal, Expiring Soon, Transferred)
- Prescription detail view (prescriber info, clinic, Rx number, SIG directions, QR verification)
- Refill count tracking per prescription

#### Orders & Tracking
- Order history list with status indicators
- Order detail view with item-level breakdown and pricing
- Five-stage status pipeline: Processing → Pharmacist Review → Dispensed & Packed → Out for Delivery → Delivered
- Temperature control and tamper seal verification indicators
- Mock driver info and vehicle location display

#### Savings
- Generic vs. brand drug comparison table
- Savings calculator with 30-day and 90-day pricing
- FDA bioequivalence rating display (AB, AP, AA)

#### Dependents
- Dependent list with adherence rate display
- Add, edit, and delete dependent profiles
- Per-dependent medication and alert filtering
- HIPAA authorization tracking
- Relationship types: Self, Father, Mother, Son, Daughter, Spouse

#### Notifications
- Notification center with category filters
- Five notification types: dose_reminder, refill_alert, order_update, caregiver_alert, rx_renewal
- Read/unread status management
- Action buttons linking to relevant portal pages

#### Settings
- Auto-refill toggle
- Bulk supply default preference
- Generic substitution preference
- Child safety caps toggle
- SMS dose reminders
- Caregiver escalation alerts
- Delivery SMS notifications
- Email statements
- Two-factor authentication toggle

#### Modals
- Refill order modal with medication selection and confirmation
- Upload Rx modal for prescription image upload
- Pharmacist Consult modal with AI-powered chat (Gemini API)

#### Layout & Navigation
- Responsive header with search, notification badge, and profile menu
- Collapsible sidebar with page navigation
- Mobile-responsive layout

#### Infrastructure
- React 19 + TypeScript 5.8 + Vite 6 project setup
- TailwindCSS v4 with Vite plugin integration
- lucide-react icon library
- motion (Framer Motion) animation library
- Express server for API proxy
- Google Gemini AI API integration
- Centralized mock data system (`mockData.ts`)
- Centralized type definitions (`types.ts`)
- Environment variable management via dotenv
- localStorage-based state persistence with `genericmed_` prefix
- Path alias `@/*` for clean imports

---

<!-- ## Template for Future Entries

## [X.Y.Z] — YYYY-MM-DD

### Added
- New features

### Changed
- Changes to existing functionality

### Fixed
- Bug fixes

### Deprecated
- Features that will be removed in future versions

### Removed
- Features removed in this release

### Security
- Security-related changes

-->
