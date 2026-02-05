import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { FitJobStatusResponse } from "@/hooks/query/fit";

export function useFitJobPolling(
	activeJobs: FitJobStatusResponse[],
	intervalMs = 3000,
) {
	/* -------------------------------------------------------------------------- */
	/*                                Access Store                                */
	/* -------------------------------------------------------------------------- */
	const queryClient = useQueryClient();

	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	/* -------------------------------------------------------------------------- */
	/*                               Derived Values                               */
	/* -------------------------------------------------------------------------- */
	const shouldPoll = activeJobs.length > 0;

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {
		if (!shouldPoll) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		intervalRef.current = setInterval(() => {
			queryClient.invalidateQueries({ queryKey: ["fit", "jobs"] });
		}, intervalMs);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [intervalMs, queryClient, shouldPoll]);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return { isPolling: shouldPoll };
}
