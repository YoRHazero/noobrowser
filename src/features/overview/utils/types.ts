export interface EquatorialCoordinate {
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

export interface GraticuleLine {
	points: CartesianCoordinate[];
}

export interface GraticuleConfig {
	radius?: number;
	meridianStepDeg?: number;
	parallelStepDeg?: number;
}

export type FootprintGeometryVertex = EquatorialCoordinate;

export interface OverviewFootprintMeta {
	included_files?: string[];
	[key: string]: unknown;
}

export interface OverviewFootprintRecord {
	id: string;
	vertices: EquatorialCoordinate[];
	center: EquatorialCoordinate;
	meta: OverviewFootprintMeta;
}
