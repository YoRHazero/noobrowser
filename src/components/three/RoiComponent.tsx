import { memo, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PlaneGeometry, OrthographicCamera } from "three";
import { useGrismStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";
import { useDrag } from "@use-gesture/react";

const RoiIndicator = memo(function RoiIndicator({
    x,
    y,
    width,
    height,
    imgWidth,
    imgHeight,
    strokeColor = "#ff0000",
    strokeWidth = 4,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    imgWidth: number;
    imgHeight: number;
    strokeColor?: string;
    strokeWidth?: number;
}) {

    const worldX = -imgWidth / 2 + x + width / 2;
    const worldY = imgHeight / 2 - y - height / 2;
    
    return (
        <mesh position={[worldX, worldY, 1]} >
            <lineSegments>
                <edgesGeometry args={[new PlaneGeometry(width, height)]} />
                <lineBasicMaterial color={strokeColor} linewidth={strokeWidth}/>
            </lineSegments>
        </mesh>
    );
})


function RoiCameraRig({
    x,
    y,
    width,
    height,
    imgWidth,
    imgHeight,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    imgWidth: number;
    imgHeight: number;
}) {
    const { camera } = useThree();

    useFrame(() => {
        const worldX = -imgWidth / 2 + x + width / 2;
        const worldY = imgHeight / 2 - y - height / 2;
        camera.position.set(worldX, worldY, 10);
        camera.updateProjectionMatrix();
    });
    
    return null;
}

function CollapseRegionIndicator({
    imgWidth,
    imgHeight,
}: {
    imgWidth: number;
    imgHeight: number;
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
        
        const width = waveMax - waveMin;
        const height = spatialMax - spatialMin;
        
        if (width <= 0 || height <= 0) return null;

        const localCenterX = (waveMin + waveMax) / 2;
        const localCenterY = (spatialMin + spatialMax) / 2;

        const absolutePixelX = roiState.x + localCenterX;
        const absolutePixelY = roiState.y + localCenterY;
        const worldX = -imgWidth / 2 + absolutePixelX;
        const worldY = imgHeight / 2 - absolutePixelY;

        return { worldX, worldY, width, height };
    }, [roiState, roiCollapseWindow, imgWidth, imgHeight]);

    const handleDrag = (delta: [number, number], mode: "move" | "top" | "bottom" | "left" | "right", isLast: boolean) => {
        const [dx, dy] = delta;

        // Calculate (Pixel to World) ratio
        const orthoCam = camera as OrthographicCamera;
        const visibleWorldHeight = (orthoCam.top - orthoCam.bottom) / orthoCam.zoom;
        const pixelToWorldRatio = visibleWorldHeight / size.height;
        
        const dataDeltaX = dx * pixelToWorldRatio;
        const dataDeltaY = dy * pixelToWorldRatio;

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
        if (hoveredPart === "move") document.body.style.cursor = "grab";
        else if (hoveredPart === "ns-edge") document.body.style.cursor = "ns-resize";
        else if (hoveredPart === "ew-edge") document.body.style.cursor = "ew-resize";
        else document.body.style.cursor = "auto";
        return () => {
            document.body.style.cursor = "auto";
        };
    }, [hoveredPart]);

    if (!geometryData) return null;

    const hitAreaThickness = 6;

    return (
        <group position={[geometryData.worldX, geometryData.worldY, 2]}>
            {/* Visualization of collapse region */}
            <mesh> 
                <lineSegments>
                    <edgesGeometry args={[new PlaneGeometry(geometryData.width, geometryData.height)]} />
                    <lineBasicMaterial color={0x00ffff} linewidth={2} />
                </lineSegments>
            </mesh>

            {/* Interaction hit areas */}
            {/* Center Move Area */}
            <mesh
                {...bindMove()}
                onPointerOver={() => setHoveredPart("move")}
                onPointerOut={() => setHoveredPart(null)}
                visible={false}
            >
                <planeGeometry args={[geometryData.width, Math.max(0, geometryData.height - hitAreaThickness * 2)]} />
                <meshBasicMaterial color="red" />
            </mesh>
            {/* Top Edge */}
            <mesh
                {...bindTop()}
                position={[0, geometryData.height / 2, 0]}
                onPointerOver={() => setHoveredPart("ns-edge")}
                onPointerOut={() => setHoveredPart(null)}
                visible={false}
            >
                <planeGeometry args={[Math.max(0, geometryData.width - hitAreaThickness), hitAreaThickness]} />
                <meshBasicMaterial color="green" />
            </mesh>

            {/* Bottom Edge */}
            <mesh
                {...bindBottom()}
                position={[0, -geometryData.height / 2, 0]}
                onPointerOver={() => setHoveredPart("ns-edge")}
                onPointerOut={() => setHoveredPart(null)}
                visible={false}
            >
                <planeGeometry args={[Math.max(0, geometryData.width - hitAreaThickness), hitAreaThickness]} />
                <meshBasicMaterial color="blue" />
            </mesh>

            {/* Left Edge */}
            <mesh
                {...bindLeft()}
                position={[-geometryData.width / 2, 0, 0]}
                onPointerOver={() => setHoveredPart("ew-edge")}
                onPointerOut={() => setHoveredPart(null)}
                visible={false}
            >
                <planeGeometry args={[hitAreaThickness, Math.max(0, geometryData.height - hitAreaThickness)]} />
                <meshBasicMaterial color="yellow" />
            </mesh>

            {/* Right Edge */}
            <mesh
                {...bindRight()}
                position={[geometryData.width / 2, 0, 0]}
                onPointerOver={() => setHoveredPart("ew-edge")}
                onPointerOut={() => setHoveredPart(null)}
                visible={false}
            >
                <planeGeometry args={[hitAreaThickness, Math.max(0, geometryData.height - hitAreaThickness)]} />
                <meshBasicMaterial color="purple" />
            </mesh>
        </group>
    );
}

export { RoiIndicator, RoiCameraRig, CollapseRegionIndicator };