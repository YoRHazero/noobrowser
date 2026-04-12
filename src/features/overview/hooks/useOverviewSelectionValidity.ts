import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useOverviewStore } from "../store";
import { useOverviewFootprints } from "./useOverviewFootprints";

export function useOverviewSelectionValidity() {
	const { footprints, isLoading, isError } = useOverviewFootprints();
	const {
		selectedFootprintId,
		hoveredFootprintId,
		clearHoveredFootprint,
		clearFootprintSelection,
	} = useOverviewStore(
		useShallow((state) => ({
			selectedFootprintId: state.selectedFootprintId,
			hoveredFootprintId: state.hoveredFootprintId,
			clearHoveredFootprint: state.clearHoveredFootprint,
			clearFootprintSelection: state.clearFootprintSelection,
		})),
	);
	const footprintIds = useMemo(
		() => new Set(footprints.map((footprint) => footprint.id)),
		[footprints],
	);

	useEffect(() => {
		if (isLoading || isError || !selectedFootprintId) {
			return;
		}
		if (!footprintIds.has(selectedFootprintId)) {
			clearFootprintSelection();
		}
	}, [
		clearFootprintSelection,
		footprintIds,
		isError,
		isLoading,
		selectedFootprintId,
	]);

	useEffect(() => {
		if (isLoading || isError || !hoveredFootprintId) {
			return;
		}
		if (!footprintIds.has(hoveredFootprintId)) {
			clearHoveredFootprint();
		}
	}, [
		clearHoveredFootprint,
		footprintIds,
		hoveredFootprintId,
		isError,
		isLoading,
	]);
}
