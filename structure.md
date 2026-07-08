# SafeClick Guardian AI - Project Structure

This document outlines the directory structure of the **SafeClick-Guardian-AI** repository, updated with the latest implemented modules and components.

```
SafeClick-Guardian-AI/
├── client/                          # Next.js Frontend Application
│   ├── public/                      # Static assets (images, icons, etc.)
│   ├── src/                         # Source code
│   │   ├── app/                     # App Router pages and layouts
│   │   │   ├── (auth)/              # Route groups for authentication pages
│   │   │   │   ├── forgot-password/ # Forgot password page
│   │   │   │   ├── login/           # Login page
│   │   │   │   ├── signup/          # Sign up page
│   │   │   │   └── verify-otp/      # OTP code verification page
│   │   │   ├── admin/               # Admin dashboard routes
│   │   │   ├── analyze/             # Link/text analysis pages
│   │   │   ├── complaint/           # Complaint logging & tracking
│   │   │   │   └── page.tsx         # Complaint wizard generator page
│   │   │   ├── dashboard/           # User dashboard
│   │   │   ├── emergency/           # Quick emergency dispatch/SOS
│   │   │   │   └── page.tsx         # Emergency Mode dashboard screen
│   │   │   ├── evidence/            # Evidence locker/uploads
│   │   │   │   └── page.tsx         # Evidence locker dashboard page
│   │   │   ├── heatmap/             # Danger zone visualization maps
│   │   │   │   └── page.tsx         # Scam Heatmap geolocator page
│   │   │   ├── learning/            # Safety tutorials & learning material
│   │   │   │   └── page.tsx         # Cyber Learning academy page
│   │   │   ├── profile/             # User profile pages
│   │   │   ├── settings/            # App preferences & user settings
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css          # Global Tailwind/CSS styles
│   │   │   ├── layout.tsx           # Root layout configuration
│   │   │   ├── loading.tsx          # Global loading states
│   │   │   ├── not-found.tsx        # Custom 404 page
│   │   │   └── page.tsx             # Main landing page
│   │   │
│   │   ├── features/                # Feature-sliced modules (state, logic, sub-components)
│   │   │   ├── analyzer/            # AI Scan Analyzer module
│   │   │   │   └── components/
│   │   │   │       ├── AIScamAnalyzerScreen.tsx
│   │   │   │       ├── AnalyzerHistory.tsx
│   │   │   │       ├── AnalyzerInputPanel.tsx
│   │   │   │       ├── AnalyzerResultPanel.tsx
│   │   │   │       ├── AnalyzerStats.tsx
│   │   │   │       └── RiskGaugeChart.tsx
│   │   │   │
│   │   │   ├── auth/                # Authentication module
│   │   │   │   ├── components/
│   │   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── OTPVerificationForm.tsx
│   │   │   │   │   └── SignupForm.tsx
│   │   │   │   └── schemas/
│   │   │   │       └── auth.schema.ts
│   │   │   ├── complaint/           # Complaint Generator wizard module
│   │   │   │   └── components/
│   │   │   │       ├── ComplaintGeneratorScreen.tsx
│   │   │   │       ├── ComplaintPreviewPanel.tsx
│   │   │   │       ├── ComplaintWizard.tsx
│   │   │   │       ├── StepEvidence.tsx
│   │   │   │       ├── StepFinancialLoss.tsx
│   │   │   │       ├── StepIncidentDetails.tsx
│   │   │   │       └── StepReviewExport.tsx
│   │   │   │
│   │   │   ├── dashboard/           # User Dashboard module
│   │   │   │   └── components/
│   │   │   │       ├── CyberScoreCard.tsx
│   │   │   │       ├── QuickActionsPanel.tsx
│   │   │   │       ├── RecentComplaintsList.tsx
│   │   │   │       ├── RecentScansList.tsx
│   │   │   │       ├── StatsGrid.tsx
│   │   │   │       └── ThreatFeedsList.tsx
│   │   │   ├── emergency/           # Emergency SOS module
│   │   │   │   └── components/
│   │   │   │       ├── EmergencyChecklist.tsx
│   │   │   │       ├── EmergencyHeroButton.tsx
│   │   │   │       ├── EmergencyModeScreen.tsx
│   │   │   │       ├── EmergencyQuickForm.tsx
│   │   │   │       ├── EmergencyStationCard.tsx
│   │   │   │       └── TrustedContactsPanel.tsx
│   │   │   │
│   │   │   ├── evidence/            # Evidence Locker module
│   │   │   │   └── components/
│   │   │   │       ├── EvidenceCard.tsx
│   │   │   │       ├── EvidenceDetailModal.tsx
│   │   │   │       ├── EvidenceLockerScreen.tsx
│   │   │   │       ├── EvidenceTimeline.tsx
│   │   │   │       └── EvidenceUploadZone.tsx
│   │   │   ├── heatmap/             # Scam Heatmap module
│   │   │   │   └── components/
│   │   │   │       ├── HeatmapScreen.tsx
│   │   │   │       └── ScamMap.tsx
│   │   │   ├── learning/            # Cyber Learning module
│   │   │   │   └── components/
│   │   │   │       ├── CertificateViewer.tsx
│   │   │   │       ├── LearningScreen.tsx
│   │   │   │       └── QuizModal.tsx
│   │   │   └── profile/             # Profile management module
│   │   │
│   │   ├── components/              # Reusable presentational components
│   │   │   ├── animations/          # Motion & transition components
│   │   │   ├── cards/               # Reusable card designs
│   │   │   ├── charts/              # Dashboard chart wrappers
│   │   │   ├── common/              # Common/Generic visual blocks
│   │   │   ├── feedback/            # Alerts, toasts, banners
│   │   │   ├── footer/              # Footer components
│   │   │   ├── forms/               # Shared form fields & inputs
│   │   │   ├── layout/              # Container and grid layouts
│   │   │   │   ├── AppLayout.tsx    # Responsive layout wrapper
│   │   │   │   ├── MobileTopbar.tsx # Sticky header navigation for mobile
│   │   │   │   └── Sidebar.tsx      # Sidebar navigation for desktop
│   │   │   ├── loaders/             # Spinners & skeleton loaders
│   │   │   │   └── LoadingSkeleton.tsx
│   │   │   ├── maps/                # Heatmap & geocoding view maps
│   │   │   ├── modals/              # Popup modal structures
│   │   │   │   └── ConfirmModal.tsx
│   │   │   ├── navbar/              # Navigation bars
│   │   │   └── ui/                  # Core design system atomic elements
│   │   │       ├── AppIcon.tsx
│   │   │       ├── AppImage.tsx
│   │   │       ├── AppLogo.tsx
│   │   │       └── StatusBadge.tsx  # Color-coded risk assessment badge
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Third-party library configurations
│   │   │   ├── axios.ts
│   │   │   ├── queryClient.ts
│   │   │   └── supabase.ts
│   │   │
│   │   ├── services/                # API client services
│   │   │   ├── analyzer.service.ts
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   └── complaint.service.ts
│   │   │
│   │   ├── utils/                   # Pure utility functions
│   │   ├── constants/               # Client-side constants
│   │   │   ├── app.ts
│   │   │   └── routes.ts
│   │   │
│   │   ├── contexts/                # React Context providers
│   │   ├── types/                   # Shared TypeScript definitions
│   │   └── styles/                  # Custom style sheets
│   │
│   ├── eslint.config.mjs            # ESLint configuration
│   ├── next.config.ts               # Next.js configuration
│   ├── package.json                 # Frontend dependencies and scripts
│   ├── postcss.config.mjs           # PostCSS configuration for Tailwind CSS
│   ├── tsconfig.json                # TypeScript configuration
│   └── README.md
│
├── server/                          # Express Backend Application (TypeScript)
│   ├── src/                         # Backend Source code
│   │   ├── config/                  # Configuration files
│   │   │   └── db.ts                # MongoDB Mongoose database connection
│   │   ├── controllers/             # Express request handlers
│   │   │   ├── auth.controller.ts   # Login/signup JWT controllers
│   │   │   ├── complaint.controller.ts # Complaint CRUD controllers
│   │   │   ├── emergency.controller.ts # SOS trigger & fetch controllers
│   │   │   └── scan.controller.ts   # Threat scans handling controllers
│   │   ├── middlewares/             # Custom Express middlewares
│   │   │   ├── auth.middleware.ts   # JWT auth token verify middleware
│   │   │   ├── error.middleware.ts  # Global express central error handler
│   │   │   └── validate.middleware.ts # Zod request body validator middleware
│   │   ├── models/                  # Mongoose Schemas/Models
│   │   │   ├── alert.model.ts       # Mongoose alert SOS Schema
│   │   │   ├── complaint.model.ts   # Mongoose complaint Schema
│   │   │   └── scan.model.ts        # Mongoose AI scan Schema
│   │   ├── routes/                  # Express API route declarations
│   │   │   ├── auth.routes.ts       # Auth routes (login/signup)
│   │   │   ├── complaint.routes.ts  # Complaint generator routes
│   │   │   ├── emergency.routes.ts  # SOS/Panic routes
│   │   │   └── scan.routes.ts       # Threat AI scan analyzer routes
│   │   ├── services/                # Business logic layer
│   │   │   └── gemini.service.ts    # Gemini AI API request service
│   │   ├── utils/                   # Threat detector engines/utilities
│   │   │   ├── domainAnalyzer.ts    # Typo/entropy domain analyzer
│   │   │   ├── emailDetector.ts     # Free/temp mail detector
│   │   │   ├── keywordDetector.ts   # Weighted keywords scanner
│   │   │   ├── phoneDetector.ts     # Intl virtual numbers/wa/tg detector
│   │   │   ├── riskEngine.ts        # Threat scoring calculation engine
│   │   │   └── urlDetector.ts       # IP/shortener/TLD link detector
│   │   ├── validators/              # Input validation schemas
│   │   │   └── schema.ts            # Zod validation schema files
│   │   └── server.ts                # Express application entry point
│   ├── package.json                 # Backend dependencies and scripts
│   └── tsconfig.json                # TypeScript compiler configuration
│
├── shared/                          # Shared utilities and configurations between client & server
│   ├── constants/                   # Shared constants
│   ├── interfaces/                  # Shared TypeScript interfaces
│   └── types/                       # Shared TypeScript types
│
├── structure.md                     # Project tree catalog
└── test_scenarios.md                # Threat detection scenarios & JSON schemas
```
