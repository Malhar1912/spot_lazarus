Here is the complete `implementation.md` file, structured for immediate execution by your coding agent (Antigravity).

```markdown
# Spot Lazarus v2: Implementation Guide

## 1. Project Overview
**Goal:** Upgrade the existing single-state React prototype into a "Multi-API Simulation Platform" deployable via Google Cloud Run.
**New Features:**
* **Simulation Selection:** Users choose between Payments, AI Inference, or Data Pipeline environments.
* **Dynamic Startups:** Each profile has unique boot logs and delay timings.
* **Dynamic Metrics:** Dashboard visualizes different units (tx/s, tokens/s, events/s) based on selection.
* **Cloud Native:** Fully Dockerized with Nginx and automated via Cloud Build.

---

## 2. Frontend Implementation

### Step A: Update Type Definitions
**File:** `src/types.ts`
**Action:** Replace content with the following to support simulation profiles.

```typescript
export type EnvironmentState = 'OFFLINE' | 'STARTING' | 'READY' | 'ACTIVE' | 'SLEEPING';

export interface LogStep {
  id: string;
  message: string;
  duration: number;
}

export interface SimulationProfile {
  id: string;
  name: string;
  description: string;
  icon: 'server' | 'cpu' | 'database'; // Maps to Lucide icons
  startupSequence: LogStep[];
  metrics: {
    label: string;
    unit: string;
    mockValues: number[]; // For the graph visualization
  };
}

```

### Step B: Define Simulation Data

**File:** `src/constants.tsx`
**Action:** Create/Update this file to include the mock data for all 3 profiles.

```typescript
import { SimulationProfile, LogStep } from './types';

// 1. Payments API Logs
const PAYMENTS_LOGS: LogStep[] = [
  { id: '1', message: 'Initializing Secure Enclave...', duration: 800 },
  { id: '2', message: 'Connecting to Banking Gateway...', duration: 1200 },
  { id: '3', message: 'Verifying TLS Certificates...', duration: 600 },
  { id: '4', message: 'Loading Fraud Detection Modules...', duration: 1000 },
  { id: '5', message: 'Ready for Transactions.', duration: 500 },
];

// 2. AI Inference Logs
const AI_LOGS: LogStep[] = [
  { id: '1', message: 'Allocating GPU VRAM (A100)...', duration: 1500 },
  { id: '2', message: 'Loading PyTorch Weights (4GB)...', duration: 2000 },
  { id: '3', message: 'Warming up Tensor Cores...', duration: 800 },
  { id: '4', message: 'Model Quantization Check...', duration: 600 },
  { id: '5', message: 'Inference Server Online.', duration: 400 },
];

// 3. Data Pipeline Logs
const DATA_LOGS: LogStep[] = [
  { id: '1', message: 'Connecting to Kafka Brokers...', duration: 900 },
  { id: '2', message: 'Hydrating Redis Cache...', duration: 1400 },
  { id: '3', message: 'Syncing Schema Registry...', duration: 700 },
  { id: '4', message: 'Starting Worker Pool (x4)...', duration: 1100 },
  { id: '5', message: 'Stream Processing Active.', duration: 300 },
];

export const SIMULATION_PROFILES: SimulationProfile[] = [
  {
    id: 'payments-v1',
    name: 'Payments Gateway',
    description: 'High-security transaction processor (PCI-DSS compliant).',
    icon: 'server',
    startupSequence: PAYMENTS_LOGS,
    metrics: { label: 'Throughput', unit: 'tx/s', mockValues: [45, 120, 80, 200, 150] }
  },
  {
    id: 'ai-model-v2',
    name: 'GenAI Inference',
    description: 'LLM hosting environment with GPU acceleration.',
    icon: 'cpu',
    startupSequence: AI_LOGS,
    metrics: { label: 'Tokens', unit: 'tok/s', mockValues: [12, 45, 30, 60, 55] }
  },
  {
    id: 'data-pipe-v1',
    name: 'Real-time Analytics',
    description: 'Stream processing for user events.',
    icon: 'database',
    startupSequence: DATA_LOGS,
    metrics: { label: 'Events', unit: 'msg/s', mockValues: [500, 2400, 1800, 3000, 2100] }
  }
];

