import { useEffect, useState, useRef } from 'react';
import { LogStep } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Layers, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
    logs: LogStep[];
    onComplete: () => void;
}

interface BuildLayer {
    id: string;
    command: string;
    details: string;
    status: 'pending' | 'building' | 'complete';
}

export default function DockerBuildSim({ logs, onComplete }: Props) {
    const [visibleLogs, setVisibleLogs] = useState<LogStep[]>([]);
    const [layers, setLayers] = useState<BuildLayer[]>([]);
    const [currentStep, setCurrentStep] = useState<string>('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [visibleLogs]);

    useEffect(() => {
        let delay = 0;

        // Reset state
        setLayers([]);
        setVisibleLogs([]);

        logs.forEach((log, index) => {
            // Analyze log to extract layer info
            const stepMatch = log.message.match(/Step (\d+)\/\d+ : ([A-Z]+) (.+)/);

            delay += log.duration;

            setTimeout(() => {
                setVisibleLogs(prev => [...prev, log]);

                if (stepMatch) {
                    const [_, stepNum, cmd, args] = stepMatch;
                    setCurrentStep(`${cmd} ${args}`);

                    setLayers(prev => [
                        {
                            id: `layer-${stepNum}`,
                            command: cmd,
                            details: args,
                            status: 'building'
                        },
                        ...prev.map(l => ({ ...l, status: 'complete' as const }))
                    ]);
                } else if (log.message.includes('Successfully built')) {
                    setLayers(prev => prev.map(l => ({ ...l, status: 'complete' as const })));
                    setCurrentStep("BUILD COMPLETE");
                }

                if (index === logs.length - 1) setTimeout(onComplete, 1500);
            }, delay);
        });
    }, [logs, onComplete]);

    return (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* LEFT: Terminal View */}
            <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col h-[500px]">
                {/* Terminal Header */}
                <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                        <Terminal size={14} />
                        <span>build-log — -zsh</span>
                    </div>
                </div>

                {/* Terminal Body */}
                <div ref={scrollRef} className="flex-1 p-6 font-mono text-sm overflow-y-auto space-y-2 bg-black/50">
                    {visibleLogs.map((log) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={log.id}
                            className="flex gap-3"
                        >
                            <span className="text-zinc-600 select-none">
                                {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className={
                                log.message.startsWith('Step') ? 'text-blue-400 font-bold' :
                                    log.message.includes('Successfully') ? 'text-green-400 font-bold' :
                                        'text-gray-300'
                            }>
                                {log.message.startsWith('Step') ? '➜ ' : '  '}
                                {log.message}
                            </span>
                        </motion.div>
                    ))}
                    <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2.5 h-5 bg-zinc-500 inline-block align-middle ml-2"
                    />
                </div>
            </div>

            {/* RIGHT: Visual Layer Visualization */}
            <div className="flex flex-col h-[500px]">
                <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 h-full flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 z-10">
                        <Layers className="text-blue-400" />
                        Image Layers
                    </h3>

                    <div className="flex-1 flex flex-col-reverse gap-3 overflow-y-auto pr-2 z-10 custom-scrollbar">
                        <AnimatePresence>
                            {layers.map((layer, idx) => (
                                <motion.div
                                    key={layer.id}
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className={`
                                        p-4 rounded-lg border backdrop-blur-sm flex items-center justify-between group
                                        ${layer.status === 'building'
                                            ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                                            : 'bg-zinc-800/40 border-zinc-700/50 text-zinc-400'}
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                            ${layer.status === 'building' ? 'bg-blue-500 text-white' : 'bg-zinc-700 text-zinc-300'}
                                        `}>
                                            <Box size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${layer.status === 'building' ? 'bg-blue-500/20 text-blue-300' : 'bg-zinc-700 text-zinc-400'
                                                    }`}>
                                                    {layer.command}
                                                </span>
                                            </div>
                                            <p className="text-sm font-mono truncate max-w-[200px]" title={layer.details}>
                                                {layer.details}
                                            </p>
                                        </div>
                                    </div>

                                    {layer.status === 'complete' && (
                                        <CheckCircle2 size={18} className="text-green-500" />
                                    )}
                                    {layer.status === 'building' && (
                                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {layers.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4">
                                <Box size={48} className="opacity-20" />
                                <p>Waiting for build context...</p>
                            </div>
                        )}
                    </div>

                    {/* Current Action Status Bar */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-zinc-400 text-sm">Current Process</span>
                            <span className="text-xs text-blue-400 font-mono flex items-center gap-1">
                                {currentStep ? <span className="animate-pulse">PROCESSING</span> : 'IDLE'}
                                {currentStep && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />}
                            </span>
                        </div>
                        <p className="text-sm font-mono text-zinc-200 mt-2 truncate">
                            {currentStep || "Initialising daemon..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
