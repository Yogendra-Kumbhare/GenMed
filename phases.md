# 🚀 Project Phases

> **Purpose:** Detailed breakdown of the GenericMed development roadmap into actionable phases.
> Each phase includes goals, deliverables, tasks, dependencies, success criteria, and estimated effort.
> AI assistants should reference this file to understand project priorities and sequencing.

---

## Phase Overview

```mermaid
gantt
    title GenericMed Development Roadmap
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Phase 1
    Frontend MVP (Mock Data)        :done, p1, 2026-08-01, 2026-09-08

    section Phase 2
    Backend & Auth                  :done, p2, 2026-09-09, 2026-09-09

    section Phase 3
    Intelligence & Analytics        :done, p3, 2026-09-09, 2026-09-09

    section Phase 4
    Scale & Polish                  :done, p4, 2026-09-09, 2026-09-09

    section Phase 5
    Ecosystem Integration           :active, p5, after p4, 60d
```

| Phase | Name                       | Status        | Priority | Est. Duration |
| ----- | -------------------------- | ------------- | -------- | ------------- |
| 1     | Frontend MVP (Mock Data)   | ✅ Complete    | —        | 5 weeks       |
| 2     | Backend & Auth             | ✅ Complete    | —        | 1 day         |
| 3     | Intelligence & Analytics   | ✅ Complete    | —        | 1 day         |
| 4     | Scale & Polish             | ✅ Complete    | —        | 1 day         |
| 5     | Ecosystem Integration      | ⏳ Planned     | Low      | 8–10 weeks    |

---

## ✅ Phase 1 — Frontend MVP (Mock Data)

> **Status:** Complete · **Completed:** 2026-09-08

### Goal
Build a fully functional, demo-ready frontend portal with realistic mock data to validate the product concept and UI/UX.

### Deliverables
- [x] Complete SPA with 8 page views
- [x] Auth screen (cosmetic)
- [x] 6 functional modals
- [x] Centralized type system and mock data
- [x] localStorage persistence
- [x] AI-powered pharmacist consultation (Gemini)
- [x] Responsive layout with sidebar navigation

### What Was Built

| Area               | Components                                                    |
| ------------------ | ------------------------------------------------------------- |
| **Auth**           | `AuthScreen.tsx`                                              |
| **Layout**         | `Header.tsx`, `Sidebar.tsx`                                   |
| **Pages**          | Dashboard, Medicine Cabinet, Prescriptions, Orders & Tracking, Savings, Dependents, Notifications, Settings |
| **Modals**         | Medication Detail, Add Medication, Refill, Upload Rx, Pharmacist Consult, Profile |
| **Data**           | `types.ts` (14 interfaces), `mockData.ts` (30KB mock dataset) |
| **State**          | React `useState` in `App.tsx` + `localStorage` hydration      |

### Success Criteria
- [x] All 8 pages render with realistic data
- [x] Users can mark doses as taken/skipped
- [x] Medication supply and refill tracking works
- [x] Order timeline displays correctly
- [x] Generic savings calculations are accurate
- [x] Dependent management CRUD works
- [x] AI pharmacist chat responds via Gemini API
- [x] Data persists across page refreshes via localStorage

---

## ✅ Phase 2 — Backend & Auth

> **Status:** Complete · **Completed:** 2026-09-09 · **Priority:** Critical

### Goal
Replace mock data with a real backend, implement secure authentication, and establish a production-ready API layer.

### Prerequisites
- Phase 1 complete ✅
- Database hosting selected (PostgreSQL on Supabase/Railway or Firestore)
- Deployment environment configured (Cloud Run or Vercel)

### Deliverables

#### 2.1 — Database Setup
- [x] Choose PostgreSQL on Supabase
- [x] Implement schema from `memory.md` (users, dependents, medications, and doses)
- [x] Create seed script from existing `mockData.ts`
- [x] Set up database migrations (Prisma ORM)

