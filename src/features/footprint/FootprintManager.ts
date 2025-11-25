import { Container, Graphics, Polygon, FederatedPointerEvent } from "pixi.js";
import { projectRaDec, toScreen } from "@/utils/projection";
import type { Footprint } from "@/stores/footprints"; 

const COLORS = {
    strokeNormal: 0x632652,
    hoveredFill: 0x333333,
    strokeSelected: 0xaa0000
};

export class FootprintManager extends Container {
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
                graphics.zIndex = 2;
            } else if (isHovered) {
                graphics
                    .fill({ color: COLORS.hoveredFill, alpha: 0.2 });
                graphics.zIndex = 1;
            } else {
                graphics
                    .stroke({ color: COLORS.strokeNormal, width: 1 });
                graphics.zIndex = 0;
            }
        });
    }
}