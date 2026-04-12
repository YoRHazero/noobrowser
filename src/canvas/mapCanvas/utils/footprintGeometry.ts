import { MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET } from "../shared/constants";
import type {
	CartesianCoordinate,
	ScreenPoint,
	SkyCoordinate,
} from "../shared/types";
import { raDecToCartesian } from "./celestial";

export function toFootprintPolygonPoints(
	vertices: SkyCoordinate[],
	radius = MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
): CartesianCoordinate[] {
	return vertices.map((vertex) => raDecToCartesian(vertex, radius));
}

export function toFootprintLinePoints(
	vertices: SkyCoordinate[],
	radius = MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
): CartesianCoordinate[] {
	const points = toFootprintPolygonPoints(vertices, radius);

	if (points.length > 1) {
		const first = points[0];
		const last = points[points.length - 1];

		if (last.x !== first.x || last.y !== first.y || last.z !== first.z) {
			points.push(points[0]);
		}
	}

	return points;
}

export function isPointInPolygon(
	point: ScreenPoint,
	polygon: ScreenPoint[],
): boolean {
	if (polygon.length < 3) return false;

	let inside = false;

	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const vertexI = polygon[i];
		const vertexJ = polygon[j];
		const intersects =
			vertexI.y > point.y !== vertexJ.y > point.y &&
			point.x <
				((vertexJ.x - vertexI.x) * (point.y - vertexI.y)) /
					(vertexJ.y - vertexI.y) +
					vertexI.x;

		if (intersects) {
			inside = !inside;
		}
	}

	return inside;
}
