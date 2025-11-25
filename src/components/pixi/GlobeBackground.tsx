import { useRef, useEffect } from "react";
import { Graphics } from "pixi.js";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useGlobeStore } from "@/stores/footprints";
import { extend, useTick } from "@pixi/react";

export class GlobeBackgroundGraphics extends Graphics {
    constructor() {
        super();
    }

    public renderFrame(
        view: {scale: number},
        globeBackground: { centerX: number; centerY: number; initialRadius: number }
    ) {
        const { centerX, centerY, initialRadius } = globeBackground;
        const r = initialRadius * view.scale;
        this.clear();
        // basic globe circle
        this
            .circle(centerX, centerY, r)
            .stroke({ color: 0x000000, width: 1 });
    }
}

extend({ GlobeBackgroundGraphics });

export default function GlobeBackground(
    { layerRef }: { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    const globeBackground = useGlobeStore((state) => state.globeBackground);
    const backgroundRef = useRef<GlobeBackgroundGraphics | null>(null);
    useEffect(() => {
        const layer = layerRef.current;
        const node = backgroundRef.current;
        if (!layer || !node) return;

        layer.attach(node);
        node.zIndex = 0;
        return () => { layer.detach(node); };
    }, [layerRef]);

    
    const viewRef = useRef(useGlobeStore.getState().view);
    useEffect(() => useGlobeStore.subscribe(state => {
        viewRef.current = state.view;
    }), []);
    useTick(() => {
        if (backgroundRef.current) {
            backgroundRef.current.renderFrame(
                viewRef.current,
                globeBackground
            );
        }
    });
    return <pixiGlobeBackgroundGraphics ref={backgroundRef} />;
}