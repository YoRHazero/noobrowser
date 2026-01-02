"use client";

import { Button, HStack } from "@chakra-ui/react";
import { LuRotateCcw, LuSparkles } from "react-icons/lu";

import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitModel, FitPrior } from "@/stores/stores-types";

interface PriorOperationsProps {
	allModels: FitModel[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
}
export default function PriorOperations({ allModels, updateModelPrior }: PriorOperationsProps) {

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
		toaster.create({
			title: "Auto Guess",
			description: "This feature is coming soon!",
			type: "info",
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