import type { MapCanvasModel } from "./api";
import { useMapCanvasOverlayState } from "./hooks/useMapCanvasOverlayState";
import {
	MAP_CANVAS_COORDINATE_TOOLTIP_OFFSET_PX,
	MAP_CANVAS_FOOTPRINT_TOOLTIP_MAX_FILES,
} from "./shared/constants";
import type {
	CoordinateTooltipViewModel,
	CursorCoordinateState,
	FootprintHoverState,
	FootprintTooltipViewModel,
	GraticuleTooltipViewModel,
	HoveredGraticule,
	MapCanvasContainerRect,
} from "./shared/types";
import {
	formatCoordinate,
	resolveTooltipPosition,
	summarizeTooltipFiles,
} from "./utils";

export interface UseMapCanvasParams {
	model: MapCanvasModel;
	containerRect: MapCanvasContainerRect | null;
}

export interface UseMapCanvasResult {
	coordinateTooltip: CoordinateTooltipViewModel | null;
	footprintTooltip: FootprintTooltipViewModel | null;
	graticuleTooltip: GraticuleTooltipViewModel | null;
	setHoveredFootprint: (hoveredFootprint: FootprintHoverState | null) => void;
	setHoveredGraticule: (hoveredGraticule: HoveredGraticule | null) => void;
	setCursorCoordinate: (cursorCoordinate: CursorCoordinateState | null) => void;
}

export function useMapCanvas({
	model,
	containerRect,
}: UseMapCanvasParams): UseMapCanvasResult {
	const {
		hoveredFootprint,
		hoveredGraticule,
		cursorCoordinate,
		setHoveredFootprint,
		setHoveredGraticule,
		setCursorCoordinate,
	} = useMapCanvasOverlayState();

	const hoveredFootprintModel =
		model.footprints.find(
			(footprint) => footprint.id === hoveredFootprint?.id,
		) ?? null;

	const coordinateTooltip =
		model.tooltipMode === "coordinate" && cursorCoordinate
			? (() => {
					const position = resolveTooltipPosition(
						cursorCoordinate.anchor,
						containerRect,
						MAP_CANVAS_COORDINATE_TOOLTIP_OFFSET_PX,
					);

					if (!position) {
						return null;
					}

					return {
						position,
						raText: formatCoordinate(
							cursorCoordinate.coordinate.ra,
							model.coordinatePrecision,
						),
						decText: formatCoordinate(
							cursorCoordinate.coordinate.dec,
							model.coordinatePrecision,
						),
					} satisfies CoordinateTooltipViewModel;
				})()
			: null;

	const footprintTooltip =
		model.tooltipMode === "footprint" &&
		hoveredFootprintModel &&
		hoveredFootprint
			? (() => {
					const position = resolveTooltipPosition(
						hoveredFootprint.anchor,
						containerRect,
						MAP_CANVAS_COORDINATE_TOOLTIP_OFFSET_PX,
					);

					if (!position) {
						return null;
					}

					const fileSummary = summarizeTooltipFiles(
						hoveredFootprintModel.files,
						MAP_CANVAS_FOOTPRINT_TOOLTIP_MAX_FILES,
					);
					const centerText = `${formatCoordinate(
						hoveredFootprintModel.center.ra,
						model.coordinatePrecision,
					)}°, ${formatCoordinate(
						hoveredFootprintModel.center.dec,
						model.coordinatePrecision,
					)}°`;

					return {
						position,
						footprintId: hoveredFootprintModel.id,
						centerText,
						filesCountText: `${hoveredFootprintModel.files.length} files`,
						previewFilesText:
							fileSummary.previewFiles.length > 0
								? fileSummary.previewFiles.join(", ")
								: null,
						overflowFilesText:
							fileSummary.overflowCount > 0
								? `+${fileSummary.overflowCount} more`
								: null,
					} satisfies FootprintTooltipViewModel;
				})()
			: null;

	const graticuleTooltip =
		model.tooltipMode === "footprint" &&
		!hoveredFootprintModel &&
		hoveredGraticule
			? (() => {
					const position = resolveTooltipPosition(
						hoveredGraticule.anchor,
						containerRect,
						MAP_CANVAS_COORDINATE_TOOLTIP_OFFSET_PX,
					);

					if (!position) {
						return null;
					}

					return {
						position,
						labelText: `${hoveredGraticule.kind === "ra" ? "RA" : "DEC"} ${formatCoordinate(
							hoveredGraticule.valueDeg,
							model.coordinatePrecision,
						)}°`,
					} satisfies GraticuleTooltipViewModel;
				})()
			: null;

	return {
		coordinateTooltip,
		footprintTooltip,
		graticuleTooltip,
		setHoveredFootprint,
		setHoveredGraticule,
		setCursorCoordinate,
	};
}
