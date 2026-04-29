import type { Spectrum1DCanvasFitModel } from "@/canvas/spectrum1dCanvas";
import type {
	FitGaussianModel,
	FitLinearModel,
	FitModel,
	FitPrior,
} from "@/hooks/query/fit/schemas";

function normalizeRange(range: Spectrum1DCanvasFitModel["range"]) {
	return {
		min: Math.min(range.minUm, range.maxUm),
		max: Math.max(range.minUm, range.maxUm),
	};
}

function pickPriors<T extends string>(
	priors: Partial<Record<string, FitPrior>> | undefined,
	keys: readonly T[],
): Partial<Record<T, FitPrior>> | undefined {
	if (!priors) {
		return undefined;
	}

	const nextPriors: Partial<Record<T, FitPrior>> = {};
	for (const key of keys) {
		const prior = priors[key];
		if (prior) {
			nextPriors[key] = prior;
		}
	}

	return Object.keys(nextPriors).length > 0 ? nextPriors : undefined;
}

export function createLineFitJobModel(
	model: Spectrum1DCanvasFitModel,
	priors?: Partial<Record<string, FitPrior>>,
): FitModel {
	const base = {
		id: model.id,
		name: model.label,
		active: model.active,
		subtracted: model.subtractFromSlice,
		range: normalizeRange(model.range),
		color: model.color,
	};

	if (model.kind === "gaussian") {
		const gaussianPriors = pickPriors(priors, ["amplitude", "mu", "sigma"]);
		const jobModel: FitGaussianModel = {
			...base,
			kind: "gaussian",
			amplitude: model.amplitude,
			mu: model.muUm,
			sigma: model.sigmaUm,
			...(gaussianPriors ? { priors: gaussianPriors } : {}),
		};

		return jobModel;
	}

	const linearPriors = pickPriors(priors, ["k", "b"]);
	const jobModel: FitLinearModel = {
		...base,
		kind: "linear",
		k: model.k,
		b: model.b,
		x0: model.x0Um,
		...(linearPriors ? { priors: linearPriors } : {}),
	};

	return jobModel;
}
