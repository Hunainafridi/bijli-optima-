# BijliOptima — Full Development Documentation

**AI-Driven Utility Bill Intelligence Platform for Pakistan**

---

## 1. Project Overview

BijliOptima is a mobile application that lets users photograph or upload their electricity (DISCO/K-Electric) or gas (SNGPL/SSGC) bills and automatically extracts structured data from them using AI-powered OCR. Every user signs in with their own Google (Gmail) account, so each person's bills, history, and settings are private to them and stored under their own account.

**Core capabilities:**
- Google Sign-In — one account per real Gmail user, no manual password system
- Snap-a-photo bill scanning using an AI vision/OCR model
- Automatic parsing of provider, tariff, units consumed, and amounts due
- Personal bill history dashboard per logged-in user
- Foundation for future features: consumption trends, tariff alerts, bill reminders

---

## 2. System Architecture (High-Level)

The system is composed of four cooperating parts:

| Component | Role |
|---|---|
| **Mobile App (Client)** | What the user installs on their phone. Handles login, camera/gallery capture, and displaying results. |
| **Backend API Server** | Central service that all app requests go through. Enforces "each user only sees their own data." |
| **Database** | Persistent storage for user accounts and every parsed bill, one row per user per bill. |
| **AI OCR Service** | An external AI vision model the backend calls to read the bill image and return structured fields. |
| **Google Identity Service** | Google's own sign-in service, used only to verify "this really is this Gmail user" — the app never sees or stores passwords. |

**Request flow in plain terms:**
1. User opens the app and taps "Continue with Google."
2. The phone hands the user off to Google's own sign-in screen (not built by us).
3. Google returns a signed proof of identity to the app.
4. The app sends that proof to our backend, which checks it with Google, then creates or recognizes the user's account.
5. The backend hands the app a session token; the app stores it securely on the device and attaches it to every future request so the backend always knows exactly which user is asking.
6. When the user scans a bill, the photo is sent to the backend, which forwards it to the AI OCR service, receives structured data back, saves it against that user's account, and returns the parsed result to the app.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Mobile frontend | React Native, via the Expo framework | Cross-platform (Android + iOS) app from one codebase |
| Backend framework | FastAPI (Python) | Handles all API requests, validation, and business logic |
| Database | PostgreSQL | Stores users and bill records |
| ORM / data layer | SQLAlchemy | Maps database tables to backend objects |
| Authentication | Google OAuth2 / Google Identity Services | Verifies each user's real Gmail identity |
| Session handling | JSON Web Tokens (JWT) | Backend-issued token proving "this device belongs to this logged-in user" |
| AI OCR engine | Gemini 2.5 Flash (multimodal vision model) | Reads bill photos and extracts structured fields |
| Hosting target | Any container-friendly host (e.g. a VPS, Render, Railway, or similar) plus a managed PostgreSQL instance | Runs backend + database in production |

---

## 4. Database Design

Two core tables are needed for the first version.

### 4.1 `users` table
One row per person who has ever signed in with Google.

| Field | Description |
|---|---|
| id | Internal unique ID for the user |
| google_id | The permanent unique ID Google assigns that person (never changes, even if email changes) |
| email | The user's Gmail address |
| name | Display name pulled from their Google profile |
| picture | Profile photo URL from Google |
| created_at | When the account was first created |

### 4.2 `utility_bills` table
One row per scanned bill, always linked to exactly one user.

| Field | Description |
|---|---|
| id | Internal unique ID for the bill record |
| user_id | Which user this bill belongs to (the ownership link that keeps accounts separate) |
| utility_type | Electricity or Natural Gas |
| provider_name | LESCO, PESCO, IESCO, MEPCO, K-Electric, SNGPL, SSGC, etc. |
| billing_month | The month/year the bill covers |
| reference_number | The official bill reference/consumer number |
| consumer_number | Secondary account identifier, where applicable |
| tariff_category | e.g. Protected Residential, A-1a, A-1b |
| is_protected | Whether the user is on a subsidized/protected tariff |
| total_units_kwh / peak / off_peak / export | Electricity consumption breakdown |
| gas_consumed_hm3 / gas_consumed_mmbtu | Gas consumption breakdown |
| energy_cost | Base charge before surcharges |
| fuel_adjustment_fpa | Fuel price adjustment surcharge |
| gst | Government sales tax component |
| total_amount | Final payable amount |
| due_date | Payment due date |
| created_at | When the bill was scanned/added |

**Key relationship:** every bill row carries a `user_id`, so the backend can always filter "show me bills WHERE user_id = the logged-in user" — this is what guarantees each user only ever sees their own bills.

---

## 5. Authentication & Per-User Accounts

Goal: every user has their own private account, logged in only via their Gmail, with zero password management on our side.

**How "one account per user" is enforced:**
- Google's `google_id` for each person is unique and permanent — the backend uses it as the single source of truth for "who is this."
- On first-ever login, the backend automatically creates a new user record tied to that `google_id`.
- On every later login, the backend recognizes the same `google_id` and logs the person into their existing account instead of creating a duplicate.
- After verifying identity with Google, the backend issues its own short-lived session token (JWT) to the app. This token — not the Google token — is what the app uses for everyday requests, and it always identifies exactly one user.
- Every protected API request requires this token; the backend rejects any request without a valid token, and automatically scopes all data access to the token's owner.

This means two different people can never see each other's bills, and no one can access the API without first proving their Gmail identity through Google.

---

## 6. API Specification

All endpoints are served from a single backend base URL. Endpoints marked "Auth required" need the user's session token attached to the request.

