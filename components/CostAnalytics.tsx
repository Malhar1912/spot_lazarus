import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CostMetric } from '../types';

export default function CostAnalytics({ data }: { data: CostMetric[] }) {
    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="text-xl font-bold text-zinc-100 mb-4">Cost Impact Analysis</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="month" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                            itemStyle={{ color: '#e4e4e7' }}
                        />
                        <Legend />
                        <Bar dataKey="onDemandCost" name="Standard (On-Demand)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="spotLazarusCost" name="Spot Lazarus" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-sm text-zinc-400 mt-4 text-center">
                *Based on n1-standard-4 pricing vs. Preemptible instances
            </p>
        </div>
    );
}