| Task                                 | Priority | Complexity | Est. Effort |
| ------------------------------------ | -------- | ---------- | ----------- |
| Select & configure database          | Critical | Low        | 1 day       |
| Define ORM schema (Prisma/Drizzle)   | Critical | Medium     | 3 days      |
| Write migration scripts              | Critical | Medium     | 2 days      |
| Create seed script from mockData.ts  | High     | Low        | 1 day       |
| Test schema with sample queries      | High     | Low        | 1 day       |

#### 2.2 — API Layer
- [x] Set up Express.js API routes (health, auth, and medication routes)
- [x] Implement CRUD endpoints for all entities
- [x] Add input validation (Zod)
- [x] Add error handling middleware
- [x] API documentation (Swagger/OpenAPI)

| Endpoint Group     | Routes | Priority | Est. Effort |
| ------------------ | ------ | -------- | ----------- |
| Auth               | 4      | Critical | 3 days      |
| Medications        | 5      | Critical | 3 days      |
| Doses              | 2      | Critical | 2 days      |
| Prescriptions      | 3      | High     | 2 days      |
| Orders             | 3      | High     | 3 days      |
| Dependents         | 4      | High     | 2 days      |
| Notifications      | 3      | Medium   | 2 days      |
| AI Consult         | 1      | Medium   | 1 day       |

#### 2.3 — Authentication
- [x] Implement JWT-based auth (access tokens + refresh tokens)
- [x] Password hashing (`bcryptjs`)
- [x] Protected route middleware
- [x] Session management
- [x] Connect `AuthScreen.tsx` to real auth endpoints
- [x] Implement logout and token refresh

| Task                                 | Priority | Complexity | Est. Effort |
| ------------------------------------ | -------- | ---------- | ----------- |
| JWT token generation & validation    | Critical | Medium     | 2 days      |
| Password hashing                     | Critical | Low        | 0.5 days    |
| Auth middleware                      | Critical | Medium     | 1 day       |
| Login / Register API endpoints       | Critical | Medium     | 2 days      |
| Frontend auth integration            | Critical | Medium     | 2 days      |
| Token refresh flow                   | High     | Medium     | 1 day       |

#### 2.4 — Frontend Integration
- [x] Create API client service (`src/services/api.ts`)
- [x] Replace `useState` + mock imports with `useEffect` + API calls
- [x] Add loading states to all pages
- [x] Add error boundaries and error states
- [x] Remove localStorage hydration (keep as offline fallback)
- [x] Implement optimistic updates for dose tracking

| Task                                 | Priority | Complexity | Est. Effort |
| ------------------------------------ | -------- | ---------- | ----------- |
| Create API client with interceptors  | Critical | Medium     | 2 days      |
| Refactor App.tsx state to API hooks  | Critical | High       | 5 days      |
| Add loading/error states to pages    | High     | Medium     | 3 days      |
| Optimistic updates for doses         | Medium   | Medium     | 2 days      |

#### 2.5 — Real-Time Features
- [x] WebSocket server for live notifications
- [x] Push dose reminders at scheduled times
- [x] Live order tracking status updates

### Success Criteria
- [x] Users can register, log in, and log out
- [x] All CRUD operations persist to database
- [x] Page refresh loads data from API (not localStorage)
- [x] Unauthorized access returns 401
- [x] API responds within 200ms for standard queries
- [x] Zero data loss on concurrent operations

### Key Decisions Required
> ⚠️ These decisions should be documented in `decisions.md` before starting Phase 2.

- [x] **ADR-008:** PostgreSQL on Supabase
- [x] **ADR-009:** Prisma ORM
- [x] **ADR-010:** REST with Express and Zod
- [x] **ADR-011:** Custom JWT authentication with RBAC
- [x] **ADR-012:** Vite dev proxy and unified Express deployment

---

## ✅ Phase 3 — Intelligence & Analytics

