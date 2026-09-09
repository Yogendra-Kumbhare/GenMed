# GenericMed - Patient & Caregiver Portal

GenericMed is a modern patient and caregiver web portal featuring smart dose tracking, generic drug savings calculation, medicine cabinet management, order live tracking, AI-powered drug interaction & symptom checker, and dependent management.

---

## Project Structure

```
project-root/
├── frontend/             # React + Vite + TypeScript Client App
│   ├── src/             # UI Components, Contexts, Pages, Hooks, i18n
│   ├── public/          # Static assets & PWA manifest icons
│   ├── package.json     # Frontend dependencies
│   ├── vite.config.ts   # Vite & PWA configuration
│   └── .env.example     # Environment template for frontend
│
├── backend/              # Node.js + Express + Prisma REST API
│   ├── src/             # Express routes, controllers, middleware, validators
│   ├── prisma/          # Database schema (PostgreSQL / SQLite) & seeds
│   ├── package.json     # Backend dependencies
│   └── .env.example     # Environment template for backend
│
├── README.md             # Project documentation
└── package.json          # Root scripts to orchestrate frontend & backend
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

---

### 1. Installation

You can install all dependencies for both `frontend` and `backend` using the root workspace command:

```bash
npm run install:all
```

Or install them individually:

```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd backend
npm install
```

---

### 2. Environment Setup

Copy `.env.example` to `.env` in both folders:

```bash
# Backend environment setup
cp backend/.env.example backend/.env

# Frontend environment setup
cp frontend/.env.example frontend/.env
```

---

### 3. Database Initialization

Initialize the backend database schema and seed mock data:

```bash
# From root directory:
npm run db:setup

# Or directly in backend folder:
cd backend
npm run db:setup
```

---

### 4. Running the Application

#### Option A: Run Both Simultaneously (Recommended)
From the root directory, start both frontend and backend in parallel:

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

#### Option B: Run Separately

**Backend Server:**
```bash
# From root
npm run dev:backend

# Or from backend folder
cd backend
npm run dev
```

**Frontend App:**
```bash
# From root
npm run dev:frontend

# Or from frontend folder
cd frontend
npm run dev
```

---

## Testing & Verification

Run tests across both frontend and backend:

```bash
# Run all tests
npm test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

---

## Key Features

1. **Medicine Cabinet & Dose Tracking**: Track schedules, log taken doses, set refill alerts.
2. **Generic Savings Finder**: Compare cost savings between brand and generic alternatives.
3. **AI Symptom & Drug Interaction Checker**: Powered by Google Gemini AI with HIPAA fallback mode.
4. **Caregiver & Dependent Management**: Switch profiles to manage medications for family members.
5. **PWA Support**: Full offline caching, push notifications, and home screen installation.
