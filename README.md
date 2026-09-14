# GeM AI Compliance Verification System (SIH26100 Prototype)

An AI-powered statutory verification and compliance scrutiny engine for the Government e-Marketplace (GeM). It automates vendor statutory checks (GSTIN, PAN, Udyam MSME certificate) and document authenticity verification to streamline public procurement scrutiny.

---

## 🏗️ Architecture Overview

```
sih-gem-compliance/
├── backend/                  # FastAPI REST API
│   ├── app/
│   │   ├── main.py           # Verification API endpoints & OCR simulation
│   │   ├── models.py         # Data models
│   │   ├── schemas.py        # Pydantic validation schemas
│   │   ├── crud.py           # Database operations
│   │   └── database.py       # DB engine setup
│   └── venv/                 # Pre-configured Python virtual environment
└── frontend/                 # React 19 + TypeScript + Tailwind CSS (Vite)
    ├── src/
    │   ├── App.tsx           # Multi-portal UI (Seller desk, Officer desk, Audit logs)
    │   ├── services/api.ts   # Axios client for FastAPI backend
    │   └── ...
    └── package.json
```

---

## 🚀 How to Run the Project

Open **two separate terminal windows** (Command Prompt or PowerShell):

### 1. Start the Backend API (FastAPI)

```powershell
cd c:\Users\hp\Desktop\sih-gem-compliance\backend

# Activate virtual environment
.\venv\Scripts\Activate.ps1
# (or in CMD: venv\Scripts\activate.bat)

# Start Uvicorn development server
uvicorn app.main:app --reload --port 8000
```

- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Redoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 2. Start the Frontend (Vite + React)

```powershell
cd c:\Users\hp\Desktop\sih-gem-compliance\frontend

# Start Vite dev server
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## 🎯 Portals & Features

1. **GeM Landing Page (`/`)**: High-level platform introduction and role selector.
2. **Login Portal**:
   - **Seller Portal**: `ABC_INDUSTRIES_2026`
   - **Officer Portal**: `OFFICER_ONGC_901`
3. **Seller Self-Service Compliance Console**:
   - **S1. Dashboard**: Readiness score (87%), verified document count, pending action indicators.
   - **S2. Checklist & Live Verification**: Direct live testing of GSTIN, PAN, and Udyam MSME status against the FastAPI backend.
   - **S3. AI Document Scrutiny**: AI OCR parsing and document tampering/seal integrity simulation.
   - **S4. Discrepancy Resolution**: In-place error resolution workflow bumping readiness to 98% (Low Risk).
4. **Procurement Officer Scrutiny Console**:
   - Bidder evaluation table with automated AI compliance score.
5. **Officer Audit Trail & Decision Console**:
   - Chronological immutable audit trail.
   - Final committee sign-off: *Approve & Qualify*, *Request Clarification*, or *Reject / Disqualify*.
