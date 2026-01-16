import { AlertTriangle, Cpu, Database, WifiOff, Zap } from 'lucide-react';
import React from 'react';

export interface ChaosState {
    cpuSpike: boolean;
    networkLoss: boolean;
    dbOutage: boolean;
}

interface ChaosControlProps {
    chaosState: ChaosState;
    onToggle: (key: keyof ChaosState) => void;
}

export default function ChaosControl({ chaosState, onToggle }: ChaosControlProps) {
    return (
        <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 text-red-500">
                <AlertTriangle size={20} />
                <h3 className="font-bold tracking-wider text-sm uppercase">Chaos Engineering</h3>
            </div>

            {/* Grid of Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* CPU SPIKE */}
                <button
                    onClick={() => onToggle('cpuSpike')}
                    className={`
                        relative group p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[80px]
                        ${chaosState.cpuSpike
                            ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10'}
                    `}
                >
                    <Cpu size={20} className={chaosState.cpuSpike ? 'text-red-400' : 'text-zinc-500 group-hover:text-red-400'} />
                    <span className={`text-xs font-bold text-center ${chaosState.cpuSpike ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                        CPU Spike
                    </span>
                    {chaosState.cpuSpike && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                </button>

                {/* NETWORK SEVER */}
                <button
                    onClick={() => onToggle('networkLoss')}
                    className={`
                        relative group p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[80px]
                        ${chaosState.networkLoss
                            ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-amber-500/50 hover:bg-amber-500/10'}
                    `}
                >
                    <WifiOff size={20} className={chaosState.networkLoss ? 'text-amber-400' : 'text-zinc-500 group-hover:text-amber-400'} />
                    <span className={`text-xs font-bold text-center ${chaosState.networkLoss ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                        Sever Network
                    </span>
                    {chaosState.networkLoss && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    )}
                </button>

                {/* DB OUTAGE */}
                <button
                    onClick={() => onToggle('dbOutage')}
                    className={`
                        relative group p-3 rounded-lg border flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[80px]
                        ${chaosState.dbOutage
                            ? 'bg-orange-600/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-orange-500/50 hover:bg-orange-500/10'}
                    `}
                >
                    <Database size={20} className={chaosState.dbOutage ? 'text-orange-400' : 'text-zinc-500 group-hover:text-orange-400'} />
                    <span className={`text-xs font-bold text-center ${chaosState.dbOutage ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                        DB Outage
                    </span>
                    {chaosState.dbOutage && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    )}
                </button>
            </div>

            {/* Background "Warning" Strips (only visible when active) */}
            {(chaosState.cpuSpike || chaosState.networkLoss || chaosState.dbOutage) && (
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] animate-slide" />
            )}
        </div>
    );
}
