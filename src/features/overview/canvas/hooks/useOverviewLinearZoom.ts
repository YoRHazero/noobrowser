import { useThree } from "@react-three/fiber";
import { type RefObject, useEffect } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import { FOOTPRINT_LINE_RADIUS_OFFSET } from "@/features/overview/shared/constants";
import {
	resolveFootprintShellGapMetrics,
	resolveNextCameraDistanceFromGapDelta,
} from "../core/cameraMath";
import { OVERVIEW_CANVAS_CONSTANTS } from "../core/constants";

export interface UseOverviewLinearZoomParams {
	controlRef: RefObject<OrbitControlsType | null>;
}

const CAMERA_CENTER = new Vector3(0, 0, 0);

function normalizeWheelDelta(event: WheelEvent) {
	switch (event.deltaMode) {
		case WheelEvent.DOM_DELTA_LINE:
			return event.deltaY * 16;
		case WheelEvent.DOM_DELTA_PAGE:
			return event.deltaY * 100;
		default:
			return event.deltaY;
	}
}

export function useOverviewLinearZoom({
	controlRef,
}: UseOverviewLinearZoomParams) {
	const { camera, gl } = useThree();

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			const controls = controlRef.current;
			if (!controls) return;

			event.preventDefault();

			const metrics = resolveFootprintShellGapMetrics({
				globeRadius: OVERVIEW_CANVAS_CONSTANTS.globeRadius,
				footprintLineRadiusOffset: FOOTPRINT_LINE_RADIUS_OFFSET,
				minCameraDistance: OVERVIEW_CANVAS_CONSTANTS.minCameraDistance,
				maxCameraDistance: OVERVIEW_CANVAS_CONSTANTS.maxCameraDistance,
			});
			const currentDistance = camera.position.distanceTo(CAMERA_CENTER);
			const nextDistance = resolveNextCameraDistanceFromGapDelta(
				currentDistance,
				normalizeWheelDelta(event) *
					OVERVIEW_CANVAS_CONSTANTS.linearZoomGapStep,
				metrics,
			);
			const nextDirection = camera.position.clone().normalize();

			if (nextDirection.lengthSq() === 0) return;

			camera.position.copy(nextDirection.multiplyScalar(nextDistance));
			camera.updateProjectionMatrix();
			controls.update();
		};

		const domElement = gl.domElement;
		domElement.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			domElement.removeEventListener("wheel", handleWheel);
		};
	}, [camera, controlRef, gl]);
}
