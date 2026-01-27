import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { useConnectionStore } from "@/stores/connection";

type DeleteCatalogEntryResponse = {
	status: string;
	message: string;
};

type DeleteCatalogEntryVariables = {
	sourceId: string;
};

export function useDeleteCatalogEntryMutation() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const queryClient = useQueryClient();

	return useMutation<
		DeleteCatalogEntryResponse,
		Error,
		DeleteCatalogEntryVariables
	>({
		mutationFn: async ({ sourceId }) => {
			const response = await axios.delete(
				`${backendUrl}/fit/catalog/${sourceId}/`,
			);
			return response.data as DeleteCatalogEntryResponse;
		},
		onSuccess: (_data, variables) => {
			toaster.success({
				title: "Catalog Entry Deleted",
				description: `Entry ${variables.sourceId} has been deleted.`,
			});
			// Invalidate catalog query to refresh the list
			queryClient.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (error) => {
			toaster.error({
				title: "Delete Failed",
				description: error.message,
			});
		},
	});
}
