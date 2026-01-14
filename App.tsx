import React, { useState } from 'react';
import { EnvironmentState, SimulationProfile } from './types';
import { SIMULATION_PROFILES } from './constants';
import { Server, Cpu, Database, Link, PlayCircle } from 'lucide-react';
import StartupSequence from './components/StartupSequence';
import ActiveSession from './components/ActiveSession';
import DockerBuildSim from './components/DockerBuildSim';
import VMVisualizer from './components/VMVisualizer';
import CostAnalytics from './components/CostAnalytics';

function App() {
  const [selectedProfile, setSelectedProfile] = useState<SimulationProfile>(SIMULATION_PROFILES[0]);
  const [appState, setAppState] = useState<EnvironmentState>('OFFLINE');
  const [stage, setStage] = useState<'SELECTION' | 'DOCKER_BUILD' | 'BOOT_LOGS' | 'ACTIVE'>('SELECTION');

  const handleStart = () => {
    setAppState('DEPLOYING');
    setStage('DOCKER_BUILD');
  };

  const handleDockerComplete = () => {
    setStage('BOOT_LOGS');
    setAppState('STARTING');
  };

  const handleBootComplete = () => {
    setStage('ACTIVE');
    setAppState('ACTIVE');
  };

  const handleStop = () => {
    setAppState('OFFLINE');
    setStage('SELECTION');
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">

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
              onClick={handleStart}
              className="bg-zinc-100 text-black px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
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

      {/* 4. ACTIVE SESSION */}
      {stage === 'ACTIVE' && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{selectedProfile.name}</h1>
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ENVIRONMENT RUNNING
              </div>
            </div>
            <button
              onClick={handleStop}
              className="text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2 border border-red-900/50 rounded-lg hover:bg-red-900/20 transition-colors"
            >
              TERMINATE SESSION
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Visuals & Metrics */}
            <div className="space-y-8">
              <VMVisualizer state={appState} />
              <ActiveSession
                profile={selectedProfile}
                onStop={handleStop}
              />
            </div>

            {/* Right Column: Analytics */}
            <div className="space-y-8">
              <CostAnalytics data={selectedProfile.costComparison.monthlyData} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
