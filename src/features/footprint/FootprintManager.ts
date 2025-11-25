import { Container, Graphics, Polygon, FederatedPointerEvent } from "pixi.js";
import { projectRaDec, toScreen } from "@/utils/projection";
import type { Footprint } from "@/stores/footprints"; 
import type { F } from "node_modules/vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

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
}