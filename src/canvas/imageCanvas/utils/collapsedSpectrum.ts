import { getFloat16 } from "@petamoriken/float16";
import type { CollapsedSpectrumModel, Frame, Rect, ScalarData } from "../api";
import type {
	CollapsedSpectrumBin,
	CollapsedSpectrumViewModel,
} from "../shared/types";
import { roiLocalRectToWorldRect } from "./rect";

type ScalarReader = (index: number) => number;

function createScalarReader(data: ScalarData): ScalarReader {
	if (data.dataType === "float16") {
		const view = new DataView(
			data.array.buffer,
			data.array.byteOffset,
			data.array.byteLength,
		);
		return (index) => getFloat16(view, index * 2, true);
	}

	return (index) => data.array[index] ?? Number.NaN;
}

function getScalarIndex(frame: Frame, col: number, row: number): number {
	return row * frame.width + col;
}

function getFiniteRange(values: CollapsedSpectrumBin[]): {
	valueMin: number;
	valueMax: number;
} | null {
	let valueMin = Number.POSITIVE_INFINITY;
	let valueMax = Number.NEGATIVE_INFINITY;

	for (const bin of values) {
		if (!Number.isFinite(bin.value)) {
			continue;
		}

		valueMin = Math.min(valueMin, bin.value);
		valueMax = Math.max(valueMax, bin.value);
		if (bin.error !== undefined) {
			valueMin = Math.min(valueMin, bin.value - bin.error);
			valueMax = Math.max(valueMax, bin.value + bin.error);
		}
	}

	if (!Number.isFinite(valueMin) || !Number.isFinite(valueMax)) {
		return null;
	}

	if (valueMin === valueMax) {
		return {
			valueMin: valueMin - 1,
			valueMax: valueMax + 1,
		};
	}

	return { valueMin, valueMax };
}

export function extractCollapsedSpectrum({
	frame,
	roi,
	collapseWindow,
	model,
}: {
	frame: Frame | null;
	roi: Rect | null;
	collapseWindow: Rect | null;
	model: CollapsedSpectrumModel | undefined;
}): CollapsedSpectrumViewModel | null {
	if (
		!model ||
		!frame ||
		!roi ||
		!collapseWindow ||
		frame.data.kind !== "scalar" ||
		frame.width <= 0 ||
		frame.height <= 0
	) {
		return null;
	}

	const dataReader = createScalarReader(frame.data);
	const errorReader = frame.error ? createScalarReader(frame.error) : null;
	const worldWindow = roiLocalRectToWorldRect(roi, collapseWindow);
	const left = Math.max(frame.x, worldWindow.x);
	const right = Math.min(
		frame.x + frame.width,
		worldWindow.x + worldWindow.width,
	);
	const bottom = Math.max(frame.y, worldWindow.y);
	const top = Math.min(
		frame.y + frame.height,
		worldWindow.y + worldWindow.height,
	);

	const startX = Math.max(0, Math.floor(left - frame.x));
	const endX = Math.min(frame.width, Math.ceil(right - frame.x));
	const startY = Math.max(0, Math.floor(bottom - frame.y));
	const endY = Math.min(frame.height, Math.ceil(top - frame.y));

	if (startX >= endX || startY >= endY) {
		return null;
	}

	const sumAxis = model.sumAxis ?? "y";
	const bins: CollapsedSpectrumBin[] = [];

	if (sumAxis === "y") {
		for (let col = startX; col < endX; col += 1) {
			let value = 0;
			let errorSumSq = 0;
			let sampleCount = 0;

			for (let row = startY; row < endY; row += 1) {
				const index = getScalarIndex(frame, col, row);
				const sample = dataReader(index);
				if (!Number.isFinite(sample)) {
					continue;
				}
				value += sample;
				sampleCount += 1;

				if (errorReader) {
					const error = errorReader(index);
					if (Number.isFinite(error)) {
						errorSumSq += error * error;
					}
				}
			}

			if (sampleCount > 0) {
				const binIndex = bins.length;
				bins.push({
					index: binIndex,
					angstrom: binIndex * model.angstromPerPixel,
					value,
					error: errorReader ? Math.sqrt(errorSumSq) : undefined,
				});
			}
		}
	} else {
		for (let row = startY; row < endY; row += 1) {
			let value = 0;
			let errorSumSq = 0;
			let sampleCount = 0;

			for (let col = startX; col < endX; col += 1) {
				const index = getScalarIndex(frame, col, row);
				const sample = dataReader(index);
				if (!Number.isFinite(sample)) {
					continue;
				}
				value += sample;
				sampleCount += 1;

				if (errorReader) {
					const error = errorReader(index);
					if (Number.isFinite(error)) {
						errorSumSq += error * error;
					}
				}
			}

			if (sampleCount > 0) {
				const binIndex = bins.length;
				bins.push({
					index: binIndex,
					angstrom: binIndex * model.angstromPerPixel,
					value,
					error: errorReader ? Math.sqrt(errorSumSq) : undefined,
				});
			}
		}
	}

	const range = getFiniteRange(bins);
	if (!range) {
		return null;
	}

	return {
		sumAxis,
		angstromPerPixel: model.angstromPerPixel,
		bins,
		valueMin: range.valueMin,
		valueMax: range.valueMax,
	};
}
