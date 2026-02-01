import { useGlobeStore } from "@/stores/footprints";
import { useCounterpartStore } from "@/stores/image";
import { useQueryAxiosGet } from "../useQueryAxiosGet";

export function useCounterpartImage({
	selectedFootprintId = null,
	r = null,
	g = null,
	b = null,
	normParams,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	r?: string | null;
	g?: string | null;
	b?: string | null;
	normParams?: Record<string, number> | undefined;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const ZustandFilterRGB = useCounterpartStore((state) => state.filterRGB);
	const ZustandCounterpartNorm = useCounterpartStore(
		(state) => state.counterpartNorm,
	);
	const queryNormParams = normParams ?? ZustandCounterpartNorm;
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const filterRGB = {
		r: r ?? ZustandFilterRGB.r,
		g: g ?? ZustandFilterRGB.g,
		b: b ?? ZustandFilterRGB.b,
	};
	const query = useQueryAxiosGet<Blob>({
		queryKey: ["counterpart_image", group_id, filterRGB, queryNormParams],
		path: `/image/counterpart_image/${group_id}`,
		axiosGetParams: {
			params: { ...filterRGB, ...queryNormParams },
			responseType: "blob",
		},
		enabled: enabled,
		queryOptions: {
			gcTime: 1000 * 60, // garbage collect after 1 minute of inactivity
		},
	});
	return query;
}
