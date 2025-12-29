"use client";

import { Box, Stack, Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";

import { useFitStore } from "@/stores/fit";
import type { FitPrior } from "@/stores/stores-types";

import PriorFormTabs from "@/features/grism/forwardprior/PriorFormTab";

interface PriorFormProps {
	modelId: number;
	paramName: string;
}

export default function PriorForm(props: PriorFormProps) {
	const { modelId, paramName } = props;

	// 连接 Store
	const { models, updateModelPrior } = useFitStore(
		useShallow((s) => ({
			models: s.models,
			updateModelPrior: s.updateModelPrior,
		})),
	);

	const currentModel = models.find((m) => m.id === modelId);
	if (!currentModel) return null;

	// 获取当前 Config (可能是 undefined)
	const priorConfig = (currentModel.priors as Record<string, FitPrior | undefined> | undefined)?.[paramName];

	const handleConfigChange = (newConfig: FitPrior | undefined) => {
		updateModelPrior(modelId, paramName, newConfig);
	};

	return (
		<Stack h="full" gap={0} overflow="hidden">
			{/* Content Area */}
			<Box flex="1" overflowY="auto" p={4}>
				<Stack gap={6}>
					<PriorFormTabs
						modelId={modelId}
						paramName={paramName}
						allModels={models}
						config={priorConfig} // 传入 undefined 代表 Default
						onChange={handleConfigChange}
					/>

					{/* Visualization Placeholder (仅在非 Default 时显示) */}
					{priorConfig && (
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
								[Prior Distribution Preview]
							</Text>
						</Box>
					)}
				</Stack>
			</Box>
		</Stack>
	);
}