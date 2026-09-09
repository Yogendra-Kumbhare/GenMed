# 📋 Architecture Decision Records (ADR)

> **Purpose:** Document every important technical and product decision for the GenericMed Patient & Caregiver Portal.
> Every AI assistant working on this project **must** read this file before making changes and **must** append a new entry here when making a significant decision.

---

## How to Use This File

1. **Before making a change** — scan existing decisions to avoid contradictions.
2. **After making a decision** — append a new entry using the template below.
3. **Never delete entries** — mark superseded decisions with `⛔ SUPERSEDED by ADR-XXX`.

### Entry Template

```markdown
## ADR-XXX: [Decision Title]

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | YYYY-MM-DD                       |
| **Status**             | ✅ Accepted / ⛔ Superseded / 🔄 Proposed |
| **Deciders**           | [who was involved]               |

### Context / Problem
[Describe the problem or situation that required a decision.]

### Decision
[State the decision clearly.]

### Reasoning
[Explain why this option was chosen.]

### Alternatives Considered
| Alternative            | Pros                  | Cons                     |
| ---------------------- | --------------------- | ------------------------ |
| Option A               | …                     | …                        |
| Option B               | …                     | …                        |

### Impact on Project
[How does this affect the codebase, team, timeline, or users?]
```

---

## ADR-001: Use React + TypeScript + Vite as the Frontend Stack

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
The project needed a modern, fast, type-safe frontend framework for building a healthcare patient portal with complex state management and many interactive components.

### Decision
Use **React 19** with **TypeScript 5.8** and **Vite 6** as the build tool.

### Reasoning
- React has the largest ecosystem for healthcare/enterprise UIs.
- TypeScript provides compile-time safety critical for healthcare data types.
- Vite offers near-instant HMR and fast cold starts, improving developer experience.

### Alternatives Considered
| Alternative            | Pros                              | Cons                                |
| ---------------------- | --------------------------------- | ----------------------------------- |
| Next.js                | SSR, file-based routing           | Heavier, unnecessary for SPA portal |
| Vue + Vite             | Simpler API                       | Smaller healthcare ecosystem        |
| Plain React (CRA)      | Familiar                          | Slow builds, deprecated             |

### Impact on Project
- All source code is in `src/` as `.tsx` / `.ts` files.
- Path alias `@/*` maps to project root via `tsconfig.json` and `vite.config.ts`.
- Build target is ES2022 with bundler module resolution.

---

## ADR-002: Use TailwindCSS v4 for Styling

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
Needed a consistent, rapid styling approach that avoids CSS drift across 15+ component files.

### Decision
Use **TailwindCSS v4** with the `@tailwindcss/vite` plugin. Styles are applied via utility classes directly in JSX.

### Reasoning
- Utility-first approach prevents class name collisions.
- v4's Vite plugin provides zero-config setup.
- Co-locating styles with markup speeds up iteration.

### Alternatives Considered
| Alternative            | Pros                          | Cons                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| CSS Modules            | Scoped by default             | More files, slower iteration     |
| Styled Components      | Dynamic theming               | Runtime cost, bundle size        |
| Vanilla CSS            | No dependencies               | Hard to maintain consistency     |

### Impact on Project
- `src/index.css` is minimal (Tailwind directives only).
- All component styling lives inline in `.tsx` files via `className`.
- Design tokens are managed through Tailwind config.

---

## ADR-003: Use Mock Data Instead of a Live Backend (Phase 1)

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
The initial version needs a fully functional UI for demos and investor presentations without waiting for backend API development.

### Decision
Use a centralized mock data file (`src/data/mockData.ts`) that exports typed initial state for all entities: dependents, medications, doses, prescriptions, orders, notifications, user profile, and settings.

### Reasoning
- Enables full UI development in parallel with backend planning.
- Typed mock data serves as a living API contract.
- Easy to swap with real API calls later (replace imports with `fetch`/`useQuery`).

### Alternatives Considered
| Alternative            | Pros                          | Cons                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| JSON Server            | REST-like                     | Extra setup, no type safety      |
| MSW (Mock Service Worker) | Intercepts fetch calls     | Over-engineering for Phase 1     |
| Firebase (live)        | Real persistence              | Premature, adds cost & complexity|

### Impact on Project
- All state is initialized from `src/data/mockData.ts`.
- State is managed via React `useState` in `App.tsx` and persisted to `localStorage`.
- When backend is ready, replace mock imports with API hooks.

