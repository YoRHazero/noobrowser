"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import PriorFormTabs from "@/features/grism/forwardprior/PriorFormTab";
import type { FitModel, FitPrior } from "@/stores/stores-types";
import { getModelParamValue } from "@/stores/stores-utils";

interface PriorFormProps {
	allModels: FitModel[];
	updateModelPrior: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;
	modelId: number;
	paramName: string;
}

export default function PriorForm(props: PriorFormProps) {
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

	return (
		<Stack h="full" gap={0} overflow="hidden">
			{/* Content Area */}
			<Box flex="1" overflowY="auto" p={4}>
				<Stack gap={6}>
					<PriorFormTabs
						modelId={modelId}
						paramName={paramName}
						allModels={allModels}
						config={priorConfig}
						onChange={handleConfigChange}
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
