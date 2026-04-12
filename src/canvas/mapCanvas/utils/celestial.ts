import {
	MAP_CANVAS_DEG_TO_RAD,
	MAP_CANVAS_RAD_TO_DEG,
} from "../shared/constants";
import type { CartesianCoordinate, SkyCoordinate } from "../shared/types";

export function raDecToCartesian(
	coordinate: SkyCoordinate,
	radius = 1,
): CartesianCoordinate {
	const raRad = coordinate.ra * MAP_CANVAS_DEG_TO_RAD;
	const decRad = coordinate.dec * MAP_CANVAS_DEG_TO_RAD;
	const cosDec = Math.cos(decRad);

	return {
		x: radius * cosDec * Math.cos(raRad),
		y: radius * Math.sin(decRad),
		z: radius * cosDec * Math.sin(raRad),
	};
}

export function cartesianToRaDec(
	coordinate: CartesianCoordinate,
): SkyCoordinate {
	const radius = Math.hypot(coordinate.x, coordinate.y, coordinate.z) || 1;
	const dec = Math.asin(coordinate.y / radius) * MAP_CANVAS_RAD_TO_DEG;
	const ra = Math.atan2(coordinate.z, coordinate.x) * MAP_CANVAS_RAD_TO_DEG;

	return {
		ra: ra < 0 ? ra + 360 : ra,
		dec,
	};
}
