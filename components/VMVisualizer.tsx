import { EnvironmentState } from '../types';
import { motion } from 'framer-motion';

export default function VMVisualizer({ state }: { state: EnvironmentState }) {
    const isRunning = state === 'ACTIVE';

    return (
        <div className="relative w-64 h-32 bg-zinc-800 rounded-md border-t-2 border-zinc-700 shadow-lg flex items-center justify-around p-4">
            {/* Status LEDs */}
            <div className="flex gap-2">
                <motion.div
                    animate={{ opacity: isRunning ? [1, 0.5, 1] : 0.2 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 shadow-[0_0_10px_lime]' : 'bg-red-900'}`}
                />
                <div className="w-3 h-3 rounded-full bg-yellow-600 opacity-20" />
            </div>

            {/* Fan Animation */}
            <div className="flex gap-4">
                {[1, 2].map(i => (
                    <motion.div
                        key={i}
                        animate={{ rotate: isRunning ? 360 : 0 }}
                        transition={{ duration: isRunning ? 0.5 : 0, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-zinc-600 rounded-full border-t-zinc-400 border-dashed"
                    />
                ))}
            </div>
            <div className="absolute bottom-2 text-[10px] text-zinc-500 font-mono">
                RACK_UNIT_04 // {state}
            </div>
        </div>
    );
}