---

## ADR-004: Client-Side State Management via useState + localStorage

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
The app has substantial state (8+ entity types) but no backend. Need persistence across page refreshes.

### Decision
Use React `useState` in the root `App.tsx` component with `localStorage` hydration on mount and manual saves on mutation.

### Reasoning
- Simple, no external dependencies.
- Sufficient for single-user portal without concurrent writes.
- Easy migration path: replace `localStorage` calls with API calls.

### Alternatives Considered
| Alternative            | Pros                          | Cons                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| Redux Toolkit          | Predictable, devtools         | Boilerplate for current scope    |
| Zustand                | Lightweight                   | Another dependency               |
| React Context only     | Built-in                      | No persistence, re-render issues |

### Impact on Project
- `App.tsx` is the single source of truth for all state.
- localStorage keys are prefixed with `genericmed_`.
- Props are drilled to page components (acceptable at current component depth).

---

## ADR-005: Use Gemini AI API for Intelligent Features

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
The portal needs AI-powered features such as pharmacist consultation chat and intelligent medication insights.

### Decision
Use the **Google Gemini API** (`@google/genai` SDK) with server-side API key management via environment variables.

### Reasoning
- Gemini provides strong medical/health context understanding.
- Server-side key keeps the API key secure (never exposed to client).
- AI Studio integration provides automatic secret injection at runtime.

### Alternatives Considered
| Alternative            | Pros                          | Cons                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| OpenAI GPT-4           | Mature ecosystem              | Higher cost, separate billing    |
| Local LLM              | Privacy                       | Resource-intensive, lower quality|
| No AI features         | Simpler                       | Misses product differentiation   |

### Impact on Project
- `GEMINI_API_KEY` must be set in `.env` (see `.env.example`).
- API calls are proxied through the Express server (`server.ts`).
- PharmacistConsultModal is the primary AI-powered feature.

---

## ADR-006: Lucide React for Iconography

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
Needed a consistent, tree-shakable icon library that works well with React and Tailwind.

### Decision
Use **lucide-react** as the sole icon library.

### Reasoning
- Tree-shakable (only imports used icons).
- Consistent stroke-based design language.
- Active maintenance and large icon set.

### Alternatives Considered
| Alternative            | Pros                          | Cons                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| Heroicons              | Tailwind-native               | Smaller set                      |
| React Icons            | Multiple icon packs           | Large bundle, inconsistent style |
| Custom SVGs            | Full control                  | Maintenance burden               |

### Impact on Project
- All icons import from `lucide-react`.
- Do **not** introduce a second icon library without an ADR.

---

## ADR-007: Motion (Framer Motion) for Animations

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Founding team                    |

### Context / Problem
Healthcare portals can feel sterile. Need polished micro-animations for a premium feel without complexity.

### Decision
Use the **motion** library (Framer Motion successor) for all UI animations.

### Reasoning
- Declarative API integrates naturally with React.
- Supports layout animations, gestures, and exit animations.
- Lightweight successor to Framer Motion.

### Alternatives Considered
| Alternative            | Pros                          | Cons                             |
| ---------------------- | ----------------------------- | -------------------------------- |
| CSS-only animations    | No dependency                 | Limited, verbose for complex UX  |
| React Spring           | Physics-based                 | Steeper API learning curve       |
| GSAP                   | Powerful                      | License concerns, imperative API |

### Impact on Project
- Import animations from `motion` (not `framer-motion`).
- Use for page transitions, modal enter/exit, and micro-interactions.

---

## ADR-008: Use PostgreSQL with Supabase for the Database Layer

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
Phase 2 requires moving from mock in-memory data to a durable, multi-user relational database with enterprise-grade consistency, foreign key cascades, transaction support, and scalable cloud hosting.

### Decision
Adopt **PostgreSQL** hosted via **Supabase** as the primary relational database layer.

### Reasoning
- Full relational integrity: supports strict foreign keys, enums, checks, and transactions needed for healthcare records.
- Supabase provides fully managed PostgreSQL with connection pooling (PgBouncer) and direct SSL connections.
- Native support for JSONB (for unstructured user preferences, vehicle locations, and clinical metadata).
- Future-ready for Supabase storage (prescription OCR files) and realtime replication.

