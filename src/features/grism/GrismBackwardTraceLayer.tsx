import { useMemo, useRef } from 'react';
import { Group } from 'three';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Circle, Line } from '@react-three/drei';
import { useShallow } from 'zustand/react/shallow';

import { useSourcesStore } from '@/stores/sources';
import { useDispersionTrace } from '@/hook/connection-hook';
import type { TraceSource } from '@/stores/stores-types';

export default function GrismBackwardTraceLayer() {
    return (
        <group>
            <TraceLinesLayer />
            <TraceMarkersLayer />
        </group>
    )
}

/* -------------------------------------------------------------------------- */
/*                             Constant for Marker                            */
/* -------------------------------------------------------------------------- */
const RADIUS_NORMAL = 4;
const RADIUS_MAIN = 6;
const COLOR_BORDER = '#000000';
const Z_INDEX_NORMAL = 1.0;
const Z_INDEX_MAIN = 1.1;

const TraceMarker = ({
    source,
    isMain,
    removeSource,
    setMain
}: {
    source: TraceSource;
    isMain: boolean;
    removeSource: (id: string) => void;
    setMain: (id: string | null) => void;
}) => {
    const groupRef = useRef<Group>(null);

    useFrame(({ camera }) => {
        if (!groupRef.current) return;
        const scale = 1 / camera.zoom;
        groupRef.current.scale.set(scale, scale, 1);
    });

    const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        e.nativeEvent.preventDefault();

        const isModPressed = e.nativeEvent.metaKey || e.nativeEvent.ctrlKey;

        if (isModPressed) {
            removeSource(source.id);
        } else {
            setMain(source.id);
        }
    };
    const currentRadius = isMain ? RADIUS_MAIN : RADIUS_NORMAL;

    return (
        <group
            ref={groupRef}
            position={[source.x, -source.y, isMain ? Z_INDEX_MAIN : Z_INDEX_NORMAL]}
            onContextMenu={handleContextMenu}
        >
            {/* edge border circle */}
            <Circle args={[currentRadius + 1, 32]} position={[0, 0, -0.001]}>
                <meshBasicMaterial color={COLOR_BORDER} />
            </Circle>
            {/* fill color circle */}
            <Circle args={[currentRadius, 32]}>
                <meshBasicMaterial color={source.color} />
            </Circle>
        </group>
    );
};

export function TraceMarkersLayer() {
    const {
        traceMode,
        traceSources,
        mainTraceSourceId,
        setMainTraceSource,
        removeTraceSource
    } = useSourcesStore(
        useShallow((state) => ({
            traceMode: state.traceMode,
            traceSources: state.traceSources,
            mainTraceSourceId: state.mainTraceSourceId,
            setMainTraceSource: state.setMainTraceSource,
            removeTraceSource: state.removeTraceSource,
        }))
    );

    if (!traceMode) return null;

    return (
        <>
            {traceSources.map((source) => (
                <TraceMarker
                    key={source.id}
                    source={source}
                    isMain={source.id === mainTraceSourceId}
                    removeSource={removeTraceSource}
                    setMain={setMainTraceSource}
                />
            ))}
        </>
    );
}
/* -------------------------------------------------------------------------- */
/*                           Constant for Trace Line                          */
/* -------------------------------------------------------------------------- */
const LINE_WIDTH = 1.5;
const MAIN_LINE_WIDTH = 2.5;
const LINE_Z_INDEX = 0.9;
const TraceSingleLine = ({
    source,
    isMain,
    currentBasename,
    enabled = false,
}: {
    source: TraceSource;
    isMain: boolean;
    currentBasename?: string;
    enabled?: boolean;
}) => {
    const { data: traceData, isSuccess } = useDispersionTrace({
        x: source.x,
        y: source.y,
        basename: currentBasename,
        enabled: enabled,   
    });
    const zIndex = isMain ? LINE_Z_INDEX + 0.01 : LINE_Z_INDEX;
    const points = useMemo(() => {
        if (!isSuccess || !traceData) return;

        const xs = traceData.trace_xs;
        const ys = traceData.trace_ys;
        if (xs.length !== ys.length) return;
        const length = xs.length;

        const pts: [number, number, number][] = new Array(length);
        for (let i = 0; i < length; i++) {
            pts[i] = [xs[i], -ys[i], zIndex];
        }
        return pts;
    }, [isSuccess, traceData, isMain]);
    if (!points || points.length === 0) return null;

    return (
        <Line
            points={points}
            color={source.color}
            lineWidth={isMain ? MAIN_LINE_WIDTH : LINE_WIDTH}
            transparent
            opacity={0.8}
            toneMapped={false}
        />
    );
}
export function TraceLinesLayer() {
    const {
        traceMode,
        traceSources,
        mainTraceSourceId,
    } = useSourcesStore(
        useShallow((state) => ({
            traceMode: state.traceMode,
            traceSources: state.traceSources,
            mainTraceSourceId: state.mainTraceSourceId,
        }))
    );
    if (!traceMode) return null;
    
    return (
        <group>
            {traceSources.map((source) => (
                <TraceSingleLine
                    key={source.id}
                    source={source}
                    isMain={source.id === mainTraceSourceId}
                    enabled={traceMode}
                />
            ))}
        </group>
    );

}