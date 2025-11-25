import { useEffect, useState } from "react";
import { extend } from "@pixi/react";
import { 
    Sprite,
    Texture,
} from "pixi.js";
import {
    useGlobeStore
} from "@/stores/footprints";
import { useExtractSpectrum } from "@/hook/connection-hook";
import { useGrismStore, useCounterpartStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";
import { sort2DArray } from "@/utils/plot";
import textureFromData from "@/utils/plot";

extend({ Sprite });

export default function GrismForwardImage() {
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const {
        forwardWaveRange,
        apertureSize,
        grismNorm,
        setCollapseWindow,
    } = useGrismStore(
        useShallow((state) => ({
            apertureSize: state.apertureSize,
            forwardWaveRange: state.forwardWaveRange,
            grismNorm: state.grismNorm,
            setCollapseWindow: state.setCollapseWindow,
        }))
    );
    const {data: extractSpectrumData} = useExtractSpectrum({
        selectedFootprintId,
        waveMin: forwardWaveRange.min,
        waveMax: forwardWaveRange.max,
        cutoutParams,
        apertureSize,
        enabled: false,
    });

    const [sortedSpec2D, setSortedSpec2D] = useState<number[] | null>(null);
    useEffect(() => {
        if (!extractSpectrumData) {
            setSortedSpec2D(null);
            return;
        }
        if (!extractSpectrumData.covered) {
            setSortedSpec2D(null);
            return;
        }
        const sorted = sort2DArray(extractSpectrumData.spectrum_2d);
        const wavelength = extractSpectrumData.wavelength;
        setCollapseWindow({
            waveMin: wavelength[0],
            waveMax: wavelength[wavelength.length - 1],
            spatialMin: 0,
            spatialMax: extractSpectrumData.spectrum_2d.length - 1,
        });
        setSortedSpec2D(sorted);
    }, [extractSpectrumData]);

    const [grismTexture, setGrismTexture] = useState<Texture>(Texture.EMPTY);
    useEffect(() => {
        if (!extractSpectrumData || !sortedSpec2D) return;
        const texture = textureFromData({
            data: extractSpectrumData.spectrum_2d,
            pmin: grismNorm.pmin,
            pmax: grismNorm.pmax,
            sortedArray: sortedSpec2D,
            excludeZero: true,
        });
        setGrismTexture((prev) => {
            if (prev && !prev.destroyed) {
                prev.destroy(true);
            }
            return texture;
        });
    }, [extractSpectrumData, sortedSpec2D, grismNorm.pmin, grismNorm.pmax]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            setGrismTexture((prev) => {
                if (prev && !prev.destroyed) {
                    prev.destroy(true);
                }
                return Texture.EMPTY;
            })
        }
    }, []); 
    
    return (
        grismTexture !== Texture.EMPTY && (
            <pixiSprite
                texture={grismTexture}
                anchor={0}
                x={0}
                y={0}
            />
        )
    );
}