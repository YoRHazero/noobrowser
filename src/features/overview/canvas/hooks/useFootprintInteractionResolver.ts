import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { FOOTPRINT_LINE_RADIUS_OFFSET } from "@/features/overview/utils/constant";
import {
	isPointInPolygon,
	toFootprintPolygonPoints,
} from "@/features/overview/utils/footprintGeometry";
import type {
	OverviewFootprintRecord,
	ScreenPoint,
} from "@/features/overview/utils/types";
import type { UseFootprintEventsResult } from "./useFootprintEvents";

export interface UseFootprintInteractionResolverParams {
	footprints: OverviewFootprintRecord[];
	radius: number;
	hoveredFootprintId: string | null;
	events: UseFootprintEventsResult;
}

interface PointerState {
	client: ScreenPoint;
	local: ScreenPoint;
}

interface FootprintPolygon {
	id: string;
	worldPoints: Array<[number, number, number]>;
}

interface HoverResolutionState {
	id: string | null;
	anchor: ScreenPoint | null;
}

export function useFootprintInteractionResolver({
	footprints,
	radius,
	hoveredFootprintId,
	events,
}: UseFootprintInteractionResolverParams) {
	const { camera, gl, size } = useThree();
	const polygonsRef = useRef<FootprintPolygon[]>([]);
	const pointerRef = useRef<PointerState | null>(null);
	const pointerDownHoverIdRef = useRef<string | null>(null);
	const prevHitIdsRef = useRef<Set<string>>(new Set());
	const enterOrderRef = useRef<Map<string, number>>(new Map());
	const nextEnterOrderRef = useRef(1);
	const eventsRef = useRef(events);
	const hoveredFootprintIdRef = useRef<string | null>(hoveredFootprintId);
	const lastHoverRef = useRef<HoverResolutionState>({
		id: null,
		anchor: null,
	});
	const cameraPositionRef = useRef(new Vector3());
	const projectedPointRef = useRef(new Vector3());

	useEffect(() => {
		eventsRef.current = events;
	}, [events]);

	useEffect(() => {
		hoveredFootprintIdRef.current = hoveredFootprintId;
	}, [hoveredFootprintId]);

	useEffect(() => {
		const footprintRadius = radius * FOOTPRINT_LINE_RADIUS_OFFSET;

		polygonsRef.current = footprints.map((footprint) => ({
			id: footprint.id,
			worldPoints: toFootprintPolygonPoints(
				footprint.vertices,
				footprintRadius,
			).map((point) => [point.x, point.y, point.z] as [number, number, number]),
		}));
	}, [footprints, radius]);

	const resetHoverState = () => {
		prevHitIdsRef.current = new Set();
		enterOrderRef.current.clear();
		nextEnterOrderRef.current = 1;

		if (lastHoverRef.current.id !== null) {
			eventsRef.current.onFootprintHoverClear();
			lastHoverRef.current = {
				id: null,
				anchor: null,
			};
		}
	};

	const syncHoverState = (footprintId: string | null, anchor: ScreenPoint | null) => {
		const lastHover = lastHoverRef.current;
		const anchorUnchanged =
			lastHover.anchor?.x === anchor?.x && lastHover.anchor?.y === anchor?.y;

		if (lastHover.id === footprintId && anchorUnchanged) {
			return;
		}

		if (!footprintId || !anchor) {
			eventsRef.current.onFootprintHoverClear();
			lastHoverRef.current = {
				id: null,
				anchor: null,
			};
			return;
		}

		eventsRef.current.onFootprintHover(footprintId, anchor);
		lastHoverRef.current = {
			id: footprintId,
			anchor,
		};
	};

	const getPointerState = (event: PointerEvent): PointerState => {
		const rect = gl.domElement.getBoundingClientRect();

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
	};

	const resolveCurrentHits = (point: ScreenPoint): string[] => {
		const hits: string[] = [];
		const cameraDirection = camera.getWorldPosition(cameraPositionRef.current).normalize();

		for (const polygon of polygonsRef.current) {
			if (polygon.worldPoints.length < 3) continue;

			const screenPoints: ScreenPoint[] = [];
			let isVisible = true;

			for (const worldPoint of polygon.worldPoints) {
				const dot =
					worldPoint[0] * cameraDirection.x +
					worldPoint[1] * cameraDirection.y +
					worldPoint[2] * cameraDirection.z;

				if (dot <= 0) {
					isVisible = false;
					break;
				}

				projectedPointRef.current
					.set(worldPoint[0], worldPoint[1], worldPoint[2])
					.project(camera);

				if (
					!Number.isFinite(projectedPointRef.current.x) ||
					!Number.isFinite(projectedPointRef.current.y) ||
					!Number.isFinite(projectedPointRef.current.z) ||
					projectedPointRef.current.z < -1 ||
					projectedPointRef.current.z > 1
				) {
					isVisible = false;
					break;
				}

				screenPoints.push({
					x: ((projectedPointRef.current.x + 1) / 2) * size.width,
					y: ((1 - projectedPointRef.current.y) / 2) * size.height,
				});
			}

			if (!isVisible || screenPoints.length < 3) continue;
			if (isPointInPolygon(point, screenPoints)) {
				hits.push(polygon.id);
			}
		}

		return hits;
	};

	const resolveHoveredFootprintId = (currentHits: string[]): string | null => {
		const currentHitSet = new Set(currentHits);

		for (const footprintId of currentHits) {
			if (!prevHitIdsRef.current.has(footprintId)) {
				enterOrderRef.current.set(footprintId, nextEnterOrderRef.current++);
			}
		}

		for (const footprintId of Array.from(enterOrderRef.current.keys())) {
			if (!currentHitSet.has(footprintId)) {
				enterOrderRef.current.delete(footprintId);
			}
		}

		prevHitIdsRef.current = currentHitSet;

		let hoveredFootprintId: string | null = null;
		let hoveredFootprintOrder = -1;

		for (const footprintId of currentHits) {
			const enterOrder = enterOrderRef.current.get(footprintId) ?? -1;

			if (enterOrder >= hoveredFootprintOrder) {
				hoveredFootprintOrder = enterOrder;
				hoveredFootprintId = footprintId;
			}
		}

		return hoveredFootprintId;
	};

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			pointerRef.current = getPointerState(event);
		};

		const handlePointerDown = (event: PointerEvent) => {
			pointerRef.current = getPointerState(event);
			pointerDownHoverIdRef.current = hoveredFootprintIdRef.current;
		};

		const handlePointerLeave = () => {
			pointerRef.current = null;
			pointerDownHoverIdRef.current = null;
			resetHoverState();
		};

		const handlePointerUp = (event: PointerEvent) => {
			pointerRef.current = getPointerState(event);
			const pointerDownHoverId = pointerDownHoverIdRef.current;
			const currentHoveredFootprintId = hoveredFootprintIdRef.current;
			pointerDownHoverIdRef.current = null;

			if (
				!pointerDownHoverId ||
				currentHoveredFootprintId !== pointerDownHoverId
			) {
				return;
			}

			eventsRef.current.onFootprintClick();
		};

		gl.domElement.addEventListener("pointermove", handlePointerMove);
		gl.domElement.addEventListener("pointerdown", handlePointerDown);
		gl.domElement.addEventListener("pointerup", handlePointerUp);
		gl.domElement.addEventListener("pointerleave", handlePointerLeave);
		gl.domElement.addEventListener("pointercancel", handlePointerLeave);

		return () => {
			gl.domElement.removeEventListener("pointermove", handlePointerMove);
			gl.domElement.removeEventListener("pointerdown", handlePointerDown);
			gl.domElement.removeEventListener("pointerup", handlePointerUp);
			gl.domElement.removeEventListener("pointerleave", handlePointerLeave);
			gl.domElement.removeEventListener("pointercancel", handlePointerLeave);
		};
	}, [gl]);

	useFrame(() => {
		if (!pointerRef.current) return;

		const currentHits = resolveCurrentHits(pointerRef.current.local);
		const hoveredFootprintId = resolveHoveredFootprintId(currentHits);

		if (!hoveredFootprintId) {
			syncHoverState(null, null);
			return;
		}

		syncHoverState(hoveredFootprintId, pointerRef.current.client);
	});
}
