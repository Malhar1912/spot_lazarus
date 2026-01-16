import React from 'react';
import { Globe, Server, Box } from 'lucide-react';

const LiveTopology: React.FC = () => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Live Topology</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded">HEALTHY</span>
                <span className="text-xs text-zinc-500 ml-2">Click node for details</span>
            </div>

            {/* Topology Flow */}
            <div className="flex items-center justify-center gap-4">
                {/* Internet Node */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-zinc-400" />
                    </div>
                    <span className="text-xs text-zinc-500">INTERNET</span>
                </div>

                {/* Connection Line */}
                <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-zinc-600 to-purple-500"></div>
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-purple-500"></div>
                </div>

                {/* Load Balancer Node */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-xl bg-purple-900/30 border border-purple-700/50 flex items-center justify-center">
                        <Server className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs text-purple-400">LB-REGION-1</span>
                </div>

                {/* Connection Line */}
                <div className="flex items-center gap-1">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-emerald-500"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-500"></div>
                </div>

                {/* Spot Instance Node */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-xl bg-emerald-900/30 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <Box className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-xs text-emerald-400 font-medium">SPOT-INSTANCE</span>
                </div>
            </div>
        </div>
    );
};

export default LiveTopology;
