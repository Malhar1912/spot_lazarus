import React from 'react';
import { Globe, Server, Shield, Tag } from 'lucide-react';

interface InstanceMetadataProps {
    instanceName?: string;
    zone?: string;
}

const InstanceMetadata: React.FC<InstanceMetadataProps> = ({
    instanceName = 'dev-env-1',
    zone = 'us-central1-a'
}) => {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <Server className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Instance Metadata</h3>
                <span className="ml-auto text-xs text-zinc-500 font-mono">payments</span>
            </div>

            {/* Network Interfaces */}
            <div className="mb-4">
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Network Interfaces</h4>
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Public IPv4
                        </span>
                        <span className="text-white font-mono">136.116.197.25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400 flex items-center gap-2">
                            <Server className="w-3 h-3" /> Private IP
                        </span>
                        <span className="text-white font-mono">10.128.0.26</span>
                    </div>
                </div>
            </div>

            {/* Specs */}
            <div className="mb-4">
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Specs & Specs</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-zinc-800/50 rounded-lg p-2.5">
                        <div className="text-xs text-zinc-500 mb-1">Instance Type</div>
                        <div className="text-sm text-white font-mono">n1-standard-4</div>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-2.5">
                        <div className="text-xs text-zinc-500 mb-1">Availability Zone</div>
                        <div className="text-sm text-white font-mono">{zone}</div>
                    </div>
                </div>
            </div>

            {/* Identity & Tags */}
            <div>
                <h4 className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Identity & Tags</h4>
                <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3 text-purple-400" />
                        <span className="text-zinc-400">AMI ID</span>
                        <span className="text-purple-400 font-mono ml-auto">ami-0a1b2c3d4e5f6g7h8</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-yellow-400" />
                        <span className="text-zinc-400">IAM Role</span>
                        <span className="text-yellow-400 font-mono ml-auto">SpotLazarus-Worker-Role</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3 text-zinc-500" />
                        <span className="text-zinc-400">User Data</span>
                        <span className="text-zinc-500 font-mono ml-auto">#!bin/bash...</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstanceMetadata;
