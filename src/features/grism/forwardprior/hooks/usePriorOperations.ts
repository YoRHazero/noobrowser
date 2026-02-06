import { toaster } from "@/components/ui/toaster";
import type {
	FitGaussianModel,
	FitModel,
	FitPrior,
} from "@/stores/stores-types";

// Constants
const C_LIGHT = 299792.458; // km/s
const SIGMA_TO_FWHM = 2.35482;

interface UsePriorOperationsProps {
	allModels: FitModel[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
}

export function usePriorOperations({
	allModels,
	updateModelPrior,
}: UsePriorOperationsProps) {
	/* -------------------------------------------------------------------------- */
	/*                                   Handle                                   */
	/* -------------------------------------------------------------------------- */
	const handleClearAll = () => {
		let count = 0;
		allModels.forEach((model) => {
			if (!model.priors) return;
			Object.keys(model.priors).forEach((key) => {
				updateModelPrior(model.id, key, undefined);
				count++;
			});
		});

		if (count > 0) {
			toaster.success({
				title: "Priors Cleared",
				description: `Reset ${count} parameters to default priors.`,
			});
		} else {
			toaster.create({
				title: "No Priors to Clear",
				description: "All parameters are already using default values.",
				type: "info",
			});
		}
	};

	const handleAutoGuess = () => {
		const gaussians = allModels.filter(
			(m) => m.kind === "gaussian",
		) as FitGaussianModel[];

		if (gaussians.length !== 2) {
			toaster.create({
				title: "Auto Guess Unavailable",
				description:
					"This feature currently requires exactly 2 Gaussian models.",
				type: "info",
			});
			return;
		}

		let count = 0;
		gaussians.forEach((model) => {
			// 1. Amplitude
			updateModelPrior(model.id, "amplitude", {
				type: "TruncatedNormal",
				mu: model.amplitude,
				sigma: model.amplitude / 2,
				lower: model.amplitude / 3,
			});

			// 2. Mu (10 Angstrom window)
			const tenAngstroms = 0.001;
			updateModelPrior(model.id, "mu", {
				type: "TruncatedNormal",
				mu: model.mu,
				sigma: tenAngstroms,
				lower: model.mu - tenAngstroms,
				upper: model.mu + tenAngstroms,
			});

			// 3. Sigma
			const sigmaDecrease = (150 * model.mu) / (C_LIGHT * SIGMA_TO_FWHM);
			const lowerSigma = Math.max(0, model.sigma - sigmaDecrease);

			updateModelPrior(model.id, "sigma", {
				type: "TruncatedNormal",
				mu: model.sigma,
				sigma: model.sigma / 2,
				lower: lowerSigma,
				upper: model.sigma * 4,
			});
			count++;
		});

		toaster.success({
			title: "Auto Guess Applied",
			description: `Applied priors to ${count} Gaussian models.`,
		});
	};

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		handleClearAll,
		handleAutoGuess,
	};
}
