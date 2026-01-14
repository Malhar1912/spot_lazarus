export type EnvironmentState = 'OFFLINE' | 'STARTING' | 'READY' | 'ACTIVE' | 'SLEEPING';

export interface LogStep {
  id: string;
  message: string;
  duration: number;
}

export interface SimulationProfile {
  id: string;
  name: string;
  description: string;
  icon: 'server' | 'cpu' | 'database'; // Maps to Lucide icons
  startupSequence: LogStep[];
  metrics: {
    label: string;
    unit: string;
    mockValues: number[]; // For the graph visualization
  };
}

