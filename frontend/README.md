# Churn Radar Frontend

Production-grade, modern React 18 + TypeScript web application for the **Churn Radar** retention engine (AI 2 Capstone project, Faculty of Computers & Information, Mansoura University).

The application provides bilingual (English LTR and Arabic RTL) analytical intelligence and campaign tooling for telecom subscriber retention.

---

## Architecture & Technology Stack

- **Framework**: React 18 + TypeScript (strict mode, zero `any`)
- **Bundler**: Vite 5
- **Styling**: Tailwind CSS v3 with Calm Analytical Modern design tokens and purely logical directional utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) for seamless RTL/LTR symmetry
- **State & Server Cache**: TanStack Query v5 + Context API for session batch selection
- **Routing**: React Router v6
- **Internationalization**: react-i18next with dedicated resource bundles (`en.json`, `ar.json`)
- **Visualizations**: Recharts (Risk Donut distribution, Contract cohort bar chart, Model factors horizontal bar chart)
- **Icons**: Lucide React
- **Testing**: Vitest, React Testing Library, and Playwright for End-to-End smoke tests

---

## Folder Map

```text
frontend/
├── .env                  # Environment configuration (VITE_API_URL)
├── .env.example          # Environment variable template
├── .eslintrc.cjs         # Strict ESLint rules (no `any`, react-hooks, react-refresh)
├── .prettierrc           # Consistent code formatting rules
├── index.html            # HTML entry point with Cairo, IBM Plex, and Plus Jakarta fonts
├── package.json          # Dependencies and npm scripts
├── tsconfig.json         # Strict TypeScript compiler options
├── tsconfig.node.json    # Node/bundler TypeScript configuration
├── vite.config.ts        # Vite config with /api dev proxy and path aliases
├── tailwind.config.ts    # Calm Analytical Modern color palette and typography
├── postcss.config.js     # PostCSS plugins (Tailwind, Autoprefixer)
├── playwright.config.ts  # Playwright E2E configuration
├── e2e/
│   └── smoke.spec.ts     # E2E test verifying upload, validation, analysis, and RTL switch
└── src/
    ├── main.tsx          # Application entry point mounting providers and router
    ├── styles/
    │   └── index.css     # Base Tailwind layers, direction-aware typography, and focus ring
    ├── app/
    │   ├── router.tsx          # React Router v6 route configuration
    │   ├── providers.tsx       # QueryClientProvider and AnalysisProvider wrapper
    │   └── AnalysisContext.tsx # Context managing active file, analysis ID, and selected customers
    ├── api/
    │   ├── client.ts     # Strongly-typed fetch client with ApiError handling
    │   ├── types.ts      # Shared backend DTOs and data models
    │   ├── analysis.ts   # Analysis, validation, customer pagination, and export API
    │   ├── campaigns.ts  # Preview, dispatch, history, and suppression API
    │   ├── model.ts      # Model telemetry and feature factor weights API
    │   └── offers.ts     # Retention offers catalog and sample dataset download API
    ├── components/
    │   ├── ui/           # Shared design system components
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Table.tsx
    │   │   ├── Modal.tsx
    │   │   ├── Toast.tsx
    │   │   ├── Skeleton.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── ErrorBanner.tsx
    │   │   └── Stepper.tsx
    │   └── layout/       # Application shell and navigation
    │       ├── AppShell.tsx
    │       ├── Sidebar.tsx
    │       ├── TopBar.tsx
    │       └── LanguageSwitch.tsx
    ├── i18n/
    │   ├── index.ts      # i18next configuration, storage persistence, and dir/lang toggler
    │   ├── en.json       # English translations
    │   └── ar.json       # Arabic translations
    ├── lib/
    │   ├── format.ts     # Date, percentage, and currency formatting helpers
    │   ├── risk.ts       # Risk classification thresholds and badge helpers
    │   ├── contact.ts    # Reachability and channel availability logic
    │   └── download.ts   # Client-side blob and file download utilities
    └── pages/
        ├── UploadPage/            # Step 1: Upload dataset (.csv, .xlsx)
        ├── ValidatePage/          # Step 2: Validate columns, contacts, and row integrity
        ├── ResultsPage/           # Step 3: Predictive telemetry, customer cohort, and drawer
        ├── ThresholdSimulatorPage/# Client-side decision threshold simulator & cost estimator
        ├── CampaignStudioPage/    # Step 4: Audience targeting, offer selection, and live preview
        ├── CampaignHistoryPage/   # Review dispatched campaigns and per-customer delivery logs
        └── ModelPage/             # Model evaluation metrics, confusion matrix, and feature factors
```

---

## Installation & Setup

### Prerequisites
- Node.js >= 18 (Node 20+ recommended)
- npm >= 9

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_URL=http://127.0.0.1:8000
```
When running the Vite dev server, requests to `/api` are automatically proxied to `VITE_API_URL`.

---

## Running the Application

### Development Server
```bash
npm run dev
```
Opens at [http://localhost:5173](http://localhost:5173).

### Production Build
```bash
npm run build
```
Generates an optimized static bundle in `dist/`.

### Preview Production Build
```bash
npm run preview
```

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
```

### E2E Testing with Playwright
```bash
npm run test:e2e
```

---

## How to Add a New Language

1. **Add translation JSON file**:
   Create `src/i18n/<lang_code>.json` and supply translations matching the existing keys in `src/i18n/en.json`.

2. **Register in `src/i18n/index.ts`**:
   Import `<lang_code>.json` and add it to the `resources` dictionary:
   ```ts
   import fr from './fr.json';

   // in i18n.init resources:
   resources: {
     en: { translation: en },
     ar: { translation: ar },
     fr: { translation: fr },
   }
   ```

3. **Update Direction Handling**:
   In `applyDocumentDirection(lang)`, specify whether the new language is RTL or LTR (e.g., Arabic, Hebrew, Urdu are RTL; European languages are LTR):
   ```ts
   const isRtl = ['ar', 'he', 'fa', 'ur'].includes(lang);
   document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
   ```

4. **Update `LanguageSwitch.tsx`**:
   Add the new language option to the selector button or dropdown.

---

## How to Add a New Screen

1. **Create the page folder in `src/pages/<NewScreenName>/`**:
   ```text
   src/pages/<NewScreenName>/
   ├── <NewScreenName>Page.tsx   # Composition only (< 120 lines)
   ├── <NewScreenName>.types.ts  # Types specific to this screen
   ├── components/               # Sub-components used only by this screen
   └── hooks/                    # Data fetching and mutation hooks (TanStack Query)
   ```

2. **Add API calls in `src/api/`**:
   Never fetch directly from components or hooks; define the typed endpoint functions in `src/api/`.

3. **Add i18n translation keys**:
   Add a new section `<newScreenName>` in both `src/i18n/en.json` and `src/i18n/ar.json`.

4. **Register the route in `src/app/router.tsx`**:
   Import `<NewScreenName>Page` and add it as a child of `AppShell`:
   ```tsx
   {
     path: 'my-screen',
     element: <MyScreenPage />,
   }
   ```

5. **Add navigation link in `src/components/layout/Sidebar.tsx`**:
   Add the item with its Lucide icon and i18n label to `navItems`.

---

## Academic Governance Disclaimer

> **Course project, AI 2 · Faculty of Computers & Information, Mansoura University.**  
> Trained on a public sample dataset. Not for real customer decisions.

