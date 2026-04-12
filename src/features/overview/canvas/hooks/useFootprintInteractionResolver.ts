import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Vector3 } from "three";
import { FOOTPRINT_LINE_RADIUS_OFFSET } from "@/features/overview/shared/constants";
import type {
	OverviewFootprintRecord,
	ScreenPoint,
} from "@/features/overview/shared/types";
import {
	isPointInPolygon,
	toFootprintPolygonPoints,
} from "@/features/overview/utils/footprintGeometry";
import {
	isProjectedPointVisible,
	isWorldPointFacingCamera,
	ndcToScreenPoint,
} from "@/features/overview/utils/projection";
import {
	type CanvasPointerState,
	readCanvasPointerState,
} from "./shared/canvasPointer";

export interface UseFootprintInteractionResolverParams {
	footprints: OverviewFootprintRecord[];
	radius: number;
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	setSelectedFootprintId: (id: string | null) => void;
	setHoveredFootprint: (id: string | null, anchor?: ScreenPoint | null) => void;
	clearHoveredFootprint: () => void;
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
	selectedFootprintId,
	hoveredFootprintId,
	setSelectedFootprintId,
	setHoveredFootprint,
	clearHoveredFootprint,
}: UseFootprintInteractionResolverParams) {
	const { camera, gl, size } = useThree();
	const polygonsRef = useRef<FootprintPolygon[]>([]);
	const pointerRef = useRef<CanvasPointerState | null>(null);
	const pointerDownHoverIdRef = useRef<string | null>(null);
	const prevHitIdsRef = useRef<Set<string>>(new Set());
	const enterOrderRef = useRef<Map<string, number>>(new Map());
	const nextEnterOrderRef = useRef(1);
	const setSelectedFootprintIdRef = useRef(setSelectedFootprintId);
	const setHoveredFootprintRef = useRef(setHoveredFootprint);
	const clearHoveredFootprintRef = useRef(clearHoveredFootprint);
	const selectedFootprintIdRef = useRef<string | null>(selectedFootprintId);
	const hoveredFootprintIdRef = useRef<string | null>(hoveredFootprintId);
	const lastHoverRef = useRef<HoverResolutionState>({
		id: null,
		anchor: null,
	});
	const cameraPositionRef = useRef(new Vector3());
	const projectedPointRef = useRef(new Vector3());

	useEffect(() => {
		setSelectedFootprintIdRef.current = setSelectedFootprintId;
	}, [setSelectedFootprintId]);

	useEffect(() => {
		setHoveredFootprintRef.current = setHoveredFootprint;
	}, [setHoveredFootprint]);

	useEffect(() => {
		clearHoveredFootprintRef.current = clearHoveredFootprint;
	}, [clearHoveredFootprint]);

	useEffect(() => {
		selectedFootprintIdRef.current = selectedFootprintId;
	}, [selectedFootprintId]);

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

	const resetHoverState = useCallback(() => {
		prevHitIdsRef.current = new Set();
		enterOrderRef.current.clear();
		nextEnterOrderRef.current = 1;

		if (lastHoverRef.current.id !== null) {
			clearHoveredFootprintRef.current();
			lastHoverRef.current = {
				id: null,
				anchor: null,
			};
		}
	}, []);

	const syncHoverState = (
		footprintId: string | null,
		anchor: ScreenPoint | null,
	) => {
		const lastHover = lastHoverRef.current;
		const anchorUnchanged =
			lastHover.anchor?.x === anchor?.x && lastHover.anchor?.y === anchor?.y;

		if (lastHover.id === footprintId && anchorUnchanged) {
			return;
		}

		if (!footprintId || !anchor) {
			clearHoveredFootprintRef.current();
			lastHoverRef.current = {
				id: null,
				anchor: null,
			};
			return;
		}

		setHoveredFootprintRef.current(footprintId, anchor);
		lastHoverRef.current = {
			id: footprintId,
			anchor,
		};
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

	const resolveCurrentHits = (point: ScreenPoint): string[] => {
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
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
		};

		const handlePointerDown = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
			pointerDownHoverIdRef.current = hoveredFootprintIdRef.current;
		};

		const handlePointerLeave = () => {
			pointerRef.current = null;
			pointerDownHoverIdRef.current = null;
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

			setSelectedFootprintIdRef.current(
				currentHoveredFootprintId === selectedFootprintIdRef.current
					? null
					: currentHoveredFootprintId,
			);
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
	}, [gl, resetHoverState]);

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
