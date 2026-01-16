import React, { useState, useEffect } from 'react';
import { SimulationProfile, EnvironmentState } from '../types';
import { Power, Clock, Link, Zap, Terminal, TrendingUp } from 'lucide-react';
import LiveTrafficTable from './LiveTrafficTable';
import InstanceDetails from './InstanceDetails';
import GlobalMesh from './GlobalMesh';
import RealTimeAnalytics from './RealTimeAnalytics';
import NeuralTerminal from './NeuralTerminal';

import ChaosControl, { ChaosState } from './ChaosControl';

interface ActiveSessionProps {
  onStop: () => void;
  onCrash: () => void;
  onConnect: () => void;
  profile: SimulationProfile;
  appState: EnvironmentState;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ onStop, onCrash, onConnect, profile, appState }) => {
  const [uptime, setUptime] = useState(0);
  const [savings, setSavings] = useState(0);
  const [chaosState, setChaosState] = useState<ChaosState>({
    cpuSpike: false,
    networkLoss: false,
    dbOutage: false
  });

  // Constants for savings calc
  const hourlySavings = profile.costComparison.hourlyRateOnDemand - profile.costComparison.hourlyRateSpot;
  const savingsPerSecond = hourlySavings / 3600;

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      setSavings(prev => prev + (savingsPerSecond / 10)); // Update every 100ms for smoothness
    }, 100);
    return () => clearInterval(interval);
  }, [savingsPerSecond]);

  const toggleChaos = (key: keyof ChaosState) => {
    setChaosState(prev => ({ ...prev, [key]: !prev[key] }));
  };


  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* 1. TOP NAVIGATION BAR */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex justify-between items-center">

        {/* Left: Brand & Status */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{profile.name}</h1>
            <p className="text-zinc-500 flex items-center gap-2 text-xs font-mono">
              <Link className="w-3 h-3" />
              {profile.id}.internal.cloud
            </p>
          </div>

          <div className="h-8 w-px bg-zinc-800" /> {/* Divider */}

          <div className="flex items-center gap-3 bg-emerald-950/30 border border-emerald-900/50 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Online</span>
            <span className="text-zinc-600 text-xs">|</span>
            <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
              <Clock className="w-3 h-3" /> {(uptime / 10).toFixed(0)}s
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 rounded-lg border border-zinc-800">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-zinc-400">Total Savings:</span>
            <span className="text-sm font-bold text-white font-mono">${savings.toFixed(4)}</span>
          </div>

          <button
            onClick={onCrash}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium"
            title="Trigger a Spot Preemption event"
          >
            <Zap size={16} />
            <span className="hidden sm:inline">Simulate Crash</span>
          </button>
          <button
            onClick={onConnect}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-zinc-200 rounded-lg hover:bg-zinc-200 transition-colors text-sm font-bold"
          >
            <Terminal size={16} />
            Connect
          </button>
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            <Power className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-12 gap-6 pb-20">

        {/* LEFT COLUMN: Infrastructure (3/12) */}
        <div className="col-span-1 md:col-span-12 xl:col-span-3 flex flex-col gap-5">
          {/* Chaos Control Panel (NEW) */}
          <ChaosControl chaosState={chaosState} onToggle={toggleChaos} />

          {/* Instance Details */}
          <InstanceDetails profileName={profile.name} profileId={profile.id} />
        </div>

        {/* CENTER COLUMN: Visuals (6/12) */}
        <div className="col-span-1 md:col-span-12 xl:col-span-6 flex flex-col gap-6">
          {/* Topology Map - Taller */}
          <div className="h-[500px] w-full">
            <GlobalMesh
              state={appState}
              isDbChaos={chaosState.dbOutage}
              isNetworkChaos={chaosState.networkLoss}
            />
          </div>

          {/* Traffic Table */}
          <div className="h-[350px]">
            <LiveTrafficTable />
          </div>
        </div>

        {/* RIGHT COLUMN: Observability (3/12) */}
        <div className="col-span-1 md:col-span-12 xl:col-span-3 flex flex-col gap-5">
          {/* Real Time Analytics - More prominent now */}
          <RealTimeAnalytics isCpuChaos={chaosState.cpuSpike} />

          {/* Event Feed - Fixed height for scrollbar visibility */}
          <div className="h-[500px]">
            <NeuralTerminal />
          </div>
        </div>

      </main>
    </div>
  );
};

export default ActiveSession;
