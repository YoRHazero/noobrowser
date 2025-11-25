import { Graphics } from "pixi.js";
import { extend, useTick, useApplication } from "@pixi/react";
import { projectRaDec, toScreen } from "@/utils/projection";
import { useRef, useEffect } from "react";
import { useGlobeStore } from "@/stores/footprints";
import type { RenderLayerInstance } from "@/types/pixi-react";


const SEGMENT_RESOLUTION = 2;

export class GraticuleGraphics extends Graphics {
    private currentRAStep: number = -1;
    private currentDecStep: number = -1;
    private gridLines: {ra: number, dec: number}[][] = [];

    constructor() {
        super();
    }

    private getRAStep(scale: number): number {
        if (scale < 1.5) return 45;
        if (scale < 4) return 30;
        if (scale < 10) return 20;
        if (scale < 50) return 10;
        if (scale < 150) return 2;
        return 1;
    }
    private getDecStep(scale: number): number {
        if (scale < 1.5) return 30;
        if (scale < 4) return 15;
        if (scale < 10) return 10;
        if (scale < 50) return 5;
        if (scale < 150) return 1;
        return 0.5;
    }

    private regenerateGridLines(raStep: number, decStep: number) {
        this.gridLines = [];

        // Right Ascension lines
        for (let ra = 0; ra < 360; ra += raStep) {
            const line: {ra: number, dec: number}[] = [];
            for (let dec = -90; dec <= 90; dec += SEGMENT_RESOLUTION) {
                line.push({ ra, dec });
            }
            this.gridLines.push(line);
        }

        // Declination lines
        for (let dec = -90; dec <= 90; dec += decStep) {
            if (Math.abs(dec) === 90) continue; // Skip poles
            const line: {ra: number, dec: number}[] = [];
            for (let ra = 0; ra < 360; ra += SEGMENT_RESOLUTION) {
                line.push({ ra, dec });
            }
            this.gridLines.push(line);
        }

        this.currentRAStep = raStep;
        this.currentDecStep = decStep;
    }

    public renderFrame(
        view: { yawDeg: number; pitchDeg: number; scale: number },
        globeBackground: { centerX: number; centerY: number; initialRadius: number }
    ) {
        const { centerX, centerY, initialRadius } = globeBackground;
        const newRAStep = this.getRAStep(view.scale);
        const newDecStep = this.getDecStep(view.scale);

        if (newRAStep !== this.currentRAStep || newDecStep !== this.currentDecStep) {
            this.regenerateGridLines(newRAStep, newDecStep);
        }

        this.clear();
        
        for (const line of this.gridLines) {
            let isDrawing = false;

            for (let i = 0; i < line.length; i++) {
                const point = line[i];

                const projected = projectRaDec(point.ra, point.dec, view.yawDeg, view.pitchDeg);

                if (!projected.visible) {
                    isDrawing = false;
                    continue;
                }

                const screenPos = toScreen(projected, centerX, centerY, view.scale, initialRadius);

                if (!isDrawing) {
                    this.moveTo(screenPos.x, screenPos.y);
                    isDrawing = true;
                } else {
                    this.lineTo(screenPos.x, screenPos.y);
                }
            }
        }
        this.stroke({ color: 0x222222, width: 1, alpha: 0.5 });
    }
}
extend({ GraticuleGraphics });

export default function GlobeGrid({ layerRef }: { layerRef: React.RefObject<RenderLayerInstance | null> }) {
    const globeBackground = useGlobeStore((state) => state.globeBackground);

    const graphicsRef = useRef<GraticuleGraphics | null>(null);

    useEffect(() => {
        const layer = layerRef.current;
        const node = graphicsRef.current;
        if (!layer || !node) return;
        layer.attach(node);
        node.zIndex = 1;
        return () => {
            layer.detach(node);
        };
    }, [layerRef, graphicsRef]);

    const viewRef = useRef(useGlobeStore.getState().view);
    useEffect(() => useGlobeStore.subscribe(state => {
        viewRef.current = state.view;
    }), []);
    useTick(() => {
        if (graphicsRef.current) {
            graphicsRef.current.renderFrame(viewRef.current, globeBackground);
        }
    });
    return <pixiGraticuleGraphics ref={graphicsRef} />;
}