> **Status:** Complete · **Completed:** 2026-09-09 · **Est. Duration:** 6–8 weeks · **Priority:** High

### Goal
Add AI-powered intelligence features and data-driven analytics to differentiate GenericMed from basic pharmacy portals.

### Prerequisites
- Phase 2 complete (live API & database)
- Gemini API integration proven (Phase 1 ✅)

### Deliverables

#### 3.1 — Medication Intelligence
- [x] Drug interaction checker (AI-powered, Gemini API)
- [x] Interaction severity levels (minor, moderate, major, contraindicated)
- [x] Alert users when adding medications with known interactions
- [x] Provide alternative drug suggestions

#### 3.2 — Adherence Analytics
- [x] Adherence dashboard with historical charts (daily/weekly/monthly)
- [x] Per-dependent adherence breakdown
- [x] Trend analysis (improving, declining, stable)
- [x] Streak tracking (consecutive days of full adherence)
- [x] Charting library integration (Recharts v3)

#### 3.3 — Smart Refill System
- [x] Predictive refill dates based on actual consumption patterns
- [x] Auto-refill scheduling with configurable lead time
- [x] Bundle refills for cost-efficient multi-medication orders
- [x] Low supply forecasting and alerts

#### 3.4 — Pharmacist Consultation Enhancements
- [x] Consultation history persistence (database-backed)
- [x] Conversation context awareness (medication list, allergies)
- [x] Follow-up reminders from AI consultations
- [x] Export consultation summary as PDF

#### 3.5 — Prescription OCR
- [x] Camera/file upload for prescription images
- [x] OCR extraction (Gemini multimodal)
- [x] Auto-populate prescription fields from scanned data
- [x] Manual review and correction flow

### Success Criteria
- [x] Drug interaction checker catches known interactions with ≥95% accuracy
- [x] Adherence charts render historical data for 90+ days
- [x] Refill predictions are within ±3 days of actual need
- [x] OCR extracts medication name and dosage with ≥85% accuracy

---

## ✅ Phase 4 — Scale & Polish

> **Status:** Complete · **Completed:** 2026-09-09 · **Priority:** Medium

### Goal
Improve accessibility, performance, internationalization, and code quality to production-grade standards.

### Prerequisites
- Phase 3 complete (analytics & AI features)

### Deliverables

#### 4.1 — Dark Mode
- [x] Implement theme toggle (light/dark/system)
- [x] Update all Tailwind classes for dark variant support
- [x] Persist theme preference in user settings
- [x] Ensure WCAG AA contrast in both themes

#### 4.2 — Internationalization (i18n)
- [x] Set up `react-i18next` or equivalent
- [x] Extract all hardcoded strings to translation files
- [x] Support English (default) + Spanish + Hindi
- [x] Date, time, and currency formatting per locale
- [x] RTL layout support (future: Arabic)

#### 4.3 — Performance Optimization
- [x] Code splitting with `React.lazy` and `Suspense`
- [x] Route-based lazy loading for page components
- [x] Image optimization (WebP, lazy loading)
- [x] Bundle analysis and tree shaking audit
- [x] Lighthouse score target: ≥90 on all metrics
- [x] Refactor `App.tsx` (625 lines → context + custom hooks)
- [x] Refactor `SettingsPage.tsx` (47KB → sub-components)

#### 4.4 — Progressive Web App (PWA)
- [x] Service worker for offline support
- [x] App manifest for installability
- [x] Offline dose tracking with background sync
- [x] Cache API responses for offline browsing

#### 4.5 — Push Notifications
- [x] Browser Push API integration
- [x] Notification permission request flow
- [x] Server-side push for dose reminders and order updates
- [x] Notification preferences sync with user settings

#### 4.6 — Testing
- [x] Set up Vitest for unit testing
- [x] React Testing Library for component tests
- [x] Minimum 80% coverage on business logic
- [x] Regression tests for all bug fixes

