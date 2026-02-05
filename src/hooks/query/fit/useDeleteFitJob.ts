import {
	useMutation,
	useQueryClient,
	type UseMutationOptions,
} from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { useConnectionStore } from "@/stores/connection";
import type { DeleteFitJobResponse } from "./schemas";

type DeleteFitJobParams = {
	jobId: string;
};

export const useDeleteFitJob = (
	options?: UseMutationOptions<
		DeleteFitJobResponse,
		AxiosError,
		DeleteFitJobParams
	>,
) => {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ jobId }: DeleteFitJobParams) => {
			const url = `${backendUrl}/fitjob/${jobId}/`;
			const { data } = await axios.delete<DeleteFitJobResponse>(url);
			return data;
		},
		...options,
		onSuccess: (data, variables, onMutateResult, context) => {
			queryClient.invalidateQueries({ queryKey: ["fit", "jobs"] });
			queryClient.removeQueries({
				queryKey: ["fit", "status", variables.jobId],
			});
			queryClient.removeQueries({
				queryKey: ["fit", "summary", variables.jobId],
			});
			options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};
