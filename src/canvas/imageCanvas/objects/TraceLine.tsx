import { Line } from "@react-three/drei";
import type { SourceAnnotation } from "../api";
import { useImagePointerHandlers } from "../canvasHooks/useImagePointerHandlers";
import {
	IMAGE_CANVAS_DEFAULT_SOURCE_COLOR,
	IMAGE_CANVAS_TRACE_OPACITY,
	IMAGE_CANVAS_TRACE_WIDTH,
} from "../shared/constants";
import type { ResolvedImageCanvasViewModel } from "../shared/types";

export function TraceLine({
	source,
	view,
	z,
}: {
	source: SourceAnnotation;
	view: ResolvedImageCanvasViewModel;
	z: number;
}) {
	const trace = source.trace;
	const pointerHandlers = useImagePointerHandlers({
		onImagePointer: view.onImagePointer,
		target: { kind: "trace", sourceId: source.id },
	});

	if (!trace || trace.visible === false || trace.points.length < 2) {
		return null;
	}

	return (
		<Line
			points={trace.points.map((point) => [point.x, point.y, z])}
			color={source.color ?? IMAGE_CANVAS_DEFAULT_SOURCE_COLOR}
			lineWidth={trace.width ?? IMAGE_CANVAS_TRACE_WIDTH}
			transparent
			opacity={IMAGE_CANVAS_TRACE_OPACITY}
			depthTest={false}
			renderOrder={z}
			toneMapped={false}
			{...pointerHandlers}
		/>
	);
}
