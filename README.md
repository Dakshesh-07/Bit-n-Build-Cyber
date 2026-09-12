# 🛡️ CyberVigil: Trauma-Informed Child Cyber Defense Ecosystem

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.6_Flash-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDakshesh-07%2FCyberVigil&env=VITE_GEMINI_API_KEY,VITE_GEMINI_MODEL&envDescription=Enter%20your%20Google%20Gemini%20API%20Key%20and%20Model)

**CyberVigil** is a trauma-informed, privacy-first digital defense web application engineered to protect children, adolescents, and young adults against online threats, cyberbullying, sexual extortion, grooming, impersonation, and phishing scams.

CyberVigil combines client-side zero-knowledge evidence preservation, unblocked real-time AI safety triage via Google Gemini, statutory Childline 1098 escalation protocols, and an explorable multi-persona camouflage mode for emergency privacy.

---

## 🌟 Key Features

### 1. Five Integrated Safety Gateways
- **Digital Resilience Academy (`/learn`)**: Practical, interactive self-defense modules covering password security, catfish detection, predator red flags, and digital boundaries with progress tracking.
- **Brave Community Stories (`/stories`)**: Moderated, community-contributed peer stories from youth who survived cyber extortion and harassment. Users can publish stories anonymously or with secret aliases.
- **Guardian AI Assistant (`/assistant`)**: Powered by `gemini-3.6-flash` with trauma-informed child protection prompts and unblocked safety guardrails specifically calibrated to identify:
  - Cyberbullying & peer targeted abuse
  - Online grooming & predator manipulation
  - Extortion, sextortion & blackmail threats
  - Phishing scams & account hijacking
- **Verified Incident Reporting (`/report`)**: A secure intake pipeline with:
  - Client-side EXIF/GPS metadata stripping
  - SHA-256 cryptographic evidence checksum generation (court-admissible under Section 65B)
  - Compulsory evidence attachment & statutory safety check verification
  - Victim-safe mode with 100% anonymous reporting
- **SafeConnect Circles (`/safeconnect`)**: Direct connection to accredited adolescent psychologists, POCSO nodal officers, and school counselors.

---

### 2. Multi-Persona Quick Escape (Camouflage Mode)
Pressing <kbd>ESC</kbd> or clicking the stealth toggle instantly replaces the active interface with a lifelike, explorable study screen to safeguard users from over-the-shoulder monitoring:
- **🧸 Class 4 Primary School**: NCERT Looking Around EVS & Math-Magic chapters with interactive kid quizzes and reward stars.
- **🔬 Class 10 High School**: CBSE digital textbook covering respiration biology, Ohm's law, and quadratic equations.
- **🎓 College / University LMS**: B.Tech CS301 syllabus featuring Dijkstra's algorithm, lecture slides, and an interactive terminal sandbox that compiles test cases in real-time.
- **📺 YouTube Study Stream**: Complete video player interface with play/pause controls, dynamic likes counter, interactive comments section, and recommended video switching.
- **Stealth Resume Control**: The resume trigger is discreetly nested inside an academic student profile dropdown to maintain absolute security.

---

### 3. Role-Based Access Control (RBAC)
CyberVigil features granular clearance levels:
| Role | Clearance | Description |
| :--- | :---: | :--- |
| **Anonymous Minor** | Level 1 | Ephemeral session, zero identity logs, Case PIN tracking |
| **Registered Youth** | Level 2 | Custom avatar, saved learning progress, anonymous story submissions |
| **Parent / Guardian** | Level 2+ | Family safety oversight, educational guides |
| **Child Welfare Officer** | Level 3 | Case triage dashboard, platform takedown dispatch, forensic dossier exports |

---

