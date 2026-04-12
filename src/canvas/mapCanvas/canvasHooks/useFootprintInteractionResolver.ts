import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import type { MapCanvasFootprintModel } from "../api";
import { MAP_CANVAS_FOOTPRINT_HIT_RADIUS_OFFSET } from "../shared/constants";
import type { FootprintHoverState, ScreenPoint } from "../shared/types";
import {
	isPointInPolygon,
	isProjectedPointVisible,
	isWorldPointFacingCamera,
	ndcToScreenPoint,
	toFootprintPolygonPoints,
} from "../utils";

export interface UseFootprintInteractionResolverParams {
	footprints: MapCanvasFootprintModel[];
	radius: number;
	selectedFootprintId: string | null;
	selectFootprint: (id: string | null) => void;
}

interface FootprintPolygon {
	id: string;
	worldPoints: Array<[number, number, number]>;
}

function readCanvasPointerState(
	event: Pick<PointerEvent, "clientX" | "clientY">,
	element: Pick<Element, "getBoundingClientRect">,
) {
	const rect = element.getBoundingClientRect();

	return {
		client: {
			x: event.clientX,
			y: event.clientY,
		},
		local: {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		},
	};
}

export function useFootprintInteractionResolver({
	footprints,
	radius,
	selectedFootprintId,
	selectFootprint,
}: UseFootprintInteractionResolverParams) {
	const { camera, gl, size } = useThree();
	const polygonsRef = useRef<FootprintPolygon[]>([]);
	const pointerRef = useRef<ReturnType<typeof readCanvasPointerState> | null>(
		null,
	);
	const pointerDownHoverIdRef = useRef<string | null>(null);
	const selectedFootprintIdRef = useRef<string | null>(selectedFootprintId);
	const hoveredFootprintIdRef = useRef<string | null>(null);
	const lastHoverRef = useRef<FootprintHoverState | null>(null);
	const cameraPositionRef = useRef(new Vector3());
	const projectedPointRef = useRef(new Vector3());
	const [hoveredFootprint, setHoveredFootprint] =
		useState<FootprintHoverState | null>(null);

	useEffect(() => {
		selectedFootprintIdRef.current = selectedFootprintId;
	}, [selectedFootprintId]);

	useEffect(() => {
		const footprintRadius = radius * MAP_CANVAS_FOOTPRINT_HIT_RADIUS_OFFSET;

		polygonsRef.current = footprints.map((footprint) => ({
			id: footprint.id,
			worldPoints: toFootprintPolygonPoints(
				footprint.vertices,
				footprintRadius,
			).map((point) => [point.x, point.y, point.z] as [number, number, number]),
		}));
	}, [footprints, radius]);

	const resetHoverState = useCallback(() => {
		hoveredFootprintIdRef.current = null;
		pointerDownHoverIdRef.current = null;
		if (lastHoverRef.current !== null) {
			lastHoverRef.current = null;
			setHoveredFootprint(null);
		}
	}, []);

	const syncHoverState = (
		footprintId: string | null,
		anchor: ScreenPoint | null,
	) => {
		const current = lastHoverRef.current;

		if (
			current?.id === footprintId &&
			current?.anchor.x === anchor?.x &&
			current?.anchor.y === anchor?.y
		) {
			return;
		}

		if (!footprintId || !anchor) {
			lastHoverRef.current = null;
			setHoveredFootprint(null);
			return;
		}

		const nextHover = { id: footprintId, anchor };
		lastHoverRef.current = nextHover;
		setHoveredFootprint(nextHover);
	};

	const projectPolygonPoint = (
		worldPoint: FootprintPolygon["worldPoints"][number],
		cameraDirection: Vector3,
	): ScreenPoint | null => {
		if (!isWorldPointFacingCamera(worldPoint, cameraDirection)) {
			return null;
		}

		projectedPointRef.current
			.set(worldPoint[0], worldPoint[1], worldPoint[2])
			.project(camera);

		if (!isProjectedPointVisible(projectedPointRef.current)) {
			return null;
		}

		return ndcToScreenPoint(projectedPointRef.current, size);
	};

	const resolveCurrentHits = (
		pointer: ReturnType<typeof readCanvasPointerState>,
	): string[] => {
		const hits: string[] = [];
		const cameraDirection = camera
			.getWorldPosition(cameraPositionRef.current)
			.normalize();

		for (const polygon of polygonsRef.current) {
			if (polygon.worldPoints.length < 3) continue;

			const screenPoints: ScreenPoint[] = [];
			let isVisible = true;

			for (const worldPoint of polygon.worldPoints) {
				const screenPoint = projectPolygonPoint(worldPoint, cameraDirection);

				if (!screenPoint) {
					isVisible = false;
					break;
				}

				screenPoints.push(screenPoint);
			}

			if (!isVisible || screenPoints.length < 3) continue;
			if (isPointInPolygon(pointer.local, screenPoints)) {
				hits.push(polygon.id);
			}
		}

		return hits;
	};

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
		};

		const handlePointerDown = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
			pointerDownHoverIdRef.current = hoveredFootprintIdRef.current;
		};

		const handlePointerLeave = () => {
			pointerRef.current = null;
			resetHoverState();
		};

		const handlePointerUp = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
			const pointerDownHoverId = pointerDownHoverIdRef.current;
			const currentHoveredFootprintId = hoveredFootprintIdRef.current;
			pointerDownHoverIdRef.current = null;

			if (
				!pointerDownHoverId ||
				currentHoveredFootprintId !== pointerDownHoverId
			) {
				return;
			}

			selectFootprint(
				currentHoveredFootprintId === selectedFootprintIdRef.current
					? null
					: currentHoveredFootprintId,
			);
		};

		gl.domElement.addEventListener("pointermove", handlePointerMove);
		gl.domElement.addEventListener("pointerdown", handlePointerDown);
		gl.domElement.addEventListener("pointerleave", handlePointerLeave);
		gl.domElement.addEventListener("pointercancel", handlePointerLeave);
		gl.domElement.addEventListener("pointerup", handlePointerUp);

		return () => {
			gl.domElement.removeEventListener("pointermove", handlePointerMove);
			gl.domElement.removeEventListener("pointerdown", handlePointerDown);
			gl.domElement.removeEventListener("pointerleave", handlePointerLeave);
			gl.domElement.removeEventListener("pointercancel", handlePointerLeave);
			gl.domElement.removeEventListener("pointerup", handlePointerUp);
		};
	}, [gl, selectFootprint, resetHoverState]);

	useFrame(() => {
		if (!pointerRef.current) {
			resetHoverState();
			return;
		}

		const nextHitIds = resolveCurrentHits(pointerRef.current);
		const nextHoveredFootprintId =
			nextHitIds.length > 0 ? nextHitIds[nextHitIds.length - 1] : null;

		hoveredFootprintIdRef.current = nextHoveredFootprintId;

		syncHoverState(
			nextHoveredFootprintId,
			nextHoveredFootprintId ? pointerRef.current.client : null,
		);
	});

	return hoveredFootprint;
}
