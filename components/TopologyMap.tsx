import { motion } from 'framer-motion';
import { EnvironmentState } from '../types';
import { Cloud, Globe, Server, Database, ShieldCheck, Zap, Info, X } from 'lucide-react';
import { useState } from 'react';

export default function TopologyMap({ state }: { state: EnvironmentState }) {
    const isRecovering = state === 'RECOVERING';
    const isActive = state === 'ACTIVE';
    const isRunning = isActive || isRecovering;

    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    // Node Details Data
    const nodeDetails: Record<string, any> = {
        'LB': {
            title: 'Load Balancer (L7)',
            stats: [
                { label: 'Active Conn', value: '14,203' },
                { label: 'Requests/sec', value: '2,400' },
                { label: 'Zone', value: 'us-east-1a' }
            ]
        },
        'INSTANCE': {
            title: 'Spot Instance',
            stats: [
                { label: 'Uptime', value: '4m 12s' },
                { label: 'CPU Util', value: '45%' },
                { label: 'Memory', value: '2.1GB' }
            ]
        },
        'DB': {
            title: 'Primary Database',
            stats: [
                { label: 'Connections', value: '42' },
                { label: 'IOPS', value: '1,200' },
                { label: 'Status', value: 'Healthy' }
            ]
        }
    };

    // Define packet animation variants
    const packetVariants = {
        active: {
            offsetDistance: ["0%", "100%"],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0.5
            }
        },
        recovering: {
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-[400px] relative overflow-hidden flex items-center justify-center">
            {/* Overlay for Node Details */}
            {selectedNode && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 right-4 z-50 bg-black/90 border border-zinc-700 p-4 rounded-lg w-64 backdrop-blur-md shadow-2xl"
                >
                    <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-white text-sm">{nodeDetails[selectedNode].title}</h4>
                        <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-white">
                            <X size={14} />
                        </button>
                    </div>
                    <div className="space-y-2">
                        {nodeDetails[selectedNode].stats.map((stat: any, i: number) => (
                            <div key={i} className="flex justify-between text-xs">
                                <span className="text-zinc-400">{stat.label}</span>
                                <span className="text-zinc-200 font-mono">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}


            <div className="absolute top-4 left-4 flex items-center gap-2">
                <h3 className="text-zinc-400 font-bold text-sm">LIVE TOPOLOGY</h3>
                {isRecovering && (
                    <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded animate-pulse font-mono">
                        NODES UNHEALTHY
                    </span>
                )}
                {isActive && (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded font-mono">
                        HEALTHY
                    </span>
                )}
                <span className="text-[10px] text-zinc-600 ml-2 italic">Click nodes for details</span>
            </div>

            {/* SVG Layer for Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                {/* 1. User to LB */}
                <path id="path1" d="M150,200 L300,200" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                {isRunning && !isRecovering && (
                    <motion.circle r="3" fill="#60a5fa">
                        <animateMotion href="#path1" dur="1.5s" repeatCount="indefinite" />
                    </motion.circle>
                )}

                {/* 2. LB to Instance */}
                <path id="path2" d="M300,200 L500,200" stroke="#333" strokeWidth="2" />
                {isRunning && !isRecovering && (
                    <motion.circle r="3" fill="#8b5cf6">
                        <animateMotion href="#path2" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                    </motion.circle>
                )}

                {/* 3. Instance to DB */}
                <path id="path3" d="M500,200 L650,200" stroke="#333" strokeWidth="2" />
                {isRunning && !isRecovering && (
                    <motion.circle r="3" fill="#10b981">
                        <animateMotion href="#path3" dur="1s" begin="1s" repeatCount="indefinite" />
                    </motion.circle>
                )}
            </svg>

            {/* Nodes Layer */}
            <div className="relative w-full max-w-4xl flex justify-between items-center z-10 px-12">

                {/* USER NODE */}
                <div className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-zinc-400 group-hover:border-zinc-500 transition-colors">
                        <Globe size={24} />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">INTERNET</span>
                </div>

                {/* LOAD BALANCER NODE */}
                <div
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => setSelectedNode('LB')}
                >
                    <div className={`w-16 h-16 rounded-lg bg-blue-900/20 border-2 ${selectedNode === 'LB' ? 'border-blue-400 ring-2 ring-blue-500/20' : 'border-blue-500/50'} flex items-center justify-center text-blue-400 hover:scale-105 transition-all`}>
                        <ShieldCheck size={28} />
                    </div>
                    <span className="text-xs text-blue-400 font-mono group-hover:underline">LB-REGION-1</span>
                </div>

                {/* SPOT INSTANCE NODE (THE TARGET) */}
                <div
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedNode('INSTANCE')}
                >
                    <motion.div
                        animate={{
                            scale: isRecovering ? [1, 0.9, 1.1, 0.9, 1] : 1,
                            borderColor: isRecovering ? '#ef4444' : '#8b5cf6',
                            backgroundColor: isRecovering ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                        }}
                        transition={{ duration: 0.5 }}
                        className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/20 ${selectedNode === 'INSTANCE' ? 'ring-2 ring-purple-500/40' : ''}`}
                    >
                        <Server size={32} className={isRecovering ? 'text-red-500' : 'text-purple-400'} />

                        {isRecovering && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1.5 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <Zap className="text-yellow-400 fill-yellow-400" size={40} />
                            </motion.div>
                        )}
                    </motion.div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap flex flex-col items-center">
                        <span className={`text-xs font-bold font-mono group-hover:underline ${isRecovering ? 'text-red-500' : 'text-purple-400'}`}>
                            {isRecovering ? 'PREEMPTED' : 'SPOT-INSTANCE'}
                        </span>
                        {isRecovering && <span className="text-[10px] text-zinc-500">Auto-recovery pending...</span>}
                    </div>
                </div>

                {/* DB NODE */}
                <div
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={() => setSelectedNode('DB')}
                >
                    <div className={`w-16 h-16 rounded-full bg-emerald-900/20 border-2 ${selectedNode === 'DB' ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-emerald-500/50'} flex items-center justify-center text-emerald-400 hover:scale-105 transition-all`}>
                        <Database size={24} />
                    </div>
                    <span className="text-xs text-emerald-400 font-mono group-hover:underline">PRIMARY-DB</span>
                </div>

            </div>

        </div>
    );
}
