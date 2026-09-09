# 📏 Project Rules

> **Purpose:** Mandatory rules every AI assistant and developer **must** follow when working on the GenericMed Patient & Caregiver Portal.
> Violations of these rules should be flagged immediately. Do not deviate without explicit user approval.

---

## 🔒 Golden Rule

> **Never break existing functionality unless the user explicitly requests it.**
> If a change risks breaking something, warn the user first and get confirmation before proceeding.

---

## 1. Coding Standards

### General
- **Language:** TypeScript (strict mode). No `any` types unless absolutely unavoidable — and always add a `// TODO: type this properly` comment.
- **Framework:** React 19 with functional components and hooks only. No class components.
- **Formatting:** Use consistent indentation (2 spaces). No trailing whitespace.
- **Imports:** Group and order imports as follows:
  1. React / React DOM
  2. Third-party libraries (`lucide-react`, `motion`, etc.)
  3. Local types (`./types`)
  4. Local data (`./data/*`)
  5. Local components (`./components/*`)
- **Exports:** Use named exports for components. Default export only for `App.tsx`.
- **Comments:** Preserve all existing comments and docstrings unless a change directly modifies that code.

### TypeScript Specific
```typescript
// ✅ DO: Use explicit types for props
interface DashboardPageProps {
  dependents: Dependent[];
  onNavigate: (page: PageId) => void;
}

// ❌ DON'T: Use `any` or untyped props
const DashboardPage = (props: any) => { ... }
```

### State Management
- All application state lives in `App.tsx` via `useState`.
- Persist to `localStorage` with the `genericmed_` prefix.
- Props are drilled from `App.tsx` to child components.
- Do **not** introduce a state management library (Redux, Zustand, etc.) without a decision in `decisions.md`.

---

## 2. Folder Structure Rules

