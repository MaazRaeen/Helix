<p align="center">
  <img src="https://img.shields.io/badge/Helix-Governance_Engine-4338ca?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDJMMiA3bDEwIDUgMTAtNS0xMC01Wk0yIDE3bDEwIDUgMTAtNU0yIDEybDEwIDUgMTAtNSIvPjwvc3ZnPg==&logoColor=white" alt="Helix Governance Engine"/>
</p>

<h1 align="center">🧬 Helix — AI Loan Governance Hub</h1>

<p align="center">
  <b>Explainable AI-Powered Loan Decision System with Real-Time Contestation</b>
  <br/>
  <sub>Built for transparent, contestable, and fair automated lending decisions</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Gemini-AI_Oracle-4285F4?style=flat-square&logo=google" />
  <img src="https://img.shields.io/badge/ML-Logistic_Regression-FF6F00?style=flat-square&logo=tensorflow" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

---

## 📌 Problem Statement

Automated loan decisions are often **black boxes** — applicants receive a rejection without understanding *why*, and have no mechanism to challenge the outcome. This creates:

- **Trust deficit** between financial institutions and borrowers
- **Regulatory risk** under emerging AI governance frameworks (EU AI Act, RBI guidelines)
- **Systemic bias** that goes undetected without explainability tools

## 💡 Our Solution

**Helix** is a full-stack AI governance platform that makes automated lending **transparent**, **explainable**, and **contestable**. It combines a custom-trained ML model with real-time SHAP-style explainability and an AI-powered contestation pipeline.

---

## ✨ Key Features

### 🧠 ML-Powered Decision Engine
- **Custom Logistic Regression** model trained on real loan data (`loan_data_1.csv`, 382 records)
- **11-feature analysis**: Gender, Marital Status, Dependents, Education, Self-Employment, Applicant Income, Co-applicant Income, Loan Amount, Loan Term, Credit History, Property Area
- Outputs a **probability score** and binary APPROVE/REJECT with configurable threshold

### 📊 Explainability & Transparency
- **Feature Contribution Charts** — visual SHAP-inspired bar charts showing which factors helped or hurt approval
- **Feature Impact Table** — ranked breakdown of each factor's percentage impact on the final verdict
- **Confidence Gauge** — animated semicircular gauge showing model confidence (0–100%)
- **AI-Generated Explanations** — Gemini-powered natural language insights for every decision

### ⚖️ Contestation & Appeal System
- Applicants can **modify any of the 11 features** and request a re-evaluation
- **Decision Delta Analysis** — side-by-side comparison of original vs. contested outcomes
- **Counterfactual Suggestions** — system calculates the *minimum change* needed to flip a rejection
- **AI Advisor Engine** — Gemini generates personalized advice on the path to approval

### 🤖 Oracle Chatbot
- Floating AI assistant powered by **Google Gemini**
- Context-aware — understands platform features, governance concepts, and loan terminology
- Available on every page for real-time guidance

### 📋 Governance Dashboard
- **Decision Ledger** — complete audit trail of all applications with status tracking
- **Executive Explorer** — searchable case database with detailed drill-down
- **Oracle Alerts** — AI-generated governance insights and risk advisories
- **Innovation Lab** — platform manifesto and technology overview

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │Application│ │ Decision │ │ Contest  │ │  Decision  │  │
│  │   Page   │ │   Page   │ │   Page   │ │   Ledger   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘  │
│       │             │            │              │         │
│  ┌────┴─────────────┴────────────┴──────────────┴──────┐ │
│  │              Axios HTTP Client (port 5174)           │ │
│  └──────────────────────┬──────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────┘
                          │ REST API
