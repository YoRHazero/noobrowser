import { GRATICULE_POINT_STEP_DEG } from "./constant";
import { raDecToCartesian } from "./celestial";
import type { CartesianCoordinate, GraticuleConfig, GraticuleLine } from "./types";

function createMeridianPoints(ra: number, radius: number): CartesianCoordinate[] {
	const points: CartesianCoordinate[] = [];
	for (let dec = -90; dec <= 90; dec += GRATICULE_POINT_STEP_DEG) {
		points.push(raDecToCartesian({ ra, dec }, radius));
	}
	return points;
}

function createParallelPoints(
	dec: number,
	radius: number,
): CartesianCoordinate[] {
	const points: CartesianCoordinate[] = [];
	for (let ra = 0; ra <= 360; ra += GRATICULE_POINT_STEP_DEG) {
		points.push(raDecToCartesian({ ra, dec }, radius));
	}
	return points;
}

export function createGraticuleLines({
	radius = 1,
	meridianStepDeg = 30,
	parallelStepDeg = 30,
}: GraticuleConfig = {}): GraticuleLine[] {
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
