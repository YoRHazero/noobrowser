import { clampValue } from "./clampValue";

export interface MapSpatialToWorldYParams {
	value: number;
	spatialMin: number;
	spatialMax: number;
	height: number;
}

export function mapSpatialToWorldY({
	value,
	spatialMin,
	spatialMax,
	height,
}: MapSpatialToWorldYParams): number {
	if (height <= 1 || spatialMax === spatialMin) {
		return 0;
	}

	const normalized = clampValue(
		(value - spatialMin) / (spatialMax - spatialMin),
		0,
		1,
	);
	return -normalized * (height - 1);
}
