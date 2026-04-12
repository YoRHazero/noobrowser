import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import type {
	MapCanvasActions,
	MapCanvasFootprintModel,
	MapCanvasModel,
	MapCanvasSourceModel,
} from "@/canvas/mapCanvas";
import { useGrismStore } from "@/stores/grism";
import { type Source, useSourceStore } from "@/stores/source";
import type { OverviewFootprintRecord } from "../shared/types";
import { useOverviewUiStore } from "../store";
import { useOverviewFootprints } from "./useOverviewFootprints";

function isFiniteCoordinate(value: number | null): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function toMapCanvasFootprintModel(
	footprint: OverviewFootprintRecord,
): MapCanvasFootprintModel {
	return {
		id: footprint.id,
		vertices: footprint.vertices.map((vertex) => ({
			ra: vertex.ra,
			dec: vertex.dec,
		})),
		center: {
			ra: footprint.center.ra,
			dec: footprint.center.dec,
		},
		files: Array.isArray(footprint.meta.included_files)
			? footprint.meta.included_files.filter(
					(file): file is string => typeof file === "string" && file.length > 0,
				)
			: [],
	};
}

function toMapCanvasSourceModel(
	source: Source,
	activeSourceId: string | null,
): MapCanvasSourceModel | null {
	if (
		!isFiniteCoordinate(source.position.ra) ||
		!isFiniteCoordinate(source.position.dec)
	) {
		return null;
	}

	return {
		id: source.id,
		label: source.label,
		coordinate: {
			ra: source.position.ra,
			dec: source.position.dec,
		},
		color: source.color,
		visible: source.visibility.overview,
		active: source.id === activeSourceId,
	};
}

export interface UseOverviewMapCanvasResult {
	model: MapCanvasModel;
	actions: MapCanvasActions;
}

export function useOverviewMapCanvas(): UseOverviewMapCanvasResult {
	const { footprints } = useOverviewFootprints();
	const {
		selectedFootprintId,
		setSelectedFootprintId,
		clearFootprintSelection,
	} = useGrismStore(
		useShallow((state) => ({
			selectedFootprintId: state.selectedFootprintId,
			setSelectedFootprintId: state.setSelectedFootprintId,
			clearFootprintSelection: state.clearFootprintSelection,
		})),
	);
	const { showGrid, tooltipMode, coordinatePrecision } = useOverviewUiStore(
		useShallow((state) => ({
			showGrid: state.showGrid,
			tooltipMode: state.tooltipMode,
			coordinatePrecision: state.targetCoordinatePrecision,
		})),
	);
	const { sources, activeSourceId } = useSourceStore(
		useShallow((state) => ({
			sources: state.sources,
			activeSourceId: state.activeSourceId,
		})),
	);

	const model = useMemo<MapCanvasModel>(
		() => ({
			footprints: footprints.map(toMapCanvasFootprintModel),
			sources: sources
				.map((source) => toMapCanvasSourceModel(source, activeSourceId))
				.filter((source): source is MapCanvasSourceModel => source !== null),
			selectedFootprintId,
			showGrid,
			tooltipMode,
			coordinatePrecision,
		}),
		[
			activeSourceId,
			coordinatePrecision,
			footprints,
			selectedFootprintId,
			showGrid,
			sources,
			tooltipMode,
		],
	);

	const actions = useMemo<MapCanvasActions>(
		() => ({
			selectFootprint: (id) => {
				if (!id || id === selectedFootprintId) {
					clearFootprintSelection();
					return;
				}

				setSelectedFootprintId(id);
			},
		}),
		[clearFootprintSelection, selectedFootprintId, setSelectedFootprintId],
	);

	return {
		model,
		actions,
	};
}
