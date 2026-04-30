import { Circle } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import type { SourceAnnotation } from "../api";
import { useImagePointerHandlers } from "../canvasHooks/useImagePointerHandlers";
import { useOrthographicPixelScale } from "../canvasHooks/useOrthographicPixelScale";
import {
	IMAGE_CANVAS_ACTIVE_SOURCE_COLOR,
	IMAGE_CANVAS_ACTIVE_SOURCE_MARKER_SIZE_PX,
	IMAGE_CANVAS_DEFAULT_SOURCE_COLOR,
	IMAGE_CANVAS_SOURCE_BORDER_COLOR,
	IMAGE_CANVAS_SOURCE_MARKER_SIZE_PX,
} from "../shared/constants";
import type { ResolvedImageCanvasViewModel } from "../shared/types";

export function SourceMarker({
	source,
	view,
	z,
}: {
	source: SourceAnnotation;
	view: ResolvedImageCanvasViewModel;
	z: number;
}) {
	const groupRef = useRef<Group | null>(null);
	const sizePx = source.active
		? IMAGE_CANVAS_ACTIVE_SOURCE_MARKER_SIZE_PX
		: IMAGE_CANVAS_SOURCE_MARKER_SIZE_PX;
	const color =
		source.color ??
		(source.active
			? IMAGE_CANVAS_ACTIVE_SOURCE_COLOR
			: IMAGE_CANVAS_DEFAULT_SOURCE_COLOR);
	const pointerHandlers = useImagePointerHandlers({
		onImagePointer: view.onImagePointer,
		target: { kind: "source", sourceId: source.id },
	});

	useOrthographicPixelScale({ groupRef, sizePx });

	return (
		<group
			ref={groupRef}
			position={[source.x, source.y, z]}
			{...pointerHandlers}
		>
			<Circle args={[0.64, 32]} position={[0, 0, -0.001]}>
				<meshBasicMaterial
					color={IMAGE_CANVAS_SOURCE_BORDER_COLOR}
					depthWrite={false}
					toneMapped={false}
				/>
			</Circle>
			<Circle args={[0.5, 32]}>
				<meshBasicMaterial
					color={color}
					depthWrite={false}
					toneMapped={false}
				/>
			</Circle>
		</group>
	);
}