### Alternatives Considered
| Alternative            | Pros                              | Cons                                          |
| ---------------------- | --------------------------------- | --------------------------------------------- |
| Firestore / NoSQL      | Easy serverless setup             | Weak relational consistency, no strict schema |
| SQLite (node:sqlite)   | Zero config, fast local dev       | Not suitable for multi-node cloud production  |
| AWS RDS PostgreSQL     | Highly configurable               | Heavier DevOps overhead, higher starting cost |

### Impact on Project
- Database connection managed through `DATABASE_URL` (pooler) and `DIRECT_URL` (direct migration connection) in `.env`.
- Relational schema defined for 8 core models with explicit foreign key constraints in `prisma/schema.prisma`.

---

## ADR-009: Use Prisma ORM for Type-Safe Database Modeling and Migrations

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
Need a type-safe data access layer that aligns with TypeScript strict mode, prevents SQL injection, and automates schema migrations and seeding.

### Decision
Use **Prisma ORM** (`@prisma/client` and `prisma` CLI).

### Reasoning
- Auto-generated TypeScript types synchronized directly from `prisma/schema.prisma`.
- Eliminates manual typing discrepancies between database schema and application code.
- Powerful migration system (`prisma migrate dev`, `prisma db push`) and built-in seeding (`prisma db seed`).
- First-class Supabase PostgreSQL integration with connection pooler and direct URL support.

### Alternatives Considered
| Alternative            | Pros                              | Cons                                          |
| ---------------------- | --------------------------------- | --------------------------------------------- |
| Drizzle ORM            | Lightweight, SQL-like             | Less mature migration ecosystem for teams     |
| TypeORM                | Class-based decorators            | Fragile decorator metadata, slower evolution  |
| Raw SQL (pg driver)    | Maximum control, zero abstraction | Manual typing, high boilerplate, error-prone  |

### Impact on Project
- `prisma/schema.prisma` is the single source of truth for the database schema.
- Seeding logic centralized in `prisma/seed.ts`.
- Prisma client generated to `node_modules/@prisma/client` and imported via singleton `src/server/db/prisma.ts`.

---

## ADR-010: Express REST API with Zod Schema Validation

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
The backend requires a modular RESTful API architecture with runtime input validation to protect against malformed data, bad inputs, and injection attacks before queries reach the database.

### Decision
Build an **Express.js REST API** with **Zod** schema validation middleware for all inbound request bodies, queries, and parameters.

### Reasoning
- Express is lightweight, well-understood, and already integrated into the project dependencies.
- Zod provides declarative, TypeScript-first validation with automatic type inference.
- Validation middleware rejects invalid payloads early with structured 400 Bad Request responses containing clear error maps.
- Keeps route controllers lean and focused on business logic.

### Alternatives Considered
| Alternative            | Pros                              | Cons                                          |
| ---------------------- | --------------------------------- | --------------------------------------------- |
| tRPC                   | End-to-end fullstack RPC          | Couples frontend directly to server code      |
| Joi / Yup              | Mature validation libraries       | Less seamless TypeScript type inference       |
| Fastify                | High raw throughput              | Slightly more boilerplate, plugin ecosystem   |

### Impact on Project
- Server code organized in `src/server/`.
- Routes organized in `src/server/routes/*.routes.ts`.
- Validation schemas defined in `src/server/validators/schemas.ts`.
- Validation middleware in `src/server/middleware/validate.ts`.

---

## ADR-011: Custom JWT Authentication & Role-Based Authorization (RBAC)

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
Healthcare patient and caregiver portals handle sensitive medical information. The system must authenticate users securely and enforce granular access control based on user roles (`Patient`, `Family Caregiver`, `Healthcare Proxy`).

### Decision
Implement **custom JWT authentication** with `bcryptjs` password hashing and **Role-Based Access Control (RBAC)** middleware (`requireAuth` and `requireRole`).

### Reasoning
- Stateless JWTs passed via standard `Authorization: Bearer <token>` HTTP header, enabling clean SPA communication.
- `bcryptjs` provides pure-JavaScript cryptographic hashing (10 salt rounds) without native compilation issues on any OS.
- RBAC middleware enforces strict authorization boundaries (e.g., verifying caregiver permissions before allowing dependent edits or refill orders).
- Custom auth maintains complete control over credential storage, password policies, and token lifetime without third-party vendor lock-in.

