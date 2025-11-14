import { useEffect, useRef } from "react";
import { extend } from "@pixi/react";
import { Graphics } from "pixi.js";

import type { RenderLayerInstance } from "@/types/pixi-react";
import { useGlobeStore } from "@/stores/footprints";
import { projectRaDec, toScreen } from "@/utils/projection";

extend({ Graphics });

export default function GlobeGrid(
    { layerRef }: { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    const gridRef = useRef<Graphics | null>(null);
    useEffect(() => {
        const layer = layerRef.current;
        const node = gridRef.current;
        if (!layer || !node) return;

        layer.attach(node);
        return () => { layer.detach(node); };
    }, [layerRef]);

    const view = useGlobeStore((state) => state.view);
    const globeBackground = useGlobeStore((state) => state.globeBackground);
    const globeGrid = useGlobeStore((state) => state.globeGrid);
    const { centerX, centerY, initialRadius } = globeBackground;
    const { showGrid, meridianStep, parallelStep } = globeGrid;
    const r = initialRadius * view.scale;

    const sampleMeridian = (raDeg: number) => {
        const segments: Array<Array<{ x: number; y: number }>> = [];
        let currentSegment: Array<{ x: number; y: number }> = [];
        for (let decDeg = -90; decDeg <= 90; decDeg += meridianStep) {
            const projectedSegment = projectRaDec(raDeg, decDeg, view.yawDeg, view.pitchDeg);
            if (projectedSegment.visible) {
                currentSegment.push(toScreen(projectedSegment, centerX, centerY, view.scale, initialRadius));
            } else if (currentSegment.length > 1) {
                segments.push(currentSegment);
                currentSegment = [];
            } else {
                currentSegment = [];
            }
        }
        if (currentSegment.length > 1) {
            segments.push(currentSegment);
        }
        return segments;
    }
}