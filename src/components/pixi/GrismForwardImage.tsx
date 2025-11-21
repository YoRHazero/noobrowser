import { extend } from "@pixi/react";
import { 
    Sprite,
    Texture,
    Assets,
} from "pixi.js";
import {
    useGlobeStore
} from "@/stores/footprints";
import { useExtractSpectrum } from "@/hook/connection-hook";
import { useGrismStore, useCounterpartStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";

extend({ Sprite });

export default function GrismForwardImage() {
    const selectedFootprintId = useGlobeStore((state) => state.selectedFootprintId);
    const cutoutParams = useCounterpartStore((state) => state.cutoutParams);
    const {
        forwardWaveRange,
        apertureSize,
    } = useGrismStore(
        useShallow((state) => ({
            apertureSize: state.apertureSize,
            forwardWaveRange: state.forwardWaveRange,
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





}