import React, { useEffect, useState } from 'react';
import { Terminal, CloudLightning, Save, DollarSign, ShieldAlert, Check, Filter, ChevronRight, X } from 'lucide-react';

interface SystemEvent {
    id: number;
    timestamp: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'COST';
    message: string;
    icon: any;
    raw?: any; // For detail view
}

const EVENTS_POOL = [
    { type: 'INFO', message: 'Volume snapshot created (vol-0a1b2c)', icon: Save, raw: { vol_id: 'vol-0a1b2c', size: '20GB', region: 'us-east-1', encrypt: true } },
    { type: 'COST', message: 'Spot price updated: $0.041/hr (Region us-east-1)', icon: DollarSign, raw: { old_price: 0.042, new_price: 0.041, saving: '2.4%', instance: 'n1-std-4' } },
    { type: 'SUCCESS', message: 'Health check passed (instance-i-0f9e8d)', icon: Check, raw: { health_check_id: 'hc-9292', status: 200, latency: '12ms' } },
    { type: 'INFO', message: 'Log rotation complete: /var/log/syslog', icon: Terminal, raw: { file: '/var/log/syslog', size_before: '45MB', size_after: '0B' } },
    { type: 'WARNING', message: 'High memory usage detected (82%) on worker-node-2', icon: ShieldAlert, raw: { node: 'worker-node-2', mem_total: '8GB', mem_used: '6.56GB', top_process: 'java' } },
    { type: 'INFO', message: 'Registry: Image pulled successfully', icon: CloudLightning, raw: { image: 'app/backend:latest', sha: 'sha256:8f92...', size: '142MB' } },
    { type: 'COST', message: 'Spot Savings Report: Saved $0.42 last hour', icon: DollarSign, raw: { period: '1h', total_saved: 0.42, currency: 'USD' } },
];

export default function SystemEventFeed() {
    const [events, setEvents] = useState<SystemEvent[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'COST'>('ALL');
    const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);

    useEffect(() => {
        // Initial seed
        const initial = Array(5).fill(null).map((_, i) => createEvent(i));
        setEvents(initial);

        const interval = setInterval(() => {
            setEvents(prev => {
                const newEvent = createEvent(Date.now());
                return [newEvent, ...prev].slice(0, 50); // Keep history
            });
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    const createEvent = (idOffset: number): SystemEvent => {
        const template = EVENTS_POOL[Math.floor(Math.random() * EVENTS_POOL.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return {
            id: idOffset,
            timestamp: timeStr,
            type: template.type as any,
            message: template.message,
            icon: template.icon,
            raw: { timestamp: now.toISOString(), event_type: template.type, ...template.raw }
        };
    };

    const filteredEvents = filter === 'ALL' ? events : events.filter(e => e.type === filter);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col relative">

            {/* Detailed View Modal Overlay */}
            {selectedEvent && (
                <div className="absolute inset-0 bg-black/95 z-50 p-4 flex flex-col animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                        <h4 className="text-zinc-300 font-mono text-sm font-bold flex items-center gap-2">
                            <selectedEvent.icon size={14} />
                            Event Details
                        </h4>
                        <button onClick={() => setSelectedEvent(null)} className="text-zinc-500 hover:text-white">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="font-mono text-xs text-green-400 overflow-auto whitespace-pre-wrap flex-1 bg-zinc-900/50 p-2 rounded">
                        {JSON.stringify(selectedEvent.raw, null, 2)}
                    </div>
                </div>
            )}


            <div className="p-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h3 className="text-zinc-300 font-bold text-sm flex items-center gap-2">
                    <Terminal size={16} className="text-purple-400" />
                    SYSTEM EVENTS
                </h3>

                {/* Mini Filters */}
                <div className="flex gap-1">
                    {['ALL', 'INFO', 'COST', 'WARNING'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`text-[10px] px-2 py-1 rounded transition-colors ${filter === f ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div
                className="flex-1 overflow-y-auto p-3 space-y-2"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#3f3f46 #18181b'
                }}
            >
                {filteredEvents.map((evt) => (
                    <div
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className="flex gap-2 items-center cursor-pointer group hover:bg-zinc-800/40 py-2 px-2 rounded-lg transition-colors border-b border-zinc-800/50 last:border-b-0"
                    >
                        <div className={`
                            w-5 h-5 rounded flex items-center justify-center flex-shrink-0
                            ${evt.type === 'INFO' ? 'bg-zinc-800 text-zinc-400' :
                                evt.type === 'SUCCESS' ? 'bg-emerald-900/30 text-emerald-400' :
                                    evt.type === 'WARNING' ? 'bg-amber-900/30 text-amber-400' :
                                        'bg-blue-900/30 text-blue-400'}
                        `}>
                            <evt.icon size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-zinc-400 leading-snug truncate group-hover:text-zinc-200 transition-colors">{evt.message}</p>
                        </div>
                        <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0">{evt.timestamp}</span>
                    </div>
                ))}
                {filteredEvents.length === 0 && (
                    <div className="text-center text-zinc-600 text-xs py-6">
                        No events for "{filter}"
                    </div>
                )}
            </div>
        </div>
    );
}
