import { useConnectionStore } from "@/stores/connection";
import { useOverviewStore } from "@/stores/overview";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { EmissionMaskRegionsResponse } from "./schemas";

export function useEmissionMaskRegions({
	enabled = true,
}: {
	enabled?: boolean;
} = {}) {
	const groupId = useOverviewStore((state) => state.selectedFootprintId);
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	return useQuery({
		queryKey: ["emission_mask_regions", groupId],
		enabled: enabled && !!groupId,
		queryFn: async () => {
			const response = await axios.get<EmissionMaskRegionsResponse>(
				`${backendUrl}/wfss/emission_mask_regions/${groupId}`,
			);
			return response.data;
		},
	});
}
