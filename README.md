# TrustLens: Forensic Content Authenticity Verifier 🔍🛡️

**TrustLens** is an advanced, full-stack digital forensics application engineered for security analysts and content auditors. It functions as an interactive operator console to inspect multimodal images, voice recording tracks, and plain-text documents for synthetic artificial anomalies, deepfakes, audio clones, and adversarial injection strings.

Instead of outputting a simple binary "real or fake" assessment, TrustLens physically isolates fraud vectors—plotting coordinate bounding boxes over visual tampering, pinpointing exact timestamps of voice cloning, and flagging adversarial payload injection frames.

---

## 🔗 Live Production Deployment
🚀 **Explore the Live App Terminal:** [Launch TrustLens Console](https://trustlens-forensic-content-authenticity-verifier-970072277340.us-west1.run.app/)

---

## 🛠️ Tech Stack & Advanced Architecture

### ⚙️ Backend & Infrastructure (Server-Side)
- **Runtime Environment:** Node.js + Express.js written completely in **TypeScript**.
- **High-Performance Bundling:** Uses a custom `esbuild` configuration compilation pipeline, yielding a single, self-contained CommonJS bundle (`dist/server.cjs`) to guarantee lightning-fast server container cold-starts.
- **Fail-Safe Networking:** Custom HTTP socket architecture utilizing an explicit IPv4 prioritization fallback strategy (`dns.setDefaultResultOrder("ipv4first")`) alongside a $120,000\text{ms}$ request timeout window to eliminate network blackholes during massive multimodal stream transfers.
- **High-Capacity Payload Infrastructure:** Configured to process heavy binary file streams up to a $50\text{MB}$ threshold limit for uncompressed high-resolution imagery and raw audio waveforms.

### 🧠 Artificial Intelligence & Telemetry Core
- **Engine Orchestration:** Integrated with the official, modern `@google/genai` TypeScript SDK.
- **Multi-Model Routing Strategy:**
  - `gemini-3.5-flash`: Leveraged for real-time, low-latency visual anomaly mapping.
  - `gemini-3.1-pro-preview`: Dispatched for deep-dive, line-by-line file auditing and structural payload evaluation.
- **Sensitivity Controls:** Features dynamic parameter matching supporting Low, Medium, and High operator diagnostic contexts.

### 🖥️ Client-Side Interface (Frontend)
- **Core Architecture:** React 19 bootstrapped on a lightning-fast Vite module loader using TypeScript.
- **Theme & Interface:** Tactical, high-contrast dark "Operator Terminal" style written with Tailwind CSS.
- **Telemetry Visualizations:** Recharts rendering dynamic SVG metric comparisons and probability-density authentication gauges.
- **Micro-Animations:** Framer Motion (`motion/react`) managing real-time scanner wave loops, staggered entry states, and view-transitions.

### 🗄️ Persistence & Cryptographic Layer
- **Cloud Logging:** Connected via Firebase Client SDK to Firebase Firestore for real-time tracking of authenticated operator scan ledgers.
- **Zero-Knowledge Privacy Wrapper:** Built-in client-side **AES-256 cryptographic wrapper** for encrypted local storage backups, giving operators complete data control without creating an external cloud footprint.

---

## 📂 Engineering Directory Layout

```text
trustlens/
│
├── src/                      # React 19 Client Application (Vite + TS)
│   ├── components/           # Terminal UI Components, Telemetry Charts, & Views
│   ├── hooks/                # Crypto wrappers, Auth handlers, & State telemetry
│   └── main.tsx              # Frontend Entrypoint
│
├── server/                   # Express (TypeScript) Backend Application
│   ├── config/               # DNS configurations, Server sockets, & Timeouts
│   └── server.ts             # Backend Server Entrypoint
│
├── dist/                     # Optimized Distribution Build Folder
│   └── server.cjs            # Self-contained high-performance esbuild binary
│
├── public/                   # Asset maps & Metadata logs
├── .gitignore                # Environment and credential security masks
└── README.md                 # Project Documentation Ledger

```

---

## 🚀 Threat Vectors Solved

### 1. Visual Duplicity (Deepfakes)

Detects sub-visual pixel-pattern inconsistencies—such as mismatched eye-gaze vectors, boundary blurs, and repetitive generative noise textures. The application isolates anomalies by calculating precise spatial coordinates and overlaying precise visual bounding boxes.

### 2. Aero-Acoustic Voice Cloning

Parses spectral frequencies, acoustic phases, and automated cadence structures. The analytical engine identifies precise time stamps (in seconds) where vocal splicing or robotic generative speech substitution has occurred.

### 3. Adversarial Text & Jailbreaks

Scans raw plain-text payloads for prompt manipulation scripts, system engineering overrides, and hidden injection vectors before they compromise downstream Large Language Models.

---

## 💻 Local Sandbox Setup

### Prerequisites

* Node.js (v18+ recommended)
* Google AI Studio Gemini API Key
* Firebase Instance Credentials

### Installation

1. **Clone the project repository:**
```bash
git clone [https://github.com/your-username/trustlens.git](https://github.com/your-username/trustlens.git)
cd trustlens

```


2. **Install core module dependencies:**
```bash
npm install
cd server && npm install && cd ..

```


3. **Configure the Environment:**
Create a `.env` file in your root server directory:
```env
GEMINI_API_KEY=your_google_ai_studio_key_here
PORT=5000

```


4. **Compile & Run:**
```bash
# Run the custom esbuild production bundler
npm run build:server

# Boot the tactical interface and proxy engine
npm run start

```



```

```