```
GenMed/
├── prisma/                    # Prisma ORM schema and seed scripts
│   ├── schema.prisma          # Relational database schema
│   └── seed.ts                # Database seed script
├── public/                    # Static assets (favicon, images)
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication screens
│   │   ├── modals/            # All modal components
│   │   └── pages/             # Full page components
│   ├── data/
│   │   └── mockData.ts        # Centralized mock & seed data
│   ├── server/                # Express backend application
│   │   ├── db/                # Prisma client singleton
│   │   ├── middleware/        # Auth, RBAC, and validation middleware
│   │   ├── routes/            # Modular Express REST route handlers
│   │   ├── validators/        # Zod request validation schemas
│   │   └── index.ts           # Server entry point
│   ├── services/
│   │   └── api.ts             # Typed frontend API client
│   ├── App.tsx                # Root component & state
│   ├── main.tsx               # React DOM entry point
│   ├── types.ts               # All TypeScript interfaces & types
│   └── index.css              # Tailwind entry point
├── decisions.md               # Architecture Decision Records
├── rules.md                   # This file
├── memory.md                  # Project memory & context
├── changelog.md               # Version history
├── phases.md                  # Development phases & roadmap
├── .env.example               # Environment variable template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Rules
- **Pages** go in `src/components/pages/`. One file per page. Named `[PageName]Page.tsx`.
- **Modals** go in `src/components/modals/`. Named `[ModalName]Modal.tsx`.
- **Auth components** go in `src/components/auth/`.
- **Shared/reusable components** go directly in `src/components/`. Named `[ComponentName].tsx`.
- **Server code** lives exclusively in `src/server/`.
  - Routes in `src/server/routes/*.routes.ts`
  - Validation schemas in `src/server/validators/*.ts`
  - Auth and validation middleware in `src/server/middleware/*.ts`
- **Database schema & migrations** live in `prisma/schema.prisma`.
- **Frontend API client** lives in `src/services/api.ts`.
- **Types** are centralized in `src/types.ts`. Do not create per-component type files.
- **Mock data** is centralized in `src/data/mockData.ts`.
- **Do not** create new top-level directories without updating this file and `decisions.md`.
- **Do not** nest components deeper than `src/components/<category>/`.

---

## 3. Naming Conventions

| Element              | Convention              | Example                          |
| -------------------- | ----------------------- | -------------------------------- |
| Component files      | PascalCase              | `DashboardPage.tsx`              |
| Component functions  | PascalCase              | `export function DashboardPage`  |
| Interfaces / Types   | PascalCase              | `UserProfile`, `PageId`          |
| Props interfaces     | `[Component]Props`      | `DashboardPageProps`             |
| State variables      | camelCase               | `currentUser`, `todayDoses`      |
| Event handlers       | `handle[Event]`         | `handleSave`, `handleDelete`     |
| Callback props       | `on[Action]`            | `onNavigate`, `onClose`          |
| Boolean props/state  | `is[State]` / `has[X]`  | `isLoading`, `hasNotifications`  |
| Constants / Mocks    | UPPER_SNAKE_CASE        | `INITIAL_DEPENDENTS`             |
| localStorage keys    | `genericmed_[name]`     | `genericmed_current_user`        |
| CSS classes          | Tailwind utilities      | `className="flex items-center"`  |
| Page IDs             | lowercase, single word  | `'dashboard'`, `'prescriptions'` |

---

## 4. UI/UX Consistency Rules

### Design System
- **Icons:** Use `lucide-react` exclusively. Do not mix icon libraries.
- **Animations:** Use the `motion` library. Consistent enter/exit transitions on modals and pages.
- **Styling:** TailwindCSS v4 utility classes only. No inline `style={}` unless dynamically computed.
- **Colors:** Follow the established color palette (emerald/teal for primary, amber for warnings, red for errors, blue for info).
- **Typography:** Use Tailwind's type scale. No hardcoded `font-size` values.

### Component Patterns
- All modals must accept `isOpen` and `onClose` props.
- All pages must accept their required data as props from `App.tsx`.
- Toast/snackbar notifications for user actions (save, delete, etc.).
- Loading states for any async operation.
- Empty states for lists with zero items.

### Accessibility
- All interactive elements must be keyboard-accessible.
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<section>`).
- Include `aria-label` on icon-only buttons.
- Maintain sufficient color contrast (WCAG AA minimum).

### Responsive Design
- Mobile-first approach.
- Sidebar collapses on small screens.
- Test at breakpoints: 320px, 768px, 1024px, 1440px.

---

## 5. Git Commit Rules

### Commit Message Format
```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types
| Type       | Use When                                       |
| ---------- | ---------------------------------------------- |
| `feat`     | Adding a new feature                           |
| `fix`      | Fixing a bug                                   |
| `refactor` | Code change that neither fixes nor adds        |
| `style`    | Formatting, whitespace, Tailwind class changes |
| `docs`     | Documentation only (markdown files, comments)  |
| `chore`    | Build config, dependencies, tooling            |
| `test`     | Adding or modifying tests                      |
| `perf`     | Performance improvement                        |

### Scope Examples
`auth`, `dashboard`, `cabinet`, `prescriptions`, `orders`, `savings`, `dependents`, `notifications`, `settings`, `modals`, `types`, `data`, `config`

### Examples
```
feat(dashboard): add medication adherence chart
fix(orders): correct delivery status not updating
refactor(types): extract OrderItem into separate interface
docs: update memory.md with new endpoints
chore: upgrade tailwindcss to v4.2
```

### Rules
- Keep the subject line under 72 characters.
- Use imperative mood ("add", "fix", "update" — not "added", "fixed", "updated").
- One logical change per commit.
- Reference issue numbers when applicable: `fix(auth): resolve login loop (#42)`.
- **Always update `changelog.md`** when making a `feat`, `fix`, or breaking change.

---

## 6. Security & Environment Variable Rules

### Environment Variables
- **Never** hardcode API keys, secrets, or credentials in source code.
- All secrets go in `.env` (git-ignored) with a template in `.env.example`.
- Current required variables:
  ```
  DATABASE_URL=       # PostgreSQL connection string (Supabase pooler mode port 6543)
  DIRECT_URL=         # PostgreSQL direct connection string (Supabase direct port 5432)
  JWT_SECRET=         # Secret key for signing and verifying JWT tokens
  PORT=3001           # Express backend server port
  GEMINI_API_KEY=     # Google Gemini API key
  APP_URL=            # Application URL for callbacks (default: http://localhost:3000)
  ```
- Access env vars via `import.meta.env.VITE_*` (client-side) or `process.env.*` (server-side).
- **Client-side variables must be prefixed with `VITE_`.**

### Security Practices
- Never expose `GEMINI_API_KEY`, `JWT_SECRET`, or `DATABASE_URL` to the browser. They must only be used server-side.
- All incoming REST request bodies, queries, and params must be validated with Zod schemas.
- Passwords must always be hashed with `bcryptjs` before persisting to the database. Never store plain text passwords.
- Enforce Role-Based Access Control (RBAC) via `requireRole` on protected endpoints.
- Sanitize all user input before rendering (React's JSX escaping handles most cases).
- Do not use `dangerouslySetInnerHTML` without explicit sanitization.
- Validate data shapes when hydrating from `localStorage`.
- No `eval()`, `Function()`, or dynamic script injection.

---

## 7. Dependency Rules

- **Do not** add new dependencies without documenting the reason.
- Prefer well-maintained packages with >1k GitHub stars.
- Check bundle size impact before adding (use [bundlephobia.com](https://bundlephobia.com)).
- Current approved dependencies:

| Package              | Purpose                            | Scope      |
| -------------------- | ---------------------------------- | ---------- |
| `react`, `react-dom` | UI framework                       | Production |
| `@prisma/client`     | Prisma ORM Client                  | Production |
| `prisma`             | Prisma ORM CLI & Migrations        | Dev        |
| `zod`                | Schema Validation                  | Production |
| `jsonwebtoken`       | JWT Authentication                 | Production |
| `bcryptjs`           | Password Hashing                   | Production |
| `cors`               | CORS Middleware                    | Production |
| `@google/genai`      | Gemini AI API                      | Production |
| `lucide-react`       | Icons                              | Production |
| `motion`             | Animations                         | Production |
| `tailwindcss`        | Styling                            | Dev        |
| `@tailwindcss/vite`  | Tailwind Vite integration          | Production |
| `express`            | API server                         | Production |
| `dotenv`             | Env var loading                    | Production |
| `concurrently`       | Run server & client concurrently   | Dev        |
| `typescript`         | Type checking                      | Dev        |
| `vite`               | Build tool                         | Dev        |
| `tsx`                | TypeScript execution               | Dev        |
| `esbuild`            | Fast bundling                      | Dev        |
| `recharts`           | Analytics & adherence charts       | Production |

---

## 8. Documentation Rules

- **Update `memory.md`** when adding features, endpoints, or schema changes.
- **Update `changelog.md`** for every release or significant change.
- **Update `decisions.md`** for architectural or technology choices.
- **Update this file (`rules.md`)** when adding new conventions or changing existing ones.
- Use JSDoc comments for complex utility functions.
- Add inline comments for non-obvious business logic (e.g., medication scheduling rules).

---

## 9. Testing Rules (Future)

> Testing infrastructure is not yet set up. When introduced:

- [ ] Use Vitest for unit tests.
- [ ] Use React Testing Library for component tests.
- [ ] Use Playwright for E2E tests.
- [ ] Test files live next to source: `Component.test.tsx`.
- [ ] Minimum coverage target: 80% for business logic.
- [ ] All bug fixes must include a regression test.

---

## 10. AI Assistant Rules

When an AI assistant works on this codebase, it **must**:

1. ✅ Read `memory.md` for project context before starting.
2. ✅ Read `rules.md` (this file) to understand conventions.
3. ✅ Check `decisions.md` before making architectural changes.
4. ✅ Update `changelog.md` after making changes.
5. ✅ Update `memory.md` if the change affects features, APIs, or schema.
6. ✅ Follow the folder structure — do not create files in arbitrary locations.
7. ✅ Use existing types from `src/types.ts` — extend, don't duplicate.
8. ✅ Preserve all existing comments and documentation.
9. ❌ Never delete or modify code unrelated to the current task.
10. ❌ Never introduce breaking changes without explicit user approval.
