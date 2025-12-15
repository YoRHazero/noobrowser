import { useMemo, useRef } from 'react';
import { Group } from 'three'; // 显式引入 Three 类型
import { useFrame, type ThreeEvent } from '@react-three/fiber'; // R3F 工具
import { Circle, Line } from '@react-three/drei'; // Drei 几何体组件
import { useShallow } from 'zustand/react/shallow';

// 引入你的 Store 和 类型
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

// --- 配置常量 ---
// 这些数值代表屏幕像素(Screen Pixels)，配合下面的 scale 逻辑实现固定大小
const RADIUS_NORMAL = 4;
const RADIUS_MAIN = 6;
const COLOR_BORDER = '#000000';
const Z_INDEX_NORMAL = 1.0;
const Z_INDEX_MAIN = 1.1; // 确保 Main 稍微高一点，盖住普通的

/**
 * 单个标记点组件
 * 负责：渲染、固定屏幕大小、处理自身的右键点击
 */
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
    // 使用 useRef 获取 Three.js 的 Group 实例，以便在 useFrame 中修改 scale
    const groupRef = useRef<Group>(null);

    // --- 核心逻辑：保持屏幕像素大小固定 ---
    // 每一帧都会执行。当相机缩放(zoom)变化时，反向调整物体的 scale。
    useFrame(({ camera }) => {
        if (!groupRef.current) return;
        
        // OrthographicCamera 的 zoom 属性决定了放大倍率
        // 为了让圆圈看起来大小不变，相机放大多少倍，物体就要缩小多少倍
        const scale = 1 / camera.zoom;
        
        groupRef.current.scale.set(scale, scale, 1);
    });

    // --- 交互逻辑：处理 Marker 上的右键点击 ---
    const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
        // [重要] 阻止事件冒泡！
        // 防止事件穿透到下层的 ImageLayer，导致触发“移动 MainSource”或“新增点”的逻辑
        e.stopPropagation();
        
        // 阻止浏览器默认菜单
        e.nativeEvent.preventDefault();

        const isModPressed = e.nativeEvent.metaKey || e.nativeEvent.ctrlKey;

        if (isModPressed) {
            // Mod + 右键：删除该点
            removeSource(source.id);
        } else {
            // 普通右键：设为 Main
            setMain(source.id);
        }
    };

    // 根据是否是 Main 决定半径
    const currentRadius = isMain ? RADIUS_MAIN : RADIUS_NORMAL;

    return (
        <group
            ref={groupRef}
            position={[source.x, -source.y, isMain ? Z_INDEX_MAIN : Z_INDEX_NORMAL]}
            onContextMenu={handleContextMenu}
        >
            {/* 1. 黑色边框 (画一个半径+1的黑圆) */}
            <Circle args={[currentRadius + 1, 32]} position={[0, 0, -0.001]}>
                <meshBasicMaterial color={COLOR_BORDER} />
            </Circle>

            {/* 2. 颜色填充圆 (画在上方) */}
            <Circle args={[currentRadius, 32]}>
                <meshBasicMaterial color={source.color} />
            </Circle>
        </group>
    );
};

/**
 * 标记层主组件
 * 负责：连接 Store，批量渲染 Marker
 */
export function TraceMarkersLayer() {
    // 使用 useShallow 避免不必要的重渲染
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