┌─────────────────────────┼────────────────────────────────┐
│                    BACKEND (Express.js)                   │
│  ┌──────────────────────┴──────────────────────────────┐ │
│  │              API Router (port 5070)                  │ │
│  │  /api/predict  /api/case/:id  /api/re-evaluate/:id  │ │
│  │  /api/cases    /api/chat      /api-health            │ │
│  └───────┬───────────────┬──────────────────────────────┘ │
│          │               │                                │
│  ┌───────┴──────┐ ┌──────┴──────────┐                    │
│  │   Decision   │ │  Gemini Service │                    │
│  │   Engine     │ │  (AI Explain +  │                    │
│  │  (ML Model)  │ │   Oracle Chat)  │                    │
│  └───────┬──────┘ └──────┬──────────┘                    │
│          │               │                                │
│  ┌───────┴──────┐ ┌──────┴──────────┐                    │
│  │model_metadata│ │  Google Gemini  │                    │
│  │    .json     │ │     API         │                    │
│  └──────────────┘ └─────────────────┘                    │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │          MongoDB Atlas (Persistent Storage)         │  │
│  │          + In-Memory Mock DB (Fallback)             │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
helix/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget.jsx       # Oracle AI Chatbot (floating)
│   │   │   ├── ConfidenceGauge.jsx  # Animated confidence gauge
│   │   │   ├── DecisionBadge.jsx    # Approve/Reject badge with icon
│   │   │   ├── SHAPChart.jsx        # Feature contribution bar chart
│   │   │   ├── FeatureImpactTable.jsx # Impact breakdown table
│   │   │   ├── DeltaChart.jsx       # Before/After delta visualization
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── ConflictModal.jsx    # Conflict resolution modal
│   │   │   └── ProcessingAnimation.jsx # Loading animation
│   │   ├── pages/
│   │   │   ├── ApplicationPage.jsx  # Loan application form (11 features)
│   │   │   ├── DecisionPage.jsx     # Decision result with SHAP analysis
│   │   │   ├── ContestPage.jsx      # Contestation form (modify features)
│   │   │   ├── DeltaPage.jsx        # Before/After decision comparison
│   │   │   ├── LedgerPage.jsx       # Decision audit trail
│   │   │   ├── Dashboard.jsx        # Executive dashboard
│   │   │   ├── CaseList.jsx         # Case explorer with search
│   │   │   ├── DirectivePage.jsx    # New directive creation
│   │   │   ├── AlertsPage.jsx       # Oracle AI alerts
│   │   │   └── InnovationManifesto.jsx # Platform manifesto
│   │   ├── context/
│   │   │   └── ApplicationContext.jsx # Global state management
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── index.css                # Design system & CSS variables
│   │   └── main.jsx                 # Entry point
│   └── package.json
│
├── server/                          # Node.js Backend
│   ├── routes/
│   │   └── api.js                   # All REST API endpoints
│   ├── models/
│   │   └── Application.js           # Mongoose schema (11 ML features)
│   ├── utils/
│   │   ├── decisionEngine.js        # ML prediction engine (Logistic Regression)
│   │   └── geminiService.js         # Google Gemini AI integration
│   ├── scripts/
│   │   └── train_model.js           # Model training script
│   ├── data/
│   │   └── model_metadata.json      # Trained weights, means, stds
│   ├── index.js                     # Express server entry point
│   ├── .env                         # Environment variables
│   └── package.json
│
└── loan_data_1.csv                  # Training dataset (382 records)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ 
- **MongoDB Atlas** account (or the app falls back to in-memory mock DB)
- **Google Gemini API Key** (for AI explanations and chatbot)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/helix-governance-hub.git
cd helix-governance-hub
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5070
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/?appName=Cluster0
GOOGLE_GENERATION_AI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

### 3. Train the ML Model

```bash
node scripts/train_model.js
```

This processes `loan_data_1.csv` and generates `data/model_metadata.json` containing:
- Logistic Regression weights (12 coefficients including bias)
- Feature means and standard deviations for normalization

### 4. Start the Backend

```bash
npm run dev
# Server runs on http://localhost:5070
```

### 5. Setup the Frontend

```bash
cd ../client
npm install
npm run dev
# Client runs on http://localhost:5174
```

### 6. Open the App

Navigate to **http://localhost:5174** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api-health` | Server health check |
| `GET` | `/api/ping` | Router diagnostic |
| `GET` | `/api/cases` | List all cases (sorted by date) |
| `GET` | `/api/case/:id` | Get flattened case detail (UI-optimized) |
| `GET` | `/api/cases/:id` | Get raw case detail |
| `POST` | `/api/predict` | Submit new loan application → ML prediction |
| `POST` | `/api/re-evaluate/:id` | Contest a decision with modified features |
| `POST` | `/api/chat` | Oracle chatbot conversation |

### Example: Submit a Loan Application

```bash
curl -X POST http://localhost:5070/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "income": 45000,
    "coapplicant_income": 20000,
    "credit_score": 1,
    "loan_amount": 250000,
    "loan_term": 360,
    "gender": "Male",
    "married": "Yes",
    "dependents": "1",
    "education": "Graduate",
    "self_employed": "No",
    "property_area": "Semiurban"
  }'
```

