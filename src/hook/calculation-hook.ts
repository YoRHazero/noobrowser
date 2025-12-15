import { useMemo, useEffect } from "react";
import { Float16Array } from "@petamoriken/float16";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore, useCounterpartStore } from "@/stores/image";
import { useGlobeStore } from "@/stores/footprints";
import { useGrismData, useGrismErr, useGrismOffsets, useCounterpartFootprint } from "@/hook/connection-hook";
import { clamp } from "@/utils/projection";
import type { Spectrum1D } from "@/utils/util-types";

export function useRoiSpectrum1D(basename: string | undefined) {
    const { 
        roiCollapseWindow,
        roiState,
    } = useGrismStore(
        useShallow((state) => ({
            roiCollapseWindow: state.roiCollapseWindow,
            roiState: state.roiState,
        })),
    );
    const grismDataQuery = useGrismData({});
    const grismErrQuery = useGrismErr({});
    const grismOffsetsQuery = useGrismOffsets({});

    const spectrum1D = useMemo<Spectrum1D[]>(() => {
        if (!basename) return [];
        const currentDataQuery = grismDataQuery[basename];
        const currentErrQuery = grismErrQuery[basename];
        const currentOffsetsQuery = grismOffsetsQuery[basename];
        
        const grismData = currentDataQuery?.data;
        const grismErr = currentErrQuery?.data;
        const grismOffsets = currentOffsetsQuery?.data;
        
        if (!grismData || !grismErr || !grismOffsets) return [];
        const dataF16 = new Float16Array(grismData.buffer);
        const errF16 = new Float16Array(grismErr.buffer);
        const width = grismData.width;
        const height = grismData.height;
        const {dx, dy} = grismOffsets;
        const {x, y, width: roiWidth, height: roiHeight} = roiState;
        // Now waveMin, waveMax are in pixel unit
        const waveRange = [clamp(roiCollapseWindow.waveMin, 0, roiWidth), 
                            clamp(roiCollapseWindow.waveMax, 0, roiWidth)];
        const waveMin = waveRange[0] < waveRange[1] ? waveRange[0] : waveRange[1];
        const waveMax = waveRange[0] < waveRange[1] ? waveRange[1] : waveRange[0];
        const spatialRange = [clamp(roiCollapseWindow.spatialMin, 0, roiHeight), 
                              clamp(roiCollapseWindow.spatialMax, 0, roiHeight)];
        const spatialMin = spatialRange[0] < spatialRange[1] ? spatialRange[0] : spatialRange[1];
        const spatialMax = spatialRange[0] < spatialRange[1] ? spatialRange[1] : spatialRange[0];
        
        const startCol = Math.floor(waveMin);
        const endCol = Math.ceil(waveMax);
        const startRow = Math.floor(spatialMin);
        const endRow = Math.ceil(spatialMax);

        const result: Spectrum1D[] = [];
        for (let col = startCol; col < endCol; col++) {
            const imageX = (x + col) - dx;
            if (imageX < 0 || imageX >= width) continue;
            let fluxSum = 0;
            let errSumSq = 0;
            let count = 0;
            for (let row = startRow; row < endRow; row++) {
                const imageY = (y + row) - dy;
                if (imageY < 0 || imageY >= height) continue;
                const index = imageY * width + imageX;
                const flux = dataF16[index];
                const err = errF16[index];
                if (isNaN(flux) || isNaN(err)) continue;
                fluxSum += flux;
                errSumSq += err * err;
                count += 1;
            }
            if (count > 0) {
                const flux = fluxSum;
                const error = Math.sqrt(errSumSq);
                result.push({
                    wavelength: col,
                    flux,
                    error,
                    fluxMinusErr: flux - error,
                    fluxPlusErr: flux + error,
                })
            };
        }
        return result;
    }, [basename, grismDataQuery, grismErrQuery, grismOffsetsQuery, roiCollapseWindow, roiState]);
    return {spectrum1D, roiCollapseWindow, roiState};
}

export function useIdSyncCounterpartPosition() {
    const selectedFootprintId = useGlobeStore(
        (state) => state.selectedFootprintId,
    );
    const setCounterpartPosition = useCounterpartStore(
        (state) => state.setCounterpartPosition,
    );
    const {
        data: footprintData,
        isSuccess: isFootprintSuccess,
    } = useCounterpartFootprint({
        selectedFootprintId,
        enabled: !!selectedFootprintId,
    });

    useEffect(() => {
        if (!isFootprintSuccess || !footprintData) return;

        const { vertex_marker } = footprintData.footprint;
        setCounterpartPosition({
            x0: vertex_marker[0][0],
            y0: vertex_marker[0][1],
            width: vertex_marker[2][0] - vertex_marker[0][0],
            height: vertex_marker[2][1] - vertex_marker[0][1],
        });
    }, [isFootprintSuccess, footprintData, setCounterpartPosition]);
    return { selectedFootprintId };
}