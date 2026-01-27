import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useConnectionStore } from "@/stores/connection";
import type { PaginatedCatalogResponse } from "./schemas";

export function useCatalogQuery({
	page = 1,
	pageSize = 20,
	sortDesc = true,
	enabled = true,
}: {
	page?: number;
	pageSize?: number;
	sortDesc?: boolean;
	enabled?: boolean;
}) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);
	const isConnected = useConnectionStore((state) => state.isConnected);

	return useQuery<PaginatedCatalogResponse>({
		queryKey: ["catalog", page, pageSize, sortDesc],
		enabled: enabled && isConnected,
		queryFn: async () => {
			const response = await axios.get(`${backendUrl}/fit/catalog/`, {
				params: {
					page,
					page_size: pageSize,
					sort_desc: sortDesc,
				},
			});
			return response.data;
		},
		placeholderData: keepPreviousData,
	});
}
