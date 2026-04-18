import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import type { OrthographicCamera } from "three";
import type { MapControls as MapControlsType } from "three-stdlib";
import {
	SPECTRUM_2D_CANVAS_CAMERA_PADDING,
	SPECTRUM_2D_CANVAS_CAMERA_Z,
} from "../shared/constants";
import type { Spectrum2DCanvasWorldBounds } from "../shared/types";

export interface UseFitSpectrum2DCameraParams {
	worldBounds: Spectrum2DCanvasWorldBounds;
	controlsRef: React.RefObject<MapControlsType | null>;
}

export function useFitSpectrum2DCamera({
	worldBounds,
	controlsRef,
}: UseFitSpectrum2DCameraParams): void {
	const { camera, size } = useThree();
	const lastFitSignatureRef = useRef<string | null>(null);

	useLayoutEffect(() => {
		if (
			worldBounds.width <= 0 ||
			worldBounds.height <= 0 ||
			size.width <= 0 ||
			size.height <= 0
		) {
			return;
		}

		const fitSignature = [
			worldBounds.width,
			worldBounds.height,
			size.width,
			size.height,
		].join(":");
		if (lastFitSignatureRef.current === fitSignature) {
			return;
		}
		lastFitSignatureRef.current = fitSignature;

		const orthoCamera = camera as OrthographicCamera;
		const paddedWidth =
			worldBounds.width * (1 + SPECTRUM_2D_CANVAS_CAMERA_PADDING * 2);
		const paddedHeight =
			worldBounds.height * (1 + SPECTRUM_2D_CANVAS_CAMERA_PADDING * 2);
		const zoom = Math.min(size.width / paddedWidth, size.height / paddedHeight);

		orthoCamera.position.set(
			worldBounds.centerX,
			worldBounds.centerY,
			SPECTRUM_2D_CANVAS_CAMERA_Z,
		);
		orthoCamera.zoom = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
		orthoCamera.near = 0.1;
		orthoCamera.far = 1000;
		orthoCamera.updateProjectionMatrix();
		orthoCamera.updateMatrixWorld();

		const controls = controlsRef.current;
		if (!controls) {
			return;
		}

		controls.target.set(worldBounds.centerX, worldBounds.centerY, 0);
		controls.update();
	}, [
		camera,
		controlsRef,
		size.height,
		size.width,
		worldBounds.centerX,
		worldBounds.centerY,
		worldBounds.height,
		worldBounds.width,
	]);
}
