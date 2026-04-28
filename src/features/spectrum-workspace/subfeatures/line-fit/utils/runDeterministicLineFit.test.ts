import { describe, expect, it } from "vitest";
import type {
	Spectrum1DCanvasFitModel,
	Spectrum1DCanvasPoint,
	Spectrum1DCanvasWaveRange,
} from "@/canvas/spectrum1dCanvas";
import { filterFiniteFitPoints } from "./filterFiniteFitPoints";
import { resolveFitModelRangeIntersection } from "./resolveFitModelRangeIntersection";
import { runDeterministicLineFit } from "./runDeterministicLineFit";

function linearFlux({
	wavelengthUm,
	k,
	b,
	x0Um,
}: {
	wavelengthUm: number;
	k: number;
	b: number;
	x0Um: number;
}): number {
	return k * (wavelengthUm - x0Um) + b;
}

function gaussianFlux({
	wavelengthUm,
	amplitude,
	muUm,
	sigmaUm,
}: {
	wavelengthUm: number;
	amplitude: number;
	muUm: number;
	sigmaUm: number;
}): number {
	return amplitude * Math.exp(-0.5 * ((wavelengthUm - muUm) / sigmaUm) ** 2);
}

function createLinearModel(
	patch: Partial<Extract<Spectrum1DCanvasFitModel, { kind: "linear" }>> = {},
): Extract<Spectrum1DCanvasFitModel, { kind: "linear" }> {
	return {
		id: 1,
		kind: "linear",
		label: "Linear 1",
		active: true,
		subtractFromSlice: false,
		color: "#ffffff",
		range: { minUm: 1, maxUm: 3 },
		k: 0,
		b: 0,
		x0Um: 2,
		...patch,
	};
}

function createGaussianModel(
	patch: Partial<Extract<Spectrum1DCanvasFitModel, { kind: "gaussian" }>> = {},
): Extract<Spectrum1DCanvasFitModel, { kind: "gaussian" }> {
	return {
		id: 2,
		kind: "gaussian",
		label: "Gaussian 1",
		active: true,
		subtractFromSlice: false,
		color: "#ffffff",
		range: { minUm: 1, maxUm: 3 },
		amplitude: 4,
		muUm: 1.9,
		sigmaUm: 0.18,
		...patch,
	};
}

function createPoints({
	range,
	count,
	fluxAt,
}: {
	range: Spectrum1DCanvasWaveRange;
	count: number;
	fluxAt: (wavelengthUm: number) => number;
}): Spectrum1DCanvasPoint[] {
	return Array.from({ length: count }, (_, index) => {
		const wavelengthUm =
			range.minUm +
			((range.maxUm - range.minUm) * index) / Math.max(1, count - 1);

		return {
			wavelengthUm,
			flux: fluxAt(wavelengthUm),
			error: 1,
		};
	});
}

