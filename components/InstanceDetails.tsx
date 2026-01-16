import React from 'react';
import { Database, Shield, Globe, Cpu, MapPin, Hash, Key } from 'lucide-react';

interface InstanceDetailsProps {
    profileName: string;
    profileId: string;
}

export default function InstanceDetails({ profileName, profileId }: InstanceDetailsProps) {
    const randomIp = `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const publicIp = `34.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Database size={18} className="text-blue-400" />
                    <h3 className="text-white font-semibold">Instance Metadata</h3>
                </div>
                <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-md font-mono">
                    {profileId.substring(0, 8)}
                </span>
            </div>

            <div className="mt-4 space-y-5">
                {/* Network Section */}
                <Section title="Network">
                    <MetadataRow icon={Globe} label="Public IP" value={publicIp} />
                    <MetadataRow icon={Shield} label="Private IP" value={randomIp} />
                </Section>

                {/* Hardware Section - Fixed typo from "Specs & Specs" */}
                <Section title="Hardware">
                    <MetadataRow icon={Cpu} label="Instance Type" value="n1-standard-4" />
                    <MetadataRow icon={MapPin} label="Zone" value="us-east-1a" />
                </Section>

                {/* Identity Section */}
                <Section title="Identity">
                    <MetadataRow icon={Hash} label="AMI ID" value="ami-0a1b2c3d" mono />
                    <MetadataRow icon={Key} label="IAM Role" value="SpotLazarus-Worker" />
                </Section>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h4 className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-2">{title}</h4>
            <div className="space-y-1.5">{children}</div>
        </div>
    );
}

function MetadataRow({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex items-center justify-between py-2 px-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center gap-2.5">
                <Icon size={14} className="text-zinc-500" />
                <span className="text-sm text-zinc-400">{label}</span>
            </div>
            <span className={`text-sm text-zinc-200 ${mono ? 'font-mono' : ''}`}>{value}</span>
        </div>
    );
}
