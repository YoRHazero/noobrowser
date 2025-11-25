import { Container, Graphics, Polygon, FederatedPointerEvent } from "pixi.js";
import { projectRaDec, toScreen } from "@/utils/projection";
import { useGlobeStore, type Footprint } from "@/stores/footprints"; 
import { useEffect, useRef } from "react";
import { extend, useTick, useApplication } from "@pixi/react";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useShallow } from "zustand/react/shallow";


const COLORS = {
    strokeNormal: 0x632652,
    hoveredFill: 0x333333,
    strokeSelected: 0xaa0000
};

class FootprintContainer extends Container {
    private footprints: Footprint[] = [];
    private graphicsMap: Map<string, Graphics> = new Map();

    public onFootprintHover?: (id: string | null, pos?: { x: number; y: number }) => void;
    public onFootprintSelect?: (id: string) => void;

    private hoveredFootprintId: string | null = null;
    private selectedFootprintId: string | null = null;

    constructor() {
        super();
        this.sortableChildren = true;
    }
    private bindEvents(graphics: Graphics, id: string) {
        graphics.on("pointerover", (event: FederatedPointerEvent) => {
            this.onFootprintHover?.(id, { x: event.global.x, y: event.global.y });
        });
        graphics.on("pointerout", () => {
            this.onFootprintHover?.(null);
        });
        graphics.on("pointermove", (event: FederatedPointerEvent) => {
            if (this.hoveredFootprintId === id) {
                this.onFootprintHover?.(id, { x: event.global.x, y: event.global.y });
            }
        });
        graphics.on("click", (event: FederatedPointerEvent) => {
            event.stopPropagation();
            this.onFootprintSelect?.(id);
        });
    }

    public setFootprints(footprints: Footprint[]) {
        this.footprints = footprints;
        const toRemove = new Set(this.graphicsMap.keys());

        footprints.forEach((fp) => {
            if (this.graphicsMap.has(fp.id)) {
                toRemove.delete(fp.id);
            } else {
                const graphics = new Graphics();
                graphics.label = fp.id;
                graphics.eventMode = "dynamic";
                this.bindEvents(graphics, fp.id);
                this.addChild(graphics);
                this.graphicsMap.set(fp.id, graphics);
            }
        });
        toRemove.forEach((id) => {
            const graphics = this.graphicsMap.get(id);
            if (graphics) {
                graphics.destroy();
                this.graphicsMap.delete(id);
            }
        });
    }

    public updateInteractiveState(hoveredId: string | null, selectedId: string | null) {
        this.hoveredFootprintId = hoveredId;
        this.selectedFootprintId = selectedId;
        this.sortChildren();
    }

    public renderFrame(
        view: { yawDeg: number; pitchDeg: number; scale: number },
        globeBackground: { centerX: number; centerY: number; initialRadius: number }
    ) {
        const { centerX, centerY, initialRadius } = globeBackground;

        this.footprints.forEach((fp) => {
            const graphics = this.graphicsMap.get(fp.id);
            if (!graphics) return;

            const projectedVertices = fp.vertices.map(
                (v) => (
                    projectRaDec(v.ra, v.dec, view.yawDeg, view.pitchDeg)
                )
            );
            if (!projectedVertices.every(v => v.visible)) {
                graphics.visible = false;
                return;
            }
            graphics.visible = true;

            const screenVertices = projectedVertices.map(
                (p) => toScreen(p, centerX, centerY, view.scale, initialRadius)
            );

            // draw footprint
            const flatPoints = screenVertices.flatMap(v => [v.x, v.y]);
            graphics.hitArea = new Polygon(flatPoints);
            graphics.clear();
            graphics.poly(flatPoints);

            // set style based on state
            const isSelected = this.selectedFootprintId === fp.id;
            const isHovered = this.hoveredFootprintId === fp.id;
            if (isSelected) {
                graphics
                    .stroke({ color: COLORS.strokeSelected, width: 2 })
                graphics.zIndex = 3;
            } else if (isHovered) {
                graphics
                    .fill({ color: COLORS.hoveredFill, alpha: 0.2 })
                    .stroke({ color: COLORS.strokeNormal, width: 1 });
                graphics.zIndex = 2;
            } else {
                graphics
                    .stroke({ color: COLORS.strokeNormal, width: 1 });
                graphics.zIndex = 1;
            }
        });
    }
}

extend({ FootprintContainer });

export default function FootprintManager({ layerRef }: { layerRef: React.RefObject<RenderLayerInstance | null> }) {
    const { app } = useApplication();
    const {
        footprints,
        globeBackground,
        hoveredFootprintId,
        selectedFootprintId,
        setHoveredFootprintId,
        setHoveredFootprintMousePosition,
        setSelectedFootprintId,
    } = useGlobeStore(
        useShallow((state) => ({
            footprints: state.footprints,
            globeBackground: state.globeBackground,
            hoveredFootprintId: state.hoveredFootprintId,
            selectedFootprintId: state.selectedFootprintId,
            setHoveredFootprintId: state.setHoveredFootprintId,
            setHoveredFootprintMousePosition: state.setHoveredFootprintMousePosition,
            setSelectedFootprintId: state.setSelectedFootprintId,
        }))
    );
    
    const footprintManagerRef = useRef<FootprintContainer | null>(null);

    useEffect(() => {
        const layer = layerRef.current;
        const node = footprintManagerRef.current;
        if (!layer || !node) return;
        layer.attach(node);
        return () => {
            layer.detach(node);
        };
    }, [layerRef, footprintManagerRef]);

    useEffect(() => {
        if (!footprintManagerRef.current) return;
        footprintManagerRef.current.setFootprints(footprints);
    }, [footprints]);
    useEffect(() => {
        if (!footprintManagerRef.current) return;

        footprintManagerRef.current.onFootprintHover = (id, pos) => {
            setHoveredFootprintId(id);
            setHoveredFootprintMousePosition(pos || null);
        };
        footprintManagerRef.current.onFootprintSelect = (id) => {
            const currentSelectedId = useGlobeStore.getState().selectedFootprintId;
            setSelectedFootprintId(currentSelectedId === id ? null : id);
        };
    }, [setHoveredFootprintId, setHoveredFootprintMousePosition, setSelectedFootprintId]);

    // sync the id states
    useEffect(() => {
        if (!footprintManagerRef.current) return;
        footprintManagerRef.current.updateInteractiveState(hoveredFootprintId, selectedFootprintId);
    }, [hoveredFootprintId, selectedFootprintId]);

    const viewRef = useRef(useGlobeStore.getState().view);
    useEffect(() => useGlobeStore.subscribe(state => {
        viewRef.current = state.view;
    }), []);

    useTick(() => {
        if (footprintManagerRef.current && app) {
            footprintManagerRef.current.renderFrame(
                viewRef.current,
                globeBackground
            );
        }
    });

    return (
        <pixiFootprintContainer ref={footprintManagerRef} />
    );
}