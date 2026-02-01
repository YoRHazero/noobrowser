import { useConnectionStore } from "@/stores/connection";
import { useFitStore } from "@/stores/fit";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FitJobResponse } from "./schemas";

// Inner hook for single job polling, much cleaner to handle updates
export function useSingleJobPoller(jobId: string) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const existingJob = useFitStore((state) =>
		state.jobs.find((j) => j.job_id === jobId),
	);

	return useQuery({
		queryKey: ["fit_job_status", jobId],
		queryFn: async () => {
			const response = await axios.get(`${backendUrl}/fit/status/${jobId}/`);
			return response.data as FitJobResponse;
		},
		enabled:
			!!jobId &&
			(existingJob?.status === "pending" ||
				existingJob?.status === "processing"),
		refetchInterval: (query) => {
			const status = query.state.data?.status;
			if (status === "completed" || status === "failed") {
				return false;
			}
			return 3000;
		},
	});
}
