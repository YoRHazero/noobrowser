import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";


type QueryAxiosParams = {
    queryKey: Array<any>;
    path: string;
    enabled?: boolean;
    AxiosGetParams?: Record<string, any>;
}

export function useQueryAxiosGet(params: QueryAxiosParams) {
    const { queryKey, path, AxiosGetParams = {} } = params;
    const isConnected = useConnectionStore((state) => state.isConnected);
    const enabled = params.enabled && isConnected;
    const backendUrl = useConnectionStore((state) => state.backendUrl);
    const query = useQuery({
        queryKey: queryKey,
        enabled: enabled,
        queryFn: () => axios.get(
            backendUrl + path,
            AxiosGetParams
        ).then(res => res.data),
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
            cutoutParams.x0,
            cutoutParams.y0,
            cutoutParams.width,
            cutoutParams.height
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