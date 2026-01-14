import { LogStep, CostTier } from './types';
import { Server, Search, Coins, Cpu, HardDrive, PlayCircle, TestTube, CheckCircle } from 'lucide-react';

export const STARTUP_SEQUENCE: Omit<LogStep, 'status'>[] = [
  { id: '1', message: 'Request received', icon: 'Server' },
  { id: '2', message: 'Checking environment status', icon: 'Search' },
  { id: '3', message: 'Attempting Spot capacity allocation', icon: 'Coins' },
  { id: '4', message: 'Waiting for compute resources', icon: 'Cpu' },
  { id: '5', message: 'Attaching persistent disk', icon: 'HardDrive' },
  { id: '6', message: 'Booting services', icon: 'PlayCircle' },
  { id: '7', message: 'Running health checks', icon: 'TestTube' },
];

export const COST_DATA: CostTier[] = [
  { name: 'Idle (Storage)', cost: 0.04, type: 'idle', description: 'Environment sleeping' },
  { name: 'Active (Spot)', cost: 0.14, type: 'spot', description: 'Current Mode' },
  { name: 'Active (On-Demand)', cost: 0.48, type: 'demand', description: 'Fallback Mode' },
];

export const MOCK_API_DATA = [
  { id: 101, endpoint: '/v1/payments/authorize', method: 'POST', status: 200, latency: '24ms' },
  { id: 102, endpoint: '/v1/payments/capture', method: 'POST', status: 202, latency: '45ms' },
  { id: 103, endpoint: '/v1/customers/kyc', method: 'GET', status: 200, latency: '120ms' },
  { id: 104, endpoint: '/v1/transactions/list', method: 'GET', status: 200, latency: '15ms' },
  { id: 105, endpoint: '/v1/webhooks/stripe', method: 'POST', status: 400, latency: '8ms' },
];