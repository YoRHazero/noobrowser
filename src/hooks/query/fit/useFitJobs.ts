import { useQueryAxiosGet } from "../useQueryAxiosGet";
import { useConnectionStore } from "@/stores/connection";
import type { FitJobStatusResponse } from "./schemas";

type UseFitJobsParams = {
	user?: string;
	limit?: number;
	enabled?: boolean;
};

export const useFitJobs = ({
	user,
	limit = 50,
	enabled = true,
}: UseFitJobsParams = {}) => {
	const username = useConnectionStore((state) => state.username);
	const effectiveUser = user ?? username;

	const returnType = "data";
	const path = "/fit/jobs/";
	const params: { user?: string; limit: number } = { limit };
	if (effectiveUser) {
		params.user = effectiveUser;
	}

	return useQueryAxiosGet<FitJobStatusResponse[]>({
		queryKey: ["fit", "jobs", effectiveUser || "all", limit],
		path,
		enabled,
		axiosGetParams: {
			params,
		},
		returnType,
	});
};
