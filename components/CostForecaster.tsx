import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line } from 'recharts';
import { DollarSign, TrendingDown, Calendar } from 'lucide-react';

interface ForecastData {
    day: string;
    onDemand: number;
    spot: number;
    savings: number;
}

export default function CostForecaster() {
    const [duration, setDuration] = useState(7); // Default 7 days
    const [data, setData] = useState<ForecastData[]>([]);
    const [totalSavings, setTotalSavings] = useState(0);

    const ON_DEMAND_RATE = 0.084; // $0.084/hr
    const SPOT_RATE = 0.024;      // $0.024/hr

    useEffect(() => {
        // Generate forecast data based on duration
        const newData: ForecastData[] = [];
        let accumulatedSavings = 0;

        for (let i = 0; i <= duration; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const dayLabel = duration > 14
                ? `${date.getMonth() + 1}/${date.getDate()}` // M/D if long duration
                : date.toLocaleDateString('en-US', { weekday: 'short' });

            const hours = i * 24;
            const onDemandCost = hours * ON_DEMAND_RATE;
            const spotCost = hours * SPOT_RATE;
            const dailySavings = onDemandCost - spotCost;

            newData.push({
                day: i === 0 ? 'Now' : dayLabel,
                onDemand: Number(onDemandCost.toFixed(2)),
                spot: Number(spotCost.toFixed(2)),
                savings: Number(dailySavings.toFixed(2))
            });

            if (i === duration) accumulatedSavings = dailySavings;
        }

        setData(newData);
        setTotalSavings(accumulatedSavings);
    }, [duration]);

    return (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 shadow-lg h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <TrendingDown className="text-emerald-400" size={20} />
                    <h3 className="text-lg font-semibold text-white">Cost Forecast</h3>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                    <span className="text-xs text-zinc-400 uppercase tracking-wider mr-2">Est. Savings</span>
                    <span className="text-lg font-bold text-emerald-400">${totalSavings.toFixed(2)}</span>
                </div>
            </div>

            {/* Slider Control */}
            <div className="mb-6 px-2">
                <div className="flex justify-between text-xs text-zinc-500 mb-2 font-mono uppercase">
                    <span>24 Hours</span>
                    <span className="text-zinc-300">Projection Window: {duration} Days</span>
                    <span>30 Days</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="30"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-colors"
                />
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradientSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#52525b"
                            tick={{ fontSize: 11 }}
                            interval={duration > 14 ? 3 : 0}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#52525b"
                            tick={{ fontSize: 11 }}
                            tickFormatter={(val) => `$${val}`}
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
                            formatter={(value: number) => [`$${value}`, '']}
                        />
                        <Area
                            type="monotone"
                            dataKey="onDemand"
                            stackId="1"
                            stroke="#52525b" // Grey for baseline
                            strokeDasharray="4 4"
                            fill="transparent"
                            name="On-Demand Cost"
                        />
                        <Area
                            type="monotone"
                            dataKey="spot"
                            stackId="2"
                            stroke="#3b82f6" // Blue for spot
                            fill="transparent"
                            name="Spot Cost"
                            strokeWidth={2}
                        />
                        {/* The fill area represents savings implicitly by the gap, but drawing explicit difference is hard in simple AreaChart. 
                            Instead, we'll plot "savings" as an area to visualize the 'profit'. */}
                        <Area
                            type="monotone"
                            dataKey="savings"
                            stroke="#10b981"
                            fill="url(#gradientSavings)"
                            name="Projected Savings"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-800/50 pt-3">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Spot
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    On-Demand
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Savings
                </div>
            </div>
        </div>
    );
}
