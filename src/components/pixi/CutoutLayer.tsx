
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
import { useShallow } from "zustand/react/shallow";
import { useCounterpartStore } from "@/stores/image";
import { clamp } from "@/utils/projection";

extend({
    Graphics,
    Sprite,
});

interface DraggableSprite extends Sprite {
    dragging: boolean;
}

export default function CutoutLayer(
    { layerRef }:
    { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    // Attach to the RenderLayer
    const { app } = useApplication();
    const spriteRef = useRef<Sprite | null>(null);
    useEffect(() => {
        const layer = layerRef.current;
        const node = spriteRef.current;
        if (!layer || !node) return;

        layer.attach(node);
        return () => { layer.detach(node); };
    }, [layerRef, spriteRef]);

    // Draw cutout rectangle
    const {
        cutoutParams,
        setCutoutParams,
        counterpartPosition,
    } = useCounterpartStore(
        useShallow((state) => ({
            cutoutParams: state.cutoutParams,
            setCutoutParams: state.setCutoutParams,
            counterpartPosition: state.counterpartPosition,
        }))
    );
    const [textureRect, setTextureRect] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        const graphics = new Graphics();
        graphics
            .rect(0, 0, cutoutParams.width, cutoutParams.height)
            .stroke({ color: 0xff0000, width: 5 })
            .rect(cutoutParams.width / 2, cutoutParams.height / 2, 1, 1)
            .stroke({ color: 0xff0000, width: 1 });
        
        const textureRect = app.renderer.generateTexture(graphics)
        setTextureRect(textureRect);
        return () => {
            textureRect.destroy(true);
        }
    }, [cutoutParams.height, cutoutParams.width]);


    // Mouse events for dragging the cutout rectangle
    const dragStartPointer = useRef<{ x: number; y: number } | null>(null);
    const dragDeltaPos = useRef<{ deltaX: number; deltaY: number }>({ deltaX: 0, deltaY: 0 });
    const dragStartSpritePos = useRef<{ x: number; y: number } | null>(null);
    const onDragStart = (event: FederatedPointerEvent) => {
        event.stopPropagation();
        const sprite = event.currentTarget as DraggableSprite;
        const parent = sprite.parent;
        if (!parent) return;
        const localPos = event.getLocalPosition(parent);
        sprite.dragging = true;
        sprite.alpha = 0.7;
        dragStartPointer.current = { x: localPos.x, y: localPos.y };
        dragDeltaPos.current = { deltaX: 0, deltaY: 0 };
        dragStartSpritePos.current = { x: sprite.x, y: sprite.y };
    }
    const onDragEnd = (event: FederatedPointerEvent) => {
        event.stopPropagation();
        const sprite = event.currentTarget as DraggableSprite;
        sprite.dragging = false;
        sprite.alpha = 1.0;
        // Update cutoutParams in the store
        const clampedX0 = clamp(
            cutoutParams.x0 + dragDeltaPos.current.deltaX,
            counterpartPosition.x0,
            counterpartPosition.x0 + counterpartPosition.width - cutoutParams.width
        );
        const clampedY0 = clamp(
            cutoutParams.y0 + dragDeltaPos.current.deltaY,
            counterpartPosition.y0,
            counterpartPosition.y0 + counterpartPosition.height - cutoutParams.height
        );
        setCutoutParams({ x0: Math.round(clampedX0), y0: Math.round(clampedY0) });

        dragStartPointer.current = null;
        dragDeltaPos.current = { deltaX: 0, deltaY: 0 };
        dragStartSpritePos.current = null;
    }
    const onDragMove = (event: FederatedPointerEvent) => {
        event.stopPropagation();
        const sprite = event.currentTarget as DraggableSprite;
        const parent = sprite.parent;
        if (!parent) return;
        const localPos = event.getLocalPosition(parent);
        if (sprite.dragging 
            && dragStartPointer.current 
            && dragStartSpritePos.current) {
            const { x: px, y: py } = dragStartPointer.current;
            const { x: sx, y: sy } = dragStartSpritePos.current;
            const deltaX = localPos.x - px;
            const deltaY = localPos.y - py;
            sprite.x = sx + deltaX;
            sprite.y = sy + deltaY;
            dragDeltaPos.current = { deltaX, deltaY };
        }
    }


    const showCutout = useCounterpartStore((state) => state.showCutout);
    if (!showCutout) return null;

    return (
        <pixiSprite
            ref={spriteRef}
            x={cutoutParams.x0}
            y={cutoutParams.y0}
            width={cutoutParams.width}
            height={cutoutParams.height}
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            onPointerMove={onDragMove}
            onPointerUpOutside={onDragEnd}
            anchor={0}
            cursor="move"
            eventMode="dynamic"
            texture={textureRect}
        />
    )
}