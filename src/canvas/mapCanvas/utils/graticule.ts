import {
	MAP_CANVAS_DEFAULT_GRATICULE_MERIDIAN_STEP_DEG,
	MAP_CANVAS_DEFAULT_GRATICULE_PARALLEL_STEP_DEG,
	MAP_CANVAS_GRATICULE_POINT_STEP_DEG,
} from "../shared/constants";
import type { GraticuleLine } from "../shared/types";
import { raDecToCartesian } from "./celestial";

function createMeridianPoints(ra: number, radius: number) {
	const points = [];

	for (let dec = -90; dec <= 90; dec += MAP_CANVAS_GRATICULE_POINT_STEP_DEG) {
		points.push(raDecToCartesian({ ra, dec }, radius));
	}

	return points;
}

function createParallelPoints(dec: number, radius: number) {
	const points = [];

	for (let ra = 0; ra <= 360; ra += MAP_CANVAS_GRATICULE_POINT_STEP_DEG) {
		points.push(raDecToCartesian({ ra, dec }, radius));
	}

	return points;
}

export interface CreateGraticuleLinesParams {
	radius?: number;
	meridianStepDeg?: number;
	parallelStepDeg?: number;
}

export function createGraticuleLines({
	radius = 1,
	meridianStepDeg = MAP_CANVAS_DEFAULT_GRATICULE_MERIDIAN_STEP_DEG,
	parallelStepDeg = MAP_CANVAS_DEFAULT_GRATICULE_PARALLEL_STEP_DEG,
}: CreateGraticuleLinesParams = {}): GraticuleLine[] {
	const lines: GraticuleLine[] = [];

	for (let ra = 0; ra < 360; ra += meridianStepDeg) {
		lines.push({
			kind: "ra",
			valueDeg: ra,
			points: createMeridianPoints(ra, radius),
		});
	}

	for (let dec = -60; dec <= 60; dec += parallelStepDeg) {
		lines.push({
			kind: "dec",
			valueDeg: dec,
			points: createParallelPoints(dec, radius),
		});
	}

	return lines;
}
