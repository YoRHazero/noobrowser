import { fwhmKmSToSigmaUm } from "./fwhmKmSToSigmaUm";
import { sigmaUmToFwhmKmS } from "./sigmaUmToFwhmKmS";

export function createTwoGaussianFwhmAutoPriors(
	gaussianModels: readonly { id: number; muUm: number; sigmaUm: number }[],
	options: { priorSigmaFwhmKmS: number },
) {
	if (gaussianModels.length !== 2) {
		return {
			assignments: [],
			reason: "Auto requires exactly two active gaussian models.",
		};
	}

	const modelsWithFwhm = gaussianModels.map((model) => ({
		model,
		fwhmKmS: sigmaUmToFwhmKmS(model.muUm, model.sigmaUm),
	}));
	if (
		modelsWithFwhm.some((item) => item.fwhmKmS === null || !(item.fwhmKmS > 0))
	) {
		return {
			assignments: [],
			reason: "Auto requires two gaussians with positive FWHM values.",
		};
	}

	const [first, second] = modelsWithFwhm as [
		{
			model: { id: number; muUm: number; sigmaUm: number };
			fwhmKmS: number;
		},
		{
			model: { id: number; muUm: number; sigmaUm: number };
			fwhmKmS: number;
		},
	];
	const [small, large] =
		first.fwhmKmS <= second.fwhmKmS ? [first, second] : [second, first];
	const fwhmDiffKmS = large.fwhmKmS - small.fwhmKmS;
	const smallPriorMu = fwhmKmSToSigmaUm(small.model.muUm, small.fwhmKmS);
	const smallPriorSigma = fwhmKmSToSigmaUm(
		small.model.muUm,
		options.priorSigmaFwhmKmS,
	);
	const smallPriorLower = fwhmKmSToSigmaUm(small.model.muUm, small.fwhmKmS / 4);
	const smallPriorUpper = fwhmKmSToSigmaUm(
		small.model.muUm,
		small.fwhmKmS + fwhmDiffKmS / 3,
	);
	const largePriorMu = fwhmKmSToSigmaUm(large.model.muUm, large.fwhmKmS);
	const largePriorSigma = fwhmKmSToSigmaUm(
		large.model.muUm,
		options.priorSigmaFwhmKmS,
	);
	const largePriorLower = fwhmKmSToSigmaUm(
		large.model.muUm,
		large.fwhmKmS - fwhmDiffKmS / 2,
	);
	const largePriorUpper = fwhmKmSToSigmaUm(large.model.muUm, large.fwhmKmS * 4);

	if (
		smallPriorMu === null ||
		smallPriorSigma === null ||
		smallPriorLower === null ||
		smallPriorUpper === null ||
		largePriorMu === null ||
		largePriorSigma === null ||
		largePriorLower === null ||
		largePriorUpper === null ||
		!(smallPriorSigma > 0) ||
		!(largePriorSigma > 0) ||
		!(smallPriorLower < smallPriorUpper) ||
		!(largePriorLower < largePriorUpper)
	) {
		return {
			assignments: [],
			reason: "Auto could not create valid FWHM prior bounds.",
		};
	}

	return {
		assignments: [
			{
				modelId: small.model.id,
				paramName: "sigma",
				prior: {
					type: "TruncatedNormal" as const,
					mu: smallPriorMu,
					sigma: smallPriorSigma,
					lower: smallPriorLower,
					upper: smallPriorUpper,
				},
			},
			{
				modelId: large.model.id,
				paramName: "sigma",
				prior: {
					type: "TruncatedNormal" as const,
					mu: largePriorMu,
					sigma: largePriorSigma,
					lower: largePriorLower,
					upper: largePriorUpper,
				},
			},
		],
		reason: null,
	};
}
