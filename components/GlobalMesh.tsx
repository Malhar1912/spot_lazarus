import React, { useEffect, useRef, useState, useMemo } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { EnvironmentState } from '../types';
import * as THREE from 'three';

interface GlobalMeshProps {
    state: EnvironmentState;
    isDbChaos?: boolean;
    isNetworkChaos?: boolean;
}

export default function GlobalMesh({ state, isDbChaos, isNetworkChaos }: GlobalMeshProps) {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [points, setPoints] = useState<any[]>([]);
    const [arcs, setArcs] = useState<any[]>([]);
    const [rings, setRings] = useState<any[]>([]);

    const isRecovering = state === 'RECOVERING';

    interface Location {
        lat: number;
        lng: number;
        name: string;
        color: string;
    }

    // Define locations
    const LOCATIONS: Record<string, Location> = useMemo(() => ({
        USER: { lat: 40.7128, lng: -74.0060, name: 'User (NYC)', color: '#60a5fa' }, // NYC
        LB: { lat: 51.5074, lng: -0.1278, name: 'LB (London)', color: '#8b5cf6' }, // London
        INSTANCE: { lat: 35.6895, lng: 139.6917, name: 'Spot Instance (Tokyo)', color: isRecovering ? '#ef4444' : '#10b981' }, // Tokyo
        DB: { lat: 1.3521, lng: 103.8198, name: 'Primary DB (Singapore)', color: isDbChaos ? '#ef4444' : '#f59e0b' } // Singapore
    }), [isRecovering, isDbChaos]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ width, height });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        // Setup initial data
        const pointData = Object.values(LOCATIONS).map(loc => ({
            lat: loc.lat,
            lng: loc.lng,
            size: 0.5,
            color: loc.color,
            name: loc.name
        }));
        setPoints(pointData);

        // Connections (Arcs)
        const arcData = [
            // User -> LB
            {
                startLat: LOCATIONS.USER.lat, startLng: LOCATIONS.USER.lng,
                endLat: LOCATIONS.LB.lat, endLng: LOCATIONS.LB.lng,
                color: isNetworkChaos ? ['#ef4444', '#ef4444'] : ['#60a5fa', '#8b5cf6'],
                dash: isNetworkChaos ? 2 : 0,
                status: isNetworkChaos ? 'Severed' : 'Active'
            },
            // LB -> Instance
            {
                startLat: LOCATIONS.LB.lat, startLng: LOCATIONS.LB.lng,
                endLat: LOCATIONS.INSTANCE.lat, endLng: LOCATIONS.INSTANCE.lng,
                color: ['#8b5cf6', LOCATIONS.INSTANCE.color],
                dash: 0
            },
            // Instance -> DB
            {
                startLat: LOCATIONS.INSTANCE.lat, startLng: LOCATIONS.INSTANCE.lng,
                endLat: LOCATIONS.DB.lat, endLng: LOCATIONS.DB.lng,
                color: isDbChaos ? ['#ef4444', '#ef4444'] : [LOCATIONS.INSTANCE.color, LOCATIONS.DB.color],
                dash: isDbChaos ? 2 : 0,
                status: isDbChaos ? 'Severed' : 'Active'
            }
        ];
        setArcs(arcData);

        // Ripple Rings on Instance if Recovering
        if (isRecovering) {
            setRings([{ lat: LOCATIONS.INSTANCE.lat, lng: LOCATIONS.INSTANCE.lng, color: 'red' }]);
        } else {
            setRings([{ lat: LOCATIONS.INSTANCE.lat, lng: LOCATIONS.INSTANCE.lng, color: 'cyan' }]);
        }

    }, [isDbChaos, isNetworkChaos, isRecovering, LOCATIONS]);

    useEffect(() => {
        // Auto-rotation
        if (globeEl.current) {
            const controls = globeEl.current.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ altitude: 2.5 });
        }
    }, []);

    return (
        <div ref={containerRef} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden h-[500px] relative hover:cursor-move flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-zinc-400 font-bold text-sm">GLOBAL INFRASTRUCTURE</h3>
                <span className="text-[10px] text-zinc-600 font-mono">Real-time Latency Mesh</span>
            </div>

            {dimensions.width > 0 && (
                <Globe
                    width={dimensions.width}
                    height={dimensions.height}
                    ref={globeEl}
                    backgroundColor="rgba(0,0,0,0)"
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

                    // Points
                    pointsData={points}
                    pointAltitude={0.05}
                    pointColor="color"
                    pointRadius={0.5}
                    pointLabel="name"

                    // Arcs
                    arcsData={arcs}
                    arcColor="color"
                    arcDashLength={0.4}
                    arcDashGap={0.2}
                    arcDashInitialGap={1}
                    arcDashAnimateTime={2000}
                    arcStroke={0.5}

                    // Rings
                    ringsData={rings}
                    ringColor="color"
                    ringMaxRadius={5}
                    ringPropagationSpeed={2}
                    ringRepeatPeriod={1000}

                    // Atmosphere
                    atmosphereColor="#3b82f6"
                    atmosphereAltitude={0.15}
                />
            )}
        </div>
    );
}
