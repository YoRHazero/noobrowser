import { useEffect, useMemo } from "react";
import type { MapCanvasActions, MapCanvasModel } from "../api";
import { useCursorCoordinateResolver } from "../canvasHooks/useCursorCoordinateResolver";
import { useFootprintInteractionResolver } from "../canvasHooks/useFootprintInteractionResolver";
import { useGraticuleDensity } from "../canvasHooks/useGraticuleDensity";
import { useGraticuleHoverResolver } from "../canvasHooks/useGraticuleHoverResolver";
import { useSourceCreationRequest } from "../canvasHooks/useSourceCreationRequest";
import { FootprintsLayer } from "../layers/FootprintsLayer";
import { GlobeLayer } from "../layers/GlobeLayer";
import { GraticuleLayer } from "../layers/GraticuleLayer";
import { SourcesLayer } from "../layers/SourcesLayer";
import {
	MAP_CANVAS_GLOBE_RADIUS,
	MAP_CANVAS_GRATICULE_RADIUS_OFFSET,
} from "../shared/constants";
import type {
	CursorCoordinateState,
	FootprintHoverState,
	HoveredGraticule,
} from "../shared/types";
import { createGraticuleLines } from "../utils";
import { CameraRig } from "./CameraRig";
import { SceneEnvironment } from "./SceneEnvironment";

export interface SceneContentProps {
	model: MapCanvasModel;
	actions: MapCanvasActions;
	onHoveredFootprintChange: (
		hoveredFootprint: FootprintHoverState | null,
	) => void;
	onHoveredGraticuleChange: (hoveredGraticule: HoveredGraticule | null) => void;
	onCursorCoordinateChange: (
		cursorCoordinate: CursorCoordinateState | null,
	) => void;
}

export function SceneContent({
	model,
	actions,
	onHoveredFootprintChange,
	onHoveredGraticuleChange,
	onCursorCoordinateChange,
}: SceneContentProps) {
	const graticuleDensity = useGraticuleDensity({
		radius: MAP_CANVAS_GLOBE_RADIUS,
	});
	const graticuleLines = useMemo(
		() =>
			createGraticuleLines({
				radius: MAP_CANVAS_GLOBE_RADIUS * MAP_CANVAS_GRATICULE_RADIUS_OFFSET,
				meridianStepDeg: graticuleDensity.meridianStepDeg,
				parallelStepDeg: graticuleDensity.parallelStepDeg,
			}),
		[graticuleDensity.meridianStepDeg, graticuleDensity.parallelStepDeg],
	);
	const hoveredFootprint = useFootprintInteractionResolver({
		footprints: model.footprints,
		radius: MAP_CANVAS_GLOBE_RADIUS,
		selectedFootprintId: model.selectedFootprintId,
		selectFootprint: actions.selectFootprint,
	});
	const hoveredGraticule = useGraticuleHoverResolver({
		lines: graticuleLines,
		visible: model.showGrid,
		suppressHover:
			hoveredFootprint !== null || model.tooltipMode === "coordinate",
	});
	const cursorCoordinate = useCursorCoordinateResolver({
		enabled: model.tooltipMode === "coordinate",
		radius: MAP_CANVAS_GLOBE_RADIUS,
	});
	useSourceCreationRequest({
		requestCreateSource: actions.requestCreateSource,
		radius: MAP_CANVAS_GLOBE_RADIUS,
	});

	useEffect(() => {
		onHoveredFootprintChange(hoveredFootprint);
	}, [hoveredFootprint, onHoveredFootprintChange]);

	useEffect(() => {
		onHoveredGraticuleChange(hoveredGraticule);
	}, [hoveredGraticule, onHoveredGraticuleChange]);

	useEffect(() => {
		onCursorCoordinateChange(cursorCoordinate);
	}, [cursorCoordinate, onCursorCoordinateChange]);

	return (
		<>
			<SceneEnvironment />
			<CameraRig />
			<GlobeLayer radius={MAP_CANVAS_GLOBE_RADIUS} />
			<GraticuleLayer visible={model.showGrid} lines={graticuleLines} />
			<FootprintsLayer
				footprints={model.footprints}
				selectedFootprintId={model.selectedFootprintId}
				hoveredFootprintId={hoveredFootprint?.id ?? null}
				radius={MAP_CANVAS_GLOBE_RADIUS}
			/>
			<SourcesLayer sources={model.sources} radius={MAP_CANVAS_GLOBE_RADIUS} />
		</>
	);
}
