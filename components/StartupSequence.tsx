import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogStep } from '../types';
import { StatusIcon } from './Icons';

interface StartupSequenceProps {
  logs: LogStep[];
  onComplete: () => void;
}

interface DisplayLog extends LogStep {
  status: 'pending' | 'running' | 'completed';
}

const StartupSequence: React.FC<StartupSequenceProps> = ({ logs, onComplete }) => {
  // Initialize with the first log running, others pending
  const [displayLogs, setDisplayLogs] = useState<DisplayLog[]>(() =>
    logs.map((log, index) => ({
      ...log,
      status: index === 0 ? 'running' : 'pending' // Start first one immediately
    }))
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(0); // Track how many we've done

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayLogs]);

  // Simulation Logic
  useEffect(() => {
    // Start the sequence logic
    let isMounted = true;
    let timeout: any;

    const runStep = async (index: number) => {
      if (!isMounted) return;

      if (index >= logs.length) {
        // All done
        timeout = setTimeout(() => {
          if (isMounted) onComplete();
        }, 800);
        return;
      }

      const currentStep = logs[index];
      // console.log(`[Startup] Step ${index} running: ${currentStep.message} duration=${currentStep.duration}`); // REMOVED

      // Update current to running
      setDisplayLogs(prev => prev.map((l, i) =>
        i === index ? { ...l, status: 'running' } : l
      ));

      // Wait for duration
      timeout = setTimeout(() => {
        if (!isMounted) return;

        // console.log(`[Startup] Step ${index} completed. Starting next.`); // REMOVED
        // Mark current as completed
        setDisplayLogs(prev => prev.map((l, i) =>
          i === index ? { ...l, status: 'completed' } : l
        ));

        // Start next if exists
        runStep(index + 1);
      }, currentStep.duration);
    };

    // We start the sequence on mount.
    // If strict mode unmounts/remounts, we just start over (or continue if we had state?)
    // Actually, simply effectively starting it on every mount (cleanup handles cancel) is cleaner than the ref check
    // because the ref check blocks the SECOND mount which is the one that stays.

    // console.log('[Startup] Starting sequence'); // REMOVED
    runStep(0);
    // processedRef.current = 1; // Mark as started // REMOVED

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []); // Run once on mount

  // Calculate progress
  const completedCount = displayLogs.filter(l => l.status === 'completed').length;
  const isComplete = completedCount === logs.length;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isComplete ? 'bg-emerald-400' : 'bg-blue-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isComplete ? 'bg-emerald-500' : 'bg-blue-500'}`}></span>
            </span>
            {isComplete ? 'Environment Ready' : 'Resurrection in Progress'}
          </h2>
        </div>

        {/* Timeline Log */}
        <div ref={scrollRef} className="p-6 h-80 overflow-y-auto font-mono text-sm space-y-6 scroll-smooth">
          <AnimatePresence>
            {displayLogs.map((log, index) => {
              // Only show logs that are running or completed (or if we want to show pending but faded?)
              // Let's show all but define styles
              const isCompleted = log.status === 'completed';
              const isRunning = log.status === 'running';
              const isPending = log.status === 'pending';

              if (isPending && index > 0 && displayLogs[index - 1].status !== 'completed') return null; // Only show pending if it is next? Or just show active ones.
              // Logic choice: Show all so user knows what's coming? OR mimic terminal.
              // Let's mimic terminal: show as they happen.
              if (isPending) return null;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative pl-8"
                >
                  {/* Timeline Line */}
                  {index !== logs.length - 1 && (
                    <div className="absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-zinc-800" />
                  )}

                  {/* Icon Node */}
                  <div className={`absolute left-0 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 
                    ${isCompleted ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' :
                      isRunning ? 'border-blue-500 bg-blue-500/10 text-blue-500 animate-pulse' :
                        'border-zinc-700 bg-zinc-900 text-zinc-600'}`}>
                    {isCompleted ? (
                      <StatusIcon name="CheckCircle" className="w-3 h-3" />
                    ) : (
                      <StatusIcon name="Activity" className="w-3 h-3" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    <span className={`font-medium ${isCompleted ? 'text-zinc-300' : 'text-blue-400'}`}>
                      {log.message}
                    </span>
                    {isRunning && (
                      <span className="text-xs text-zinc-500 mt-1 animate-pulse">Processing...</span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] text-zinc-600 mt-0.5">Done ({log.duration}ms)</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StartupSequence;
