import React, { useState, useEffect } from 'react';
import { SimulationProfile } from '../types';
import { Power, Clock, Link, Activity, Search, Bell, Zap, Terminal, TrendingUp } from 'lucide-react';
import LiveTrafficTable from './LiveTrafficTable';
import SystemEventFeed from './SystemEventFeed';

interface ActiveSessionProps {
  onStop: () => void;
  onCrash: () => void;
  onConnect: () => void;
  profile: SimulationProfile;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ onStop, onCrash, onConnect, profile }) => {
  const [idleTime, setIdleTime] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [savings, setSavings] = useState(0);

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
    <div className="bg-zinc-950 flex flex-col rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      {/* Persistent Banner */}
      <div className="bg-emerald-950/30 border-b border-emerald-900/50 text-emerald-100 px-4 py-2 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-semibold uppercase tracking-wider">Online</span>
          <span className="hidden md:inline text-zinc-500 text-xs">|</span>
          <span className="hidden md:flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="w-3 h-3" /> Uptime: {(uptime / 10).toFixed(0)}s
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-mono">
              You saved <span className="font-bold">${savings.toFixed(5)}</span>
            </span>
          </div>

          <button
            onClick={onStop}
            className="group flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors bg-red-950/30 px-3 py-1.5 rounded-full border border-red-900/50 hover:border-red-800"
            title="Stopping will preserve all data and reduce costs."
          >
            <Power className="w-3 h-3 group-hover:scale-110 transition-transform" />
            Stop
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 ml-1">{profile.name}</h1>
            <p className="text-zinc-500 flex items-center gap-2 text-sm ml-1">
              <Link className="w-3 h-3" />
              <span className="font-mono text-zinc-400">https://{profile.id}.internal.cloud</span>
            </p>
          </div>
          <div className="flex gap-3">
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
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors text-sm font-medium"
            >
              <Terminal size={16} />
              <span className="hidden sm:inline">Connect</span>
            </button>
          </div>
        </header>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-zinc-400 font-medium text-sm">{profile.metrics.label}</h3>
              <Activity className="text-blue-500 w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">{currentMetric} <span className="text-sm font-normal text-zinc-500">{profile.metrics.unit}</span></p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-zinc-400 font-medium text-sm">Avg Latency</h3>
              <Clock className="text-emerald-500 w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white">42<span className="text-sm text-zinc-500">ms</span></p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-zinc-400 font-medium text-sm">Current Rate</h3>
              <div className="w-4 h-4 text-yellow-500">$</div>
            </div>
            <p className="text-2xl font-bold text-white">${profile.costComparison.hourlyRateSpot}<span className="text-sm font-normal text-zinc-500">/hr</span></p>
            <p className="text-xs text-emerald-400 mt-1">
              Savings Active ({((1 - profile.costComparison.hourlyRateSpot / profile.costComparison.hourlyRateOnDemand) * 100).toFixed(0)}%)
            </p>
          </div>
        </div>

        {/* Live Feeds Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          <div className="lg:col-span-2 h-full">
            <LiveTrafficTable />
          </div>
          <div className="h-full">
            <SystemEventFeed />
          </div>
        </div>

      </main>
    </div>
  );
};

export default ActiveSession;
