import { useCallback, useRef } from "react";
import { extend } from "@pixi/react";
import { Graphics, Container, RenderLayer, FederatedPointerEvent, Polygon } from "pixi.js";
import { useGlobeStore } from "@/stores/footprints";
import { projectRaDec, toScreen } from "@/utils/projection";

extend({
  Graphics,
  Container,
});



export default function FootprintGraphics({width, height}: {width: number, height: number}) {
    const footprints = useGlobeStore((state) => state.footprints);
    const view = useGlobeStore((state) => state.view);
    const hoveredFootprintId = useGlobeStore((state) => state.hoveredFootprintId);
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
    const setHoveredFootprintId = useGlobeStore((state) => state.setHoveredFootprintId);
    const setHoveredFootprintMousePosition = useGlobeStore(
        (state) => state.setHoveredFootprintMousePosition,
    );
    const setSelectedFootprintId = useGlobeStore((state) => state.setSelectedFootprintId);

    const colorSetup = {
        strokeNormal: 0x632652,
        hoveredFill: 0x333333,
        strokeSelected: 0xaa0000
    }

    const cx = width / 2;
    const cy = height / 2;
    const globeInitialRadius = Math.min(width, height) / 2 * 0.9;

    // Draw Globe
    const drawGlobe = useCallback((graphics: Graphics) => {
        graphics.clear();
        graphics
            .circle(cx, cy, globeInitialRadius * view.scale)
            .stroke({ color: 0x000000, width: 1 });
    }, [cx, cy, globeInitialRadius, view.scale]);

    const drawFootprint = useCallback((
        screenVertices: {x: number, y: number}[], 
        state: 'normal' | 'hovered' | 'selected') => {
        switch(state) {
            case 'normal':
                return (graphics: Graphics) => {
                    graphics.clear();
                    graphics
                        .poly(
                            screenVertices.map((v) => ({ x: v.x, y: v.y }))
                        )
                        .stroke({ color: colorSetup.strokeNormal, width: 1 });
                }
            case 'hovered':
                return (graphics: Graphics) => {
                    graphics.clear();
                    graphics
                        .poly(
                            screenVertices.map((v) => ({ x: v.x, y: v.y }))
                        )
                        .fill({ color: colorSetup.hoveredFill, alpha: 0.3 })
                        .stroke({ color: colorSetup.strokeNormal, width: 2 });
                }
            case 'selected':
                return (graphics: Graphics) => {
                    graphics.clear();
                    graphics
                        .poly(
                            screenVertices.map((v) => ({ x: v.x, y: v.y }))
                        )
                        .stroke({ color: colorSetup.strokeSelected, width: 2 });
                }
            default:
                throw new Error(`Unknown state: ${state}`);
        }
    }, [colorSetup]);

    // Event handling for footprint
    const onFootprintPointerOver = useCallback(
        (id: string, e: FederatedPointerEvent) => {
            setHoveredFootprintId(id);
            setHoveredFootprintMousePosition({ x: e.global.x, y: e.global.y });
        },
        [setHoveredFootprintId, setHoveredFootprintMousePosition]
    );

    const onFootprintPointerMove = useCallback(
        (id: string, e: FederatedPointerEvent) => {
            if (hoveredFootprintId === id) {
                setHoveredFootprintMousePosition({ x: e.global.x, y: e.global.y });
            }
        },
        [hoveredFootprintId, setHoveredFootprintMousePosition]
    );

    const onFootprintPointerOut = useCallback(() => {
        setHoveredFootprintId(null);
        setHoveredFootprintMousePosition(null);
        }, 
        [setHoveredFootprintId, setHoveredFootprintMousePosition]
    );

    return (
        <pixiContainer 
            width={width} 
            height={height}
        >
            <pixiGraphics draw={drawGlobe} />
            {
                footprints.map((fp) => {
                    const projectedVertices = fp.vertices.map(
                        (v) => (
                            projectRaDec(v.ra, v.dec, view.yawDeg, view.pitchDeg)
                        )
                    )
                    // Skip footprints whose vertices are not fully visible
                    if (!projectedVertices.every(v => v.visible)) {
                        return;
                    }

                    const screenVertices = projectedVertices.map(
                        (p) => toScreen(p, cx, cy, view.scale, globeInitialRadius)
                    );

                    const state = 
                        fp.id === selectedFootprintId ? 'selected' :
                        fp.id === hoveredFootprintId ? 'hovered' :
                        'normal';
                    
                    const flat = screenVertices.flatMap(v => [v.x, v.y]);
                    const hitArea = new Polygon(flat);

                    return (
                        <pixiGraphics 
                            key={fp.id} 
                            draw={drawFootprint(screenVertices, state)}
                            hitArea={hitArea}
                            onPointerOver={(event: FederatedPointerEvent) => onFootprintPointerOver(fp.id, event)}
                            onPointerMove={(event: FederatedPointerEvent) => onFootprintPointerMove(fp.id, event)}
                            onPointerOut={onFootprintPointerOut}
                            onClick={() => setSelectedFootprintId(
                                fp.id === selectedFootprintId ? null : fp.id
                            )}
                            eventMode="dynamic"
                        />
                    )
                })
            }
        </pixiContainer>
    )
}


