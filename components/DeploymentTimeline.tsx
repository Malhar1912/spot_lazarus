import React, { useEffect, useState } from 'react';
import { Circle, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface TimelineEvent {
    id: number;
    time: string;
    title: string;
    type: 'NORMAL' | 'SUCCESS' | 'WARNING';
}

export default function DeploymentTimeline() {
    const [events, setEvents] = useState<TimelineEvent[]>([
        { id: 1, time: '00:00:00', title: 'Session Initialized', type: 'NORMAL' },
        { id: 2, time: '00:00:03', title: 'Profile Loaded', type: 'NORMAL' },
        { id: 3, time: '00:00:15', title: 'Docker Image Built', type: 'SUCCESS' },
        { id: 4, time: '00:00:42', title: 'Instance Booted', type: 'SUCCESS' },
    ]);

    // Pool of possible runtime events
    const RUNTIME_EVENTS = [
        { title: 'Health Check Passed', type: 'SUCCESS' as const },
        { title: 'Metrics Synced', type: 'SUCCESS' as const },
        { title: 'Config Reload', type: 'NORMAL' as const },
        { title: 'Auto-Scaling Trigger', type: 'SUCCESS' as const },
        { title: 'Disk I/O Spike', type: 'WARNING' as const },
        { title: 'Memory Reclaimed', type: 'SUCCESS' as const },
        { title: 'Network Ping OK', type: 'SUCCESS' as const },
        { title: 'CPU Throttle Detected', type: 'WARNING' as const },
        { title: 'Snapshot Created', type: 'SUCCESS' as const },
        { title: 'Log Rotation', type: 'NORMAL' as const },
        { title: 'SSL Cert Renewed', type: 'SUCCESS' as const },
        { title: 'Cache Invalidated', type: 'NORMAL' as const },
        { title: 'Backup Completed', type: 'SUCCESS' as const },
        { title: 'Connection Pool Resized', type: 'NORMAL' as const },
        { title: 'Latency Spike Detected', type: 'WARNING' as const },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            if (Math.random() > 0.6) { // More frequent updates
                const now = new Date();
                const timeStr = now.toLocaleTimeString('en-US', { hour12: false });

                // Pick a random event from the pool
                const randomEvent = RUNTIME_EVENTS[Math.floor(Math.random() * RUNTIME_EVENTS.length)];

                const newEvent: TimelineEvent = {
                    id: Date.now(),
                    time: timeStr,
                    title: randomEvent.title,
                    type: randomEvent.type
                };

                setEvents(prev => [...prev, newEvent].slice(-8)); // Keep last 8
            }
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full flex flex-col">
            <h3 className="text-zinc-400 font-bold text-xs tracking-wider mb-4 flex items-center gap-2">
                <Clock size={14} />
                SESSION TIMELINE
            </h3>

            <div className="relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                {/* Vertical Line */}
                <div className="absolute left-2.5 top-0 bottom-0 w-px bg-zinc-800" />

                <div className="space-y-4 relative">
                    {events.map((evt) => (
                        <div key={evt.id} className="flex gap-4 items-start animate-in slide-in-from-left-2 fade-in duration-300">
                            {/* Icon Blob */}
                            <div className="relative z-10 bg-zinc-900">
                                {evt.type === 'SUCCESS' ? (
                                    <CheckCircle size={20} className="text-emerald-500 bg-zinc-900" />
                                ) : evt.type === 'WARNING' ? (
                                    <AlertTriangle size={20} className="text-amber-500 bg-zinc-900" />
                                ) : (
                                    <Circle size={20} className="text-zinc-600 bg-zinc-900" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 -mt-0.5">
                                <p className={`text-sm font-medium ${evt.type === 'WARNING' ? 'text-amber-400' : 'text-zinc-200'}`}>
                                    {evt.title}
                                </p>
                                <span className="text-[10px] text-zinc-600 font-mono">{evt.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