| Method | Endpoint | Auth required | Purpose |
|---|---|---|---|
| POST | `/api/auth/google` | No | Accepts the Google identity proof from the app; verifies it with Google; creates the account if new; returns a session token and basic profile info |
| POST | `/api/bills/scan` | Yes | Accepts an uploaded bill photo; sends it to the AI OCR engine; saves the parsed result under the logged-in user; returns the structured bill data |
| GET | `/api/bills/my-bills` | Yes | Returns the full bill history belonging only to the logged-in user, most recent first |

**Design principles behind the API:**
- Every "Yes" (protected) endpoint automatically figures out who's asking from their session token — the app never has to manually pass a user ID, which prevents one user from ever pretending to be another.
- The bill-scanning endpoint is intentionally the only place that talks to the AI OCR engine, keeping the AI usage centralized, auditable, and easy to swap out later.
- Responses always return complete, structured bill fields (provider, tariff, amounts, due date, consumption) rather than raw text, so the app never has to do its own text parsing.

---

## 7. AI OCR Extraction Logic

When a bill photo reaches the backend:
1. The image is forwarded to the Gemini 2.5 Flash vision model along with instructions describing exactly which fields to extract and the known Pakistani DISCO/gas-company formats.
2. The model is constrained to return a fixed structured format (not free text), covering: utility type, provider, billing month, due date, reference number, tariff category, protected status, consumption figures, and the full cost breakdown.
3. The backend validates the structured result, converts it into a database record, links it to the current user, and stores it.
4. The same structured result is returned to the app immediately so the user sees their parsed bill without delay.

---

## 8. Frontend (Mobile App) Structure

| Screen | Purpose |
|---|---|
| **Login screen** | Branding + a single "Continue with Google" action; handles the Google sign-in handoff and stores the resulting session token securely on-device |
| **Home / Dashboard screen** | Shows an at-a-glance energy status indicator and a scrollable list of the user's previously scanned bills (provider, tariff, amount, usage) |
| **Scanner screen** | Lets the user take a new photo or choose one from their gallery, shows a preview, then submits it for AI extraction and displays a success/result confirmation |

**Session handling on the app side:**
- The session token is stored in the device's secure storage (not plain app storage), so it survives app restarts but stays private to that device.
- On every app launch, the app checks for a stored token; if missing, the user is sent to the login screen; if present, it's attached to all API calls automatically.

---

## 9. Step-by-Step Development Process

### Phase 1 — Project Setup
1. Set up version control (a Git repository) with separate `backend/` and `frontend/` folders.
2. Provision a PostgreSQL database instance (local for development, managed instance for production).
3. Create a Google Cloud project and configure OAuth consent screen + credentials (Android client ID, web client ID) to enable "Continue with Google."
4. Obtain API access to the Gemini model for OCR.

### Phase 2 — Backend Foundation
1. Scaffold the FastAPI project structure (config, database connection, models, schemas, routes).
2. Define the `users` and `utility_bills` tables and generate the database schema.
3. Implement the Google token verification flow and session-token (JWT) issuance.
4. Implement the login endpoint and confirm new/returning users are handled correctly.

### Phase 3 — AI OCR Integration
1. Integrate the Gemini vision model with a defined structured-output schema for bill fields.
2. Write the prompt/instructions describing Pakistani DISCO and gas-company bill formats.
3. Build the bill-scan endpoint: receive image → call AI model → validate output → save to database → return result.
4. Test extraction accuracy against a variety of real bill photo samples (different providers, lighting, angles).

### Phase 4 — Backend Data Access
1. Implement the "my bills" endpoint with correct per-user filtering.
2. Add input validation and error handling (invalid image types, failed AI extraction, expired tokens).
3. Add CORS configuration so the mobile app can call the API during development.

### Phase 5 — Frontend Foundation
1. Scaffold the Expo/React Native project with navigation between Login, Home, and Scanner screens.
2. Implement the Google sign-in flow on the client and connect it to the backend's login endpoint.
3. Implement secure token storage and automatic redirect logic (logged-in vs. logged-out).

### Phase 6 — Frontend Feature Screens
1. Build the Home dashboard: fetch and display the user's bill history.
2. Build the Scanner screen: camera/gallery capture, image preview, upload, and result feedback.
3. Add loading and error states throughout (network failures, extraction failures).

### Phase 7 — Integration Testing
1. Test the full flow end-to-end: sign in → scan a real bill → confirm it appears only under that account.
2. Test with a second Google account to confirm account isolation (no cross-user data leakage).
3. Test edge cases: poor photo quality, unsupported file types, expired session tokens.

### Phase 8 — Deployment
1. Deploy the backend and database to a hosting provider, moving all secrets (database URL, Gemini key, Google client ID, JWT secret) into secure environment variables.
2. Point the mobile app's API URL to the production backend address.
3. Build production app binaries via Expo's build service for distribution/testing.
4. Set up basic monitoring/logging on the backend to track errors and AI extraction failures.

### Phase 9 — Post-Launch Enhancements (Future Scope)
- Consumption trend charts across months
- Bill due-date reminders/notifications
- Tariff-slab optimization suggestions
- Support for additional utility types (water)
- Export of bill history to PDF/CSV

---

## 10. Configuration & Secrets Checklist

Before running or deploying the system, the following must be configured (values only, never hard-coded into the codebase):

- Database connection string
- Gemini API key
- Google OAuth client IDs (Android + Web)
- JWT signing secret
- Backend base URL (used by the mobile app to reach the API)

---

## 11. Summary

BijliOptima's architecture keeps a strict separation between identity (handled entirely by Google), business logic (handled by the FastAPI backend), and presentation (handled by the Expo mobile app). Because every bill record is permanently linked to the Google-verified user who created it, the system guarantees private, per-user accounts by design rather than by convention.
