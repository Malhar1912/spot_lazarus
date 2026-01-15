import React, { useEffect, useState } from 'react';
import { Terminal, CloudLightning, Save, DollarSign, ShieldAlert, Check } from 'lucide-react';

interface SystemEvent {
    id: number;
    timestamp: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'COST';
    message: string;
    icon: any;
}

const EVENTS_POOL = [
    { type: 'INFO', message: 'Volume snapshot created (vol-0a1b2c)', icon: Save },
    { type: 'COST', message: 'Spot price updated: $0.041/hr (Region us-east-1)', icon: DollarSign },
    { type: 'SUCCESS', message: 'Health check passed (instance-i-0f9e8d)', icon: Check },
    { type: 'INFO', message: 'Log rotation complete: /var/log/syslog', icon: Terminal },
    { type: 'WARNING', message: 'High memory usage detected (82%) on worker-node-2', icon: ShieldAlert },
    { type: 'INFO', message: 'Registry: Image pulled successfully', icon: CloudLightning },
    { type: 'COST', message: 'Spot Savings Report: Saved $0.42 last hour', icon: DollarSign },
];

export default function SystemEventFeed() {
    const [events, setEvents] = useState<SystemEvent[]>([]);

    useEffect(() => {
        // Initial seed
        const initial = Array(3).fill(null).map((_, i) => createEvent(i));
        setEvents(initial);

        const interval = setInterval(() => {
            setEvents(prev => {
                const newEvent = createEvent(Date.now());
                return [newEvent, ...prev].slice(0, 50); // Keep history
            });
        }, 3500); // Slower than traffic

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
            icon: template.icon
        };
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h3 className="text-zinc-300 font-bold text-sm flex items-center gap-2">
                    <Terminal size={16} className="text-purple-400" />
                    SYSTEM EVENTS
                </h3>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                {events.map((evt) => (
                    <div key={evt.id} className="flex gap-3 items-start animate-in slide-in-from-left-2 fade-in duration-300">
                        <div className={`
                            mt-0.5 min-w-[24px] h-6 rounded flex items-center justify-center
                            ${evt.type === 'INFO' ? 'bg-zinc-800 text-zinc-400' :
                                evt.type === 'SUCCESS' ? 'bg-emerald-900/30 text-emerald-400' :
                                    evt.type === 'WARNING' ? 'bg-amber-900/30 text-amber-400' :
                                        'bg-blue-900/30 text-blue-400'}
                        `}>
                            <evt.icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-zinc-300 leading-tight">{evt.message}</p>
                            <span className="text-[10px] text-zinc-600 font-mono mt-0.5 block">{evt.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
