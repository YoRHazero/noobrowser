import { useThree } from "@react-three/fiber";
import { type RefObject, useEffect } from "react";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsType } from "three-stdlib";
import {
	MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
	MAP_CANVAS_GLOBE_RADIUS,
	MAP_CANVAS_LINEAR_ZOOM_GAP_STEP,
	MAP_CANVAS_MAX_CAMERA_DISTANCE,
	MAP_CANVAS_MIN_CAMERA_DISTANCE,
} from "../shared/constants";
import {
	resolveFootprintShellGapMetrics,
	resolveNextCameraDistanceFromGapDelta,
} from "../utils";

export interface UseLinearZoomParams {
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

export function useLinearZoom({ controlRef }: UseLinearZoomParams) {
	const { camera, gl } = useThree();

	useEffect(() => {
		const handleWheel = (event: WheelEvent) => {
			const controls = controlRef.current;
			if (!controls) return;

			event.preventDefault();

			const metrics = resolveFootprintShellGapMetrics({
				globeRadius: MAP_CANVAS_GLOBE_RADIUS,
				footprintLineRadiusOffset: MAP_CANVAS_FOOTPRINT_LINE_RADIUS_OFFSET,
				minCameraDistance: MAP_CANVAS_MIN_CAMERA_DISTANCE,
				maxCameraDistance: MAP_CANVAS_MAX_CAMERA_DISTANCE,
			});
			const currentDistance = camera.position.distanceTo(CAMERA_CENTER);
			const nextDistance = resolveNextCameraDistanceFromGapDelta(
				currentDistance,
				normalizeWheelDelta(event) * MAP_CANVAS_LINEAR_ZOOM_GAP_STEP,
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
