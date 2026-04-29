import { describe, expect, it } from "vitest";
import type { Spectrum1DCanvasGaussianFitModel } from "@/canvas/spectrum1dCanvas";
import { createTwoGaussianFwhmAutoPriors } from "./createTwoGaussianFwhmAutoPriors";
import { fwhmKmSToSigmaUm } from "./fwhmKmSToSigmaUm";

function createGaussianModel(
	patch: Partial<Spectrum1DCanvasGaussianFitModel> = {},
): Spectrum1DCanvasGaussianFitModel {
	return {
		id: 1,
		kind: "gaussian",
		label: "Gaussian 1",
		active: true,
		subtractFromSlice: false,
		color: "#ffffff",
		range: { minUm: 1, maxUm: 3 },
		amplitude: 1,
		muUm: 2,
		sigmaUm: 0.01,
		...patch,
	};
}

function expectTruncatedNormalPrior(
	prior: unknown,
	expected: {
		mu: number | null;
		sigma: number | null;
		lower: number | null;
		upper: number | null;
	},
) {
	expect(prior).toMatchObject({ type: "TruncatedNormal" });
	if (
		!prior ||
		typeof prior !== "object" ||
		!("mu" in prior) ||
		!("sigma" in prior) ||
		!("lower" in prior) ||
		!("upper" in prior)
	) {
		throw new Error("Expected a truncated-normal prior.");
	}

	expect(prior.mu).toBeCloseTo(expected.mu ?? Number.NaN);
	expect(prior.sigma).toBeCloseTo(expected.sigma ?? Number.NaN);
	expect(prior.lower).toBeCloseTo(expected.lower ?? Number.NaN);
	expect(prior.upper).toBeCloseTo(expected.upper ?? Number.NaN);
}

describe("createTwoGaussianFwhmAutoPriors", () => {
	it("creates truncated-normal sigma priors from two gaussian FWHM values", () => {
		const smallModel = createGaussianModel({
			id: 10,
			muUm: 2,
			sigmaUm: fwhmKmSToSigmaUm(2, 1000) ?? 0,
		});
		const largeModel = createGaussianModel({
			id: 20,
			muUm: 2,
			sigmaUm: fwhmKmSToSigmaUm(2, 2500) ?? 0,
		});

		const result = createTwoGaussianFwhmAutoPriors([largeModel, smallModel], {
			priorSigmaFwhmKmS: 500,
		});

		expect(result.reason).toBeNull();
		expect(result.assignments).toHaveLength(2);

		const smallPrior = result.assignments.find(
			(assignment) => assignment.modelId === smallModel.id,
		)?.prior;
		const largePrior = result.assignments.find(
			(assignment) => assignment.modelId === largeModel.id,
		)?.prior;

		expectTruncatedNormalPrior(smallPrior, {
			mu: fwhmKmSToSigmaUm(2, 1000),
			sigma: fwhmKmSToSigmaUm(2, 500),
			lower: fwhmKmSToSigmaUm(2, 250),
			upper: fwhmKmSToSigmaUm(2, 1500),
		});
		expectTruncatedNormalPrior(largePrior, {
			mu: fwhmKmSToSigmaUm(2, 2500),
			sigma: fwhmKmSToSigmaUm(2, 500),
			lower: fwhmKmSToSigmaUm(2, 1750),
			upper: fwhmKmSToSigmaUm(2, 10000),
		});
	});

	it("requires exactly two positive-FWHM gaussian models", () => {
		expect(
			createTwoGaussianFwhmAutoPriors([], { priorSigmaFwhmKmS: 500 }).reason,
		).toBe("Auto requires exactly two active gaussian models.");

		expect(
			createTwoGaussianFwhmAutoPriors(
				[
					createGaussianModel({ id: 1, sigmaUm: 0 }),
					createGaussianModel({ id: 2, sigmaUm: 0.01 }),
				],
				{ priorSigmaFwhmKmS: 500 },
			).reason,
		).toBe("Auto requires two gaussians with positive FWHM values.");
	});
});
