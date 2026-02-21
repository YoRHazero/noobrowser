"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { PriorTypeTabs } from "./components/PriorTypeTabs";
import { usePriorForm } from "./hooks/usePriorForm";
import type { FitModel, FitPrior } from "@/stores/stores-types";
import { getModelParamValue } from "@/stores/stores-utils";

interface PriorDetailViewProps {
	allModels: FitModel[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
	modelId: number;
	paramName: string;
}

export default function PriorDetailView(props: PriorDetailViewProps) {
	const { allModels, updateModelPrior, modelId, paramName } = props;

	const currentModel = allModels.find((m) => m.id === modelId);
	if (!currentModel) return null;

	const priorConfig = (
		currentModel.priors as Record<string, FitPrior | undefined> | undefined
	)?.[paramName];

	const handleConfigChange = (newConfig: FitPrior | undefined) => {
		updateModelPrior(modelId, paramName, newConfig);
	};

	const paramValue = getModelParamValue(currentModel, paramName);

	// Use Hook
	const formLogic = usePriorForm({
		modelId,
		paramName,
		allModels,
		config: priorConfig,
		onChange: handleConfigChange,
	});

	return (
		<Stack h="full" gap={0} overflow="hidden">
			{/* Content Area */}
			<Box flex="1" overflowY="auto" p={4}>
				<Stack gap={6}>
					<PriorTypeTabs
						modelId={modelId}
						paramName={paramName}
						allModels={allModels}
						{...formLogic}
					/>

					{/* Visualization Placeholder */}
					<Box
						h="150px"
						bg="bg.muted"
						borderRadius="md"
						borderStyle="dashed"
						borderWidth="1px"
						display="flex"
						alignItems="center"
						justifyContent="center"
					>
						<Text fontSize="xs" color="fg.muted">
							Initial value: {paramValue}
						</Text>
					</Box>
				</Stack>
			</Box>
		</Stack>
	);
}