**Response:**
```json
{
  "decision": "APPROVE",
  "probability": 0.882,
  "topFactors": [
    { "feature": "Credit_History", "contribution": 0.53, "impact": "positive" },
    { "feature": "Married", "contribution": 0.26, "impact": "positive" },
    { "feature": "LoanAmount", "contribution": 0.24, "impact": "positive" }
  ]
}
```

---

## 🧪 ML Model Details

### Algorithm
**Logistic Regression** — chosen for its interpretability, which is critical in governance contexts where decisions must be explainable.

### Training Data
- **Source**: `loan_data_1.csv` (382 records from historical loan approvals)
- **Target**: `Loan_Status` (Y = Approved, N = Rejected)
- **Approval Rate**: ~69% in training data

### Features (11 predictors)

| # | Feature | Type | Description |
|---|---------|------|-------------|
| 1 | Gender | Binary | Male (0) / Female (1) |
| 2 | Married | Binary | No (0) / Yes (1) |
| 3 | Dependents | Numeric | Number of dependents (0–3+) |
| 4 | Education | Binary | Graduate (1) / Not Graduate (0) |
| 5 | Self_Employed | Binary | No (0) / Yes (1) |
| 6 | ApplicantIncome | Continuous | Monthly income in ₹ |
| 7 | CoapplicantIncome | Continuous | Co-applicant monthly income in ₹ |
| 8 | LoanAmount | Continuous | Loan amount in thousands (₹) |
| 9 | Loan_Amount_Term | Continuous | Loan term in months |
| 10 | Credit_History | Binary | No history (0) / Has history (1) |
| 11 | Property_Area | Ordinal | Rural (0) / Semiurban (1) / Urban (2) |

### Top Feature Weights

| Feature | Weight | Interpretation |
|---------|--------|----------------|
| **Credit_History** | **+0.975** | Strongest positive predictor — having credit history dramatically improves approval |
| Married | +0.321 | Being married slightly improves chances |
| Education | +0.140 | Graduates have a slight edge |
| Gender | +0.138 | Minor factor |
| Loan_Amount_Term | -0.150 | Longer terms slightly decrease approval |

### Normalization
All features are z-score normalized using training set means and standard deviations. Values are clamped to ±3σ to prevent extreme outliers from dominating predictions.

---

## 🎨 Design System

The UI follows a **premium glassmorphism** design language with:

- **Typography**: Inter (body) + Outfit (headings) from Google Fonts
- **Color Palette**:
  - Primary: Indigo 700 (`#4338ca`)
  - Approved: Emerald 500 (`#10b981`) with light green backgrounds
  - Rejected: Red 500 (`#ef4444`) with light red backgrounds
  - Warning: Amber 500 (`#f59e0b`)
- **Animations**: Framer Motion for page transitions, gauge animations, and chart reveals
- **Layout**: Responsive grid with rounded 3rem cards and subtle box shadows

---

## 🛡️ Governance Features

| Feature | Description |
|---------|-------------|
| **Decision Audit Trail** | Every application is persisted with full initial + contested states |
| **Counterfactual Engine** | Shows the minimum change needed to reverse a rejection |
| **AI Transparency Reports** | Gemini generates human-readable explanations for every decision |
| **Feature Contribution Mapping** | SHAP-style visualization of how each factor influenced the outcome |
| **Real-Time EMI Calculator** | Dynamic EMI estimation at 8.5% p.a. using reducing balance formula |
| **Oracle Chatbot** | AI assistant for governance guidance |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `EADDRINUSE: port 5070` | Run `kill $(lsof -t -i:5070)` then restart the server |
| MongoDB connection fails | App auto-falls back to in-memory mock DB — no action needed |
| Gemini 404 errors | Update `GEMINI_MODEL` in `.env` to a valid model (e.g., `gemini-2.0-flash`) |
| SHAP chart shows NaN | Ensure the backend returns `contribution` field in `topFactors` |
| Good applicant gets rejected | Check that `credit_score` in the form maps correctly (1 = has history) |

---

## 👥 Team

Built at **Thapar Hackathon 2026**

---

## 📜 License

This project is built for educational and hackathon purposes.

---

<p align="center">
  <b>Helix Governance Engine</b> — Making AI decisions <i>transparent</i>, <i>explainable</i>, and <i>contestable</i>.
</p>
