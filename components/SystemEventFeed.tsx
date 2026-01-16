import React, { useEffect, useState } from 'react';
import { Terminal, CloudLightning, Save, DollarSign, ShieldAlert, Check, X } from 'lucide-react';

interface SystemEvent {
    id: number;
    timestamp: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'COST';
    message: string;
    icon: any;
    raw?: any;
}

const EVENTS_POOL = [
    { type: 'INFO', message: 'Volume snapshot created', icon: Save, raw: { vol_id: 'vol-0a1b2c', size: '20GB' } },
    { type: 'COST', message: 'Spot price: $0.041/hr', icon: DollarSign, raw: { saving: '2.4%' } },
    { type: 'SUCCESS', message: 'Health check passed', icon: Check, raw: { latency: '12ms' } },
    { type: 'INFO', message: 'Log rotation complete', icon: Terminal, raw: { file: '/var/log/syslog' } },
    { type: 'WARNING', message: 'Memory usage at 82%', icon: ShieldAlert, raw: { node: 'worker-2' } },
    { type: 'INFO', message: 'Image pulled successfully', icon: CloudLightning, raw: { image: 'app/backend:latest' } },
    { type: 'COST', message: 'Saved $0.42 this hour', icon: DollarSign, raw: { period: '1h' } },
];

export default function SystemEventFeed() {
    const [events, setEvents] = useState<SystemEvent[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'INFO' | 'WARNING' | 'COST'>('ALL');
    const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);

    useEffect(() => {
        const initial = Array(5).fill(null).map((_, i) => createEvent(i));
        setEvents(initial);

        const interval = setInterval(() => {
            setEvents(prev => {
                const newEvent = createEvent(Date.now());
                return [newEvent, ...prev].slice(0, 30); // Reduced from 50 to 30
            });
        }, 4000); // Slower updates (4s instead of 3.5s)

        return () => clearInterval(interval);
    }, []);

    const createEvent = (idOffset: number): SystemEvent => {
        const template = EVENTS_POOL[Math.floor(Math.random() * EVENTS_POOL.length)];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

        return {
            id: idOffset,
            timestamp: timeStr,
            type: template.type as any,
            message: template.message,
            icon: template.icon,
            raw: { timestamp: now.toISOString(), ...template.raw }
        };
    };

    const filteredEvents = filter === 'ALL' ? events : events.filter(e => e.type === filter);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'SUCCESS': return 'bg-emerald-500/10 text-emerald-400';
            case 'WARNING': return 'bg-amber-500/10 text-amber-400';
            case 'COST': return 'bg-blue-500/10 text-blue-400';
            default: return 'bg-zinc-700/50 text-zinc-400';
        }
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col relative">
            {/* Detail Overlay */}
            {selectedEvent && (
                <div className="absolute inset-0 bg-black/95 z-50 p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-800">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                            <selectedEvent.icon size={16} />
                            Event Details
                        </h4>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="text-zinc-500 hover:text-white p-1"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <pre className="font-mono text-sm text-green-400 overflow-auto flex-1 bg-zinc-900/50 p-3 rounded-lg">
                        {JSON.stringify(selectedEvent.raw, null, 2)}
                    </pre>
                </div>
            )}

            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Terminal size={18} className="text-purple-400" />
                    <h3 className="text-white font-semibold">System Events</h3>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 bg-zinc-800/50 p-1 rounded-lg">
                    {['ALL', 'INFO', 'COST', 'WARNING'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`text-xs px-3 py-1.5 rounded-md transition-colors ${filter === f
                                    ? 'bg-zinc-700 text-white'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event List - Better spacing and readability */}
            <div
                className="flex-1 overflow-y-auto p-3"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 #18181b' }}
            >
                <div className="space-y-2">
                    {filteredEvents.map((evt) => (
                        <div
                            key={evt.id}
                            onClick={() => setSelectedEvent(evt)}
                            className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-colors"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeStyles(evt.type)}`}>
                                <evt.icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-zinc-300 truncate">{evt.message}</p>
                            </div>
                            <span className="text-xs text-zinc-600 font-mono flex-shrink-0">{evt.timestamp}</span>
                        </div>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center text-zinc-600 text-sm py-8">
                        No events for "{filter}"
                    </div>
                )}
            </div>
        </div>
    );
}
