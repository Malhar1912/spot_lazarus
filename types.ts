export enum AppState {
  OFFLINE = 'OFFLINE',
  STARTING = 'STARTING',
  READY = 'READY',
  ACTIVE = 'ACTIVE',
  SLEEPING = 'SLEEPING', // The transition state back to offline
  DEPLOYING = 'DEPLOYING'
}

export interface LogStep {
  id: string;
  message: string;
  status: 'pending' | 'running' | 'completed' | 'fallback';
  timestamp?: string;
  icon?: string;
}

export interface CostTier {
  name: string;
  cost: number;
  type: 'idle' | 'spot' | 'demand';
  description: string;
}