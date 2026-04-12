import type {
	CartesianCoordinate,
	ViewportSize,
	WorldPointInput,
} from "../shared/types";

function getPointX(point: WorldPointInput) {
	return Array.isArray(point) ? point[0] : point.x;
}

function getPointY(point: WorldPointInput) {
	return Array.isArray(point) ? point[1] : point.y;
}

function getPointZ(point: WorldPointInput) {
	return Array.isArray(point) ? point[2] : point.z;
}

export function isWorldPointFacingCamera(
	point: WorldPointInput,
	cameraDirection: CartesianCoordinate,
) {
	return (
		getPointX(point) * cameraDirection.x +
			getPointY(point) * cameraDirection.y +
			getPointZ(point) * cameraDirection.z >
		0
	);
}

export function isProjectedPointVisible(point: CartesianCoordinate) {
	return (
		Number.isFinite(point.x) &&
		Number.isFinite(point.y) &&
		Number.isFinite(point.z) &&
		point.z >= -1 &&
		point.z <= 1
	);
}

export function ndcToScreenPoint(
	point: CartesianCoordinate,
	viewport: ViewportSize,
) {
	return {
		x: ((point.x + 1) / 2) * viewport.width,
		y: ((1 - point.y) / 2) * viewport.height,
	};
}
