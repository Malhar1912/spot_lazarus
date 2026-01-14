import { useEffect, useState } from 'react';
import { LogStep } from '../types';
import { motion } from 'framer-motion';

interface Props {
    logs: LogStep[];
    onComplete: () => void;
}

export default function DockerBuildSim({ logs, onComplete }: Props) {
    const [visibleLogs, setVisibleLogs] = useState<LogStep[]>([]);

    useEffect(() => {
        let delay = 0;
        logs.forEach((log, index) => {
            delay += log.duration;
            setTimeout(() => {
                setVisibleLogs(prev => [...prev, log]);
                if (index === logs.length - 1) setTimeout(onComplete, 800);
            }, delay);
        });
    }, [logs, onComplete]);

    return (
        <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm text-green-400 shadow-2xl border border-gray-700 w-full max-w-3xl mx-auto">
            <div className="border-b border-gray-700 pb-2 mb-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-gray-500 text-xs">build-log — -zsh</span>
            </div>
            <div className="space-y-2 h-64 overflow-y-auto">
                {visibleLogs.map(log => (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={log.id}>
                        <span className="text-blue-400">➜</span> {log.message}
                    </motion.div>
                ))}
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-green-400 inline-block align-middle"
                />
            </div>
        </div>
    );
}
