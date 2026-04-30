import type {
	Frame,
	LayerModel,
	ScalarArray,
	ScalarData,
	ScalarDataType,
} from "../api";

export function getActiveFrame(layer: LayerModel | undefined): Frame | null {
	if (!layer) {
		return null;
	}

	return layer.frames.find((frame) => frame.id === layer.activeId) ?? null;
}

export function isScalarArrayValid(
	dataType: ScalarDataType,
	array: ScalarArray,
): boolean {
	switch (dataType) {
		case "float16":
			return array instanceof Uint16Array;
		case "float32":
			return array instanceof Float32Array;
		case "uint8":
			return array instanceof Uint8Array;
		case "uint16":
			return array instanceof Uint16Array;
		case "uint32":
			return array instanceof Uint32Array;
	}
}

export function isScalarDataValid(
	data: ScalarData,
	sampleCount: number,
): boolean {
	return (
		isScalarArrayValid(data.dataType, data.array) &&
		data.array.length >= sampleCount
	);
}

export function validateFrameData(
	frame: Frame,
	expectedKind: "scalar" | "any",
): string[] {
	const errors: string[] = [];
	const sampleCount = Math.max(0, frame.width * frame.height);

	if (frame.width <= 0 || frame.height <= 0) {
		errors.push(`Frame ${frame.id} must have positive width and height.`);
	}

	if (expectedKind === "scalar" && frame.data.kind !== "scalar") {
		errors.push(`Frame ${frame.id} must use scalar data.`);
	}

	if (
		frame.data.kind === "scalar" &&
		!isScalarDataValid(frame.data, sampleCount)
	) {
		errors.push(`Frame ${frame.id} scalar data does not match dataType.`);
	}

	if (frame.error && !isScalarDataValid(frame.error, sampleCount)) {
		errors.push(`Frame ${frame.id} error data does not match dataType.`);
	}

	if (frame.error && frame.data.kind !== "scalar") {
		errors.push(`Frame ${frame.id} cannot attach error data to bitmap data.`);
	}

	return errors;
}
