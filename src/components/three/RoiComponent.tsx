import { memo, useMemo, useState, useEffect, useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "three";
import  { Line } from "@react-three/drei"
import { useGrismStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";
import { useDrag } from "@use-gesture/react";

const RoiIndicator = memo(function RoiIndicator({
    x,
    y,
    width,
    height,
    strokeColor = "#ff0000",
    strokeWidth = 2,
    dashed = false,
}: {
    x: number; // top-left corner x in ref coordinates
    y: number; // top-left corner y in ref coordinates
    width: number; // width of the ROI
    height: number; // height of the ROI
    strokeColor?: string;
    strokeWidth?: number; // pixels in screen space
    dashed?: boolean;
}) {
    const groupX = x;
    const groupY = -y;
    const points = useMemo(() => {
        return [
            [0, 0, 0], // top-left
            [width, 0, 0], // top-right
            [width, -height, 0], // bottom-right
            [0, -height, 0], // bottom-left
            [0, 0, 0], // back to top-left
        ] as [number, number, number][];
    }, [width, height]);

    return (
        <group position={[groupX, groupY, 10]}>
            <Line
                points={points}
                color={strokeColor}
                lineWidth={strokeWidth}
                dashed={dashed}
                dashSize={10}
                gapSize={5}
            />
        </group>
    );
})


function RoiCameraRig({
    x,
    y,
    width,
    height,
    dx=0,
    dy=0,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    dx?: number;
    dy?: number;
}) {
    const { camera } = useThree() as { camera: OrthographicCamera };

    useLayoutEffect(() => {
        const centerX = dx + x + width / 2;
        const centerY = - (dy + y + height / 2);
        camera.position.set(centerX, centerY, 100);

        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
    }, [x, y, width, height, dx, dy, camera]);
    
    return null;
}

function CollapseRegionIndicator({
    dx=0,
    dy=0,
    lineColor="#00aaaa",
    lineWidth=2,
    dashed=false,
}: {
    dx?: number; // if used, make sure this is consistent with RoiCameraRig
    dy?: number; // if used, make sure this is consistent with RoiCameraRig
    lineColor?: string;
    lineWidth?: number;
    dashed?: boolean;
}) {
    const { camera, size } = useThree();
    const { roiState, roiCollapseWindow, setRoiCollapseWindow } = useGrismStore(
        useShallow((state) => ({
            roiState: state.roiState,
            roiCollapseWindow: state.roiCollapseWindow,
            setRoiCollapseWindow: state.setRoiCollapseWindow,
        }))
    );

    const geometryData = useMemo(() => {
        const { waveMin, waveMax, spatialMin, spatialMax } = roiCollapseWindow;
        
        const rectWidth = waveMax - waveMin;
        const rectHeight = spatialMax - spatialMin;

        if (rectWidth <= 0 || rectHeight <= 0) return null;

        const groupX = dx + roiState.x + waveMin; // top-left corner x in ref coordinates
        const groupY = - (dy + roiState.y + spatialMin); // top-left corner y in ref coordinates
        

        return { groupX, groupY, rectWidth, rectHeight };
    }, [roiState.x, roiState.y, roiCollapseWindow, dx, dy]);
    const points = useMemo(() => {
        if (!geometryData) return [] as [number, number, number][];
        return [
            [0, 0, 0], // top-left
            [geometryData.rectWidth, 0, 0], // top-right
            [geometryData.rectWidth, -geometryData.rectHeight, 0], // bottom-right
            [0, -geometryData.rectHeight, 0], // bottom-left
            [0, 0, 0], // back to top-left
        ] as [number, number, number][];
    }, [geometryData?.rectWidth, geometryData?.rectHeight]);

    const [isDragging, setIsDragging] = useState(false);
    const handleDrag = (delta: [number, number], mode: "move" | "top" | "bottom" | "left" | "right", isLast: boolean) => {
        const [dragDx, dragDy] = delta;
        setIsDragging(!isLast);

        // Calculate (Pixel to World) ratio
        const orthoCam = camera as OrthographicCamera;
        const visibleWorldHeight = Math.abs(orthoCam.top - orthoCam.bottom) / orthoCam.zoom;
        const visibleWorldWidth = Math.abs(orthoCam.right - orthoCam.left) / orthoCam.zoom;
        const pixelToWorldRatioX = visibleWorldWidth / size.width;
        const pixelToWorldRatioY = visibleWorldHeight / size.height;
        
        const dataDeltaX = dragDx * pixelToWorldRatioX;
        const dataDeltaY = dragDy * pixelToWorldRatioY;
        const { spatialMax, spatialMin, waveMax, waveMin } = roiCollapseWindow;
        const roiHeight = roiState.height;
        const roiWidth = roiState.width;
        const minGap = 5;

        let newSpatialMin = spatialMin;
        let newSpatialMax = spatialMax;
        let newWaveMin = waveMin;
        let newWaveMax = waveMax;
        
        /* --------------------------------- Y axis --------------------------------- */
        if (mode === "move" || mode === "top" || mode === "bottom") {
            if (mode === "move") {
                newSpatialMin += dataDeltaY;
                newSpatialMax += dataDeltaY;

                if (newSpatialMin < 0) {
                    const diff = -newSpatialMin;
                    newSpatialMin += diff;
                    newSpatialMax += diff;
                }
                if (newSpatialMax >= roiHeight) {
                    const diff = newSpatialMax - roiHeight;
                    newSpatialMin -= diff;
                    newSpatialMax -= diff;
                }
            } else if (mode === "top") {
                newSpatialMin += dataDeltaY;
                if (newSpatialMin < 0) newSpatialMin = 0;
                if (newSpatialMax - newSpatialMin < minGap) newSpatialMin = newSpatialMax - minGap;
            } else if (mode === "bottom") {
                newSpatialMax += dataDeltaY;
                if (newSpatialMax > roiHeight) newSpatialMax = roiHeight;
                if (newSpatialMax - newSpatialMin < minGap) newSpatialMax = newSpatialMin + minGap;
            }
        }
        /* --------------------------------- X axis --------------------------------- */
        if (mode === "move" || mode === "left" || mode === "right") {
            if (mode === "move") {
                newWaveMin += dataDeltaX;
                newWaveMax += dataDeltaX;
                if (newWaveMin < 0) {
                    const diff = -newWaveMin;
                    newWaveMin += diff;
                    newWaveMax += diff;
                }
                if (newWaveMax >= roiWidth) {
                    const diff = newWaveMax - roiWidth;
                    newWaveMin -= diff;
                    newWaveMax -= diff;
                }
            } else if (mode === "left") {
                newWaveMin += dataDeltaX;
                if (newWaveMin < 0) newWaveMin = 0;
                if (newWaveMax - newWaveMin < minGap) newWaveMin = newWaveMax - minGap;
            } else if (mode === "right") {
                newWaveMax += dataDeltaX;
                if (newWaveMax > roiWidth) newWaveMax = roiWidth;
                if (newWaveMax - newWaveMin < minGap) newWaveMax = newWaveMin + minGap;
            }
        }
        if (isLast) {
            newSpatialMin = Math.round(newSpatialMin);
            newSpatialMax = Math.round(newSpatialMax);
            newWaveMin = Math.round(newWaveMin);
            newWaveMax = Math.round(newWaveMax);
        }
        setRoiCollapseWindow({
            spatialMin: newSpatialMin,
            spatialMax: newSpatialMax,
            waveMin: newWaveMin,
            waveMax: newWaveMax,
        });
    }
    const bindMove = useDrag(({delta, last, event}) => {
        event.stopPropagation();
        handleDrag(delta, "move", last);
    });

    const bindTop = useDrag(({delta, last, event}) => {
        event.stopPropagation();
        handleDrag(delta, "top", last);
    });

    const bindBottom = useDrag(({delta, last, event}) => {
        event.stopPropagation();
        handleDrag(delta, "bottom", last);
    });

    const bindLeft = useDrag(({delta, last, event}) => {
        event.stopPropagation();
        handleDrag(delta, "left", last);
    });

    const bindRight = useDrag(({delta, last, event}) => {
        event.stopPropagation();
        handleDrag(delta, "right", last);
    });

    const [hoveredPart, setHoveredPart] = useState<null | "move" | "ns-edge" | "ew-edge">(null);
    
    useEffect(() => {
        if (isDragging) return;
        if (hoveredPart === "move") document.body.style.cursor = "grab";
        else if (hoveredPart === "ns-edge") document.body.style.cursor = "ns-resize";
        else if (hoveredPart === "ew-edge") document.body.style.cursor = "ew-resize";
        else document.body.style.cursor = "auto";
        return () => {
            document.body.style.cursor = "auto";
        };
    }, [hoveredPart]);

    if (!geometryData) return null;

    const hitAreaThickness = 4;


    return (
        <group position={[geometryData.groupX, geometryData.groupY, 2]}>
            {/* Visualization of collapse region */}
            <mesh> 
                <Line
                    points={points}
                    color={lineColor}
                    lineWidth={lineWidth}
                    dashed={dashed}
                    dashSize={10}
                    gapSize={5}
                    depthTest={false}
                    renderOrder={999}
                    raycast={() => null} // Disable raycast on the line itself
                />
            </mesh>

            {/* Interaction hit areas */}
            {/* Center Move Area */}
            <mesh
                {...bindMove()}
                position={[geometryData.rectWidth / 2, -geometryData.rectHeight / 2, 0]}
                onPointerOver={() => setHoveredPart("move")}
                onPointerOut={() => setHoveredPart(null)}
            >
                <planeGeometry args={[
                    Math.max(0, geometryData.rectWidth - hitAreaThickness), 
                    Math.max(0, geometryData.rectHeight - hitAreaThickness)
                    ]} />
                <meshBasicMaterial opacity={0} transparent depthWrite={false} />
            </mesh>
            {/* Top Edge */}
            <mesh
                {...bindTop()}
                position={[geometryData.rectWidth / 2, 0, 0.01]}
                onPointerOver={() => setHoveredPart("ns-edge")}
                onPointerOut={() => setHoveredPart(null)}
            >
                <planeGeometry args={[Math.max(0, geometryData.rectWidth - hitAreaThickness), hitAreaThickness]} />
                <meshBasicMaterial opacity={0} transparent depthWrite={false} />
            </mesh>

            {/* Bottom Edge */}
            <mesh
                {...bindBottom()}
                position={[geometryData.rectWidth / 2, -geometryData.rectHeight, 0.01]}
                onPointerOver={() => setHoveredPart("ns-edge")}
                onPointerOut={() => setHoveredPart(null)}
            >
                <planeGeometry args={[Math.max(0, geometryData.rectWidth - hitAreaThickness), hitAreaThickness]} />
                <meshBasicMaterial opacity={0} transparent depthWrite={false} />
            </mesh>

            {/* Left Edge */}
            <mesh
                {...bindLeft()}
                position={[0, -geometryData.rectHeight / 2, 0.01]}
                onPointerOver={() => setHoveredPart("ew-edge")}
                onPointerOut={() => setHoveredPart(null)}
            >
                <planeGeometry args={[hitAreaThickness, Math.max(0, geometryData.rectHeight - hitAreaThickness)]} />
                <meshBasicMaterial opacity={0} transparent depthWrite={false} />
            </mesh>

            {/* Right Edge */}
            <mesh
                {...bindRight()}
                position={[geometryData.rectWidth, -geometryData.rectHeight / 2, 0.01]}
                onPointerOver={() => setHoveredPart("ew-edge")}
                onPointerOut={() => setHoveredPart(null)}
            >
                <planeGeometry args={[hitAreaThickness, Math.max(0, geometryData.rectHeight - hitAreaThickness)]} />
                <meshBasicMaterial opacity={0} transparent depthWrite={false} />
            </mesh>
        </group>
    );
}

export { RoiIndicator, RoiCameraRig, CollapseRegionIndicator };