### Alternatives Considered
| Alternative            | Pros                              | Cons                                          |
| ---------------------- | --------------------------------- | --------------------------------------------- |
| Supabase Auth / Gotrue | Built-in UI and hosted endpoints  | Vendor lock-in, harder to customize RBAC      |
| Session Cookies        | Automatic browser transport       | Requires session store, CSRF vulnerabilities  |
| Auth0 / Clerk          | Managed enterprise auth           | External cloud dependency, monthly cost tier  |

### Impact on Project
- Auth middleware located in `src/server/middleware/auth.ts`.
- Token stored client-side in `localStorage` under `genericmed_token`.
- User roles: `Patient`, `Family Caregiver`, `Healthcare Proxy` enforced across API routes.
- JWT secret managed via `JWT_SECRET` environment variable.

---

## ADR-012: Vite Dev Proxy & Unified Express Full-Stack Architecture

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-08                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
During development, the frontend runs on Vite's dev server (`port 3000`) and the API server runs on Express (`port 3001`). In production, the application needs a unified deployment footprint on Cloud Run / container hosting.

### Decision
Use **Vite Dev Server Proxy** in development (forwarding `/api` requests to `http://localhost:3001`) and a **unified Express server** in production that serves both the `/api` routes and the static compiled frontend (`dist/`).

### Reasoning
- In development, Vite's lightning-fast HMR is fully preserved while eliminating CORS complexity (frontend talks to `/api` on the same origin).
- `concurrently` runs both the Express backend and the Vite dev server with a single `npm run dev:all` command.
- In production, a single container entry point serves both static assets and API endpoints, simplifying deployment.

### Alternatives Considered
| Alternative            | Pros                              | Cons                                          |
| ---------------------- | --------------------------------- | --------------------------------------------- |
| Independent deployments| Decoupled scaling                 | Requires complex CORS, dual domain hosting    |
| Vite SSR / SSR Plugin  | Unified bundle                    | Unnecessary complexity for SPA portal         |

### Impact on Project
- `vite.config.ts` configured with `server.proxy` for `/api`.
- Package scripts added: `dev:all`, `server`.
- Production build serves `dist/` with fallback to `dist/index.html`.

---

## ADR-013: Phase 3 Intelligence Layer — Gemini API for Drug Interactions and Analytics

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-09                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
Phase 3 introduces AI-powered medication intelligence (drug interaction checking, interaction severity classification) and data-driven analytics (adherence trends, refill predictions). The project needs a consistent approach for where AI inference lives, which model is used, and how analytics data is sourced and rendered.

### Decision
1. **AI inference (drug interactions, consultation context)** — route all Gemini API calls through the Express backend (`POST /api/ai/consult`, `POST /api/ai/interactions`). The frontend never holds the API key.
2. **Analytics data** — compute adherence metrics, streaks, and refill forecasts server-side via Prisma aggregate queries. Return pre-computed summaries to the client; avoid heavy computation in the browser.
3. **Charting** — use **Recharts** as the single charting library (React-native, composable, tree-shakable, ~180 KB gzipped).
4. **Prescription OCR** — use **Gemini's multimodal input** (image → structured JSON) rather than a separate Vision API, keeping the vendor surface minimal.

### Reasoning
- Keeping AI keys server-side is already established by ADR-005 and ADR-011; this ADR extends that pattern to new endpoints rather than creating a new pattern.
- Server-side aggregation prevents sending large raw dose histories to the client just for charting.
- Recharts is the most widely adopted React charting library with first-class TypeScript support and no canvas dependency, which aligns with the project's accessibility requirements.
- Gemini multimodal handles OCR without adding a second Google Cloud service, consistent with ADR-005.

### Alternatives Considered
| Alternative                          | Pros                                  | Cons                                                  |
| ------------------------------------ | ------------------------------------- | ----------------------------------------------------- |
| Client-side Gemini calls             | Less latency (no proxy hop)           | Exposes `GEMINI_API_KEY` in the browser bundle        |
| Google Cloud Vision for OCR          | Purpose-built OCR accuracy            | Adds a second GCP service, separate billing, more setup |
| Chart.js / D3.js                     | More customisable                     | Chart.js requires canvas; D3 is imperative and verbose |
| Client-side adherence computation    | No extra API call for stats           | Sends full dose history to browser; poor on slow connections |

