import { useMemo } from "react";
import { useGrismFootprints } from "@/hooks/query/overview";
import { useOverviewStore } from "@/stores/overview";

export function useSelectedOverviewFootprint() {
	const selectedFootprintId = useOverviewStore((state) => state.selectedFootprintId);
	const query = useGrismFootprints();
	const selectedFootprint = useMemo(
		() =>
			selectedFootprintId
				? query.data?.find((footprint) => footprint.id === selectedFootprintId) ?? null
				: null,
		[query.data, selectedFootprintId],
	);
	const basenameList = useMemo(
		() =>
			Array.isArray(selectedFootprint?.meta.included_files)
				? selectedFootprint.meta.included_files.filter(
						(file): file is string => typeof file === "string" && file.length > 0,
					)
				: [],
		[selectedFootprint],
	);

	return {
		selectedFootprintId,
		selectedFootprint,
		basenameList,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error ?? null,
	};
}
