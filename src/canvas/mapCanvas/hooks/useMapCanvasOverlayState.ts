import { useState } from "react";
import type {
	CursorCoordinateState,
	FootprintHoverState,
	HoveredGraticule,
} from "../shared/types";

export interface UseMapCanvasOverlayStateResult {
	hoveredFootprint: FootprintHoverState | null;
	hoveredGraticule: HoveredGraticule | null;
	cursorCoordinate: CursorCoordinateState | null;
	setHoveredFootprint: (hoveredFootprint: FootprintHoverState | null) => void;
	setHoveredGraticule: (hoveredGraticule: HoveredGraticule | null) => void;
	setCursorCoordinate: (cursorCoordinate: CursorCoordinateState | null) => void;
}

export function useMapCanvasOverlayState(): UseMapCanvasOverlayStateResult {
	const [hoveredFootprint, setHoveredFootprint] =
		useState<FootprintHoverState | null>(null);
	const [hoveredGraticule, setHoveredGraticule] =
		useState<HoveredGraticule | null>(null);
	const [cursorCoordinate, setCursorCoordinate] =
		useState<CursorCoordinateState | null>(null);

	return {
		hoveredFootprint,
		hoveredGraticule,
		cursorCoordinate,
		setHoveredFootprint,
		setHoveredGraticule,
		setCursorCoordinate,
	};
}
