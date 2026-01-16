import React from 'react';
import { Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface ResilienceScoreProps {
    score?: number;
    uptimeBonus?: number;
    spotRisk?: number;
}

const ResilienceScore: React.FC<ResilienceScoreProps> = ({
    score = 92,
    uptimeBonus = 15,
    spotRisk = -5
}) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Resilience Score</h3>
            </div>

            {/* Score Ring */}
            <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            fill="none"
                            stroke="#27272a"
                            strokeWidth="8"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score}</span>
                        <span className="text-xs text-zinc-500">/ 100</span>
                    </div>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-zinc-500 uppercase mb-1">Uptime Bonus</div>
                    <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-lg font-bold text-emerald-400">+{uptimeBonus}</span>
                    </div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-zinc-500 uppercase mb-1">Spot Risk</div>
                    <div className="flex items-center justify-center gap-1">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        <span className="text-lg font-bold text-red-400">{spotRisk}</span>
                    </div>
                </div>
            </div>

            {/* Throughput & Cost */}
            <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="text-xs text-zinc-500 uppercase mb-1">Throughput</div>
                    <div className="text-2xl font-bold text-white">80<span className="text-sm text-zinc-500 ml-1">req/s</span></div>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                    <div className="text-xs text-zinc-500 uppercase mb-1">Hourly</div>
                    <div className="text-2xl font-bold text-emerald-400">$0.04</div>
                    <div className="text-xs text-zinc-500">91% savings</div>
                </div>
            </div>

            {/* Latency */}
            <div className="mt-3 bg-zinc-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500 uppercase">Latency</span>
                    <span className="text-xs text-zinc-400">Δ%</span>
                </div>
                <div className="text-2xl font-bold text-white mb-2">100<span className="text-sm text-zinc-500 ml-1">ms</span></div>
                <div className="flex gap-1">
                    {[40, 60, 80, 70, 50].map((h, i) => (
                        <div key={i} className="flex-1 bg-zinc-700 rounded-full h-8 relative overflow-hidden">
                            <div
                                className="absolute bottom-0 w-full bg-emerald-500 rounded-full transition-all"
                                style={{ height: `${h}%` }}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-zinc-600">
                    <span>IDLE</span>
                    <span>OFFLINE</span>
                    <span>ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

export default ResilienceScore;
