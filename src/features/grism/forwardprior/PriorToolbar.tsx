"use client";

import { Button, HStack } from "@chakra-ui/react";
import { LuRotateCcw, LuSparkles } from "react-icons/lu";

import { Tooltip } from "@/components/ui/tooltip";
import { usePriorOperations } from "./hooks/usePriorOperations";
import type { FitModel, FitPrior } from "@/stores/stores-types";

interface PriorToolbarProps {
	allModels: FitModel[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
}
export default function PriorToolbar({
	allModels,
	updateModelPrior,
}: PriorToolbarProps) {
	const { handleClearAll, handleAutoGuess } = usePriorOperations({
		allModels,
		updateModelPrior,
	});

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
