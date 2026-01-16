import React, { useState, useEffect } from 'react';
import { SimulationProfile, EnvironmentState } from '../types';
import { Power, Clock, Link, Zap, Terminal, TrendingUp } from 'lucide-react';
import LiveTrafficTable from './LiveTrafficTable';
import SystemEventFeed from './SystemEventFeed';
import InstanceDetails from './InstanceDetails';
import TopologyMap from './TopologyMap';
import RealTimeAnalytics from './RealTimeAnalytics';

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

  // Constants for savings calc
  const hourlySavings = profile.costComparison.hourlyRateOnDemand - profile.costComparison.hourlyRateSpot;
  const savingsPerSecond = hourlySavings / 3600;

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      setSavings(prev => prev + (savingsPerSecond / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [savingsPerSecond]);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* HEADER - Simplified with better touch targets (min 44px) */}
      <header className="bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* Left: Instance Identity & Status */}
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg font-bold text-white">{profile.name}</h1>
              <p className="text-zinc-500 text-sm font-mono flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5" />
                {profile.id}.internal.cloud
              </p>
            </div>

            {/* Status Badge - Clear visibility of system status */}
            <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-800/50 px-4 py-2 rounded-lg">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">Online</span>
              <span className="text-zinc-600">|</span>
              <span className="flex items-center gap-1.5 text-sm text-zinc-400 font-mono">
                <Clock className="w-3.5 h-3.5" />
                {(uptime / 10).toFixed(0)}s
              </span>
            </div>
          </div>

          {/* Right: Actions - Larger touch targets (44px+ height) */}
          <div className="flex items-center gap-4">
            {/* Savings indicator - less prominent */}
            <div className="flex items-center gap-2 px-4 py-2 text-zinc-400">
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-sm font-mono">${savings.toFixed(4)}</span>
            </div>

            {/* Primary Actions - Clear visual hierarchy */}
            <button
              onClick={onConnect}
              className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors text-sm font-semibold min-h-[44px]"
              title="Open SSH Terminal"
            >
              <Terminal size={18} />
              Connect
            </button>

            <button
              onClick={onCrash}
              className="flex items-center gap-2 px-5 py-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium min-h-[44px]"
              title="Simulate a Spot Preemption Event"
            >
              <Zap size={18} />
              <span className="hidden sm:inline">Simulate Crash</span>
            </button>

            <button
              onClick={onStop}
              className="flex items-center justify-center w-11 h-11 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Stop Instance"
            >
              <Power size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - 2-Column Layout (8/4 split) following F-pattern scanning */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* PRIMARY COLUMN (8/12) - Main visual focus */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Topology Map - Hero element, most important visual */}
            <section>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Network Topology
              </h2>
              <div className="h-[380px]">
                <TopologyMap state={appState} />
              </div>
            </section>

            {/* Live Traffic - Secondary visual */}
            <section>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Request Traffic
              </h2>
              <div className="h-[320px]">
                <LiveTrafficTable />
              </div>
            </section>
          </div>

          {/* SECONDARY COLUMN (4/12) - Supporting information */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Instance Details */}
            <section>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Instance Info
              </h2>
              <InstanceDetails profileName={profile.name} profileId={profile.id} />
            </section>

            {/* System Events */}
            <section>
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Activity Log
              </h2>
              <div className="h-[400px]">
                <SystemEventFeed />
              </div>
            </section>
          </div>
        </div>

        {/* BOTTOM ROW - Full width analytics */}
        <section className="mt-6">
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Resource Telemetry
          </h2>
          <RealTimeAnalytics />
        </section>
      </main>
    </div>
  );
};

export default ActiveSession;
