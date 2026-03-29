import type { CartesianCoordinate, WorldCoordinate } from "./types";
import { DEG_TO_RAD, RAD_TO_DEG } from "./constant";

export function raDecToCartesian(
	coordinate: WorldCoordinate,
	radius = 1,
): CartesianCoordinate {
	const raRad = coordinate.ra * DEG_TO_RAD;
	const decRad = coordinate.dec * DEG_TO_RAD;
	const cosDec = Math.cos(decRad);

	return {
		x: radius * cosDec * Math.cos(raRad),
		y: radius * Math.sin(decRad),
		z: radius * cosDec * Math.sin(raRad),
	};
}

export function cartesianToRaDec(
	coordinate: CartesianCoordinate,
): WorldCoordinate {
	const radius = Math.hypot(coordinate.x, coordinate.y, coordinate.z) || 1;
	const dec = Math.asin(coordinate.y / radius) * RAD_TO_DEG;
	const ra = Math.atan2(coordinate.z, coordinate.x) * RAD_TO_DEG;

	return {
		ra: ra < 0 ? ra + 360 : ra,
		dec,
	};
}
