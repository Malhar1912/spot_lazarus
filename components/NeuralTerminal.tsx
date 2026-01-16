import React, { useEffect, useRef, useState } from 'react';
import { Terminal, AlertTriangle, ShieldCheck, DollarSign, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LogEntry {
    id: number;
    timestamp: string;
    level: 'INFO' | 'WARN' | 'CRIT' | 'SYS';
    text: string;
}

const LOG_TEMPLATES = [
    { level: 'INFO', text: 'Packet routing table updated [Route-52]' },
    { level: 'SYS', text: 'Garbage collection cycle completed (12ms)' },
    { level: 'INFO', text: 'New node discovery: worker-us-east-1d-442' },
    { level: 'WARN', text: 'High latency detected on port 8080 (150ms)' },
    { level: 'CRIT', text: 'Connection timeout: db-primary-replica' },
    { level: 'SYS', text: 'Neural net weights optimized (Loss: 0.0042)' },
    { level: 'INFO', text: 'Auto-scaling trigger: +1 instance requested' },
    { level: 'WARN', text: 'Memory pressure warning (Zone B)' },
    { level: 'SYS', text: 'Quantum entropy pool entropy replenished' },
    { level: 'INFO', text: 'Spot Instance price update: $0.0034/hr' }
];

export default function NeuralTerminal() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Log generation loop
    useEffect(() => {
        // Initial seed
        setLogs(Array(8).fill(null).map((_, i) => createLog(i)));

        const interval = setInterval(() => {
            setLogs(prev => {
                const newLog = createLog(Date.now());
                const newLogs = [...prev, newLog];
                if (newLogs.length > 50) newLogs.shift();
                return newLogs;
            });
        }, 1200); // Faster feed for "matrix" feel

        return () => clearInterval(interval);
    }, []);

    const createLog = (id: number): LogEntry => {
        const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        return {
            id,
            timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
            level: template.level as any,
            text: template.text
        };
    };

    return (
        <div className="relative h-full bg-black border border-green-900/50 rounded-xl overflow-hidden font-mono text-xs shadow-[0_0_20px_rgba(0,255,0,0.05)] flex flex-col">
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-scanlines opacity-20" />

            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-green-900/30 bg-green-950/10 z-10">
                <div className="flex items-center gap-2 text-green-500">
                    <Terminal size={14} />
                    <span className="font-bold tracking-widest opacity-80">NEURAL_FEED_V4</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-700">ONLINE</span>
                </div>
            </div>

            {/* Log Stream */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide z-10"
            >
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-3 group hover:bg-green-900/10 p-0.5 rounded"
                        >
                            <span className="text-green-800 shrink-0 select-none">[{log.timestamp}]</span>

                            <span className={`
                                shrink-0 w-10 font-bold select-none
                                ${log.level === 'INFO' ? 'text-green-400' :
                                    log.level === 'WARN' ? 'text-amber-400' :
                                        log.level === 'CRIT' ? 'text-red-500 animate-pulse' :
                                            'text-cyan-400'}
                            `}>
                                {log.level}
                            </span>

                            <span className={`
                                flex-1 truncate
                                ${log.level === 'CRIT' ? 'text-red-400' : 'text-green-100/80'}
                            `}>
                                {log.text}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing Cursor */}
                <div className="flex items-center gap-2 mt-2 px-1">
                    <span className="text-green-500 animate-pulse">_</span>
                </div>
            </div>
        </div>
    );
}
