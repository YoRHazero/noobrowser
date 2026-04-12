import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGrismStore } from "@/stores/grism";
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
	const {
		selectedFootprintId: selectedGrismFootprintId,
		clearFootprintSelection: clearGrismFootprintSelection,
	} = useGrismStore(
		useShallow((state) => ({
			selectedFootprintId: state.selectedFootprintId,
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
		if (isLoading || isError || !selectedGrismFootprintId) {
			return;
		}
		if (!footprintIds.has(selectedGrismFootprintId)) {
			clearGrismFootprintSelection();
		}
	}, [
		clearGrismFootprintSelection,
		footprintIds,
		isError,
		isLoading,
		selectedGrismFootprintId,
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
