import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

interface MetricPoint {
    time: string;
    cpu: number;
    memory: number;
    network: number;
}

const generateDataPoint = (lastPoint?: MetricPoint): MetricPoint => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    if (!lastPoint) {
        return {
            time: timeStr,
            cpu: 45,
            memory: 60,
            network: 20
        };
    }

    // Add some random fluctuation but keep it somewhat realistic (clamped 0-100)
    const nextCpu = Math.min(100, Math.max(0, lastPoint.cpu + (Math.random() - 0.5) * 15));
    const nextMem = Math.min(100, Math.max(0, lastPoint.memory + (Math.random() - 0.5) * 5)); // Memory is more stable
    const nextNet = Math.min(100, Math.max(0, lastPoint.network + (Math.random() - 0.5) * 20));

    return {
        time: timeStr,
        cpu: nextCpu,
        memory: nextMem,
        network: nextNet
    };
};

export default function RealTimeAnalytics() {
    const [data, setData] = useState<MetricPoint[]>([]);
    const [currentMetrics, setCurrentMetrics] = useState<MetricPoint>({ time: '', cpu: 0, memory: 0, network: 0 });

    useEffect(() => {
        // Initial seed data
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
                if (newData.length > 30) newData.shift(); // Keep last 30 points
                return newData;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-green-400" size={20} />
                        Live Telemetry
                    </h3>
                    <p className="text-zinc-500 text-sm mt-1">Real-time resource utilization</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-mono bg-zinc-800 px-3 py-1 rounded text-green-400 border border-green-500/20">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        LIVE
                    </span>
                </div>
            </div>

            {/* Top Cards for Instant Values */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <MetricCard
                    label="CPU Load"
                    value={currentMetrics.cpu}
                    unit="%"
                    icon={Cpu}
                    color="text-blue-400"
                    bg="bg-blue-400/10"
                    border="border-blue-400/20"
                />
                <MetricCard
                    label="Memory"
                    value={currentMetrics.memory}
                    unit="%"
                    icon={HardDrive}
                    color="text-purple-400"
                    bg="bg-purple-400/10"
                    border="border-purple-400/20"
                />
                <MetricCard
                    label="Network I/O"
                    value={currentMetrics.network}
                    unit=" Mbps"
                    icon={Wifi}
                    color="text-amber-400"
                    bg="bg-amber-400/10"
                    border="border-amber-400/20"
                />
            </div>

            {/* Chart Area */}
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="gradientCpu" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientMem" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="#52525b"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(val) => val} // Can simplify if needed
                            interval={4}
                        />
                        <YAxis stroke="#52525b" tick={{ fontSize: 12 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                            itemStyle={{ fontSize: 13 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="cpu"
                            stroke="#60a5fa"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#gradientCpu)"
                            name="CPU Usage"
                            animationDuration={500}
                        />
                        <Area
                            type="monotone"
                            dataKey="memory"
                            stroke="#c084fc"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#gradientMem)"
                            name="Memory Usage"
                            animationDuration={500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function MetricCard({ label, value, unit, icon: Icon, color, bg, border }: any) {
    return (
        <div className={`p-4 rounded-lg border ${bg} ${border} flex flex-col justify-between`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">{label}</span>
                <Icon size={16} className={color} />
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${color}`}>{value.toFixed(1)}</span>
                <span className="text-zinc-500 text-sm">{unit}</span>
            </div>
        </div>
    );
}
