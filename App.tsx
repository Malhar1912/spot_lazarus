import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Power, HardDrive, Layout, RefreshCw } from 'lucide-react';

import { AppState, LogStep } from './types';
import { STARTUP_SEQUENCE } from './constants';
import TransparencyPanel from './components/TransparencyPanel';
import StartupSequence from './components/StartupSequence';
import ActiveSession from './components/ActiveSession';
import StopModal from './components/StopModal';

export default function App() {
  const [state, setState] = useState<AppState>(AppState.OFFLINE);
  const [logs, setLogs] = useState<LogStep[]>([]);
  const [showStopModal, setShowStopModal] = useState(false);
  const [redirectCount, setRedirectCount] = useState(3);

  // --- Actions ---

  const handleStart = () => {
    setState(AppState.STARTING);
    setLogs([]);
    runStartupSimulation();
  };

  const handleStopRequest = () => {
    setShowStopModal(true);
  };

  const handleConfirmStop = () => {
    setShowStopModal(false);
    setState(AppState.SLEEPING);
    setTimeout(() => {
        setState(AppState.OFFLINE);
    }, 2000);
  };

  const runStartupSimulation = useCallback(async () => {
    // Helper to delay
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < STARTUP_SEQUENCE.length; i++) {
      const step = STARTUP_SEQUENCE[i];
      
      // Add log as 'running'
      setLogs(prev => [...prev, { ...step, status: 'running' } as LogStep]);
      
      // Simulate variable work time
      await wait(Math.random() * 800 + 800);

      // Mark as completed
      setLogs(prev => prev.map(l => l.id === step.id ? { ...l, status: 'completed' } : l));
      
      // Small pause between steps
      await wait(200);
    }

    // All done
    setState(AppState.READY);
  }, []);

  // --- Effects ---

  // Handle Ready -> Active transition
  useEffect(() => {
    let interval: any;
    if (state === AppState.READY) {
      setRedirectCount(3);
      interval = setInterval(() => {
        setRedirectCount(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setState(AppState.ACTIVE);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  // --- Render Helpers ---

  // Render the Hero Card (Offline / Ready / Sleeping)
  const renderHero = () => {
    const isSleeping = state === AppState.SLEEPING;
    const isOffline = state === AppState.OFFLINE;
    const isReady = state === AppState.READY;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <TransparencyPanel />

        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {state === AppState.STARTING ? (
            <StartupSequence logs={logs} isComplete={false} />
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden group">
              {/* Top Status Badge */}
              <div className="flex justify-center mb-6 min-h-[32px] items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={state}
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
                      ${isReady ? 'bg-emerald-950/50 border-emerald-900 text-emerald-400' : 
                        isSleeping ? 'bg-indigo-950/50 border-indigo-900 text-indigo-400' :
                        'bg-red-950/30 border-red-900/50 text-red-400'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : isSleeping ? 'bg-indigo-500' : 'bg-red-500'}`} />
                    {isReady ? 'Environment Ready' : isSleeping ? 'Environment Sleeping' : 'Environment Offline'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Content */}
              <h1 className="text-2xl font-bold text-white mb-2">Dev Environment – Payments API</h1>
              
              {isReady ? (
                 <div className="py-6">
                   <p className="text-xl text-zinc-300 mb-2">You are ready to code.</p>
                   <p className="text-sm text-zinc-500">Redirecting in {redirectCount}...</p>
                 </div>
              ) : isSleeping ? (
                <div className="py-6">
                  <p className="text-zinc-400 mb-2">Compute stopped. Storage preserved.</p>
                  <p className="text-xs text-zinc-600">Cost reduced to $0.04/hr</p>
                </div>
              ) : (
                <p className="text-zinc-400 mb-8">This environment is currently idle to save costs.</p>
              )}

              {/* Action Button */}
              {!isReady && !isSleeping && (
                <button
                  onClick={handleStart}
                  className="w-full group relative flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 py-3.5 rounded-lg font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <Play className="w-4 h-4 fill-black" />
                  Start Environment
                </button>
              )}

              {/* Wake Button (Sleeping State) */}
              {isSleeping && (
                 <div className="flex justify-center py-4">
                   <RefreshCw className="w-8 h-8 text-zinc-700 animate-spin" />
                 </div>
              )}

              {/* Start Info */}
              {!isReady && !isSleeping && (
                <p className="text-xs text-zinc-600 mt-4 flex items-center justify-center gap-1.5">
                  <HardDrive className="w-3 h-3" /> No data will be lost. Startup takes ~30s.
                </p>
              )}

              {/* Ready Buttons */}
              {isReady && (
                 <div className="flex gap-3 mt-4">
                   <button 
                    onClick={() => setState(AppState.ACTIVE)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg font-medium transition"
                   >
                     Enter Now
                   </button>
                 </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <>
      {state === AppState.ACTIVE ? (
        <ActiveSession 
          onStop={handleStopRequest} 
          environmentName="Dev Environment – Payments API"
        />
      ) : (
        renderHero()
      )}

      <StopModal 
        isOpen={showStopModal} 
        onConfirm={handleConfirmStop} 
        onCancel={() => setShowStopModal(false)} 
      />
    </>
  );
}