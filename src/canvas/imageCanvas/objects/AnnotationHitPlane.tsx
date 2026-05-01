import { useMemo } from "react";
import { DoubleSide } from "three";
import { useImagePointerHandlers } from "../canvasHooks/useImagePointerHandlers";
import {
	IMAGE_CANVAS_ANNOTATION_HIT_MARGIN,
	IMAGE_CANVAS_ANNOTATION_HIT_Z,
} from "../shared/constants";
import type { ResolvedImageCanvasViewModel } from "../shared/types";
import { getFrameUnionRect } from "../utils";

export function AnnotationHitPlane({
	view,
}: {
	view: ResolvedImageCanvasViewModel;
}) {
	const rect = useMemo(
		() =>
			getFrameUnionRect(
				[...view.baseFrames, ...view.referenceFrames, ...view.maskFrames],
				IMAGE_CANVAS_ANNOTATION_HIT_MARGIN,
			),
		[view.baseFrames, view.referenceFrames, view.maskFrames],
	);
	const pointerHandlers = useImagePointerHandlers({
		onImagePointer: view.onImagePointer,
		target: { kind: "hit-plane" },
	});

	if (!rect) {
		return null;
	}

	return (
		<mesh
			position={[
				rect.x + rect.width / 2,
				rect.y + rect.height / 2,
				IMAGE_CANVAS_ANNOTATION_HIT_Z,
			]}
			renderOrder={IMAGE_CANVAS_ANNOTATION_HIT_Z}
			{...pointerHandlers}
		>
			<planeGeometry args={[rect.width, rect.height]} />
			<meshBasicMaterial
				transparent
				opacity={0}
				colorWrite={false}
				depthWrite={false}
				side={DoubleSide}
			/>
		</mesh>
	);
}
