import { FOOTPRINT_LINE_RADIUS_OFFSET } from "./constant";
import { raDecToCartesian } from "./celestial";
import type { CartesianCoordinate, FootprintGeometryVertex } from "./types";

export function toFootprintLinePoints(
	vertices: FootprintGeometryVertex[],
	radius = FOOTPRINT_LINE_RADIUS_OFFSET,
): CartesianCoordinate[] {
	const points = vertices.map((vertex) => raDecToCartesian(vertex, radius));

	if (points.length > 1) {
		const [firstX, firstY, firstZ] = [points[0].x, points[0].y, points[0].z];
		const last = points[points.length - 1];
		if (last.x !== firstX || last.y !== firstY || last.z !== firstZ) {
			points.push(points[0]);
		}
	}

	return points;
}
