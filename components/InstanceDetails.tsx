import React from 'react';
import { Database, Shield, Globe, Tag, Cpu, MapPin, Hash, Key } from 'lucide-react';

interface InstanceDetailsProps {
    profileName: string;
    profileId: string;
}

export default function InstanceDetails({ profileName, profileId }: InstanceDetailsProps) {
    const randomIp = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const publicIp = `34.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg h-full">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-3">
                <h3 className="text-zinc-300 font-bold text-sm flex items-center gap-2">
                    <Database size={16} className="text-blue-400" />
                    INSTANCE METADATA
                </h3>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                    {profileId.substring(0, 8)}
                </span>
            </div>

            <div className="space-y-4">
                {/* Network Section */}
                <div>
                    <h4 className="text-xs text-zinc-500 font-semibold mb-2 uppercase tracking-wider">Network Interfaces</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <MetadataItem
                            label="Public IPv4"
                            value={publicIp}
                            icon={Globe}
                            copyable
                        />
                        <MetadataItem
                            label="Private IP"
                            value={randomIp}
                            icon={Shield}
                            copyable
                        />
                    </div>
                </div>

                {/* Hardware Section */}
                <div>
                    <h4 className="text-xs text-zinc-500 font-semibold mb-2 uppercase tracking-wider">Specs & Specs</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <MetadataItem
                            label="Instance Type"
                            value="n1-standard-4"
                            icon={Cpu}
                        />
                        <MetadataItem
                            label="Availability Zone"
                            value="us-east-1a"
                            icon={MapPin}
                        />
                    </div>
                </div>

                {/* Identity Section */}
                <div>
                    <h4 className="text-xs text-zinc-500 font-semibold mb-2 uppercase tracking-wider">Identity & Tags</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <MetadataItem
                            label="AMI ID"
                            value="ami-0a1b2c3d4e5f6g7h8"
                            icon={Hash}
                            mono
                        />
                        <MetadataItem
                            label="IAM Role"
                            value="SpotLazarus-Worker-Role"
                            icon={Key}
                        />
                        <MetadataItem
                            label="User Data"
                            value="#!/bin/bash..."
                            icon={Tag}
                            truncate
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const MetadataItem = ({ label, value, icon: Icon, copyable, mono, truncate }: any) => (
    <div className="flex items-center justify-between bg-zinc-900/50 p-2 rounded hover:bg-zinc-800/50 transition-colors group">
        <div className="flex items-center gap-2">
            <Icon size={14} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            <span className="text-xs text-zinc-400">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-xs text-zinc-300 ${mono ? 'font-mono' : ''} ${truncate ? 'truncate max-w-[100px]' : ''}`}>
                {value}
            </span>
        </div>
    </div>
);
