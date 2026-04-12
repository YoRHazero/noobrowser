import { useMemo } from "react";
import { useGrismFootprints } from "@/hooks/query/overview";
import type { GrismFootprintItem } from "@/hooks/query/overview/schemas";
import { useOverviewStore } from "@/stores/overview";
import type { TargetHubFootprintRecord } from "../shared/types";

function getIncludedFiles(item: GrismFootprintItem) {
	return Array.isArray(item.meta?.included_files)
		? item.meta.included_files.filter(
				(file): file is string =>
					typeof file === "string" && file.trim().length > 0,
			)
		: [];
}

function createFootprintOption(
	item: GrismFootprintItem,
): TargetHubFootprintRecord {
	const basenameList = getIncludedFiles(item);
	const refBasename = basenameList[0] ?? null;

	return {
		id: item.id,
		refBasename,
	};
}

export function useFootprints() {
	const selectedFootprintId = useOverviewStore(
		(state) => state.selectedFootprintId,
	);
	const query = useGrismFootprints();

	const footprints = useMemo(
		() => (query.data ?? []).map(createFootprintOption),
		[query.data],
	);
	const selectedFootprint = useMemo(
		() =>
			selectedFootprintId
				? (footprints.find(
						(footprint) => footprint.id === selectedFootprintId,
					) ?? null)
				: null,
		[footprints, selectedFootprintId],
	);

	return {
		selectedFootprintId,
		selectedFootprint,
		footprints,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error ?? null,
	};
}
