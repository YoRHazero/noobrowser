import { useRef, useEffect, useCallback } from "react";
import { Graphics } from "pixi.js";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useGlobeStore } from "@/stores/footprints";
import { extend } from "@pixi/react";
extend({ Graphics });

export default function GlobeBackground(
    { layerRef }: { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    const backgroundRef = useRef<Graphics | null>(null);
    useEffect(() => {
        const layer = layerRef.current;
        const node = backgroundRef.current;
        if (!layer || !node) return;

        layer.attach(node);
        return () => { layer.detach(node); };
    }, [layerRef]);

    const view = useGlobeStore((state) => state.view);
    const globeBackground = useGlobeStore((state) => state.globeBackground);
    const { centerX, centerY, initialRadius } = globeBackground;

    const drawGlobe = useCallback((graphics: Graphics) => {
            const r = initialRadius * view.scale;
            graphics.clear();
            // basic globe circle
            graphics
                .circle(centerX, centerY, r)
                .stroke({ color: 0x000000, width: 1 });
    }, [centerX, centerY, initialRadius, view.scale]);
    return <pixiGraphics ref={backgroundRef} draw={drawGlobe} />;

}