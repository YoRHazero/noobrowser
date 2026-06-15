import { useOverviewStore } from "@/stores/overview";
import { useQueryAxiosGet } from "../useQueryAxiosGet";

export function useCounterpartImage({
	selectedFootprintId,
	r,
	g,
	b,
	normParams,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	r: string;
	g: string;
	b: string;
	normParams: Record<string, number>;
	enabled?: boolean;
}) {
	const overviewSelectedFootprintId = useOverviewStore(
		(state) => state.selectedFootprintId,
	);
	const group_id =
		selectedFootprintId === undefined
			? overviewSelectedFootprintId
			: selectedFootprintId;
	const filterRGB = { r, g, b };
	const query = useQueryAxiosGet<Blob>({
		queryKey: ["counterpart_image", group_id, filterRGB, normParams],
		path: `/image/counterpart_image/${group_id}`,
		axiosGetParams: {
			params: { ...filterRGB, ...normParams },
			responseType: "blob",
		},
		enabled: enabled,
		queryOptions: {
			gcTime: 1000 * 60, // garbage collect after 1 minute of inactivity
		},
	});
	return query;
}
