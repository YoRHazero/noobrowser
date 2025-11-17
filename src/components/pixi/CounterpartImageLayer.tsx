import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { extend } from "@pixi/react";
import { Assets, Sprite, Container, FederatedPointerEvent, Texture } from "pixi.js";
import type { RenderLayerInstance } from "@/types/pixi-react";

import { useCounterpartStore } from "@/stores/image";
import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartFootprint, useCounterpartImage } from "@/hook/connection-hook";
  
extend({
    Sprite,
    Container,
});


export default function CounterpartImageLayer(
    { layerRef }:
    { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
    const filterRGB = useCounterpartStore((state) => state.filterRGB);
    const filterRed = filterRGB.r;
    const normParams = useCounterpartStore((state) => state.normParams);
    const counterpartPosition = useCounterpartStore((state) => state.counterpartPosition);
    const setCounterpartPosition = useCounterpartStore((state) => state.setCounterpartPosition);

    /* Determine counterpart position */
    const { data: footprintData, isSuccess: isFootprintSuccess } = useCounterpartFootprint(
        selectedFootprintId
    );
    useEffect(() => {
        if (!isFootprintSuccess) return;
        const vertex_marker: Array<[number, number]> = footprintData.footprint.vertex_marker;
        setCounterpartPosition({
            x0: vertex_marker[0][0],
            y0: vertex_marker[0][1],
            width: vertex_marker[2][0] - vertex_marker[0][0],
            height: vertex_marker[2][1] - vertex_marker[0][1],
        });
    }, [footprintData, isFootprintSuccess]);

    /* Load counterpart image */
    const counterpartImageQuery = useCounterpartImage(
        selectedFootprintId,
        filterRed,
        normParams,
    );
    const [counterpartTexture, setCounterpartTexture] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (!counterpartImageQuery.isSuccess) return;
        const blob = counterpartImageQuery.data;
        const imageUrl = URL.createObjectURL(blob);
        let canceled = false;
        (async () => {
            try {
                const texture = await Assets.load({
                    src: imageUrl,
                    format: 'png',
                    parser: 'texture',
                });
                if (canceled) {
                    texture.destroy(true);
                    return;
                }
                if (counterpartTexture !== Texture.EMPTY) {
                    counterpartTexture.destroy(true);
                }
                setCounterpartTexture(texture);
            } finally {
                URL.revokeObjectURL(imageUrl);
            }
        })();
        return () => { 
            canceled = true; 
            if (counterpartTexture !== Texture.EMPTY) {
                counterpartTexture.destroy(true);
            }
        };
    }, [counterpartImageQuery.isSuccess, counterpartImageQuery.data]);

    // Attach to the RenderLayer
    const spriteRef = useRef<Sprite | null>(null);
    useEffect(() => {
        const layer = layerRef.current;
        const node = spriteRef.current;
        if (!layer || !node) return;

        layer.attach(node);
        return () => { layer.detach(node); };
    }, [layerRef, spriteRef]);

    return (
        <pixiContainer>
            {counterpartTexture !== Texture.EMPTY && (
                <pixiSprite
                    ref={spriteRef}
                    texture={counterpartTexture}
                    anchor={0}
                    x={counterpartPosition.x0}
                    y={counterpartPosition.y0}
                    width={counterpartPosition.width}
                    height={counterpartPosition.height}
                />
            )}
        </pixiContainer>
    )
}