### Impact on Project
- Two new server routes: `POST /api/ai/interactions` (drug interaction check) and `GET /api/analytics/adherence` (adherence summary).
- New Zod schemas: `interactionCheckSchema` (array of medication names) and query params for the analytics endpoint (date range, dependentId).
- Recharts added to production dependencies — document in `rules.md` approved dependencies table.
- `src/server/routes/` gains `ai.routes.ts` and `analytics.routes.ts`.
- Frontend gains `src/components/pages/AnalyticsPage.tsx` and interaction alert UI in `MedicationDetailModal.tsx`.
- No new environment variables required beyond the existing `GEMINI_API_KEY`.

---

## ADR-014: Prisma v7 Adapter Pattern Migration

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-09                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
Prisma v7 removed the `url` and `directUrl` fields from `datasource` blocks in `schema.prisma`. Connection strings must now be passed via a `prisma.config.ts` file using a database adapter, breaking the existing schema on `prisma generate`.

### Decision
1. Remove `url` and `directUrl` from `schema.prisma` datasource block (keep `provider = "postgresql"` only).
2. Create `prisma.config.ts` at project root using `defineConfig` with a `PrismaPg` adapter that reads `DIRECT_URL` / `DATABASE_URL` at runtime.
3. Update `src/server/db/client.ts` to instantiate `PrismaClient` with `new PrismaPg(connectionString)` adapter.
4. Add `@prisma/adapter-pg` and `pg` as production dependencies.
5. Exclude `prisma.config.ts` from `tsconfig.json` (it is run by the Prisma CLI, not the app bundler).

### Reasoning
- Required for compatibility with Prisma v7.x — no alternative without downgrading.
- The adapter pattern gives explicit control over the pg connection pool.
- Excluding `prisma.config.ts` from app TypeScript avoids type conflicts between the Prisma CLI's type declarations and the app's bundler module resolution.

### Alternatives Considered
| Alternative              | Pros                          | Cons                                   |
| ------------------------ | ----------------------------- | -------------------------------------- |
| Downgrade to Prisma 5.x  | No migration required         | Misses v7 performance and features     |
| Use Prisma Accelerate    | Zero-config URL handling      | Requires Prisma Cloud account          |

### Impact on Project
- `prisma.config.ts` is the new connection configuration source of truth for Prisma CLI commands (`migrate`, `db push`, `generate`).
- `DATABASE_URL` is used by the runtime `PrismaClient`; `DIRECT_URL` is used for migrations via the config file.
- `.env.example` remains unchanged — both variables are still required.

---

## ADR-015: SettingsPage Sub-Component Architecture & Phase 4 Scale Refactor

| Field                  | Details                          |
| ---------------------- | -------------------------------- |
| **Date**               | 2026-09-09                       |
| **Status**             | ✅ Accepted                       |
| **Deciders**           | Engineering team                 |

### Context / Problem
`SettingsPage.tsx` had grown into an 1119-line monolithic component containing all user profile fields, delivery addresses, payment methods, pharmacy preferences, notifications, security settings, and data export logic. This negatively impacted maintainability, testability, and readable code organisation.

### Decision
Split `SettingsPage.tsx` into six domain-focused sub-components located in `src/components/settings/`:
1. `ProfileSection.tsx` — Personal & medical profile fields.
2. `DeliverySection.tsx` — Address management with modal for creation/deletion.
3. `PaymentSection.tsx` — HSA/FSA and credit card management modal flow.
4. `PharmacySection.tsx` — Auto-refill, generic substitution, and child caps toggles.
5. `NotificationSection.tsx` — SMS, email, push notifications (PushToggle), LanguageSwitcher, and ThemeToggle controls.
6. `SecuritySection.tsx` — 2FA toggle, change password modal, data export, and logout.

`SettingsPage.tsx` becomes a lightweight ~140-line orchestrator that coordinates shared user settings and profile state.

### Reasoning
- Follows the Single Responsibility Principle: each section owns its internal dialog modals, form fields, and validation logic.
- Enables granular unit testing for specific settings flows without mounting the entire 1100+ line tree.
- Co-locates `LanguageSwitcher` and `ThemeToggle` into the Appearance subsection of `NotificationSection` while allowing Header access via a compact variant.

### Impact on Project
- Modular directory created at `src/components/settings/`.
- Reduced `SettingsPage.tsx` from 1119 lines to ~140 lines.
- High testability: ThemeToggle, LanguageSwitcher, and PushNotificationManager covered by Vitest suite.

