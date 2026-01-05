"use client";

import { Button, HStack } from "@chakra-ui/react";
import { LuRotateCcw, LuSparkles } from "react-icons/lu";

import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitGaussianModel, FitModel, FitPrior } from "@/stores/stores-types";

interface PriorOperationsProps {
	allModels: FitModel[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
}
export default function PriorOperations({
	allModels,
	updateModelPrior,
}: PriorOperationsProps) {
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
			toaster.create({
				title: "Priors Cleared",
				description: `Reset ${count} parameters to default priors.`,
				type: "success",
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

		const C_LIGHT = 299792.458; // km/s
		const SIGMA_TO_FWHM = 2.35482;

		let count = 0;
		gaussians.forEach((model) => {
			// 2.2.1 Amplitude
			// TruncatedNormal: mu=val, sigma=val/2, lower=val/3, upper=unset
			updateModelPrior(model.id, "amplitude", {
				type: "TruncatedNormal",
				mu: model.amplitude,
				sigma: model.amplitude / 2,
				lower: model.amplitude / 3,
			});

			// 2.2.2 Mu
			// TruncatedNormal: mu=val, sigma=10A, lower=val-10A, upper=val+10A
			// 10 Angstrom = 0.001 micron
			const tenAngstroms = 0.001;
			updateModelPrior(model.id, "mu", {
				type: "TruncatedNormal",
				mu: model.mu,
				sigma: tenAngstroms,
				lower: model.mu - tenAngstroms,
				upper: model.mu + tenAngstroms,
			});

			// 2.2.3 Sigma
			// "sigma converted to fwhm... lower is value - 100km/s"
			// lower_sigma = sigma - (100 * mu) / (c * fwhmFactor)
			const sigmaDecrease = (100 * model.mu) / (C_LIGHT * SIGMA_TO_FWHM);
			const lowerSigma = Math.max(0, model.sigma - sigmaDecrease);

			updateModelPrior(model.id, "sigma", {
				type: "TruncatedNormal",
				mu: model.sigma,
				sigma: model.sigma / 2,
				lower: lowerSigma,
				upper: model.sigma * 2,
			});
			count++;
		});

		toaster.create({
			title: "Auto Guess Applied",
			description: `Applied priors to ${count} Gaussian models.`,
			type: "success",
		});
	};

	return (
		<HStack justify="flex-end" gap={2} p={0}>
			<Tooltip content="Intelligently guess priors based on data">
				<Button size="xs" variant="outline" onClick={handleAutoGuess}>
					<LuSparkles />
					Auto
				</Button>
			</Tooltip>

			<Tooltip content="Reset all parameters of all models to default priors">
				<Button
					size="xs"
					variant="ghost"
					colorPalette="red"
					onClick={handleClearAll}
				>
					<LuRotateCcw />
					Reset
				</Button>
			</Tooltip>
		</HStack>
	);
}
