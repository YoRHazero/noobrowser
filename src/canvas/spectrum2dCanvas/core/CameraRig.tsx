import { MapControls } from "@react-three/drei";
import { useRef } from "react";
import type { MapControls as MapControlsType } from "three-stdlib";
import { useFitSpectrum2DCamera } from "../canvasHooks/useFitSpectrum2DCamera";
import {
	SPECTRUM_2D_CANVAS_MAX_ZOOM,
	SPECTRUM_2D_CANVAS_MIN_ZOOM,
} from "../shared/constants";
import type { Spectrum2DCanvasWorldBounds } from "../shared/types";

export interface CameraRigProps {
	worldBounds: Spectrum2DCanvasWorldBounds;
}

export function CameraRig({ worldBounds }: CameraRigProps) {
	const controlsRef = useRef<MapControlsType | null>(null);

	useFitSpectrum2DCamera({
		worldBounds,
		controlsRef,
	});

	return (
		<MapControls
			ref={controlsRef}
			enableRotate={false}
			screenSpacePanning
			minZoom={SPECTRUM_2D_CANVAS_MIN_ZOOM}
			maxZoom={SPECTRUM_2D_CANVAS_MAX_ZOOM}
			zoomSpeed={0.8}
		/>
	);
}
