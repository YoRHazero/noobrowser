import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { useConnectionStore } from "@/stores/connection";
import type { SaveFitResultResponse, SaveFitResultVariables } from "./schemas";

type ApiErrorDetail = {
	loc: Array<string | number>;
	msg: string;
};

export function useSaveFitResultMutation() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
    const username = useConnectionStore((state) => state.username);

	return useMutation<SaveFitResultResponse, Error, SaveFitResultVariables>({
		mutationFn: async ({ sourceId, tags }) => {
			try {
				const response = await axios.post(
					`${backendUrl}/fit/save/${sourceId}/`,
					{
						tags: tags || [],
                        user: username,
					},
				);
				return response.data as SaveFitResultResponse;
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					const data = error.response.data;
					let errorMsg = "Unknown error";

					if (data?.detail) {
						if (Array.isArray(data.detail)) {
							const detail = data.detail as ApiErrorDetail[];
							errorMsg = detail
								.map((err) => `${err.loc.join(".")} -> ${err.msg}`)
								.join("\n");
						} else if (typeof data.detail === "object") {
							errorMsg = JSON.stringify(data.detail);
						} else {
							errorMsg = String(data.detail);
						}
					} else if (data?.message) {
						errorMsg = data.message;
					} else {
						errorMsg = error.message;
					}
					throw new Error(`Fit save failed:\n${errorMsg}`);
				}
				throw error;
			}
		},
		onSuccess: (data) => {
			toaster.success({
				title: "Fit Result Saved",
				description: data.message,
			});
		},
		onError: (error) => {
			toaster.error({ title: "Fit Save Failed", description: error.message });
		},
	});
}
