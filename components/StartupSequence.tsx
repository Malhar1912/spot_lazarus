import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogStep } from '../types';
import { StatusIcon } from './Icons';

interface StartupSequenceProps {
  logs: LogStep[];
  isComplete: boolean;
}

const StartupSequence: React.FC<StartupSequenceProps> = ({ logs, isComplete }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

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
          {!isComplete && (
            <span className="text-xs text-zinc-500 font-mono">~{(30 - logs.length * 4)}s remaining</span>
          )}
        </div>

        {/* Timeline Log */}
        <div ref={scrollRef} className="p-6 h-80 overflow-y-auto font-mono text-sm space-y-6 scroll-smooth">
          <AnimatePresence>
            {logs.map((log, index) => {
              const isLast = index === logs.length - 1;
              const isCompleted = log.status === 'completed';

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
                      log.status === 'running' ? 'border-blue-500 bg-blue-500/10 text-blue-500 animate-pulse' : 
                      'border-zinc-700 bg-zinc-900 text-zinc-600'}`}>
                    {isCompleted ? (
                      <StatusIcon name="CheckCircle" className="w-3 h-3" />
                    ) : (
                      <StatusIcon name={log.icon || 'Activity'} className="w-3 h-3" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    <span className={`font-medium ${isCompleted ? 'text-zinc-300' : 'text-blue-400'}`}>
                      {log.message}
                    </span>
                    {log.status === 'running' && (
                      <span className="text-xs text-zinc-500 mt-1 animate-pulse">Processing...</span>
                    )}
                    {log.status === 'completed' && (
                      <span className="text-[10px] text-zinc-600 mt-0.5">Done ({Math.floor(Math.random() * 800) + 200}ms)</span>
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