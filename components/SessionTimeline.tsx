import React from 'react';
import { Clock, Check, AlertTriangle, RefreshCw, HardDrive, Wifi } from 'lucide-react';

interface TimelineEvent {
    id: number;
    time: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    icon: 'check' | 'warning' | 'refresh' | 'disk' | 'network';
}

const TIMELINE_EVENTS: TimelineEvent[] = [
    { id: 1, time: '17:36:04', message: 'Session Initialized', type: 'success', icon: 'check' },
    { id: 2, time: '17:36:04', message: 'Connection Pool Resized', type: 'info', icon: 'refresh' },
    { id: 3, time: '17:36:04', message: 'Log Rotation', type: 'info', icon: 'refresh' },
    { id: 4, time: '17:36:04', message: 'Disk I/O Spike', type: 'warning', icon: 'disk' },
    { id: 5, time: '17:36:04', message: 'Network Ping OK', type: 'success', icon: 'network' },
];

const SessionTimeline: React.FC = () => {
    const getIcon = (icon: string, type: string) => {
        const colorClass = type === 'success' ? 'text-emerald-400' : type === 'warning' ? 'text-red-400' : 'text-zinc-400';
        const bgClass = type === 'success' ? 'bg-emerald-500/20' : type === 'warning' ? 'bg-red-500/20' : 'bg-zinc-800';

        const IconComponent = icon === 'check' ? Check : icon === 'warning' ? AlertTriangle : icon === 'disk' ? HardDrive : icon === 'network' ? Wifi : RefreshCw;

        return (
            <div className={`w-6 h-6 rounded-full ${bgClass} flex items-center justify-center`}>
                <IconComponent className={`w-3 h-3 ${colorClass}`} />
            </div>
        );
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Session Timeline</h3>
            </div>

            <div className="space-y-3">
                {TIMELINE_EVENTS.map((event) => (
                    <div key={event.id} className="flex items-center gap-3">
                        {getIcon(event.icon, event.type)}
                        <div className="flex-1">
                            <div className={`text-sm ${event.type === 'warning' ? 'text-red-400' : 'text-zinc-300'}`}>
                                {event.message}
                            </div>
                            <div className="text-xs text-zinc-600">{event.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionTimeline;