```

### Step C: Update Main App Logic

**File:** `src/App.tsx`
**Action:** Implement the grid selection logic and pass the selected profile to child components.

```tsx
import { useState } from 'react';
import { SIMULATION_PROFILES } from './constants';
import { SimulationProfile, EnvironmentState } from './types';
import { Server, Cpu, Database } from 'lucide-react'; // Ensure lucide-react is installed
import StartupSequence from './components/StartupSequence'; // Assume existing
import ActiveSession from './components/ActiveSession'; // Assume existing

function App() {
  const [selectedProfile, setSelectedProfile] = useState<SimulationProfile>(SIMULATION_PROFILES[0]);
  const [appState, setAppState] = useState<EnvironmentState>('OFFLINE');

  const handleStart = () => {
    setAppState('STARTING');
  };

  // Helper to render dynamic icons
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'server': return <Server className="w-8 h-8" />;
      case 'cpu': return <Cpu className="w-8 h-8" />;
      case 'database': return <Database className="w-8 h-8" />;
      default: return <Server className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans selection:bg-emerald-500/30">
      
      {/* 1. SELECTION SCREEN */}
      {appState === 'OFFLINE' && (
        <div className="max-w-4xl mx-auto mt-20 fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Spot Lazarus Control
          </h1>
          <p className="text-zinc-400 text-lg mb-12">Select an environment configuration to resurrect.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SIMULATION_PROFILES.map((profile) => (
              <div 
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`
                  p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 group
                  ${selectedProfile.id === profile.id 
                    ? 'border-emerald-500 bg-emerald-900/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}
                `}
              >
                <div className={`mb-4 transition-colors ${selectedProfile.id === profile.id ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                   {renderIcon(profile.icon)}
                </div>
                <h3 className="text-xl font-bold text-zinc-100">{profile.name}</h3>
                <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{profile.description}</p>
              </div>
            ))}
          </div>

          <button 
            onClick={handleStart}
            className="mt-12 w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold text-xl tracking-wide shadow-lg shadow-emerald-900/20 transition-all transform hover:-translate-y-1"
          >
            INITIALIZE SEQUENCE
          </button>
        </div>
      )}

      {/* 2. STARTUP SEQUENCE */}
      {appState === 'STARTING' && (
        <StartupSequence 
          logs={selectedProfile.startupSequence} 
          onComplete={() => setAppState('ACTIVE')} 
        />
      )}

      {/* 3. ACTIVE DASHBOARD */}
      {appState === 'ACTIVE' && (
        <ActiveSession 
          profile={selectedProfile} 
          onStop={() => setAppState('OFFLINE')} 
        />
      )}
    </div>
  );
}

export default App;

```

---

## 3. Infrastructure & Deployment

### Step A: Docker Configuration

**File:** `Dockerfile` (in project root)
**Action:** Create file for multi-stage Nginx build.

```dockerfile
# Stage 1: Build React App
FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
# Configure Nginx to listen on $PORT (Required for Cloud Run)
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

```

### Step B: CI/CD Pipeline

**File:** `cloudbuild.yaml` (in project root)
**Action:** Create file to automate build and deploy.

```yaml
steps:
  # 1. Build Container
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'us-central1-docker.pkg.dev/$PROJECT_ID/spot-lazarus-repo/dashboard:latest', '.']

  # 2. Push to Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'us-central1-docker.pkg.dev/$PROJECT_ID/spot-lazarus-repo/dashboard:latest']

  # 3. Deploy to Cloud Run
  - name: 'gcr.io/[google.com/cloudsdktool/cloud-sdk](https://google.com/cloudsdktool/cloud-sdk)'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'spot-lazarus-dashboard'
      - '--image'
      - 'us-central1-docker.pkg.dev/$PROJECT_ID/spot-lazarus-repo/dashboard:latest'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'

images:
  - 'us-central1-docker.pkg.dev/$PROJECT_ID/spot-lazarus-repo/dashboard:latest'

options:
  logging: CLOUD_LOGGING_ONLY

```

---

## 4. Execution Commands (GCP Setup)

Run these commands in your terminal to prepare the Google Cloud environment before pushing code.

```bash
# 1. Login and Set Project
gcloud auth login
gcloud config set project [YOUR_PROJECT_ID]

# 2. Enable Required APIs (if not already done)
gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com run.googleapis.com

# 3. Create Artifact Registry Repo
gcloud artifacts repositories create spot-lazarus-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Docker repository for Spot Lazarus Dashboard"

# 4. (Optional) Manual Trigger Check
# You can manually submit the build to test it immediately
gcloud builds submit --config cloudbuild.yaml .

```

```

```