import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { MOCK_API_DATA } from '../constants';
import { Power, Clock, CreditCard, Activity, Search, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActiveSessionProps {
  onStop: () => void;
  environmentName: string;
}

const ActiveSession: React.FC<ActiveSessionProps> = ({ onStop, environmentName }) => {
  const [idleTime, setIdleTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdleTime(prev => prev + 1);
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const idleMins = 30 - idleTime;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Persistent Banner */}
      <div className="bg-emerald-950/30 border-b border-emerald-900/50 text-emerald-100 px-4 py-2 flex justify-between items-center sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-semibold uppercase tracking-wider">Environment Running</span>
          <span className="hidden md:inline text-zinc-500 text-xs">|</span>
          <span className="hidden md:flex items-center gap-1 text-xs text-zinc-400">
             <Clock className="w-3 h-3" /> Auto-sleep in {idleMins} mins
          </span>
        </div>
        
        <button 
          onClick={onStop}
          className="group flex items-center gap-2 text-xs font-medium text-red-400 hover:text-red-300 transition-colors bg-red-950/30 px-3 py-1.5 rounded-full border border-red-900/50 hover:border-red-800"
          title="Stopping will preserve all data and reduce costs."
        >
          <Power className="w-3 h-3 group-hover:scale-110 transition-transform" />
          Stop Environment Now
        </button>
      </div>

      {/* Main App Simulation (Payload) */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{environmentName}</h1>
            <p className="text-zinc-500">Gateway: <span className="font-mono text-zinc-400">https://dev-payments.spot-lazarus.internal</span></p>
          </div>
          <div className="flex gap-4">
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"><Search className="w-5 h-5" /></button>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"><Bell className="w-5 h-5" /></button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium">Throughput</h3>
                <Activity className="text-blue-500 w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-white">1,240 <span className="text-sm font-normal text-zinc-500">req/min</span></p>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium">Avg Latency</h3>
                <Clock className="text-emerald-500 w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-white">42ms</p>
           </div>
           <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-zinc-400 font-medium">Cost Rate (Spot)</h3>
                <CreditCard className="text-yellow-500 w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-white">$0.14<span className="text-sm font-normal text-zinc-500">/hr</span></p>
              <p className="text-xs text-emerald-400 mt-2">Savings Active (71%)</p>
           </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h3 className="font-semibold text-white">Recent Transactions</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">View Logs</button>
          </div>
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950/50 text-zinc-500 uppercase font-medium text-xs">
              <tr>
                <th className="px-6 py-4">Endpoint</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {MOCK_API_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-zinc-300">{row.endpoint}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-zinc-800 rounded text-xs font-bold">{row.method}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.status >= 400 ? 'bg-red-900/30 text-red-400' : 'bg-emerald-900/30 text-emerald-400'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{row.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ActiveSession;