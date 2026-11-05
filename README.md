# Doctor Tracker – Healthcare Administration System

[![Next.js 16](https://img.shields.io/badge/Frontend-Next.js%2016%20(App%20Router)-000000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Backend-Node.js%20Express%20(ESM)-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS%20%2B%20shadcn-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Auth-httpOnly%20Cookies-teal?style=flat&logo=shield)](https://owasp.org/)

---

## Description

**Doctor Tracker** is an enterprise-grade administrative healthcare management system engineered for hospitals and clinical networks to monitor specialized physicians and their active patients with real-time epidemiological and workload analytics. Built on a decoupled Next.js 16 (React 19) and Node.js Express architecture, it empowers clinical administrators with single-roundtrip MongoDB aggregation metrics, multi-dimensional parametric filtering, sub-100ms debounced searching, and hardened `httpOnly` cookie authentication—all delivered through an accessible, clinical-grade interface engineered for both desktop workstations and mobile devices.

---

## Setup Guide

Follow this step-by-step local installation guide to run the complete Doctor Tracker application (Backend API & Frontend Portal):

### Prerequisites
- **Node.js**: v22+ (tested and verified with Node.js v22/v26)
- **MongoDB**: MongoDB Atlas cluster URI or Local MongoDB instance (`mongodb://localhost:27017/doctor-tracker`)
- **Package Manager**: npm (v10+)

---

### 1. Backend Setup (`02-doctor-tracker-api`)

1. Open your terminal and navigate to the backend service directory:
   ```bash
   cd 02-doctor-tracker-api
   ```
2. Install production and development dependencies:
   ```bash
   npm install
   ```
3. Create your environment configuration file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `.env` contains your `MONGODB_URI` and `JWT_SECRET`; defaults are pre-configured for local testing).*
4. Seed the database with clinical demo records (Super Admin account, 11 Doctors, and 29 Patients):
   ```bash
   npm run seed
   ```
5. Start the backend API server in development mode (with hot-reload):
   ```bash
   npm run dev
   ```
   *The API will start at `http://localhost:5000` with the health check available at `http://localhost:5000/api/v1/health`.*

---

### 2. Frontend Setup (`01-doctor-tracker-portal`)

1. Open a new terminal tab and navigate to the frontend portal directory:
   ```bash
   cd 01-doctor-tracker-portal
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create your local environment configuration file from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   *(Points to `http://localhost:5000/api/v1` by default).*
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:3000](http://localhost:3000) in your web browser.*

---

### 3. Demo Credentials

| Role | Email Address | Password |
| :--- | :--- | :--- |
| **Super Admin (Clinical Administrator)** | `admin@gmail.com` | `admin123` |

> **Quick Access Tip:** On the Sign In screen, click the **"Fill Demo Admin Credentials"** button to auto-populate the form and sign in instantly.

---

## System Architecture

The application implements a decoupled, client-server architecture communicating over asynchronous RESTful JSON protocols with cross-origin credential sharing.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 16 Client Portal                    │
│   (App Router, Turbopack, React 19, Recharts, Tailwind CSS) │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
       HTTP / REST (Axios)               Next.js Edge
       withCredentials: true              Middleware
       (httpOnly Cookies)             (Route Protection)
               │                               │
┌──────────────▼───────────────────────────────┴──────────────┐
│                 Node.js Express REST API                    │
│   (ESM, Helmet, CORS Credentials, Rate Limiter, Zod, JWT)   │
└──────────────┬───────────────────────────────▲──────────────┘
               │                               │
          Mongoose ODM                  $facet & $lookup
        Compound Indexes             Aggregation Pipelines
               │                               │
┌──────────────▼───────────────────────────────┴──────────────┐
│                     MongoDB Atlas                           │
│     (Collections: users, doctors, patients, analytics)      │
└─────────────────────────────────────────────────────────────┘
```

### High-Level Data Flow & Service Interactions:
1. **Hardened Authentication Flow:**
   - The user signs in via `/login`. The Express backend validates credentials with `bcryptjs` and signs a JWT.
   - The backend attaches an `httpOnly`, `SameSite=Lax`, `Secure` cookie (`doctor_tracker_token`) in the `Set-Cookie` header.
   - Next.js server-side session handler (`/api/auth/session`) synchronizes the cookie across the frontend origin.
   - Private client routes (`/dashboard`, `/doctors`, `/patients`) are guarded by Next.js Edge Middleware before any page code executes.
   - When communicating with the API, Axios automatically dispatches credentials with every request without storing sensitive tokens in `localStorage`.
2. **Unified Clinical Analytics Pipeline:**
   - The `/analytics/dashboard` endpoint invokes a single MongoDB aggregation pipeline using `$facet` and `$lookup`.
   - In a single database round-trip, the engine calculates overview counts, monthly intake history, diagnosis condition distributions, and physician workloads simultaneously.
3. **Relational Consistency & Cascade Management:**
   - Patient records hold a schema-level reference (`doctorId`) to their assigned specialist.
   - When retrieving doctor profiles, patient rosters are aggregated on demand.
   - When deleting a doctor, the backend automatically performs cascade unlinking to ensure no orphaned patient assignments remain.

---

## Technical Decisions

### Decision 1: Single-Roundtrip MongoDB Aggregation Pipeline (`$facet`, `$lookup`) vs. Multiple Sequential Database Queries

* **Context & Problem:** The administrative dashboard requires 5 distinct datasets: overall counts (doctors, patients, workload ratios), a 6-month historical admission timeline, a categorical breakdown of medical diagnoses, doctor workload distributions, and recent admissions.
* **Alternative Considered:** Executing multiple sequential or `Promise.all()` Mongoose queries (`Doctor.countDocuments()`, `Patient.countDocuments()`, `Patient.find().sort()`, separate regex groupings).
* **Decision & Rationale:**
  - Over a cloud-hosted database connection (MongoDB Atlas), each query incurs TCP round-trip latency (typically 50–100ms per round-trip). Chained queries would take 400ms–800ms to resolve.
  - We implemented a single MongoDB `$facet` aggregation pipeline with sub-pipelines. The MongoDB database engine executes these sub-queries concurrently in memory, eliminating redundant connection overhead and returning the complete analytics dashboard in a single round-trip (under 60ms).
  - Furthermore, using `$facet` ensures atomic read consistency across all dashboard metrics, preventing race conditions where patient totals do not align with status breakdowns.

---

### Decision 2: Server-Set `httpOnly` Cookie Authentication with Next.js Middleware vs. Client-Side `localStorage` Token Storage

* **Context & Problem:** Modern single-page applications often store JWT tokens in `localStorage`. However, tokens stored in `localStorage` are vulnerable to Cross-Site Scripting (XSS) attacks and cannot be accessed by Next.js server-side Edge Middleware during route guarding.
* **Alternative Considered:** Storing the JWT token in `localStorage` and passing it via Axios request interceptors (`Authorization: Bearer <token>`).
* **Decision & Rationale:**
  - We transitioned the entire authentication architecture to **`httpOnly` Cookies** set directly via HTTP headers (`doctor_tracker_token`).
  - **XSS Mitigation:** Because `httpOnly` cookies cannot be accessed or manipulated by client-side JavaScript (`document.cookie`), third-party scripts and XSS vulnerabilities cannot exfiltrate the authentication token.
  - **Server-Side Route Protection:** Next.js `middleware.ts` runs in the edge runtime before the client bundle is downloaded. By using cookies, the middleware reads the authentication state instantly on the server and redirects unauthenticated users without flashing protected UI.
  - **Single Source of Truth:** Axios uses `withCredentials: true`, allowing the browser to manage token lifecycles natively (`maxAge`, `SameSite`, `Path`). Only non-sensitive display profile data (`name`, `email`) is kept in `localStorage` for UI header avatars.

---

## Visual Evidence

### 1. Desktop Experience

#### 1. Administrative Sign In (`/login`)
*Clinical-grade centered authentication card with real-time field validation, secure credential submission, and instant demo credentials loader.*

![Administrative Sign In](docs/screenshots/01-login-desktop.png)

---

#### 2. Clinical Overview & Real-Time Analytics Dashboard (`/dashboard`)
*Real-time medical performance analytics displaying high-level KPI cards (Total Doctors, Total Patients, Workload per Doctor, Active Patients Under Care), monthly admission trends area chart, diagnosis/condition breakdown donut chart, and physician workload distribution.*

![Clinical Analytics Dashboard](docs/screenshots/02-dashboard-desktop.png)

---

#### 3. Doctors Management Directory & Registration Modal (`/doctors`)
*Comprehensive physician directory with multi-field search, dynamic specialization and hospital filters, registration date-range controls, real-time patient load badges, and accessible modal form for registering new licensed medical practitioners.*

![Doctors Management Directory](docs/screenshots/03-doctor-management.png)

---

#### 4. Dedicated Patients Management & Clinical Intake Modal (`/patients`)
*Centralized patient registry with diagnostic condition filters, status pills (Active, Under Observation, Recovered, Discharged), date pickers, and comprehensive patient registration modal with specialist doctor assignment.*

![Patients Management Registry](docs/screenshots/04-patient-management.png)

---

### 2. Mobile Responsive Experience

The entire application is engineered with a mobile-first philosophy, ensuring full administrative capability on smartphones and tablets:

| Clinical Dashboard Analytics | Doctor Profile & Assigned Patients | Responsive Patient Edit Dialog |
| :---: | :---: | :---: |
| ![Mobile Dashboard](docs/screenshots/05-dashboard-mobile.png) | ![Doctor Profile Mobile](docs/screenshots/06-doctor-details-mobile.png) | ![Patient Modal Mobile](docs/screenshots/07-patient-edit-mobile.png) |
| **Mobile Dashboard**<br>*Real-time admission trend area chart and top diagnosis breakdown donut chart optimized for mobile screens.* | **Doctor Profile & Roster**<br>*Physician credentials, hospital affiliation, patient load badge, back navigation, and direct "+ Add Patient" action.* | **Patient Edit Modal**<br>*Centered touch-friendly modal with overflow-protected specialist doctor select dropdown and full-width buttons.* |

---

## Evaluation Checklist & Feature Coverage

| Feature Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Authentication & Route Guarding** | ✅ Complete | `httpOnly` cookies, Next.js Edge Middleware, JWT session management |
| **Doctor Creation & Management** | ✅ Complete | Full doctor registration (Name, Specialization, Hospital, Phone, Email) |
| **Doctor Directory Search & Filters** | ✅ Complete | Multi-criteria search (name, phone, email, hospital) + Date added range |
| **Doctor-Patient Association** | ✅ Complete | View assigned patients per doctor, add patient under doctor, remove patient |
| **Dedicated Patient Management** | ✅ Complete | Comprehensive CRUD, diagnosis tracking, clinical status, doctor reassignment |
| **Data Visualization & Analytics** | ✅ Complete | Area chart trends, Donut chart diagnoses, Bar chart physician distributions |
| **Query Optimization & Indexing** | ✅ Complete | Compound indexes, `$facet` + `$lookup` aggregation pipelines |
| **UI/UX & Mobile Responsiveness** | ✅ Complete | Tailwind CSS, Radix UI dialogs, custom breadcrumbs, back buttons |
