add the **Docker Simulation**, **VM Visualization**, and **Comparative Analytics**.



```markdown
# Spot Lazarus v3: Advanced Implementation Guide

## 1. Project Overview
**Goal:** Enhance the Spot Lazarus platform with deep technical simulations and financial impact visualization.
**New Capabilities:**
1.  **Docker Build Simulation:** A terminal-style UI simulating the container build process before the VM boots.
2.  **VM Visualizer:** An animated, graphical representation of the server hardware state (e.g., fans spinning, status LEDs) responding to lifecycle events.
3.  **Impact Analytics:** A data dashboard comparing "Standard On-Demand Costs" (Before) vs. "Spot Lazarus Costs" (After) using rich charts.

---

## 2. Frontend Implementation

### Step A: Update Type Definitions
**File:** `src/types.ts`
**Action:** Extend definitions to support Docker logs and detailed cost analytics.

```typescript
// ... existing types

export interface CostMetric {
  month: string;
  onDemandCost: number; // The "Before" cost
  spotLazarusCost: number; // The "After" cost
}

export interface SimulationProfile {
  // ... existing fields
  dockerBuildSequence: LogStep[]; // New: Container build logs
  costComparison: {
    hourlyRateOnDemand: number;
    hourlyRateSpot: number;
    monthlyData: CostMetric[]; // Data for the chart
  };
}

```

### Step B: Update Simulation Data

**File:** `src/constants.tsx`
**Action:** Add Docker logs and financial data to the profiles.

```typescript
// ... imports

const DOCKER_LOGS_TEMPLATE: LogStep[] = [
  { id: 'd1', message: 'Step 1/5 : FROM node:18-alpine', duration: 400 },
  { id: 'd2', message: 'Step 2/5 : WORKDIR /app', duration: 200 },
  { id: 'd3', message: 'Step 3/5 : COPY package*.json ./', duration: 300 },
  { id: 'd4', message: 'Step 4/5 : RUN npm ci --only=production', duration: 1500 },
  { id: 'd5', message: 'Step 5/5 : COPY . .', duration: 300 },
  { id: 'd6', message: 'Successfully built image sha256:a1b2c3d4', duration: 600 },
];

export const SIMULATION_PROFILES: SimulationProfile[] = [
  {
    id: 'payments-v1',
    // ... existing fields
    dockerBuildSequence: DOCKER_LOGS_TEMPLATE,
    costComparison: {
      hourlyRateOnDemand: 0.48, // e.g. n1-standard-4
      hourlyRateSpot: 0.04,     // Spot price
      monthlyData: [
        { month: 'Jan', onDemandCost: 350, spotLazarusCost: 45 },
        { month: 'Feb', onDemandCost: 340, spotLazarusCost: 42 },
        { month: 'Mar', onDemandCost: 360, spotLazarusCost: 48 },
      ]
    }
  },
  // ... Repeat structure for AI and Data profiles with different costs
];

```

### Step C: Create New Components

#### 1. Docker Build Simulator

**File:** `src/components/DockerBuildSim.tsx`
**Concept:** A dark terminal window that streams lines of code.

```tsx
import { useEffect, useState } from 'react';
import { LogStep } from '../types';
import { motion } from 'framer-motion';

interface Props {
  logs: LogStep[];
  onComplete: () => void;
}

