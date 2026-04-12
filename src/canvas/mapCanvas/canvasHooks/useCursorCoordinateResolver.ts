import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { Raycaster, Sphere, Vector2, Vector3 } from "three";
import type { CursorCoordinateState } from "../shared/types";
import { cartesianToRaDec } from "../utils";

export interface UseCursorCoordinateResolverParams {
	enabled: boolean;
	radius: number;
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

export function useCursorCoordinateResolver({
	enabled,
	radius,
}: UseCursorCoordinateResolverParams) {
	const { camera, gl, size } = useThree();
	const pointerRef = useRef<ReturnType<typeof readCanvasPointerState> | null>(
		null,
	);
	const raycasterRef = useRef(new Raycaster());
	const ndcRef = useRef(new Vector2());
	const sphereRef = useRef(new Sphere(new Vector3(0, 0, 0), radius));
	const intersectionPointRef = useRef(new Vector3());
	const [cursorCoordinate, setCursorCoordinate] =
		useState<CursorCoordinateState | null>(null);
	const currentCoordinateRef = useRef<CursorCoordinateState | null>(null);

	useEffect(() => {
		sphereRef.current.radius = radius;
	}, [radius]);

	const syncCoordinate = useCallback(
		(nextValue: CursorCoordinateState | null) => {
			const current = currentCoordinateRef.current;
			const next = nextValue;

			if (
				current?.coordinate.ra === next?.coordinate.ra &&
				current?.coordinate.dec === next?.coordinate.dec &&
				current?.anchor.x === next?.anchor.x &&
				current?.anchor.y === next?.anchor.y
			) {
				return;
			}

			currentCoordinateRef.current = next;
			setCursorCoordinate(next);
		},
		[],
	);

	useEffect(() => {
		const handlePointerMove = (event: PointerEvent) => {
			pointerRef.current = readCanvasPointerState(event, gl.domElement);
		};

		const handlePointerLeave = () => {
			pointerRef.current = null;
			syncCoordinate(null);
		};

		gl.domElement.addEventListener("pointermove", handlePointerMove);
		gl.domElement.addEventListener("pointerleave", handlePointerLeave);
		gl.domElement.addEventListener("pointercancel", handlePointerLeave);

		return () => {
			gl.domElement.removeEventListener("pointermove", handlePointerMove);
			gl.domElement.removeEventListener("pointerleave", handlePointerLeave);
			gl.domElement.removeEventListener("pointercancel", handlePointerLeave);
			syncCoordinate(null);
		};
	}, [gl, syncCoordinate]);

	useEffect(() => {
		if (!enabled) {
			syncCoordinate(null);
		}
	}, [enabled, syncCoordinate]);

	useFrame(() => {
		if (!enabled || !pointerRef.current) {
			syncCoordinate(null);
			return;
		}

		const { width, height } = size;
		if (width <= 0 || height <= 0) {
			syncCoordinate(null);
			return;
		}

		ndcRef.current.set(
			(pointerRef.current.local.x / width) * 2 - 1,
			-((pointerRef.current.local.y / height) * 2 - 1),
		);
		raycasterRef.current.setFromCamera(ndcRef.current, camera);

		const intersection = raycasterRef.current.ray.intersectSphere(
			sphereRef.current,
			intersectionPointRef.current,
		);

		if (!intersection) {
			syncCoordinate(null);
			return;
		}

		const coordinate = cartesianToRaDec(intersection);
		const normalizedCoordinate = {
			ra: ((coordinate.ra % 360) + 360) % 360,
			dec: coordinate.dec,
		};

		syncCoordinate({
			coordinate: normalizedCoordinate,
			anchor: pointerRef.current.client,
		});
	});

	return cursorCoordinate;
}