describe("line-fit deterministic fit utilities", () => {
	it("resolves range intersection from multiple models", () => {
		const models = [
			createGaussianModel({ range: { minUm: 1, maxUm: 4 } }),
			createLinearModel({ range: { minUm: 2, maxUm: 3 } }),
		];

		expect(resolveFitModelRangeIntersection(models)).toEqual({
			minUm: 2,
			maxUm: 3,
		});
	});

	it("filters finite points inside a range", () => {
		const points: Spectrum1DCanvasPoint[] = [
			{ wavelengthUm: 1, flux: 1, error: 1 },
			{ wavelengthUm: 2, flux: Number.NaN, error: 1 },
			{ wavelengthUm: 3, flux: 3, error: Number.NaN },
			{ wavelengthUm: 4, flux: 4, error: 1 },
		];

		expect(filterFiniteFitPoints(points, { minUm: 0.5, maxUm: 3.5 })).toEqual([
			{ wavelengthUm: 1, flux: 1, error: 1 },
			{ wavelengthUm: 3, flux: 3, error: Number.NaN },
		]);
	});

	it("recovers linear k and b while preserving x0Um", () => {
		const x0Um = 2;
		const points = createPoints({
			range: { minUm: 1, maxUm: 3 },
			count: 25,
			fluxAt: (wavelengthUm) =>
				linearFlux({ wavelengthUm, k: 2.5, b: -0.75, x0Um }),
		});
		const inactiveGaussian = createGaussianModel({
			active: false,
			amplitude: 999,
			muUm: 1.7,
			sigmaUm: 0.05,
		});
		const result = runDeterministicLineFit({
			models: [createLinearModel({ x0Um }), inactiveGaussian],
			points,
		});

		expect(result.ok).toBe(true);
		if (!result.ok) {
			return;
		}

		const model = result.models[0];
		expect(model.kind).toBe("linear");
		if (model.kind !== "linear") {
			return;
		}

		expect(model.k).toBeCloseTo(2.5, 6);
		expect(model.b).toBeCloseTo(-0.75, 6);
		expect(model.x0Um).toBe(x0Um);
		expect(result.models[1]).toBe(inactiveGaussian);
	});

	it("recovers a single gaussian", () => {
		const points = createPoints({
			range: { minUm: 1.5, maxUm: 2.5 },
			count: 60,
			fluxAt: (wavelengthUm) =>
				gaussianFlux({
					wavelengthUm,
					amplitude: 5,
					muUm: 2,
					sigmaUm: 0.15,
				}),
		});
		const result = runDeterministicLineFit({
			models: [
				createGaussianModel({
					range: { minUm: 1.5, maxUm: 2.5 },
					amplitude: 4.5,
					muUm: 1.95,
					sigmaUm: 0.2,
				}),
			],
			points,
		});

		expect(result.ok).toBe(true);
		if (!result.ok) {
			return;
		}

		const model = result.models[0];
		expect(model.kind).toBe("gaussian");
		if (model.kind !== "gaussian") {
			return;
		}

		expect(model.amplitude).toBeCloseTo(5, 3);
		expect(model.muUm).toBeCloseTo(2, 4);
		expect(model.sigmaUm).toBeCloseTo(0.15, 4);
	});

	it("recovers gaussian plus linear parameters", () => {
		const x0Um = 2;
		const points = createPoints({
			range: { minUm: 1.5, maxUm: 2.5 },
			count: 70,
			fluxAt: (wavelengthUm) =>
				gaussianFlux({
					wavelengthUm,
					amplitude: 4.5,
					muUm: 2,
					sigmaUm: 0.12,
				}) + linearFlux({ wavelengthUm, k: 0.8, b: 0.4, x0Um }),
		});
		const result = runDeterministicLineFit({
			models: [
				createGaussianModel({
					range: { minUm: 1.5, maxUm: 2.5 },
					amplitude: 4.8,
					muUm: 2.03,
					sigmaUm: 0.16,
				}),
				createLinearModel({
					id: 3,
					range: { minUm: 1.5, maxUm: 2.5 },
					k: 1,
					b: 0.2,
					x0Um,
				}),
			],
			points,
		});

		expect(result.ok).toBe(true);
		if (!result.ok) {
			return;
		}

		const gaussian = result.models[0];
		const linear = result.models[1];
		expect(gaussian.kind).toBe("gaussian");
		expect(linear.kind).toBe("linear");
		if (gaussian.kind !== "gaussian" || linear.kind !== "linear") {
			return;
		}

		expect(gaussian.amplitude).toBeCloseTo(4.5, 3);
		expect(gaussian.muUm).toBeCloseTo(2, 4);
		expect(gaussian.sigmaUm).toBeCloseTo(0.12, 4);
		expect(linear.k).toBeCloseTo(0.8, 3);
		expect(linear.b).toBeCloseTo(0.4, 3);
		expect(linear.x0Um).toBe(x0Um);
	});

	it("returns failure without model mutation for invalid cases", () => {
		const inactiveModel = createGaussianModel({
			active: false,
			amplitude: Number.NaN,
		});
		const invalidResult = runDeterministicLineFit({
			models: [inactiveModel],
			points: [{ wavelengthUm: 2, flux: 1, error: 1 }],
		});

		expect(invalidResult.ok).toBe(false);
		expect(inactiveModel).toEqual(
			createGaussianModel({ active: false, amplitude: Number.NaN }),
		);

		const activeModel = createGaussianModel({ sigmaUm: Number.NaN });
		const result = runDeterministicLineFit({
			models: [activeModel],
			points: [{ wavelengthUm: 2, flux: 1, error: 1 }],
		});

		expect(result.ok).toBe(false);
		expect(activeModel).toEqual(createGaussianModel({ sigmaUm: Number.NaN }));
	});
});
