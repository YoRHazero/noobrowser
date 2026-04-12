export interface WorldCoordinate {
	ra: number;
	dec: number;
}

export interface CartesianCoordinate {
	x: number;
	y: number;
	z: number;
}

export interface ScreenPoint {
	x: number;
	y: number;
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

export interface GraticuleConfig {
	radius?: number;
	meridianStepDeg?: number;
	parallelStepDeg?: number;
}

export interface HoveredGraticule {
	kind: GraticuleKind;
	valueDeg: number;
	anchor: ScreenPoint;
}

export interface OverviewFootprintMeta {
	included_files?: string[];
	[key: string]: unknown;
}

export interface OverviewFootprintRecord {
	id: string;
	vertices: WorldCoordinate[];
	center: WorldCoordinate;
	meta: OverviewFootprintMeta;
}