export default function DockerBuildSim({ logs, onComplete }: Props) {
  const [visibleLogs, setVisibleLogs] = useState<LogStep[]>([]);

  useEffect(() => {
    let delay = 0;
    logs.forEach((log, index) => {
      delay += log.duration;
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
        if (index === logs.length - 1) setTimeout(onComplete, 800);
      }, delay);
    });
  }, [logs, onComplete]);

  return (
    <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm text-green-400 shadow-2xl border border-gray-700 w-full max-w-3xl mx-auto">
      <div className="border-b border-gray-700 pb-2 mb-4 flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"/>
        <div className="w-3 h-3 rounded-full bg-yellow-500"/>
        <div className="w-3 h-3 rounded-full bg-green-500"/>
        <span className="ml-4 text-gray-500 text-xs">build-log — -zsh</span>
      </div>
      <div className="space-y-2 h-64 overflow-y-auto">
        {visibleLogs.map(log => (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={log.id}>
            <span className="text-blue-400">➜</span> {log.message}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1, 0] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-2 h-4 bg-green-400 inline-block align-middle"
        />
      </div>
    </div>
  );
}

```

#### 2. VM Visualizer

**File:** `src/components/VMVisualizer.tsx`
**Concept:** An animated SVG representing a server blade. Fans spin when active, lights dim when sleeping.

```tsx
import { EnvironmentState } from '../types';
import { motion } from 'framer-motion';

export default function VMVisualizer({ state }: { state: EnvironmentState }) {
  const isRunning = state === 'ACTIVE';
  
  return (
    <div className="relative w-64 h-32 bg-zinc-800 rounded-md border-t-2 border-zinc-700 shadow-lg flex items-center justify-around p-4">
      {/* Status LEDs */}
      <div className="flex gap-2">
        <motion.div 
          animate={{ opacity: isRunning ? [1, 0.5, 1] : 0.2 }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 shadow-[0_0_10px_lime]' : 'bg-red-900'}`} 
        />
        <div className="w-3 h-3 rounded-full bg-yellow-600 opacity-20" />
      </div>

      {/* Fan Animation */}
      <div className="flex gap-4">
        {[1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ rotate: isRunning ? 360 : 0 }}
            transition={{ duration: isRunning ? 0.5 : 0, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-zinc-600 rounded-full border-t-zinc-400 border-dashed"
          />
        ))}
      </div>
      <div className="absolute bottom-2 text-[10px] text-zinc-500 font-mono">
        RACK_UNIT_04 // {state}
      </div>
    </div>
  );
}

```

#### 3. Cost Analytics Chart

**File:** `src/components/CostAnalytics.tsx`
**Concept:** A Recharts bar chart showing the drastic savings.

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CostMetric } from '../types';

export default function CostAnalytics({ data }: { data: CostMetric[] }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
      <h3 className="text-xl font-bold text-zinc-100 mb-4">Cost Impact Analysis</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="month" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
              itemStyle={{ color: '#e4e4e7' }}
            />
            <Legend />
            <Bar dataKey="onDemandCost" name="Standard (On-Demand)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="spotLazarusCost" name="Spot Lazarus" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-zinc-400 mt-4 text-center">
        *Based on n1-standard-4 pricing vs. Preemptible instances
      </p>
    </div>
  );
}

```

### Step D: Integrate into Main App

**File:** `src/App.tsx`
**Action:** Update the flow logic to include the new steps.

```tsx
// ... imports including new components

function App() {
  const [appState, setAppState] = useState<EnvironmentState>('OFFLINE');
  // New State for flow control
  const [stage, setStage] = useState<'SELECTION' | 'DOCKER_BUILD' | 'BOOT_LOGS' | 'ACTIVE'>('SELECTION');

  const handleStart = () => setStage('DOCKER_BUILD');

  const handleDockerComplete = () => setStage('BOOT_LOGS');
  
  const handleBootComplete = () => {
    setStage('ACTIVE');
    setAppState('ACTIVE');
  };

  return (
    // ... Layout wrapper
    
    {stage === 'SELECTION' && <SelectionScreen onSelect={handleStart} ... />}

    {/* New Docker Stage */}
    {stage === 'DOCKER_BUILD' && (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-8 text-blue-400">Building Container Image...</h2>
        <DockerBuildSim logs={selectedProfile.dockerBuildSequence} onComplete={handleDockerComplete} />
      </div>
    )}

    {stage === 'BOOT_LOGS' && <StartupSequence ... onComplete={handleBootComplete} />}

    {stage === 'ACTIVE' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Dashboard & VM Visual */}
        <div className="space-y-6">
          <VMVisualizer state={appState} />
          <ActiveSession ... />
        </div>
        
        {/* Right Column: Analytics */}
        <div>
          <CostAnalytics data={selectedProfile.costComparison.monthlyData} />
        </div>
      </div>
    )}
    
    // ...
  );
}

```

---

## 3. Deployment (Unchanged)

The Dockerfile and Cloud Build configurations remain valid as they serve the final built React application. No changes required to `Dockerfile` or `cloudbuild.yaml` unless you wish to add build arguments for specific analytic keys.

```

```