### 4. Forensic Security & Privacy Hub (`/security`)
- **Client-Side EXIF Scrubbing**: Device serial numbers, GPS coordinates, and camera metadata are scrubbed locally in the browser before transmission.
- **SHA-256 Integrity Verification**: An interactive Web Crypto API tool demonstrating how forensic evidence is permanently sealed.
- **Emergency Session Purge**: 1-click irreversible purging of all local browser cache, tokens, drafts, and tickets for shared or monitored family computers.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Vanilla Tailwind CSS with custom Alabaster Sand design tokens
- **Icons**: Lucide React
- **AI Intelligence**: Google Gemini API (`gemini-3.6-flash`)
- **State & Local Persistence**: Custom zero-leak LocalStore engine & React Context

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dakshesh-07/CyberVigil.git
   cd CyberVigil
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file and add your Google Gemini API key:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GEMINI_MODEL=gemini-3.6-flash
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel

CyberVigil is configured for deployment on Vercel out of the box with zero additional setup.

### Option 1: 1-Click Instant Deploy
Click the button below to deploy your own instance of CyberVigil to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDakshesh-07%2FCyberVigil&env=VITE_GEMINI_API_KEY,VITE_GEMINI_MODEL&envDescription=Enter%20your%20Google%20Gemini%20API%20Key%20and%20Model)

### Option 2: Connect via Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new).
2. Select or import your GitHub repository: **`Dakshesh-07/CyberVigil`**.
3. Under **Build and Output Settings**, Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_GEMINI_API_KEY` = your Google Gemini API key
   - `VITE_GEMINI_MODEL` = `gemini-3.6-flash`
5. Click **Deploy**. Vercel will build and assign you a secure production domain (e.g., `cybervigil.vercel.app`).
6. Single Page Application (SPA) routing is handled automatically by the included [`vercel.json`](./vercel.json).

---

## 📂 Project Architecture

```
CyberVigil/
├── public/
│   └── shield.svg                # Application Favicon
├── src/
│   ├── components/
│   │   ├── auth/                 # Protected route & role authorization gates
│   │   └── layout/
│   │       ├── CamouflageOverlay.tsx # 4-Persona Quick Escape disguises
│   │       ├── EmergencyBanner.tsx   # Direct 1098 & 1930 helplines
│   │       ├── Footer.tsx            # Legal disclosures & helpline bar
│   │       └── Navbar.tsx            # Decluttered responsive navigation & RBAC switcher
│   ├── context/
│   │   └── AuthContext.tsx       # RBAC auth state & session lifecycle
│   ├── lib/
│   │   └── gemini.ts             # Google Gemini API integration with unblocked safety
│   ├── pages/
│   │   ├── AIAssistant.tsx       # Trauma-informed Guardian AI chat interface
│   │   ├── BraveStories.tsx      # Moderated anonymous community courage stories
│   │   ├── Home.tsx              # Safety Gateways & interactive scenario simulator
│   │   ├── Learn.tsx             # Digital resilience academy & micro-lessons
│   │   ├── Login.tsx             # Multi-tab sign-in, case PIN tracking & officer clearance
│   │   ├── OrgPortal.tsx         # POCSO officer investigation & platform takedown desk
│   │   ├── Register.tsx          # Zero-PII account activation
│   │   ├── ReportIncident.tsx    # Compulsory evidence intake with EXIF scrubbing
│   │   ├── SafeConnect.tsx       # Verified psychological and legal counselors
│   │   └── SecurityHub.tsx       # Cryptographic hashing & emergency cache purge
│   ├── utils/
│   │   └── localStore.ts         # Encrypted browser session store
│   ├── types/
│   │   └── index.ts              # TypeScript type contracts & data schemas
│   ├── App.tsx                   # Top-level routing & layout shell
│   └── main.tsx                  # Application entry point
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file for secrets and dependencies
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🤝 Contributing

Contributions that bolster child safety, enhance trauma-informed UX, or expand language accessibility are welcome. Please open an issue or submit a pull request with details on your proposed enhancements.

---

## ⚖️ Statutory Notice & Ethics

CyberVigil is dedicated to child welfare and cybersecurity defense. In cases of immediate life-threatening physical peril, self-harm, or child sexual abuse material (CSAM), report directly to:
- **Childline India**: `1098`
- **National Cyber Crime Portal**: `1930` or [cybercrime.gov.in](https://cybercrime.gov.in)


