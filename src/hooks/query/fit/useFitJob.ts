import { useConnectionStore } from "@/stores/connection";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FitJobResponse } from "./schemas";

export function useFitJob({
	source_id,
	enabled = true,
}: {
	source_id: string;
	enabled?: boolean;
}) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	return useQuery({
		queryKey: ["fit_job", source_id],
		enabled: enabled && !!source_id,
		queryFn: async () => {
			const response = await axios.get(
				`${backendUrl}/fit/status/${source_id}/`,
			);
			return response.data as FitJobResponse;
		},
	});
}

