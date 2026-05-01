import { describe, expect, it } from "vitest";
import type { Frame, LayerModel, Rect } from "../api";
import {
	createDefaultCollapseWindow,
	createMaskMapUniformEntries,
	extractCollapsedSpectrum,
	getActiveFrame,
	getModelRetainTextureKeys,
	getTextureCacheKey,
	isPointInRect,
	isScalarArrayValid,
	resolveCollapseWindow,
	roiLocalRectToWorldRect,
	validateFrameData,
} from "./index";

function createScalarFrame(
	array: Float32Array,
	width: number,
	height: number,
): Frame {
	return {
		id: "frame-a",
		x: 0,
		y: 0,
		width,
		height,
		data: {
			kind: "scalar",
			array,
			dataType: "float32",
		},
	};
}

describe("imageCanvas rect utilities", () => {
	it("creates and clamps the default collapse window in ROI-local coordinates", () => {
		const roi: Rect = { x: 10, y: 20, width: 200, height: 20 };
		expect(createDefaultCollapseWindow(roi)).toEqual({
			x: 50,
			y: 8,
			width: 100,
			height: 4,
		});

		expect(
			resolveCollapseWindow({
				roi: { x: 0, y: 0, width: 80, height: 3 },
			}),
		).toEqual({
			x: 0,
			y: 0,
			width: 80,
			height: 3,
		});
	});

	it("converts ROI-local rects to world rects", () => {
		expect(
			roiLocalRectToWorldRect(
				{ x: 10, y: 20, width: 100, height: 80 },
				{ x: 4, y: 5, width: 12, height: 3 },
			),
		).toEqual({ x: 14, y: 25, width: 12, height: 3 });
	});

	it("checks whether a point is inside a rect", () => {
		const rect: Rect = { x: 10, y: 20, width: 30, height: 40 };

		expect(isPointInRect({ x: 10, y: 20 }, rect)).toBe(true);
		expect(isPointInRect({ x: 40, y: 60 }, rect)).toBe(true);
		expect(isPointInRect({ x: 9.9, y: 20 }, rect)).toBe(false);
		expect(isPointInRect({ x: 10, y: 60.1 }, rect)).toBe(false);
	});
});

describe("imageCanvas frame and texture-key utilities", () => {
	it("resolves active frames and retain texture keys", () => {
		const layer: LayerModel = {
			activeId: "b",
			frames: [
				createScalarFrame(new Float32Array([1]), 1, 1),
				{
					...createScalarFrame(new Float32Array([2]), 1, 1),
					id: "b",
					error: {
						kind: "scalar",
						array: new Float32Array([0.1]),
						dataType: "float32",
					},
				},
			],
		};

		expect(getActiveFrame(layer)?.id).toBe("b");
		expect(getTextureCacheKey("base", "data", "b")).toBe("base:data:b");
		expect(
			Array.from(
				getModelRetainTextureKeys({
					baseLayer: layer,
				}),
			).sort(),
		).toEqual(["base:data:b", "base:data:frame-a", "base:error:b"]);
	});

	it("validates scalar data type constraints", () => {
		expect(isScalarArrayValid("float16", new Uint16Array([0]))).toBe(true);
		expect(isScalarArrayValid("float16", new Float32Array([0]))).toBe(false);
		expect(isScalarArrayValid("float32", new Float32Array([0]))).toBe(true);
		expect(isScalarArrayValid("uint8", new Uint8Array([0]))).toBe(true);
		expect(isScalarArrayValid("uint16", new Uint16Array([0]))).toBe(true);
		expect(isScalarArrayValid("uint32", new Uint32Array([0]))).toBe(true);

		const invalidFrame: Frame = {
			...createScalarFrame(new Float32Array([1]), 1, 1),
			data: {
				kind: "scalar",
				array: new Float32Array([1]),
				dataType: "float16",
			},
		};
		expect(validateFrameData(invalidFrame, "scalar")).toHaveLength(1);
	});
});

describe("imageCanvas mask map helpers", () => {
	it("packs mask values into exact-match bytes", () => {
		const entries = createMaskMapUniformEntries([
			{ value: 0x12345678, color: "#336699", opacity: 0.4 },
		]);

		expect(entries[0]?.valueBytes).toEqual([0x78, 0x56, 0x34, 0x12]);
		expect(entries[0]?.color[3]).toBe(0.4);
	});
});

describe("imageCanvas collapsed spectrum extraction", () => {
	it("sums along y and outputs x-direction bins by default", () => {
		const frame = createScalarFrame(
			new Float32Array([9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4]),
			4,
			3,
		);
		frame.error = {
			kind: "scalar",
			array: new Float32Array(12).fill(1),
			dataType: "float32",
		};

		const spectrum = extractCollapsedSpectrum({
			frame,
			roi: { x: 0, y: 0, width: 4, height: 3 },
			collapseWindow: { x: 1, y: 0, width: 2, height: 2 },
			model: { angstromPerPixel: 2 },
		});

		expect(spectrum?.sumAxis).toBe("y");
		expect(spectrum?.bins.map((bin) => bin.value)).toEqual([16, 18]);
		expect(spectrum?.bins.map((bin) => bin.angstrom)).toEqual([0, 2]);
		expect(spectrum?.bins[0]?.error).toBeCloseTo(Math.sqrt(2));
	});

	it("sums along x and outputs y-direction bins", () => {
		const frame = createScalarFrame(
			new Float32Array([9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4]),
			4,
			3,
		);

		const spectrum = extractCollapsedSpectrum({
			frame,
			roi: { x: 0, y: 0, width: 4, height: 3 },
			collapseWindow: { x: 1, y: 0, width: 2, height: 2 },
			model: { sumAxis: "x", angstromPerPixel: 3 },
		});

		expect(spectrum?.sumAxis).toBe("x");
		expect(spectrum?.bins.map((bin) => bin.value)).toEqual([21, 13]);
		expect(spectrum?.bins.map((bin) => bin.angstrom)).toEqual([0, 3]);
	});
});
