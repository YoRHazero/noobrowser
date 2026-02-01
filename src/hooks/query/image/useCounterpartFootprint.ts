import { useGlobeStore } from "@/stores/footprints";
import { useQueryAxiosGet } from "../useQueryAxiosGet";
import type { CounterpartFootprint } from "./schemas";

export function useCounterpartFootprint({
	selectedFootprintId = null,
	enabled = false,
}: {
	selectedFootprintId?: string | null;
	enabled?: boolean;
}) {
	const ZustandFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const group_id = selectedFootprintId ?? ZustandFootprintId;
	const query = useQueryAxiosGet<CounterpartFootprint>({
		queryKey: ["counterpart_footprint", group_id],
		path: `/image/counterpart_footprint/${group_id}`,
		enabled: enabled,
	});

	return query;
}
