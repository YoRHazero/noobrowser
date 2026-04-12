import { FOOTPRINT_LINE_RADIUS_OFFSET } from "../shared/constants";
import type {
	CartesianCoordinate,
	ScreenPoint,
	WorldCoordinate,
} from "../shared/types";
import { raDecToCartesian } from "./celestial";

export function toFootprintPolygonPoints(
	vertices: WorldCoordinate[],
	radius = FOOTPRINT_LINE_RADIUS_OFFSET,
): CartesianCoordinate[] {
	return vertices.map((vertex) => raDecToCartesian(vertex, radius));
}

export function toFootprintLinePoints(
	vertices: WorldCoordinate[],
	radius = FOOTPRINT_LINE_RADIUS_OFFSET,
): CartesianCoordinate[] {
	const points = toFootprintPolygonPoints(vertices, radius);

	if (points.length > 1) {
		const [firstX, firstY, firstZ] = [points[0].x, points[0].y, points[0].z];
		const last = points[points.length - 1];
		if (last.x !== firstX || last.y !== firstY || last.z !== firstZ) {
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
