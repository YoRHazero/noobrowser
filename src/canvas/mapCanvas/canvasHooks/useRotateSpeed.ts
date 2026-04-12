import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import {
	MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
	MAP_CANVAS_GLOBE_RADIUS,
	MAP_CANVAS_MAX_CAMERA_DISTANCE,
	MAP_CANVAS_MAX_ROTATE_SPEED,
	MAP_CANVAS_MIN_CAMERA_DISTANCE,
	MAP_CANVAS_MIN_ROTATE_SPEED,
	MAP_CANVAS_ROTATE_SPEED_GAMMA,
} from "../shared/constants";
import {
	resolveFootprintShellGapMetrics,
	resolveNormalizedFootprintShellGap,
	resolveRotateSpeedFromNormalizedGap,
} from "../utils";

export interface UseRotateSpeedParams {
	controlRef: RefObject<OrbitControlsType | null>;
}

export function useRotateSpeed({ controlRef }: UseRotateSpeedParams) {
	const { camera } = useThree();
	const rotateSpeedRef = useRef<number | null>(null);

	useFrame(() => {
		const controls = controlRef.current;
		if (!controls) return;

		const metrics = resolveFootprintShellGapMetrics({
			globeRadius: MAP_CANVAS_GLOBE_RADIUS,
			footprintLineRadiusOffset: MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
			minCameraDistance: MAP_CANVAS_MIN_CAMERA_DISTANCE,
			maxCameraDistance: MAP_CANVAS_MAX_CAMERA_DISTANCE,
		});
		const normalizedGap = resolveNormalizedFootprintShellGap(
			camera.position.length(),
			metrics,
		);
		const nextRotateSpeed = resolveRotateSpeedFromNormalizedGap(normalizedGap, {
			minRotateSpeed: MAP_CANVAS_MIN_ROTATE_SPEED,
			maxRotateSpeed: MAP_CANVAS_MAX_ROTATE_SPEED,
			gamma: MAP_CANVAS_ROTATE_SPEED_GAMMA,
		});

		if (rotateSpeedRef.current === nextRotateSpeed) return;

		controls.rotateSpeed = nextRotateSpeed;
		rotateSpeedRef.current = nextRotateSpeed;
	});
}
