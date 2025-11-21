import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";


type QueryAxiosParams = {
    queryKey: Array<any>;
    path: string;
    enabled?: boolean;
    AxiosGetParams?: Record<string, any>;
    returnType?: 'response' | 'data';
}

export function useQueryAxiosGet(params: QueryAxiosParams) {
    const { queryKey, path, AxiosGetParams = {}, returnType = 'data' } = params;
    const isConnected = useConnectionStore((state) => state.isConnected);
    let enabled = (params.enabled ?? true) && isConnected;
    if (!!AxiosGetParams?.params) {
        const paramsHasNull = Object.values(AxiosGetParams.params).some(v => v === null || v === undefined);
        enabled = enabled && !paramsHasNull;
    }

    const backendUrl = useConnectionStore((state) => state.backendUrl);
    
    const queryFn = () => {
        if (returnType === 'response') {
            return axios.get(
                backendUrl + path,
                AxiosGetParams
            );
        }  
        if (returnType === 'data') {
            return axios.get(
                backendUrl + path,
                AxiosGetParams
            ).then(res => res.data);
        }
        throw new Error(`Invalid returnType: ${returnType}`);
    }
    const query = useQuery({
        queryKey,
        enabled,
        queryFn,
    });
    return query;
}

export function useWorldCoordinates(
    selectedFootprintId: string | null,
    x: number | null = null,
    y: number | null = null,
    cutoutParams: Record<string, number> | null = null,
    enabled: boolean = false,
) {
    if ((x === null || y === null) && cutoutParams === null) {
        throw new Error("Either (x, y) or cutoutParams must be provided");
    }
    if (x === null && y === null && cutoutParams !== null) {
        x = cutoutParams.x0 + cutoutParams.width / 2;
        y = cutoutParams.y0 + cutoutParams.height / 2;
    }
    const query = useQueryAxiosGet({
        queryKey: ["world_coordinates", selectedFootprintId, x, y],
        enabled: enabled,
        path: "/wfss/world_coordinates/",
        AxiosGetParams: {
            params: {
                group_id: selectedFootprintId,
                x: x,
                y: y,
            }
        }
    });
    return query;
}

export function usePixelCoordinates(
    selectedFootprintId: string | null,
    ra: number,
    dec: number,
    enabled: boolean = false,
) {
    const query = useQueryAxiosGet({
        queryKey: ["pixel_coordinates", selectedFootprintId, ra, dec],
        enabled: enabled,
        path: "/wfss/pixel_coordinates/",
        AxiosGetParams: {
            params: {
                group_id: selectedFootprintId,
                ra: ra,
                dec: dec,
            }
        }
    });
    return query;
}


export function useCounterpartFootprint(
    selectedFootprintId: string | null,
    enabled: boolean = false,
) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const query = useQuery({
        queryKey: ["counterpart_footprint", selectedFootprintId],
        enabled: enabled,
        queryFn: () => axios.get(
            backendUrl + `/image/counterpart_footprint/${selectedFootprintId}`,
        ).then(res => res.data),
    });
    return query;
}

export function useCounterpartImage(
    selectedFootprintId: string | null,
    filter: string,
    normParams: Record<string, number>,
    enabled: boolean = false,
) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const query = useQuery({
        queryKey: ["counterpart_image", selectedFootprintId, filter, normParams],
        enabled: enabled,
        queryFn: () => axios.get(
            backendUrl + `/image/counterpart_image/${selectedFootprintId}`,
            { params: { filter: filter, ...normParams }, responseType: 'blob' }
        ).then(res => res.data)
    });
    return query;
}
export function useCounterpartCutout(
    selectedFootprintId: string | null,
    filter: string,
    cutoutParams: Record<string, number>,
    enabled: boolean = false,
) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const query = useQuery({
        queryKey: [
            "counterpart_cutout",
            selectedFootprintId,
            filter,
            cutoutParams.width,
            cutoutParams.height,
        ],
        enabled: enabled,
        queryFn: () => axios.get(
            backendUrl + `/image/counterpart_cutout/${selectedFootprintId}`,
            { params: {
                filter: filter,
                x0: cutoutParams.x0,
                y0: cutoutParams.y0,
                width: cutoutParams.width,
                height: cutoutParams.height,
            }}).then(res => res.data)
    });
    return query;
}

export function useGrismOffsets(
    selectedFootprintId: string | null,
    basename: string,
    enabled: boolean = false,
) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const query = useQuery({
        queryKey: ["grism_offsets", selectedFootprintId, basename],
        enabled: enabled && selectedFootprintId !== null,
        queryFn: () => axios.get(
            backendUrl + `/wfss/grism_offsets/${selectedFootprintId}`,
            { params: { basename } }
        ).then(res => res.data)
    });
    return query;
}

export function useGrismData({
    basenameList,
    enabled = false,
}: {
    basenameList: string[];
    enabled?: boolean;
}) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const results = useQueries({
        queries: basenameList.map((basename) => ({
            queryKey: ["grism_data", basename],
            enabled: enabled,
            queryFn: async () => {
                const response = await axios.get(
                    backendUrl + "/wfss/grism_data/",
                    { 
                        params: { basename },
                        responseType: "arraybuffer",
                    }
                );
                const buffer = response.data as ArrayBuffer;
                const headers = response.headers;
                const height = Number(headers["x-data-height"]);
                const width = Number(headers["x-data-width"]);
                return { buffer, width, height };
            }
        })),
    })
    return results;
}

export function useGrismErr({
    basenameList,
    enabled = false,
}: {
    basenameList: string[];
    enabled?: boolean;
}) {
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const results = useQueries({
        queries: basenameList.map((basename) => ({
            queryKey: ["grism_err", basename],
            enabled: enabled,
            queryFn: async () => {
                const response = await axios.get(
                    backendUrl + "/wfss/grism_err/",
                    { 
                        params: { basename },
                        responseType: "arraybuffer",
                    }
                );
                const buffer = response.data as ArrayBuffer;
                const headers = response.headers;
                const height = Number(headers["x-data-height"]);
                const width = Number(headers["x-data-width"]);
                return { buffer, width, height };
            }
        })),
    })
    return results;
}

export function useExtractSpectrum({
    selectedFootprintId,
    waveMin,
    waveMax,
    apertureSize,
    x = null,
    y = null,
    cutoutParams = null,
    enabled = false,
}: {
    selectedFootprintId: string | null;
    waveMin: number;
    waveMax: number;
    apertureSize: number | null;
    x?: number | null;
    y?: number | null;
    cutoutParams?: Record<string, number> | null;
    enabled?: boolean;
}) {
    if ((x === null || y === null) && cutoutParams === null) {
        throw new Error("Either (x, y) or cutoutParams must be provided");
    }
    if (x === null && y === null && cutoutParams !== null) {
        x = cutoutParams.x0 + cutoutParams.width / 2;
        y = cutoutParams.y0 + cutoutParams.height / 2;
    }
    if (apertureSize === null && cutoutParams === null) {
        throw new Error("Either apertureSize or cutoutParams must be provided");
    }
    if (apertureSize === null && cutoutParams !== null) {
        apertureSize = cutoutParams.height;
    }
    const query = useQueryAxiosGet({
        queryKey: ["extract_spectrum", selectedFootprintId, x, y, apertureSize],
        path: "/wfss/extract_spectrum/",
        enabled: enabled,
        AxiosGetParams: {
            params: {
                group_id: selectedFootprintId,
                wavelength_min: waveMin,
                wavelength_max: waveMax,
                x: x,
                y: y,
                aperture_size: apertureSize,
            }
        },
    });
    return query;
}