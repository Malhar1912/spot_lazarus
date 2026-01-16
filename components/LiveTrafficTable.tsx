import React, { useEffect, useState } from 'react';
import { MOCK_API_DATA } from '../constants';
import { ArrowUpRight, CheckCircle, AlertTriangle } from 'lucide-react';

interface TrafficRequest {
    id: number;
    timestamp: string;
    method: string;
    endpoint: string;
    status: number;
    latency: string;
}

export default function LiveTrafficTable() {
    const [requests, setRequests] = useState<TrafficRequest[]>([]);

    useEffect(() => {
        const initial = Array(5).fill(null).map((_, i) => createRandomRequest(i));
        setRequests(initial);

        const interval = setInterval(() => {
            setRequests(prev => {
                const newReq = createRandomRequest(Date.now());
                return [newReq, ...prev].slice(0, 15); // Reduced to 15 for less clutter
            });
        }, 1500); // Slightly slower for less distraction

        return () => clearInterval(interval);
    }, []);

    const createRandomRequest = (idOffset: number): TrafficRequest => {
        const template = MOCK_API_DATA[Math.floor(Math.random() * MOCK_API_DATA.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const baseLatency = parseInt(template.latency);
        const variance = Math.floor(Math.random() * 20) - 10;
        const finalLatency = Math.max(5, baseLatency + variance) + 'ms';

        return {
            id: idOffset,
            timestamp: timeStr,
            method: template.method,
            endpoint: template.endpoint,
            status: template.status,
            latency: finalLatency
        };
    };

    const getMethodStyle = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
            case 'POST': return 'bg-green-500/15 text-green-400 border-green-500/30';
            default: return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <ArrowUpRight size={18} className="text-blue-400" />
                    <h3 className="text-white font-semibold">Live Traffic</h3>
                </div>
                <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
            </div>

            {/* Table with zebra striping and larger rows */}
            <div
                className="flex-1 overflow-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 #18181b' }}
            >
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-800/50 text-zinc-400 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 font-medium">Time</th>
                            <th className="px-4 py-3 font-medium">Method</th>
                            <th className="px-4 py-3 font-medium">Endpoint</th>
                            <th className="px-4 py-3 font-medium text-right">Status</th>
                            <th className="px-4 py-3 font-medium text-right">Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, idx) => (
                            <tr
                                key={req.id}
                                className={`
                                    border-b border-zinc-800/50 transition-colors
                                    ${idx % 2 === 0 ? 'bg-zinc-900/50' : 'bg-zinc-800/20'}
                                    hover:bg-zinc-800/40
                                `}
                            >
                                <td className="px-4 py-3.5 text-zinc-500 font-mono text-xs">
                                    {req.timestamp}
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className={`
                                        inline-block px-2.5 py-1 rounded text-xs font-medium border
                                        ${getMethodStyle(req.method)}
                                    `}>
                                        {req.method}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-zinc-300 font-mono text-xs">
                                    {req.endpoint}
                                </td>
                                <td className="px-4 py-3.5 text-right">
                                    <span className={`
                                        inline-flex items-center gap-1.5
                                        ${req.status >= 400 ? 'text-red-400' : 'text-emerald-400'}
                                    `}>
                                        {req.status}
                                        {req.status >= 400
                                            ? <AlertTriangle size={14} />
                                            : <CheckCircle size={14} />
                                        }
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-zinc-500 text-right font-mono text-xs">
                                    {req.latency}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
