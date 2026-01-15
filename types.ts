export type EnvironmentState = 'OFFLINE' | 'STARTING' | 'READY' | 'ACTIVE' | 'SLEEPING' | 'RECOVERING';

export interface LogStep {
  id: string;
  message: string;
  duration: number;
}

export interface CostMetric {
  month: string;
  onDemandCost: number; // The "Before" cost
  spotLazarusCost: number; // The "After" cost
}

export interface SimulationProfile {
  id: string;
  name: string;
  description: string;
  icon: 'server' | 'cpu' | 'database'; // Maps to Lucide icons
  startupSequence: LogStep[];
  dockerBuildSequence: LogStep[]; // New: Container build logs
  costComparison: {
    hourlyRateOnDemand: number;
    hourlyRateSpot: number;
    monthlyData: CostMetric[]; // Data for the chart
  };
  metrics: {
    label: string;
    unit: string;
    mockValues: number[]; // For the graph visualization
  };
}

