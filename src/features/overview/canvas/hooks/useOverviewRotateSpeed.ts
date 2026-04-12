import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { FOOTPRINT_LINE_RADIUS_OFFSET } from "@/features/overview/shared/constants";
import {
	resolveFootprintShellGapMetrics,
	resolveNormalizedFootprintShellGap,
	resolveRotateSpeedFromNormalizedGap,
} from "../core/cameraMath";
import { OVERVIEW_CANVAS_CONSTANTS } from "../core/constants";

export interface UseOverviewRotateSpeedParams {
	controlRef: RefObject<OrbitControlsType | null>;
}

export function useOverviewRotateSpeed({
	controlRef,
}: UseOverviewRotateSpeedParams) {
	const { camera } = useThree();
	const rotateSpeedRef = useRef<number | null>(null);

	useFrame(() => {
		const controls = controlRef.current;
		if (!controls) return;

		const metrics = resolveFootprintShellGapMetrics({
			globeRadius: OVERVIEW_CANVAS_CONSTANTS.globeRadius,
			footprintLineRadiusOffset: FOOTPRINT_LINE_RADIUS_OFFSET,
			minCameraDistance: OVERVIEW_CANVAS_CONSTANTS.minCameraDistance,
			maxCameraDistance: OVERVIEW_CANVAS_CONSTANTS.maxCameraDistance,
		});
		const normalizedGap = resolveNormalizedFootprintShellGap(
			camera.position.length(),
			metrics,
		);
		const nextRotateSpeed = resolveRotateSpeedFromNormalizedGap(normalizedGap, {
			minRotateSpeed: OVERVIEW_CANVAS_CONSTANTS.minRotateSpeed,
			maxRotateSpeed: OVERVIEW_CANVAS_CONSTANTS.maxRotateSpeed,
			gamma: OVERVIEW_CANVAS_CONSTANTS.rotateSpeedGamma,
		});

		if (rotateSpeedRef.current === nextRotateSpeed) return;

		controls.rotateSpeed = nextRotateSpeed;
		rotateSpeedRef.current = nextRotateSpeed;
	});
}
