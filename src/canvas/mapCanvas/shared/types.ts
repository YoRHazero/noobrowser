import type { MapCanvasScreenPoint, MapCanvasSkyCoordinate } from "../api";

export type SkyCoordinate = MapCanvasSkyCoordinate;
export type ScreenPoint = MapCanvasScreenPoint;

export interface CartesianCoordinate {
	x: number;
	y: number;
	z: number;
}

export type WorldPointInput = CartesianCoordinate | [number, number, number];

export interface ViewportSize {
	width: number;
	height: number;
}

export type GraticuleKind = "ra" | "dec";

export interface GraticuleLine {
	kind: GraticuleKind;
	valueDeg: number;
	points: CartesianCoordinate[];
}

export interface HoveredGraticule {
	kind: GraticuleKind;
	valueDeg: number;
	anchor: ScreenPoint;
}

export interface FootprintHoverState {
	id: string;
	anchor: ScreenPoint;
}

export interface CursorCoordinateState {
	coordinate: SkyCoordinate;
	anchor: ScreenPoint;
}

export interface TooltipPosition {
	left: number;
	top: number;
}

export interface MapCanvasContainerRect {
	left: number;
	top: number;
}

export interface CoordinateTooltipViewModel {
	position: TooltipPosition;
	raText: string;
	decText: string;
}

export interface FootprintTooltipViewModel {
	position: TooltipPosition;
	footprintId: string;
	centerText: string;
	filesCountText: string;
	previewFilesText: string | null;
	overflowFilesText: string | null;
}

export interface GraticuleTooltipViewModel {
	position: TooltipPosition;
	labelText: string;
}
