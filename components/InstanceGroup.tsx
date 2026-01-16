import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Plus, Trash2, AlertCircle } from 'lucide-react';

interface InstanceGroupProps {
    instanceCount: number;
    maxInstances: number;
    onAdd?: () => void;
    onRemove?: () => void;
}

export default function InstanceGroup({ instanceCount, maxInstances, onAdd, onRemove }: InstanceGroupProps) {
    // Create an array of IDs based on count
    const instances = Array.from({ length: instanceCount }, (_, i) => i);

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 shadow-lg flex flex-col h-[280px]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Server className="text-purple-400" size={18} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Managed Instance Group</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">
                        {instanceCount} / {maxInstances} Active
                    </span>
                    {instanceCount >= maxInstances && (
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                            <AlertCircle size={10} /> MAX
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 gap-2">
                    <AnimatePresence>
                        {instances.map((id) => (
                            <motion.button
                                key={id}
                                layout
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, backgroundColor: '#ef4444' }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onRemove}
                                className="aspect-square bg-zinc-800 rounded-md border border-zinc-700 flex flex-col items-center justify-center relative group overflow-hidden cursor-pointer hover:border-red-500/50 hover:bg-red-500/10 transition-colors"
                                title="Terminate Instance"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent group-hover:opacity-0" />

                                {/* Status Indicator */}
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-2 right-2 animate-pulse group-hover:bg-red-500" />

                                {/* Default Icon */}
                                <Server size={16} className="text-zinc-400 group-hover:hidden transition-colors z-10" />
                                <span className="text-[9px] font-mono text-zinc-500 mt-1 z-10 group-hover:hidden">vm-{id + 1}</span>

                                {/* Hover Icon */}
                                <Trash2 size={20} className="text-red-400 hidden group-hover:block z-10" />
                                <span className="text-[9px] font-bold text-red-400 mt-1 z-10 hidden group-hover:block">KILL</span>
                            </motion.button>
                        ))}
                    </AnimatePresence>

                    {/* Add Button Slot */}
                    {instanceCount < maxInstances && (
                        <motion.button
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.05, borderStyle: 'solid' }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAdd}
                            className="aspect-square rounded-md border border-zinc-800 border-dashed flex flex-col items-center justify-center bg-zinc-900/50 text-zinc-600 hover:text-white hover:border-zinc-600 hover:bg-zinc-800 transition-all cursor-pointer group"
                            title="Provision New Instance"
                        >
                            <Plus size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="text-[9px] font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">ADD VM</span>
                        </motion.button>
                    )}

                    {/* Remaining Empty Slots */}
                    {Array.from({ length: Math.max(0, maxInstances - instanceCount - 1) }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square rounded-md border border-zinc-800/30 border-dashed flex items-center justify-center bg-zinc-900/20">
                            <div className="w-1 h-1 rounded-full bg-zinc-800/50" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
