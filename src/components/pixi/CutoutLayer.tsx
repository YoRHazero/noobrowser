
import { useCallback, useEffect, useRef, useState } from "react";
import { 
    FederatedPointerEvent,
    Sprite,
    Graphics,
    Texture,
    Rectangle
} from "pixi.js";
import { extend, useApplication } from "@pixi/react";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useCounterpartStore } from "@/stores/image";
import { clamp } from "@/utils/projection";

extend({
    Graphics,
    Sprite,
});

export default function CutoutLayer(
    { layerRef }:
    { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    // Attach to the RenderLayer
    const spriteRef = useRef<Sprite | null>(null);
    useEffect(() => {
        const layer = layerRef.current;
        const node = spriteRef.current;
        if (!layer || !node) return;

        layer.attach(node);
        return () => { layer.detach(node); };
    }, [layerRef, spriteRef]);

    // Draw cutout rectangle
    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const counterpartPosition = useCounterpartStore((state) => state.counterpartPosition);
    const setCutoutParams = useCounterpartStore((state) => state.setCutoutParams);
    const drawCutout = useCallback((graphics: Graphics) => {
        graphics.clear();
        const { width, height } = cutoutParams;
        graphics
            .rect(0, 0, width, height)
            .stroke({ color: 0xee0000, width: 2 }); 
    }, [cutoutParams.width, cutoutParams.height]);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const dragStartPos = useRef<{x: number, y: number} | null>(null);
    const dragStartCutoutPos = useRef<{x0: number, y0: number} | null>(null);


    // Mouse events for dragging the cutout rectangle
    const onPointerDown = (event: FederatedPointerEvent) => {
        setIsDragging(true);
        dragStartPos.current = { x: event.globalX, y: event.globalY };
        dragStartCutoutPos.current = { x0: cutoutParams.x0, y0: cutoutParams.y0 };
        event.stopPropagation();
    }
    const onDragEnd = (event: FederatedPointerEvent) => {
        setIsDragging(false);
        setCutoutParams({
            x0: Math.round(cutoutParams.x0),
            y0: Math.round(cutoutParams.y0),
        })
        dragStartPos.current = null;
        dragStartCutoutPos.current = null;
        event.stopPropagation();
    }
    const onPointerMove = (event: FederatedPointerEvent) => {
        if (!isDragging || !dragStartPos.current || !dragStartCutoutPos.current) return;
        const { x, y } = dragStartPos.current;
        const { x0, y0 } = dragStartCutoutPos.current;
        const dx = event.globalX - x;
        const dy = event.globalY - y;

        const newX0 = clamp(x0 + dx, counterpartPosition.x0, counterpartPosition.x0 + counterpartPosition.width - cutoutParams.width);
        const newY0 = clamp(y0 + dy, counterpartPosition.y0, counterpartPosition.y0 + counterpartPosition.height - cutoutParams.height);
        setCutoutParams({ x0: newX0, y0: newY0 });
        event.stopPropagation();
    };
    
    const cutoutHitArea = new Rectangle(
        cutoutParams.x0,
        cutoutParams.y0,
        cutoutParams.width,
        cutoutParams.height
    );

    const showCutout = useCounterpartStore((state) => state.showCutout);
    if (!showCutout) return null;

    return (
        <pixiSprite
            ref={spriteRef}
            x={cutoutParams.x0}
            y={cutoutParams.y0}
            anchor={0}
            onPointerDown={onPointerDown}
            onPointerUp={onDragEnd}
            onPointerUpOutside={onDragEnd}
            onPointerMove={onPointerMove}
            eventMode="static"
            hitArea={cutoutHitArea}
        >
            <pixiGraphics
                draw={drawCutout}
            />
        </pixiSprite>
    )
}