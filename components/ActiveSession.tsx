import React, { useState, useEffect } from 'react';
import { SimulationProfile, EnvironmentState } from '../types';
import { Power, Clock, Link, Activity, Search, Bell, Zap, Terminal, TrendingUp, Cpu, Network } from 'lucide-react';
import LiveTrafficTable from './LiveTrafficTable';
import SystemEventFeed from './SystemEventFeed';
import InstanceDetails from './InstanceDetails';
import TopologyMap from './TopologyMap';
import RealTimeAnalytics from './RealTimeAnalytics';
import CostAnalytics from './CostAnalytics';
import VMVisualizer from './VMVisualizer';
import ResilienceScore from './ResilienceScore';
import DeploymentTimeline from './DeploymentTimeline';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface ActiveSessionProps {
  onStop: () => void;
  onCrash: () => void;
  onConnect: () => void;
  profile: SimulationProfile;
  appState: EnvironmentState;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ onStop, onCrash, onConnect, profile, appState }) => {
  const [idleTime, setIdleTime] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [savings, setSavings] = useState(0);

  // Latency Graph State
  const [latencyData, setLatencyData] = useState<{ value: number }[]>(Array(20).fill({ value: 42 }));

  // Constants for savings calc
  const hourlySavings = profile.costComparison.hourlyRateOnDemand - profile.costComparison.hourlyRateSpot;
  const savingsPerSecond = hourlySavings / 3600;

  useEffect(() => {
    const timer = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      setSavings(prev => prev + (savingsPerSecond / 10)); // Update every 100ms for smoothness
    }, 100);
    return () => clearInterval(interval);
  }, [savingsPerSecond]);

  // Latency Simulation Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyData(prev => {
        const last = prev[prev.length - 1].value;
        const next = Math.max(20, Math.min(100, last + (Math.random() - 0.5) * 20));
        return [...prev.slice(1), { value: next }];
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const idleMins = 30 - idleTime;

  // Use the profile metrics to show something interesting
  const metricValue = profile.metrics.mockValues[0];
  const [currentMetric, setCurrentMetric] = useState(metricValue);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * profile.metrics.mockValues.length);
      setCurrentMetric(profile.metrics.mockValues[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, [profile]);


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
        <div className="col-span-1 md:col-span-12 xl:col-span-3 flex flex-col gap-6">
          {/* Instance Details */}
          <InstanceDetails profileName={profile.name} profileId={profile.id} />

          {/* 2x2 Grid for Metrics */}
          {/* Resilience Score - Full width for proper display */}
          <div className="h-56">
            <ResilienceScore score={92} />
          </div>

          {/* 2x2 Grid for Metrics */}
          <div className="grid grid-cols-2 gap-4">

            {/* Profile Metric */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between h-32">
              <div className="flex justify-between items-start">
                <span className="text-zinc-500 text-[10px] font-semibold uppercase">{profile.metrics.label}</span>
                <Activity size={14} className="text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">{currentMetric}</span>
                <span className="text-zinc-500 text-xs">{profile.metrics.unit}</span>
              </div>
            </div>

            {/* Cost Rate */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
              <div className="flex justify-between items-start z-10">
                <span className="text-zinc-500 text-[10px] font-semibold uppercase">Hourly</span>
                <span className="text-yellow-500 text-xs">$</span>
              </div>
              <div className="z-10 flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight">${profile.costComparison.hourlyRateSpot}</span>
                <p className="text-[10px] text-emerald-400">
                  -{((1 - profile.costComparison.hourlyRateSpot / profile.costComparison.hourlyRateOnDemand) * 100).toFixed(0)}% vs OD
                </p>
              </div>
            </div>

            {/* Latency Mini */}
            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between relative overflow-hidden h-32">
              <div className="flex justify-between items-start z-10">
                <span className="text-zinc-500 text-[10px] font-semibold uppercase">Latency</span>
                <Network size={14} className="text-emerald-500" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={latencyData}>
                    <defs>
                      <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#latencyGradient)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="z-10">
                <span className="text-xl font-bold text-white tracking-tight">{latencyData[latencyData.length - 1].value.toFixed(0)}</span>
                <span className="text-zinc-500 text-xs ml-1">ms</span>
              </div>
            </div>
          </div>

          {/* VM Visualizer */}
          <VMVisualizer state={appState} />

          {/* Cost Analytics - Moved to bottom of left col */}
          <div className="flex-1">
            <CostAnalytics data={profile.costComparison.monthlyData} />
          </div>
        </div>

        {/* CENTER COLUMN: Visuals (6/12) */}
        <div className="col-span-1 md:col-span-12 xl:col-span-6 flex flex-col gap-6">
          {/* Topology Map - Taller */}
          <div className="h-[500px] w-full">
            <TopologyMap state={appState} />
          </div>

          {/* Traffic Table */}
          <div className="h-[350px]">
            <LiveTrafficTable />
          </div>
        </div>

        {/* RIGHT COLUMN: Observability (3/12) */}
        <div className="col-span-1 md:col-span-12 xl:col-span-3 flex flex-col gap-6">
          {/* Real Time Analytics */}
          <RealTimeAnalytics />

          {/* Timeline */}
          <div className="h-64 relative z-10">
            <DeploymentTimeline />
          </div>

          {/* Event Feed */}
          <div className="h-[400px] overflow-hidden">
            <SystemEventFeed />
          </div>
        </div>

      </main>
    </div>
  );
};

export default ActiveSession;
