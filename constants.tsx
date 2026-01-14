import { SimulationProfile, LogStep } from './types';
const PAYMENTS_LOGS: LogStep[] = [
  { id: '1', message: 'Initializing Secure Enclave...', duration: 800 },
  { id: '2', message: 'Connecting to Banking Gateway...', duration: 1200 },
  { id: '3', message: 'Verifying TLS Certificates...', duration: 600 },
  { id: '4', message: 'Loading Fraud Detection Modules...', duration: 1000 },
  { id: '5', message: 'Ready for Transactions.', duration: 500 },
];

// 2. AI Inference Logs
const AI_LOGS: LogStep[] = [
  { id: '1', message: 'Allocating GPU VRAM (A100)...', duration: 1500 },
  { id: '2', message: 'Loading PyTorch Weights (4GB)...', duration: 2000 },
  { id: '3', message: 'Warming up Tensor Cores...', duration: 800 },
  { id: '4', message: 'Model Quantization Check...', duration: 600 },
  { id: '5', message: 'Inference Server Online.', duration: 400 },
];

// 3. Data Pipeline Logs
const DATA_LOGS: LogStep[] = [
  { id: '1', message: 'Connecting to Kafka Brokers...', duration: 900 },
  { id: '2', message: 'Hydrating Redis Cache...', duration: 1400 },
  { id: '3', message: 'Syncing Schema Registry...', duration: 700 },
  { id: '4', message: 'Starting Worker Pool (x4)...', duration: 1100 },
  { id: '5', message: 'Stream Processing Active.', duration: 300 },
];

export const MOCK_API_DATA = [
  { id: 101, endpoint: '/v1/payments/authorize', method: 'POST', status: 200, latency: '24ms' },
  { id: 102, endpoint: '/v1/payments/capture', method: 'POST', status: 202, latency: '45ms' },
  { id: 103, endpoint: '/v1/customers/kyc', method: 'GET', status: 200, latency: '120ms' },
  { id: 104, endpoint: '/v1/transactions/list', method: 'GET', status: 200, latency: '15ms' },
  { id: 105, endpoint: '/v1/webhooks/stripe', method: 'POST', status: 400, latency: '8ms' },
];

export const SIMULATION_PROFILES: SimulationProfile[] = [
  {
    id: 'payments-v1',
    name: 'Payments Gateway',
    description: 'High-security transaction processor (PCI-DSS compliant).',
    icon: 'server',
    startupSequence: PAYMENTS_LOGS,
    metrics: { label: 'Throughput', unit: 'tx/s', mockValues: [45, 120, 80, 200, 150] }
  },
  {
    id: 'ai-model-v2',
    name: 'GenAI Inference',
    description: 'LLM hosting environment with GPU acceleration.',
    icon: 'cpu',
    startupSequence: AI_LOGS,
    metrics: { label: 'Tokens', unit: 'tok/s', mockValues: [12, 45, 30, 60, 55] }
  },
  {
    id: 'data-pipe-v1',
    name: 'Real-time Analytics',
    description: 'Stream processing for user events.',
    icon: 'database',
    startupSequence: DATA_LOGS,
    metrics: { label: 'Events', unit: 'msg/s', mockValues: [500, 2400, 1800, 3000, 2100] }
  }
];