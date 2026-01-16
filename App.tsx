import React, { useState, useEffect } from 'react';
import { EnvironmentState, SimulationProfile } from './types';
import { SIMULATION_PROFILES } from './constants';
import { Server, Cpu, Database, PlayCircle, Wifi, WifiOff } from 'lucide-react';
import StartupSequence from './components/StartupSequence';
import DockerBuildSim from './components/DockerBuildSim';
import CostAnalytics from './components/CostAnalytics';
import InstanceMetadata from './components/InstanceMetadata';
import LiveTopology from './components/LiveTopology';
import LiveTelemetry from './components/LiveTelemetry';
import ResilienceScore from './components/ResilienceScore';
import LiveTraffic from './components/LiveTraffic';
import SessionTimeline from './components/SessionTimeline';
import SystemEvents from './components/SystemEvents';
import { checkBackendHealth, resurrectVM, stopVM } from './api';

function App() {
  const [selectedProfile, setSelectedProfile] = useState<SimulationProfile>(SIMULATION_PROFILES[0]);
  const [appState, setAppState] = useState<EnvironmentState>('OFFLINE');
  const [stage, setStage] = useState<'SELECTION' | 'DOCKER_BUILD' | 'BOOT_LOGS' | 'ACTIVE'>('SELECTION');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendLogs, setBackendLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendConnected(isHealthy);
    };
    checkHealth();

    // Keep checking every 10 seconds
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setError(null);
    setIsLoading(true);

    if (backendConnected) {
      // Use real backend
      try {
        setAppState('DEPLOYING');
        setStage('DOCKER_BUILD');

        const result = await resurrectVM(selectedProfile.id);

        if (result.success) {
          setBackendLogs(result.logs || []);
          // After docker build sim, move to boot logs
        } else {
          setError(result.message);
          setAppState('OFFLINE');
          setStage('SELECTION');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to backend');
        // Fall back to mock mode
        setAppState('DEPLOYING');
        setStage('DOCKER_BUILD');
      }
    } else {
      // Use mock mode (existing behavior)
      setAppState('DEPLOYING');
      setStage('DOCKER_BUILD');
    }

    setIsLoading(false);
  };

  const handleDockerComplete = () => {
    setStage('BOOT_LOGS');
    setAppState('STARTING');
  };

  const handleBootComplete = () => {
    setStage('ACTIVE');
    setAppState('ACTIVE');
  };

  const handleStop = async () => {
    setIsLoading(true);

    if (backendConnected) {
      try {
        await stopVM();
      } catch (err) {
        console.error('Failed to stop VM:', err);
      }
    }

    setAppState('OFFLINE');
    setStage('SELECTION');
    setBackendLogs([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">

      {/* Backend Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${backendConnected
        ? 'bg-green-900/30 border border-green-700/50 text-green-400'
        : 'bg-yellow-900/30 border border-yellow-700/50 text-yellow-400'
        }`}>
        {backendConnected ? (
          <>
            <Wifi size={14} />
            <span>Backend Connected</span>
          </>
        ) : (
          <>
            <WifiOff size={14} />
            <span>Mock Mode</span>
          </>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="fixed top-16 right-4 z-50 bg-red-900/30 border border-red-700/50 text-red-400 px-4 py-2 rounded-lg text-sm max-w-md">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-300 hover:text-white">×</button>
        </div>
      )}

      {/* 1. SELECTION SCREEN */}
      {stage === 'SELECTION' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <header className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              Spot Lazarus Control
            </h1>
            <p className="text-xl text-gray-400 font-light">
              Select an environment configuration to resurrect.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SIMULATION_PROFILES.map((profile) => {
              const Icon = profile.icon === 'server' ? Server : profile.icon === 'cpu' ? Cpu : Database;
              const isSelected = selectedProfile.id === profile.id;

              return (
                <div
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={`
                    relative group cursor-pointer rounded-2xl p-8 border transition-all duration-300
                    ${isSelected
                      ? 'bg-blue-900/10 border-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}
                  `}
                >
                  <div className={`p-4 rounded-xl inline-block mb-6 ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{profile.name}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{profile.description}</p>

                  {isSelected && (
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-blue-900/20 to-transparent rounded-b-2xl">
                      <span className="text-sm font-mono text-blue-400 flex items-center gap-2">
                        <PlayCircle size={16} /> Ready to Deploy
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => {
                window.open('https://lazarus-gateway-913938404636.us-central1.run.app', '_blank');
                setStage('ACTIVE');
                setAppState('ACTIVE');
              }}
              className="bg-zinc-100 text-black px-12 py-4 rounded-full font-bold text-lg transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
            >
              INITIALIZE SEQUENCE
            </button>
          </div>
        </div>
      )}

      {/* 2. DOCKER BUILD SIMULATION */}
      {stage === 'DOCKER_BUILD' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h2 className="text-3xl font-bold mb-8 text-blue-400 tracking-wider">BUILDING CONTAINER IMAGE...</h2>
          <DockerBuildSim logs={selectedProfile.dockerBuildSequence} onComplete={handleDockerComplete} />
        </div>
      )}

      {/* 3. STARTUP LOGS */}
      {stage === 'BOOT_LOGS' && (
        <StartupSequence logs={selectedProfile.startupSequence} onComplete={handleBootComplete} />
      )}

      {/* 4. ACTIVE SESSION - COMPREHENSIVE DASHBOARD */}
      {stage === 'ACTIVE' && (
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{selectedProfile.name}</h1>
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ENVIRONMENT RUNNING
                {backendConnected && <span className="text-zinc-500 ml-2">(Live)</span>}
              </div>
            </div>
            <button
              onClick={handleStop}
              disabled={isLoading}
              className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition-colors"
            >
              {isLoading ? 'STOPPING...' : 'TERMINATE SESSION'}
            </button>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-4">
            {/* Row 1: Instance Metadata | Live Topology | Live Telemetry */}
            <div className="col-span-12 lg:col-span-3">
              <InstanceMetadata />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <LiveTopology />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <LiveTelemetry />
            </div>

            {/* Row 2: Resilience Score | Live Traffic | Session Timeline + System Events */}
            <div className="col-span-12 lg:col-span-3">
              <ResilienceScore />
            </div>
            <div className="col-span-12 lg:col-span-5">
              <LiveTraffic />
            </div>
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <SessionTimeline />
              <SystemEvents />
            </div>

            {/* Row 3: Cost Analytics */}
            <div className="col-span-12 lg:col-span-4">
              <CostAnalytics data={selectedProfile.costComparison.monthlyData} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
