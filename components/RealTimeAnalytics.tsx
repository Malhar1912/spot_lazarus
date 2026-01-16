import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Cpu, HardDrive } from 'lucide-react';

interface MetricPoint {
    time: string;
    cpu: number;
    memory: number;
}

const generateDataPoint = (lastPoint?: MetricPoint): MetricPoint => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (!lastPoint) {
        return { time: timeStr, cpu: 45, memory: 60 };
    }

    const nextCpu = Math.min(100, Math.max(0, lastPoint.cpu + (Math.random() - 0.5) * 15));
    const nextMem = Math.min(100, Math.max(0, lastPoint.memory + (Math.random() - 0.5) * 5));

    return { time: timeStr, cpu: nextCpu, memory: nextMem };
};

export default function RealTimeAnalytics() {
    const [data, setData] = useState<MetricPoint[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<MetricPoint>({ time: '', cpu: 0, memory: 0 });

    useEffect(() => {
        const initialData = Array(20).fill(null).map((_, i) => ({
            ...generateDataPoint(),
            time: new Date(Date.now() - (20 - i) * 1000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));
        setData(initialData);
        setCurrentMetrics(initialData[initialData.length - 1]);

        const interval = setInterval(() => {
            setData(prev => {
                const newPoint = generateDataPoint(prev[prev.length - 1]);
                setCurrentMetrics(newPoint);
                const newData = [...prev, newPoint];
                if (newData.length > 30) newData.shift();
                return newData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 shadow-lg">
            {/* Header - Simplified */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Activity className="text-green-400" size={20} />
                    <h3 className="text-lg font-semibold text-white">Live Telemetry</h3>
                </div>
                <span className="flex items-center gap-2 text-xs font-mono bg-green-500/10 text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    LIVE
                </span>
            </div>

            {/* Metric Cards - Larger, more readable (2 cards instead of 3) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricCard
                    label="CPU Usage"
                    value={currentMetrics.cpu}
                    unit="%"
                    icon={Cpu}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    border="border-blue-500/20"
                />
                <MetricCard
                    label="Memory Usage"
                    value={currentMetrics.memory}
                    unit="%"
                    icon={HardDrive}
                    color="text-purple-400"
                    bg="bg-purple-500/10"
                    border="border-purple-500/20"
                />
            </div>

            {/* Chart - Cleaner with better readability */}
            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="gradientCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientMem" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#52525b"
                            tick={{ fontSize: 11 }}
                            interval={5}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#52525b"
                            tick={{ fontSize: 11 }}
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#18181b',
                                borderColor: '#3f3f46',
                                borderRadius: '8px',
                                fontSize: '13px'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cpu"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#gradientCpu)"
                            name="CPU"
                            animationDuration={300}
                        />
                        <Area
                            type="monotone"
                            dataKey="memory"
                            stroke="#c084fc"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#gradientMem)"
                            name="Memory"
                            animationDuration={300}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function MetricCard({ label, value, unit, icon: Icon, color, bg, border }: any) {
    return (
        <div className={`p-4 rounded-xl border ${bg} ${border} flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon size={24} className={color} />
            </div>
            <div>
                <span className="text-zinc-400 text-sm block mb-1">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${color}`}>{value.toFixed(1)}</span>
                    <span className="text-zinc-500 text-sm">{unit}</span>
                </div>
            </div>
        </div>
    );
}
