import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { useConnectionStore } from "@/stores/connection";
import type { FitBodyRequest, FitJobStatusResponse } from "./schemas";

type SubmitFitJobParams = {
	body: FitBodyRequest;
	user?: string;
};

export const useSubmitFitJob = (
	options?: UseMutationOptions<
		FitJobStatusResponse,
		AxiosError,
		SubmitFitJobParams
	>,
) => {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const username = useConnectionStore((state) => state.username);

	return useMutation({
		mutationFn: async ({ body, user }: SubmitFitJobParams) => {
			const effectiveUser = user ?? username;
			const url = effectiveUser
				? `${backendUrl}/fit/submit/${effectiveUser}/`
				: `${backendUrl}/fit/submit/`;
			const { data } = await axios.post<FitJobStatusResponse>(url, body);
			return data;
		},
		...options,
	});
};
