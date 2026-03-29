import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Raycaster, Sphere, Vector2, Vector3 } from "three";
import { cartesianToRaDec } from "@/features/overview/utils/celestial";
import type {
	OverviewCursorWorldCoordinate,
	OverviewHoverAnchor,
} from "@/stores/overview";
import type { CanvasPointerState } from "./shared/canvasPointer";
import { readCanvasPointerState } from "./shared/canvasPointer";

export interface UseCursorWorldCoordinateResolverParams {
	enabled: boolean;
	radius: number;
	setCursorWorldCoordinate: (
		coordinate: OverviewCursorWorldCoordinate | null,
	) => void;
	clearCursorWorldCoordinate: () => void;
}

export function useCursorWorldCoordinateResolver({
	enabled,
	radius,
	setCursorWorldCoordinate,
	clearCursorWorldCoordinate,
}: UseCursorWorldCoordinateResolverParams) {
	const { camera, gl, size } = useThree();
	const pointerRef = useRef<CanvasPointerState | null>(null);
	const enabledRef = useRef(enabled);
	const cameraRef = useRef(camera);
	const setCursorWorldCoordinateRef = useRef(setCursorWorldCoordinate);
	const clearCursorWorldCoordinateRef = useRef(clearCursorWorldCoordinate);
	const sizeRef = useRef(size);
	const rafIdRef = useRef<number | null>(null);
	const raycasterRef = useRef(new Raycaster());
	const ndcRef = useRef(new Vector2());
	const sphereRef = useRef(new Sphere(new Vector3(0, 0, 0), radius));
	const intersectionPointRef = useRef(new Vector3());
	const lastCursorWorldCoordinateRef =
		useRef<OverviewCursorWorldCoordinate | null>(null);

	useEffect(() => {
		enabledRef.current = enabled;
	}, [enabled]);

	useEffect(() => {
		cameraRef.current = camera;
	}, [camera]);

	useEffect(() => {
		setCursorWorldCoordinateRef.current = setCursorWorldCoordinate;
	}, [setCursorWorldCoordinate]);

	useEffect(() => {
		clearCursorWorldCoordinateRef.current = clearCursorWorldCoordinate;
	}, [clearCursorWorldCoordinate]);

	useEffect(() => {
		sizeRef.current = size;
	}, [size]);

	useEffect(() => {
		sphereRef.current.radius = radius;
	}, [radius]);

	const syncCursorWorldCoordinate = (
		nextCursorWorldCoordinate: OverviewCursorWorldCoordinate | null,
	) => {
		const current = lastCursorWorldCoordinateRef.current;

		if (
			current?.ra === nextCursorWorldCoordinate?.ra &&
			current?.dec === nextCursorWorldCoordinate?.dec &&
			current?.anchor.x === nextCursorWorldCoordinate?.anchor.x &&
			current?.anchor.y === nextCursorWorldCoordinate?.anchor.y
		) {
			return;
		}

		lastCursorWorldCoordinateRef.current = nextCursorWorldCoordinate;

		if (nextCursorWorldCoordinate) {
			setCursorWorldCoordinateRef.current(nextCursorWorldCoordinate);
			return;
		}

		clearCursorWorldCoordinateRef.current();
	};

	const resolveCursorWorldCoordinate = (
		pointer: CanvasPointerState,
	): OverviewCursorWorldCoordinate | null => {
		const { width, height } = sizeRef.current;

		if (width <= 0 || height <= 0) {
			return null;
		}

		ndcRef.current.set(
			(pointer.local.x / width) * 2 - 1,
			-((pointer.local.y / height) * 2 - 1),
		);
		raycasterRef.current.setFromCamera(ndcRef.current, cameraRef.current);

		const intersection = raycasterRef.current.ray.intersectSphere(
			sphereRef.current,
			intersectionPointRef.current,
		);

		if (!intersection) {
			return null;
		}

		const { ra, dec } = cartesianToRaDec(intersection);
		const normalizedRa = ((ra % 360) + 360) % 360;
		const anchor: OverviewHoverAnchor = {
			x: pointer.client.x,
			y: pointer.client.y,
		};

		return {
			ra: normalizedRa,
			dec,
			anchor,
		};
	};

	const stopLoop = () => {
		if (rafIdRef.current === null) {
			return;
		}

		window.cancelAnimationFrame(rafIdRef.current);
		rafIdRef.current = null;
	};

	const tick = () => {
		rafIdRef.current = null;

		if (!enabledRef.current || !pointerRef.current) {
			return;
		}

		syncCursorWorldCoordinate(resolveCursorWorldCoordinate(pointerRef.current));

		if (!enabledRef.current || !pointerRef.current) {
			return;
		}

		rafIdRef.current = window.requestAnimationFrame(tick);
	};

	const startLoop = () => {
		if (rafIdRef.current !== null || !enabledRef.current || !pointerRef.current) {
			return;
		}

		rafIdRef.current = window.requestAnimationFrame(tick);
	};

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
			startLoop();
		};

		const handlePointerLeave = () => {
			pointerRef.current = null;
			stopLoop();
			syncCursorWorldCoordinate(null);
		};

		gl.domElement.addEventListener("pointermove", handlePointerMove);
		gl.domElement.addEventListener("pointerleave", handlePointerLeave);
		gl.domElement.addEventListener("pointercancel", handlePointerLeave);

		return () => {
			gl.domElement.removeEventListener("pointermove", handlePointerMove);
			gl.domElement.removeEventListener("pointerleave", handlePointerLeave);
			gl.domElement.removeEventListener("pointercancel", handlePointerLeave);
			stopLoop();
			syncCursorWorldCoordinate(null);
		};
	}, [gl.domElement]);

	useEffect(() => {
		if (!enabled) {
			stopLoop();
			syncCursorWorldCoordinate(null);
			return;
		}

		if (pointerRef.current) {
			startLoop();
		}

		return () => {
			stopLoop();
			syncCursorWorldCoordinate(null);
		};
	}, [enabled]);
}
