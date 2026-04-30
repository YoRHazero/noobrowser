import { MapControls } from "@react-three/drei";
import { useRef } from "react";
import type { MapControls as MapControlsType } from "three-stdlib";
import { useLockedRoiCamera } from "../canvasHooks/useLockedRoiCamera";
import { useMainImageCamera } from "../canvasHooks/useMainImageCamera";
import {
	IMAGE_CANVAS_MAX_ZOOM,
	IMAGE_CANVAS_MIN_ZOOM,
} from "../shared/constants";
import type {
	ImageCanvasViewKind,
	ResolvedImageCanvasViewModel,
} from "../shared/types";

export function CameraRig({
	view,
	viewKind,
}: {
	view: ResolvedImageCanvasViewModel;
	viewKind: ImageCanvasViewKind;
}) {
	const controlsRef = useRef<MapControlsType | null>(null);

	useMainImageCamera({
		roi: view.roi,
		lockROI: view.lockROI,
		enabled: viewKind === "main",
		controlsRef,
	});
	useLockedRoiCamera(viewKind === "roi" ? view.roi : null);

	if (viewKind === "roi") {
		return null;
	}

	return (
		<MapControls
			ref={controlsRef}
			enableRotate={false}
			enablePan={!view.lockROI}
			screenSpacePanning
			minZoom={IMAGE_CANVAS_MIN_ZOOM}
			maxZoom={IMAGE_CANVAS_MAX_ZOOM}
			zoomSpeed={0.8}
		/>
	);
}
