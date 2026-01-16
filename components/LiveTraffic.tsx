import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

interface TrafficEntry {
    id: number;
    time: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    status: number;
    latency: string;
}

const INITIAL_TRAFFIC: TrafficEntry[] = [
    { id: 1, time: '17:34:07', method: 'GET', endpoint: '/v1/customers/kyc', status: 200, latency: '121ms' },
    { id: 2, time: '17:34:50', method: 'POST', endpoint: '/v1/payments/capture', status: 202, latency: '45ms' },
    { id: 3, time: '17:36:34', method: 'POST', endpoint: '/v1/webhooks/stripe', status: 400, latency: '5ms' },
    { id: 4, time: '17:38:34', method: 'POST', endpoint: '/v1/webhooks/stripe', status: 400, latency: '5ms' },
    { id: 5, time: '17:38:53', method: 'POST', endpoint: '/v1/payments/capture', status: 202, latency: '44ms' },
    { id: 6, time: '17:38:33', method: 'POST', endpoint: '/v1/payments/authorize', status: 200, latency: '53ms' },
    { id: 7, time: '17:38:31', method: 'GET', endpoint: '/v1/customers/kyc', status: 200, latency: '128ms' },
    { id: 8, time: '17:38:30', method: 'POST', endpoint: '/v1/payments/authorize', status: 200, latency: '29ms' },
    { id: 9, time: '17:38:28', method: 'GET', endpoint: '/v1/transactions/list', status: 200, latency: '22ms' },
];

const LiveTraffic: React.FC = () => {
    const [traffic, setTraffic] = useState<TrafficEntry[]>(INITIAL_TRAFFIC);

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET': return 'bg-purple-500/20 text-purple-400';
            case 'POST': return 'bg-yellow-500/20 text-yellow-400';
            case 'PUT': return 'bg-blue-500/20 text-blue-400';
            case 'DELETE': return 'bg-red-500/20 text-red-400';
            default: return 'bg-zinc-500/20 text-zinc-400';
        }
    };

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'text-emerald-400';
        if (status >= 400) return 'text-red-400';
        return 'text-yellow-400';
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Live Traffic</h3>
                <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-emerald-400">STREAMING</span>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-2 text-xs text-zinc-500 uppercase tracking-wider mb-2 px-2">
                <span>Time</span>
                <span>Method</span>
                <span className="col-span-2">Endpoint</span>
                <span className="text-right">Status / Latency</span>
            </div>

            {/* Traffic Entries */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
                {traffic.map((entry) => (
                    <div
                        key={entry.id}
                        className="grid grid-cols-5 gap-2 text-sm py-1.5 px-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
                    >
                        <span className="text-zinc-400 font-mono">{entry.time}</span>
                        <span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getMethodColor(entry.method)}`}>
                                {entry.method}
                            </span>
                        </span>
                        <span className="col-span-2 text-zinc-300 font-mono truncate">{entry.endpoint}</span>
                        <span className="text-right">
                            <span className={`font-mono ${getStatusColor(entry.status)}`}>{entry.status}</span>
                            <span className="text-zinc-500 ml-2">{entry.latency}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveTraffic;
