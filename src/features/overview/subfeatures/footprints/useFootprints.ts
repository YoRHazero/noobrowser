import { useMemo } from "react";
import { useGrismStore } from "@/stores/grism";
import { useOverviewFootprints } from "../../hooks";
import type { OverviewFootprintRecord } from "../../shared/types";
import { useOverviewUiStore } from "../../store";

export interface FootprintsStatePanelViewModel {
	title: string;
	description: string;
}

export type FootprintsViewState =
	| ({ kind: "loading" } & FootprintsStatePanelViewModel)
	| ({ kind: "error" } & FootprintsStatePanelViewModel)
	| ({ kind: "empty" } & FootprintsStatePanelViewModel)
	| { kind: "list" };

export interface UseFootprintsResult {
	state: FootprintsViewState;
	footprints: OverviewFootprintRecord[];
	selectedFootprintId: string | null;
	precision: number;
	toggleFootprint: (footprintId: string) => void;
}

export function useFootprints(): UseFootprintsResult {
	const { footprints, isLoading, isError, error } = useOverviewFootprints();
	const selectedFootprintId = useGrismStore(
		(state) => state.selectedFootprintId,
	);
	const setSelectedFootprintId = useGrismStore(
		(state) => state.setSelectedFootprintId,
	);
	const clearFootprintSelection = useGrismStore(
		(state) => state.clearFootprintSelection,
	);
	const precision = useOverviewUiStore(
		(state) => state.targetCoordinatePrecision,
	);

	const state = useMemo<FootprintsViewState>(() => {
		if (isLoading && footprints.length === 0) {
			return {
				kind: "loading",
				title: "Loading footprints",
				description:
					"Overview footprint cards will appear here once the query finishes.",
			};
		}

		if (isError && footprints.length === 0) {
			return {
				kind: "error",
				title: "Failed to load footprints",
				description:
					error?.message ?? "The overview footprint query returned an error.",
			};
		}

		if (footprints.length === 0) {
			return {
				kind: "empty",
				title: "No footprints available",
				description:
					"The overview query returned no footprint records for this view.",
			};
		}

		return { kind: "list" };
	}, [error?.message, footprints.length, isError, isLoading]);

	const toggleFootprint = (footprintId: string) => {
		if (selectedFootprintId === footprintId) {
			clearFootprintSelection();
			return;
		}

		setSelectedFootprintId(footprintId);
	};

	return {
		state,
		footprints,
		selectedFootprintId,
		precision,
		toggleFootprint,
	};
}
