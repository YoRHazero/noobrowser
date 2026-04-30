import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { OrthographicCamera } from "three";
import type { MapControls as MapControlsType } from "three-stdlib";
import type { Rect } from "../api";
import { IMAGE_CANVAS_CAMERA_Z } from "../shared/constants";

function getRoiCenter(roi: Rect): { x: number; y: number } {
	return {
		x: roi.x + roi.width / 2,
		y: roi.y + roi.height / 2,
	};
}

function setCameraCenter({
	camera,
	controls,
	x,
	y,
}: {
	camera: OrthographicCamera;
	controls: MapControlsType | null;
	x: number;
	y: number;
}) {
	const z = Number.isFinite(camera.position.z)
		? camera.position.z
		: IMAGE_CANVAS_CAMERA_Z;

	camera.position.set(x, y, z);
	camera.updateMatrixWorld();

	if (controls) {
		controls.target.set(x, y, 0);
		controls.update();
	}
}

export function useMainImageCamera({
	roi,
	lockROI,
	enabled,
	controlsRef,
}: {
	roi: Rect | null;
	lockROI: boolean;
	enabled: boolean;
	controlsRef: React.RefObject<MapControlsType | null>;
}) {
	const { camera } = useThree();
	const initializedRef = useRef(false);

	useLayoutEffect(() => {
		if (!enabled) {
			return;
		}
		if (initializedRef.current) {
			return;
		}
		initializedRef.current = true;

		setCameraCenter({
			camera: camera as OrthographicCamera,
			controls: controlsRef.current,
			x: 0,
			y: 0,
		});
	}, [camera, controlsRef, enabled]);

	useLayoutEffect(() => {
		if (!enabled) {
			return;
		}
		if (!lockROI || !roi) {
			return;
		}

		const center = getRoiCenter(roi);
		setCameraCenter({
			camera: camera as OrthographicCamera,
			controls: controlsRef.current,
			x: center.x,
			y: center.y,
		});
	}, [camera, controlsRef, enabled, lockROI, roi]);
}
