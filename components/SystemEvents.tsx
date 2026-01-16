import React, { useState } from 'react';
import { Bell, Check, Info, DollarSign, AlertTriangle } from 'lucide-react';

interface SystemEvent {
    id: number;
    time: string;
    message: string;
    type: 'info' | 'cost' | 'warning' | 'success';
}

const SYSTEM_EVENTS: SystemEvent[] = [
    { id: 1, time: '17:36:04', message: 'Health check passed (instance-i-0f9e8d)', type: 'success' },
    { id: 2, time: '17:36:04', message: 'Health check passed (instance-i-0f9e8d)', type: 'success' },
    { id: 3, time: '17:36:04', message: 'Health check passed (instance-i-0f9e8d)', type: 'success' },
    { id: 4, time: '17:36:04', message: 'Registry: Image pulled successfully', type: 'info' },
    { id: 5, time: '17:36:04', message: 'Spot price updated: $0.041/hr', type: 'cost' },
    { id: 6, time: '17:36:04', message: 'Spot Savings Report: Saved $0.42 last hour', type: 'cost' },
];

type TabType = 'ALL' | 'INFO' | 'COST' | 'WARNING';

const SystemEvents: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('ALL');

    const tabs: TabType[] = ['ALL', 'INFO', 'COST', 'WARNING'];

    const filteredEvents = activeTab === 'ALL'
        ? SYSTEM_EVENTS
        : SYSTEM_EVENTS.filter(e => e.type.toUpperCase() === activeTab || (activeTab === 'INFO' && e.type === 'success'));

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'success': return <Check className="w-3 h-3 text-emerald-400" />;
            case 'info': return <Info className="w-3 h-3 text-blue-400" />;
            case 'cost': return <DollarSign className="w-3 h-3 text-yellow-400" />;
            case 'warning': return <AlertTriangle className="w-3 h-3 text-red-400" />;
            default: return <Info className="w-3 h-3 text-zinc-400" />;
        }
    };

    const getEventBg = (type: string) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10';
            case 'info': return 'bg-blue-500/10';
            case 'cost': return 'bg-yellow-500/10';
            case 'warning': return 'bg-red-500/10';
            default: return 'bg-zinc-800';
        }
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-zinc-400" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">System Events</h3>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-zinc-800/50 p-1 rounded-lg">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeTab === tab
                                ? 'bg-zinc-700 text-white'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredEvents.map((event) => (
                    <div
                        key={event.id}
                        className={`flex items-start gap-3 p-2 rounded-lg ${getEventBg(event.type)}`}
                    >
                        <div className="mt-0.5">{getEventIcon(event.type)}</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm text-zinc-300 truncate">{event.message}</div>
                            <div className="text-xs text-zinc-600">{event.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemEvents;
