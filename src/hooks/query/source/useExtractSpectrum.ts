import { useGlobeStore } from "@/stores/footprints";
import type { ExtractedSpectrum } from "./schemas";
import { useQueryAxiosGet } from "../useQueryAxiosGet";

export function useExtractSpectrum({
    selectedFootprintId,
    waveMin,
    waveMax,
    apertureSize,
    x,
    y,
    ra,
    dec,
    enabled = false,
    queryKey
}: {
    selectedFootprintId?: string | null;
    waveMin: number;
    waveMax: number;
    apertureSize: number;
    x?: number;
    y?: number;
    ra?: number;
    dec?: number;
    enabled?: boolean;
    queryKey?: Array<any>;
}) {
    let posReady = true;
    if ((x === undefined) !== (y === undefined)) {
        throw new Error("Both x and y must be provided together");
    }
    if ((ra === undefined) !== (dec === undefined)) {
        throw new Error("Both ra and dec must be provided together");
    }
    if (x === undefined && ra === undefined) {
        posReady = false;
    }
    const ZustandFootprintId = useGlobeStore((state) => state.selectedFootprintId);
    const group_id = selectedFootprintId ?? ZustandFootprintId;
    const finalQueryKey = queryKey ?? [
        "extract_spectrum",
        waveMin,
        waveMax,
        apertureSize,
        ra?.toFixed(10),
        dec?.toFixed(10),
        x?.toFixed(1),
        y?.toFixed(1),
        group_id
    ];
    const query = useQueryAxiosGet<ExtractedSpectrum>({
        queryKey: finalQueryKey,
        path: "/source/extract_spectrum/",
        enabled: enabled && posReady && group_id != null,
		axiosGetParams: {
			params: {
				group_id: group_id,
				wavelength_min: waveMin,
				wavelength_max: waveMax,
				x: x,
				y: y,
                ra: ra,
                dec: dec,
				aperture_size: apertureSize,
			},
		},
        checkParamsNull: false,
    });
    return query;
}