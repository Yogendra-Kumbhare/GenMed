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

### Added
- Persistent local storage for portal records, including medications, doses, prescriptions, orders, and notifications
- Dashboard dates now reflect the current day and medication supply remaining
- Modal workflows now reset safely when reopened and create internally consistent medication and prescription records
- Removed unsafe frontend type assertions in medication creation and sorting controls
- Refill orders now use the selected supply quantity and prevent orders without remaining refills
- Improved keyboard and screen-reader support for modal controls and refill supply choices
- Family member removal controls with a confirmation step and related local-data cleanup
- Phase 2 backend foundation: Prisma data models for users, dependents, medications, and doses
- Express API server with health, authentication, and medication endpoints
- JWT authentication middleware, bcrypt password hashing, and Zod request validation
- Development API proxy and combined client/server development command
- `decisions.md` — Architecture Decision Records for persistent AI context
- `rules.md` — Project rules and coding standards for AI assistants
- `memory.md` — Long-term project memory with tech stack, features, and roadmap
- `changelog.md` — This file; chronological change history

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
