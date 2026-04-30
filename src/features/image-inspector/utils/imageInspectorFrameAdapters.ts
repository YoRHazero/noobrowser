import type { Frame, ScalarData } from "@/canvas/imageCanvas";
import type {
	CounterpartFootprint,
	GrismData,
	GrismErr,
	GrismOffset,
} from "@/hooks/query/image/schemas";
import { isValidImageSize } from "./imageInspectorDataUtils";

function createHalfFloatScalar(buffer: ArrayBuffer): ScalarData {
	return {
		kind: "scalar",
		array: new Uint16Array(buffer),
		dataType: "float16",
	};
}

export function createGrismFrame({
	basename,
	data,
	err,
	offset,
	dataUpdatedAt,
	errUpdatedAt,
	offsetUpdatedAt,
}: {
	basename: string;
	data: GrismData | undefined;
	err: GrismErr | undefined;
	offset: GrismOffset | undefined;
	dataUpdatedAt: number;
	errUpdatedAt: number;
	offsetUpdatedAt: number;
}): Frame | null {
	if (!data || !offset || !isValidImageSize(data.width, data.height)) {
		return null;
	}

	const canAttachError =
		err &&
		err.width === data.width &&
		err.height === data.height &&
		err.buffer.byteLength > 0;

	return {
		id: `grism:${basename}:${dataUpdatedAt}:${errUpdatedAt}:${offsetUpdatedAt}`,
		x: offset.dx,
		y: offset.dy,
		width: data.width,
		height: data.height,
		data: createHalfFloatScalar(data.buffer),
		error: canAttachError ? createHalfFloatScalar(err.buffer) : undefined,
	};
}

export function createCounterpartFrame({
	id,
	bitmap,
	footprint,
}: {
	id: string;
	bitmap: ImageBitmap;
	footprint: CounterpartFootprint["footprint"] | undefined;
}): Frame {
	const marker = footprint?.vertex_marker;
	if (marker && marker.length >= 3) {
		const x0 = marker[0][0];
		const y0 = marker[0][1];
		const width = marker[2][0] - marker[0][0];
		const height = marker[2][1] - marker[0][1];

		if (isValidImageSize(width, height)) {
			return {
				id,
				x: x0,
				y: y0,
				width,
				height,
				data: {
					kind: "bitmap",
					bitmap,
					colorSpace: "srgb",
				},
			};
		}
	}

	return {
		id,
		x: 0,
		y: 0,
		width: bitmap.width,
		height: bitmap.height,
		data: {
			kind: "bitmap",
			bitmap,
			colorSpace: "srgb",
		},
	};
}
