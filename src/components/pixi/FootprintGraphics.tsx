import { useCallback, useMemo, useState } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container } from "pixi.js";
import { useGlobeStore } from "@/stores/footprints";
import { projectRaDec, toScreen } from "@/utils/projection";

extend({
  Graphics,
  Container,
});

export default function FootprintGraphics({width, height}: {width: number, height: number}) {
    const footprints = useGlobeStore((state) => state.footprints);
    const view = useGlobeStore((state) => state.view);

    const cx = width / 2;
    const cy = height / 2;
    const globeRadius = Math.min(width, height) / 2 * 0.9;

    const screenPolygons = useMemo(() => {
        return footprints.map(
            (fp) => {
                const projectedVertices = fp.vertices.map(
                    (v) => (
                        projectRaDec(v.ra, v.dec, view.yawDeg, view.pitchDeg)
                    )
                )
                // Now we filter out footprints which contain invisible vertices
                if (projectedVertices.every(v => v.visible)) {
                    return projectedVertices.map(
                        (p) => toScreen(p, cx, cy, view.scale, globeRadius)
                    );
                }
            }
        )
    }, [footprints, view, cx, cy, globeRadius]);

    // Grid Lines

    const draw = useCallback(
        (graphics: Graphics) => {
            graphics.clear();

            graphics
                .circle(cx, cy, globeRadius * view.scale)
                .stroke({ color: 0x000000, width: 1 })
            for (const polygon of screenPolygons) {
                if (!polygon) continue;
                graphics
                    .poly(
                        polygon.map((v) => ({ x: v.x, y: v.y }))
                    )
                    .stroke({ color: 0x123454, alpha: 0.3 })
            }
        },
        [screenPolygons]
    )

    return (
        <pixiContainer 
            width={width} 
            height={height}
            eventMode="static"
        >
            <pixiGraphics draw={draw} />
        </pixiContainer>
    )
}
