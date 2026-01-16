import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi } from 'lucide-react';

const LiveTelemetry: React.FC = () => {
    const [metrics, setMetrics] = useState({
        cpu: 35.3,
        memory: 63.4,
        network: 61.4
    });

    const [chartData, setChartData] = useState<number[]>([30, 35, 32, 40, 38, 35, 42, 45, 40, 38, 35, 33]);

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics({
                cpu: Math.round((30 + Math.random() * 20) * 10) / 10,
                memory: Math.round((55 + Math.random() * 15) * 10) / 10,
                network: Math.round((50 + Math.random() * 25) * 10) / 10
            });

            setChartData(prev => {
                const newData = [...prev.slice(1), 30 + Math.random() * 30];
                return newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const MetricGauge = ({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) => (
        <div className="text-center">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}<span className="text-sm text-zinc-500">%</span></div>
        </div>
    );

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Live Telemetry</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-emerald-400 font-medium">LIVE</span>
                </div>
            </div>

            <div className="text-xs text-zinc-500 mb-4">Real-time resource utilization</div>

            {/* Metric Gauges */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <MetricGauge label="CPU Load" value={metrics.cpu} icon={Cpu} color="text-cyan-400" />
                <MetricGauge label="Memory" value={metrics.memory} icon={HardDrive} color="text-purple-400" />
                <MetricGauge label="Network I/O" value={metrics.network} icon={Wifi} color="text-emerald-400" />
            </div>

            {/* Mini Chart */}
            <div className="h-16 flex items-end gap-0.5 bg-zinc-800/50 rounded-lg p-2">
                {chartData.map((value, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-sm transition-all duration-300"
                        style={{ height: `${value}%` }}
                    />
                ))}
            </div>

            {/* Time Labels */}
            <div className="flex justify-between mt-2 text-xs text-zinc-600">
                <span>17:30:00</span>
                <span>17:35:00</span>
                <span>17:40:00</span>
            </div>
        </div>
    );
};

export default LiveTelemetry;
