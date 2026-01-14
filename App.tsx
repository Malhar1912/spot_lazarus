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
