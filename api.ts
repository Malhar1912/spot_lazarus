// API Service Layer for connecting to Lazarus-Prod Backend

// Production backend on Google Cloud Run
const API_BASE_URL = 'https://lazarus-gateway-913938404636.us-central1.run.app';

// Types for API responses
export interface APIStatus {
    status: 'OFFLINE' | 'STARTING' | 'ACTIVE' | 'STOPPING';
    vm_name: string | null;
    zone: string | null;
    start_time: string | null;
    watchdog: WatchdogStatus;
    mock_mode: boolean;
}

export interface WatchdogStatus {
    users: number;
    tunnels: number;
    cpu_load: number;
    idle_countdown: number | null;
    status: 'INACTIVE' | 'MONITORING' | 'IDLE' | 'ACTIVE';
    signals?: {
        ssh_sessions: number;
        ide_connections: number;
        cpu_busy: boolean;
    };
}

export interface ZoneData {
    region: string;
    zone: string;
    price: number;
    carbon: string;
    latency: string;
}

export interface ZonesResponse {
    zones: ZoneData[];
    optimal_zone: string;
    optimal_region: string;
    optimal_price: number;
}

export interface ResurrectResponse {
    success: boolean;
    message: string;
    logs: string[];
    zone?: string;
    vm_name?: string;
}

export interface StopResponse {
    success: boolean;
    message: string;
}

// API Functions

/**
 * Fetch current system status
 */
export async function fetchStatus(): Promise<APIStatus> {
    const response = await fetch(`${API_BASE_URL}/api/status`);
    if (!response.ok) {
        throw new Error(`Failed to fetch status: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Get zone arbitrage data
 */
export async function getZoneData(): Promise<ZonesResponse> {
    const response = await fetch(`${API_BASE_URL}/api/zones`);
    if (!response.ok) {
        throw new Error(`Failed to fetch zones: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Trigger VM resurrection
 */
export async function resurrectVM(profile: string): Promise<ResurrectResponse> {
    const response = await fetch(`${API_BASE_URL}/api/resurrect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile }),
    });
    if (!response.ok) {
        throw new Error(`Failed to resurrect VM: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Get watchdog monitoring state
 */
export async function getWatchdogStatus(): Promise<WatchdogStatus> {
    const response = await fetch(`${API_BASE_URL}/api/watchdog`);
    if (!response.ok) {
        throw new Error(`Failed to fetch watchdog status: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Stop/terminate current VM session
 */
export async function stopVM(): Promise<StopResponse> {
    const response = await fetch(`${API_BASE_URL}/api/stop`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to stop VM: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/status`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        return response.ok;
    } catch {
        return false;
    }
}
