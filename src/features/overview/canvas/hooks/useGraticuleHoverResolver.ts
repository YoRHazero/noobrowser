import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Vector3 } from "three";
import type {
	GraticuleLine,
	HoveredGraticule,
	ScreenPoint,
} from "@/features/overview/shared/types";
import {
	isProjectedPointVisible,
	isWorldPointFacingCamera,
	ndcToScreenPoint,
} from "@/features/overview/utils/projection";
import {
	type CanvasPointerState,
	readCanvasPointerState,
} from "./shared/canvasPointer";

export interface UseGraticuleHoverResolverParams {
	lines: GraticuleLine[];
	visible: boolean;
	suppressHover: boolean;
	onHoverChange: (hoveredGraticule: HoveredGraticule | null) => void;
}

interface GraticuleHoverCandidate {
	kind: GraticuleLine["kind"];
	valueDeg: number;
	distance: number;
}

const GRATICULE_HOVER_THRESHOLD_PX = 8;
const RA_PRIORITY_EPSILON_PX = 1;

function distanceToSegment(
	point: ScreenPoint,
	start: ScreenPoint,
	end: ScreenPoint,
) {
	const dx = end.x - start.x;
	const dy = end.y - start.y;
	const segmentLengthSquared = dx * dx + dy * dy;

	if (segmentLengthSquared === 0) {
		return Math.hypot(point.x - start.x, point.y - start.y);
	}

	const t = Math.max(
		0,
		Math.min(
			1,
			((point.x - start.x) * dx + (point.y - start.y) * dy) /
				segmentLengthSquared,
		),
	);
	const projectedX = start.x + dx * t;
	const projectedY = start.y + dy * t;

	return Math.hypot(point.x - projectedX, point.y - projectedY);
}

export function useGraticuleHoverResolver({
	lines,
	visible,
	suppressHover,
	onHoverChange,
}: UseGraticuleHoverResolverParams) {
	const { camera, gl, size } = useThree();
	const pointerRef = useRef<CanvasPointerState | null>(null);
	const callbackRef = useRef(onHoverChange);
	const lastHoverRef = useRef<HoveredGraticule | null>(null);
	const cameraPositionRef = useRef(new Vector3());
	const projectedPointRef = useRef(new Vector3());

	useEffect(() => {
		callbackRef.current = onHoverChange;
	}, [onHoverChange]);

	const clearHover = useCallback(() => {
		if (lastHoverRef.current === null) {
			return;
		}

		lastHoverRef.current = null;
		callbackRef.current(null);
	}, []);

	const projectPoint = (
		point: GraticuleLine["points"][number],
		cameraDirection: Vector3,
	): ScreenPoint | null => {
		if (!isWorldPointFacingCamera(point, cameraDirection)) {
			return null;
		}

		projectedPointRef.current.set(point.x, point.y, point.z).project(camera);

		if (!isProjectedPointVisible(projectedPointRef.current)) {
			return null;
		}

		return ndcToScreenPoint(projectedPointRef.current, size);
	};

	const resolveHover = (
		pointer: CanvasPointerState,
	): HoveredGraticule | null => {
		const candidates: GraticuleHoverCandidate[] = [];
		const cameraDirection = camera
			.getWorldPosition(cameraPositionRef.current)
			.normalize();

		for (const line of lines) {
			let minDistance = Number.POSITIVE_INFINITY;

			for (let index = 1; index < line.points.length; index += 1) {
				const start = projectPoint(line.points[index - 1], cameraDirection);
				const end = projectPoint(line.points[index], cameraDirection);

				if (!start || !end) {
					continue;
				}

				const distance = distanceToSegment(pointer.local, start, end);
				if (distance < minDistance) {
					minDistance = distance;
				}
			}

			if (minDistance <= GRATICULE_HOVER_THRESHOLD_PX) {
				candidates.push({
					kind: line.kind,
					valueDeg: line.valueDeg,
					distance: minDistance,
				});
			}
		}

		if (candidates.length === 0) {
			return null;
		}

		candidates.sort((left, right) => {
			const distanceDelta = left.distance - right.distance;

			if (Math.abs(distanceDelta) <= RA_PRIORITY_EPSILON_PX) {
				if (left.kind !== right.kind) {
					return left.kind === "ra" ? -1 : 1;
				}
			}

			return distanceDelta;
		});

		return {
			kind: candidates[0].kind,
			valueDeg: candidates[0].valueDeg,
			anchor: pointer.client,
		};
	};

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
		};

		const handlePointerLeave = () => {
			pointerRef.current = null;
			clearHover();
		};

		gl.domElement.addEventListener("pointermove", handlePointerMove);
		gl.domElement.addEventListener("pointerleave", handlePointerLeave);
		gl.domElement.addEventListener("pointercancel", handlePointerLeave);

		return () => {
			gl.domElement.removeEventListener("pointermove", handlePointerMove);
			gl.domElement.removeEventListener("pointerleave", handlePointerLeave);
			gl.domElement.removeEventListener("pointercancel", handlePointerLeave);
		};
	}, [gl, clearHover]);

	useEffect(() => {
		if (visible && !suppressHover) {
			return;
		}

		clearHover();
	}, [visible, suppressHover, clearHover]);

	useFrame(() => {
		if (!visible || suppressHover || !pointerRef.current) {
			clearHover();
			return;
		}

		const nextHover = resolveHover(pointerRef.current);
		const currentHover = lastHoverRef.current;

		if (
			currentHover?.kind === nextHover?.kind &&
			currentHover?.valueDeg === nextHover?.valueDeg &&
			currentHover?.anchor.x === nextHover?.anchor.x &&
			currentHover?.anchor.y === nextHover?.anchor.y
		) {
			return;
		}

		lastHoverRef.current = nextHover;
		callbackRef.current(nextHover);
	});
}
