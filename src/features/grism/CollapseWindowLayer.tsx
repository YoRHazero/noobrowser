import { useEffect, useRef, useState } from "react";
import {
    FederatedPointerEvent,
    Container,
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
    Container,
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
        collapseWindow,
        showTraceOnSpectrum2D,
        setCollapseWindow,
    } = useGrismStore(
        useShallow((state) => ({
            forwardWaveRange: state.forwardWaveRange,
            apertureSize: state.apertureSize,
            collapseWindow: state.collapseWindow,
            showTraceOnSpectrum2D: state.showTraceOnSpectrum2D,
            setCollapseWindow: state.setCollapseWindow,
        }))
    );
    // Attach to the RenderLayer
    const { app } = useApplication();
    const spriteRef = useRef<Container | null>(null);

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
    // Update collapse window when extractSpectrumData changes
    useEffect(() => {
        if (!extractSpectrumData) return;
        setCollapseWindow({
            waveMin: waveArray[0],
            waveMax: waveArray[waveArray.length - 1],
            spatialMin: 0,
            spatialMax: extractSpectrumData.spectrum_2d.length - 1,
        });
    }, [extractSpectrumData, setCollapseWindow]);

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
            return;
        }
        const graphics = new Graphics();
        const width = endIdx - startIdx;
        const height = spatialMax - spatialMin;
        graphics
            .rect(0, 0, width, height)
            .stroke({ color: 0xee0000, width: 1 });
        const texture = app.renderer.generateTexture(graphics);
        setTextureRect((prev) => {
            if (prev && !prev.destroyed) {
                prev.destroy(true);
            }
            return texture;
        });
    }, [endIdx, startIdx, spatialMin, spatialMax, waveArray]);
    // Draw trace dashed line
    const [traceTexture, setTraceTexture] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (waveArray.length === 0) return;
        const graphics = new Graphics();
        const dashLength = 15;
        const gapLength = 15;
        const totalLength = waveArray.length;
        let x = 0;
        let drawDash = true;
        while (x < totalLength) {
            const thisDashLength = Math.min(
                drawDash ? dashLength : gapLength,
                totalLength - x
            );
            if (drawDash) {
                graphics.moveTo(x, 0);
                graphics.lineTo(x + thisDashLength, 0)
                    .stroke({ color: 0xee0000, width: 1 });
            }
            x += thisDashLength;
            drawDash = !drawDash;
        }
        const texture = app.renderer.generateTexture(graphics);
        setTraceTexture((prev) => {
            if (prev && !prev.destroyed) {
                prev.destroy(true);
            }
            return texture;
        });
    }, [waveArray]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setTextureRect((prev) => {
                if (prev && !prev.destroyed) {
                    prev.destroy(true);
                }
                return Texture.EMPTY;
            });
            setTraceTexture((prev) => {
                if (prev && !prev.destroyed) {
                    prev.destroy(true);
                }
                return Texture.EMPTY;
            });
        }
    }, []);

    if (!extractSpectrumData) return null;
    return (
        <pixiContainer
            ref={spriteRef}
        >
            <pixiSprite
                texture={textureRect}
                x={startIdx}
                y={spatialMin}
                anchor={0}
            />
            {showTraceOnSpectrum2D && (
                <pixiSprite
                    texture={traceTexture}
                    x={0}
                    y={(apertureSize - 1) / 2}
                    anchor={{x: 0, y: 0.5}}
                />
            )}
        </pixiContainer>
    );
}