import { useEffect, useRef, useState } from "react";
import {
    FederatedPointerEvent,
    Sprite,
    Graphics,
    Texture,
} from "pixi.js";
import { extend, useApplication } from "@pixi/react";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { useShallow } from "zustand/react/shallow";
import { useCounterpartStore, useGrismStore } from "@/stores/image";
import { clamp } from "@/utils/projection";
import { getWavelengthSliceIndices } from "@/utils/extraction";
import { useGlobeStore } from "@/stores/footprints";
import { useExtractSpectrum } from "@/hook/connection-hook";

extend({
    Graphics,
    Sprite,
});

export default function CollapseWindowLayer({ layerRef }:
    { layerRef: React.RefObject<RenderLayerInstance | null> }
) {
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const {
        forwardWaveRange,
        apertureSize,
        collapseWindow
    } = useGrismStore(
        useShallow((state) => ({
            forwardWaveRange: state.forwardWaveRange,
            apertureSize: state.apertureSize,
            collapseWindow: state.collapseWindow,
        }))
    );
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

    const {data: extractSpectrumData} = useExtractSpectrum({
            selectedFootprintId,
            waveMin: forwardWaveRange.min,
            waveMax: forwardWaveRange.max,
            cutoutParams,
            apertureSize,
            enabled: false,
        });
    const waveArray = extractSpectrumData?.wavelength || [];
    const { waveMin, waveMax, spatialMin, spatialMax } = collapseWindow;
    const {startIdx, endIdx} = getWavelengthSliceIndices(
        waveArray,
        waveMin,
        waveMax
    );
    // Draw collapse window rectangle
    const [textureRect, setTextureRect] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (waveArray.length === 0) {
            setTextureRect(Texture.EMPTY);
            return;
        }
        const graphics = new Graphics();
        const width = endIdx - startIdx;
        const height = spatialMax - spatialMin;
        graphics
            .rect(0, 0, width, height)
            .stroke({ color: 0xee0000, width: 5 });
        const texture = app.renderer.generateTexture(graphics);
        setTextureRect((prev) => {
            if (prev && !prev.destroyed) {
                prev.destroy(true);
            }
            return texture;
        });
    }, [collapseWindow, waveArray]);
    if (!!extractSpectrumData) return null;
    return (
        <pixiSprite
            ref={spriteRef}
            texture={textureRect}
            x={startIdx}
            y={spatialMin}
            anchor={0}
        />
    );
}