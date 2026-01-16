import React from 'react';
import { Settings, RefreshCw, Layers } from 'lucide-react';

export interface AutoScaleConfig {
    targetCpu: number;
    minInstances: number;
    maxInstances: number;
    coolDown: number;
}

interface AutoScalerProps {
    config: AutoScaleConfig;
    currentCpu: number;
    instanceCount: number;
    onChange: (newConfig: AutoScaleConfig) => void;
}

export default function AutoScaler({ config, currentCpu, instanceCount, onChange }: AutoScalerProps) {

    const handleChange = (key: keyof AutoScaleConfig, value: number) => {
        onChange({ ...config, [key]: value });
    };

    // Calculate utilization pressure
    const pressure = Math.min(100, (currentCpu / config.targetCpu) * 50);

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 shadow-lg flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings className="text-blue-400" size={18} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Auto-Scaler Policy</h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-500">Status:</span>
                    <span className="text-emerald-400">Active</span>
                </div>
            </div>

            {/* Target CPU Slider */}
            <div>
                <div className="flex justify-between text-xs mb-2">
                    <span className="text-zinc-400">Target CPU Utilization</span>
                    <span className="text-white font-mono font-bold">{config.targetCpu}%</span>
                </div>
                <input
                    type="range"
                    min="30"
                    max="90"
                    step="5"
                    value={config.targetCpu}
                    onChange={(e) => handleChange('targetCpu', parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                />

                {/* Pressure Gauge */}
                <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                    <div
                        className={`h-full transition-all duration-500 ${currentCpu > config.targetCpu ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, currentCpu)}%` }}
                    />
                    {/* Target Marker */}
                    <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                        style={{ left: `${config.targetCpu}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-zinc-500 font-mono">
                    <span>Current Load: {currentCpu.toFixed(0)}%</span>
                    <span>Target</span>
                </div>
            </div>

            {/* Min/Max Instances */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Min Replicas</label>
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-zinc-500" />
                        <input
                            type="number"
                            min="1"
                            max={config.maxInstances}
                            value={config.minInstances}
                            onChange={(e) => handleChange('minInstances', parseInt(e.target.value))}
                            className="bg-transparent text-white font-mono text-sm w-full outline-none"
                        />
                    </div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Max Replicas</label>
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-zinc-500" />
                        <input
                            type="number"
                            min={config.minInstances}
                            max="20"
                            value={config.maxInstances}
                            onChange={(e) => handleChange('maxInstances', parseInt(e.target.value))}
                            className="bg-transparent text-white font-mono text-sm w-full outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Current State Indicator */}
            <div className="flex items-center justify-between text-xs bg-blue-500/10 border border-blue-500/20 p-2 rounded">
                <div className="flex items-center gap-2">
                    <RefreshCw size={12} className={`text-blue-400 ${currentCpu > config.targetCpu || currentCpu < (config.targetCpu - 20) ? 'animate-spin' : ''}`} />
                    <span className="text-blue-200">
                        {currentCpu > config.targetCpu
                            ? instanceCount >= config.maxInstances ? 'Max Capacity Reached' : 'Scaling Up...'
                            : currentCpu < (config.targetCpu - 20) && instanceCount > config.minInstances
                                ? 'Scaling Down...'
                                : 'Steady State'}
                    </span>
                </div>
                <span className="font-mono text-blue-400">{instanceCount} Replicas</span>
            </div>
        </div>
    );
}
