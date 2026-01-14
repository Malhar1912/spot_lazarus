import React from 'react';
import {
  Server, Search, Coins, Cpu, HardDrive, PlayCircle, TestTube, CheckCircle,
  AlertCircle, Loader2, Power, PauseCircle, Activity,
  UploadCloud, Box, Zap, Layers
} from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  Server, Search, Coins, Cpu, HardDrive, PlayCircle, TestTube, CheckCircle,
  AlertCircle, Loader2, Power, PauseCircle, Activity,
  UploadCloud, Box, Zap, Layers
};

export const StatusIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = IconMap[name] || Activity;
  return <Icon className={className} />;
};