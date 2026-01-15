import React, { useEffect, useState, useRef } from 'react';
import { MOCK_API_DATA } from '../constants';
import { ArrowUpRight, ArrowDownLeft, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

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
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial population
        const initial = Array(5).fill(null).map((_, i) => createRandomRequest(i));
        setRequests(initial);

        // Add new requests periodically
        const interval = setInterval(() => {
            setRequests(prev => {
                const newReq = createRandomRequest(Date.now());
                const updated = [newReq, ...prev].slice(0, 20); // Keep last 20
                return updated;
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const createRandomRequest = (idOffset: number): TrafficRequest => {
        const template = MOCK_API_DATA[Math.floor(Math.random() * MOCK_API_DATA.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        // Add random variance to latency
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

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h3 className="text-zinc-300 font-bold text-sm flex items-center gap-2">
                    <ArrowUpRight size={16} className="text-blue-400" />
                    LIVE TRAFFIC
                </h3>
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
            </div>

            <div className="flex-1 overflow-auto p-0 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                <table className="w-full text-left text-xs bg-zinc-900/30">
                    <thead className="bg-zinc-950/50 text-zinc-500 sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                            <th className="px-4 py-3 font-mono">TIME</th>
                            <th className="px-4 py-3 font-mono">METHOD</th>
                            <th className="px-4 py-3 font-mono">ENDPOINT</th>
                            <th className="px-4 py-3 font-mono text-right">STATUS</th>
                            <th className="px-4 py-3 font-mono text-right">LATENCY</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {requests.map((req, idx) => (
                            <tr key={req.id} className="hover:bg-zinc-800/30 transition-colors animate-in fade-in slide-in-from-top-1 duration-300">
                                <td className="px-4 py-2.5 text-zinc-500 font-mono">{req.timestamp}</td>
                                <td className="px-4 py-2.5 font-bold">
                                    <span className={`
                                        px-2 py-0.5 rounded text-[10px] 
                                        ${req.method === 'GET' ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' :
                                            req.method === 'POST' ? 'bg-green-900/30 text-green-400 border border-green-900/50' :
                                                'bg-purple-900/30 text-purple-400 border border-purple-900/50'}
                                    `}>
                                        {req.method}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-zinc-300 font-mono tracking-tight">{req.endpoint}</td>
                                <td className="px-4 py-2.5 text-right">
                                    <span className={`flex items-center justify-end gap-1.5 ${req.status >= 400 ? 'text-red-400' : 'text-emerald-400'}`}>
                                        {req.status}
                                        {req.status >= 400 ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 text-zinc-500 text-right font-mono">{req.latency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