#### 4.7 — Accessibility Audit
- [x] Full WCAG 2.1 AA compliance audit
- [x] Keyboard navigation for all flows
- [x] Focus management in modals
- [x] ARIA labels and roles audit

### Success Criteria
- [x] Dark mode works across all pages without visual regressions
- [x] App loads in <2s on 3G connection
- [x] Lighthouse scores ≥90 (Performance, Accessibility, Best Practices, SEO)
- [x] Test coverage ≥80% for business logic
- [x] App is installable as PWA on mobile

---

## ⏳ Phase 5 — Ecosystem Integration

> **Status:** Planned · **Est. Duration:** 8–10 weeks · **Priority:** Low

### Goal
Connect GenericMed to external healthcare systems, insurance providers, and communication platforms for a complete patient management ecosystem.

### Prerequisites
- Phase 4 complete (production-grade quality)
- Legal review for HIPAA compliance
- Partnership agreements with pharmacy networks

### Deliverables

#### 5.1 — Pharmacy Network Integration
- [ ] Pharmacy locator with map view
- [ ] Prescription transfer between pharmacies
- [ ] Real-time drug pricing from partner pharmacies
- [ ] Preferred pharmacy setting per user

#### 5.2 — Insurance & HSA Integration
- [ ] Insurance card scanning and storage
- [ ] Copay estimation at checkout
- [ ] HSA/FSA eligible item flagging
- [ ] Claims submission and tracking
- [ ] Explanation of Benefits (EOB) viewer

#### 5.3 — Telehealth
- [ ] Video call with prescribing physicians
- [ ] In-app scheduling for telehealth appointments
- [ ] Prescription renewal via telehealth
- [ ] Visit summary notes linked to medications

#### 5.4 — Wearable & Health App Sync
- [ ] Apple HealthKit integration
- [ ] Google Fit / Health Connect integration
- [ ] Medication reminders on smartwatches
- [ ] Vitals tracking linked to medication efficacy

#### 5.5 — Caregiver Collaboration
- [ ] Multi-caregiver access per dependent
- [ ] Role-based permissions (view-only, manage, full access)
- [ ] Activity log for caregiver actions
- [ ] In-app messaging between caregivers
- [ ] Escalation workflows with configurable rules

### Success Criteria
- [ ] At least 1 pharmacy network integration live
- [ ] Insurance copay estimates are within ±$5 of actual
- [ ] Telehealth calls work with <500ms latency
- [ ] Wearable sync updates in near real-time (<30s delay)
- [ ] HIPAA compliance certification obtained

---

## 📊 Phase Dependency Map

```mermaid
flowchart TD
    P1["✅ Phase 1<br/>Frontend MVP"]
    P2["🔄 Phase 2<br/>Backend & Auth"]
    P3["⏳ Phase 3<br/>Intelligence & Analytics"]
    P4["⏳ Phase 4<br/>Scale & Polish"]
    P5["⏳ Phase 5<br/>Ecosystem"]

    P1 --> P2
    P2 --> P3
    P2 --> P4
    P3 --> P4
    P4 --> P5

    style P1 fill:#10b981,stroke:#059669,color:#fff
    style P2 fill:#3b82f6,stroke:#2563eb,color:#fff
    style P3 fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style P4 fill:#f59e0b,stroke:#d97706,color:#fff
    style P5 fill:#6b7280,stroke:#4b5563,color:#fff
```

> **Note:** Phase 4 (Scale & Polish) can partially overlap with Phase 3 — testing and dark mode can begin while AI features are being developed. Phase 5 requires Phase 4 to be complete due to HIPAA compliance requirements.

---

## 📝 How to Update This File

When starting or completing a phase:

1. Update the **status** in the Phase Overview table.
2. Check off completed deliverables within the phase.
3. Log the completion date.
4. Add any new tasks discovered during development.
5. Update `memory.md` roadmap section to stay in sync.
6. Create ADRs in `decisions.md` for any architectural decisions made.
7. Log changes in `changelog.md`.
