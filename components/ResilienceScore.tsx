import React from 'react';
import { Shield, Zap, TrendingUp } from 'lucide-react';

interface ResilienceScoreProps {
    score: number; // 0 to 100
}

export default function ResilienceScore({ score }: ResilienceScoreProps) {
    // Determine color based on score
    const getColor = (s: number) => {
        if (s >= 80) return 'text-emerald-500';
        if (s >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const colorClass = getColor(score);
    const strokeDash = 251.2; // 2 * PI * 40
    const offset = strokeDash - (score / 100) * strokeDash;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 relative overflow-hidden flex flex-col items-center justify-center h-full">
            <div className="absolute top-3 left-4 flex items-center gap-2">
                <Shield size={16} className={colorClass} />
                <span className="text-zinc-400 font-bold text-xs tracking-wider">RESILIENCE SCORE</span>
            </div>

            <div className="relative w-32 h-32 flex items-center justify-center mt-4">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-zinc-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={strokeDash}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${colorClass} transition-all duration-1000 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">Points</span>
                </div>
            </div>

            <div className="mt-4 w-full grid grid-cols-2 gap-2">
                <div className="bg-zinc-950/50 rounded p-2 text-center border border-zinc-800">
                    <span className="block text-[10px] text-zinc-500 uppercase">Uptime Bonus</span>
                    <span className="text-emerald-400 font-mono text-xs">+15</span>
                </div>
                <div className="bg-zinc-950/50 rounded p-2 text-center border border-zinc-800">
                    <span className="block text-[10px] text-zinc-500 uppercase">Spot Risk</span>
                    <span className="text-yellow-400 font-mono text-xs">-5</span>
                </div>
            </div>
        </div>
    );
}
