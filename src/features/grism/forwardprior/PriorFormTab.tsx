"use client";

import { Box, HStack, Stack, Switch, Tabs, Text } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
// Import Atom Forms
import DeterministicForm from "@/features/grism/forwardprior/forms/DeterminsticForm";
import FixedForm from "@/features/grism/forwardprior/forms/FixedForm";
import GaussianFamilyForm from "@/features/grism/forwardprior/forms/GaussianForm";
import UniformForm from "@/features/grism/forwardprior/forms/UniformForm";
import type { FitModel, FitPrior, PriorType } from "@/stores/stores-types";
import { getModelParamValue } from "@/stores/stores-utils";
import { SIGMA_TO_FWHM, SPEED_OF_LIGHT_KM_S } from "@/utils/wavelength";

interface PriorTypeTabsProps {
	modelId: number;
	paramName: string;
	allModels: FitModel[];
	config: FitPrior | undefined;
	onChange: (newConfig: FitPrior | undefined) => void;
}

export default function PriorFormTabs(props: PriorTypeTabsProps) {
	const { modelId, paramName, allModels, config, onChange } = props;

	const currentModel = allModels.find((m) => m.id === modelId);

	const canUseVelocity =
		currentModel?.kind === "gaussian" && paramName === "sigma";
	const [useVelocity, setUseVelocity] = useState(false);

	const conversionFactor = useMemo(() => {
		if (!canUseVelocity || !currentModel || currentModel.kind !== "gaussian")
			return 1;
		const centerLambda = currentModel.mu > 0 ? currentModel.mu : 1;
		return (SIGMA_TO_FWHM * SPEED_OF_LIGHT_KM_S) / centerLambda;
	}, [canUseVelocity, currentModel]);

	const displayConfig = useMemo(() => {
		if (!config) return undefined;
		if (!useVelocity || conversionFactor === 1) return config;

		const cloned = structuredClone(config);
		if ("mu" in cloned) cloned.mu *= conversionFactor;
		if ("sigma" in cloned) cloned.sigma *= conversionFactor;
		if ("value" in cloned) cloned.value *= conversionFactor;
		if ("lower" in cloned && cloned.lower !== undefined)
			cloned.lower *= conversionFactor;
		if ("upper" in cloned && cloned.upper !== undefined)
			cloned.upper *= conversionFactor;
		return cloned;
	}, [config, useVelocity, conversionFactor]);

	const handleFormChange = useCallback(
		(newConfig: FitPrior) => {
			if (!useVelocity || conversionFactor === 1) {
				onChange(newConfig);
				return;
			}
			const cloned = structuredClone(newConfig);
			if ("mu" in cloned) cloned.mu /= conversionFactor;
			if ("sigma" in cloned) cloned.sigma /= conversionFactor;
			if ("value" in cloned) cloned.value /= conversionFactor;
			if ("lower" in cloned && cloned.lower !== undefined)
				cloned.lower /= conversionFactor;
			if ("upper" in cloned && cloned.upper !== undefined)
				cloned.upper /= conversionFactor;

			onChange(cloned);
		},
		[useVelocity, conversionFactor, onChange],
	);

	if (!currentModel) return null;
	const currentTabValue = config?.type ?? "Default";

	const handleTypeChange = (newTypeStr: string) => {
		if (newTypeStr === currentTabValue) return;
		if (newTypeStr === "Default") {
			onChange(undefined);
			return;
		}
		let centerVal = 0;
		const sourceConfig = displayConfig;
		if (!sourceConfig) {
			const rawVal = getModelParamValue(currentModel, paramName) ?? 0;
			centerVal = useVelocity ? rawVal * conversionFactor : rawVal;
		} else {
			if ("value" in sourceConfig) centerVal = sourceConfig.value;
			else if ("mu" in sourceConfig) centerVal = sourceConfig.mu;
			else if (
				"lower" in sourceConfig &&
				"upper" in sourceConfig &&
				sourceConfig.lower !== undefined &&
				sourceConfig.upper !== undefined
			)
				centerVal = (sourceConfig.lower + sourceConfig.upper) / 2;
		}

		const newType = newTypeStr as PriorType;
		let newDisplayConfig: FitPrior;

		switch (newType) {
			case "Fixed":
				newDisplayConfig = { type: "Fixed", value: centerVal };
				break;
			case "Normal":
				newDisplayConfig = {
					type: "Normal",
					mu: centerVal,
					sigma: Math.abs(centerVal) * 0.1 || 1,
				};
				break;
			case "TruncatedNormal":
				newDisplayConfig = {
					type: "TruncatedNormal",
					mu: centerVal,
					sigma: Math.abs(centerVal) * 0.1 || 1,
					lower: undefined,
					upper: undefined,
				};
				break;
			case "Uniform": {
				const range = Math.abs(centerVal) * 0.1 || 1;
				newDisplayConfig = {
					type: "Uniform",
					lower: centerVal - range,
					upper: centerVal + range,
				};
				break;
			}
			case "Deterministic": {
				const otherModel = allModels.find((m) => m.id !== modelId);
				newDisplayConfig = {
					type: "Deterministic",
					mode: "add",
					value: 0,
					refModelId: otherModel ? otherModel.id : -1,
				};
				break;
			}
			default:
				return;
		}
		handleFormChange(newDisplayConfig);
	};

	return (
		<Tabs.Root
			value={currentTabValue}
			onValueChange={(d) => handleTypeChange(d.value)}
			variant="enclosed"
			size="sm"
			fitted
		>
			<Tabs.List>
				<Tabs.Trigger value="Default">Default</Tabs.Trigger>
				<Tabs.Trigger value="Normal">Normal</Tabs.Trigger>
				<Tabs.Trigger value="TruncatedNormal">Truncated</Tabs.Trigger>
				<Tabs.Trigger value="Uniform">Uniform</Tabs.Trigger>
				<Tabs.Trigger value="Fixed">Fixed</Tabs.Trigger>
				<Tabs.Trigger value="Deterministic">Link</Tabs.Trigger>
			</Tabs.List>

			<Box
				mt={4}
				p={4}
				borderWidth="1px"
				borderRadius="md"
				bg="bg.subtle"
				minH="220px"
				position="relative"
			>
				{canUseVelocity && currentTabValue !== "Default" && (
					<Box position="absolute" top={3} right={3} zIndex={2}>
						<Tooltip
							content="Toggle to edit parameters in FWHM Velocity (km/s)"
							positioning={{ placement: "top-end" }}
						>
							<HStack
								gap={1.5}
								bg="bg.panel"
								px={2}
								py={1}
								borderRadius="md"
								shadow="xs"
								borderWidth="1px"
							>
								<Text
									fontSize="xs"
									fontWeight="bold"
									color={useVelocity ? "teal.600" : "fg.muted"}
								>
									km/s
								</Text>
								<Switch.Root
									checked={useVelocity}
									onCheckedChange={(e) => setUseVelocity(e.checked)}
									size="xs"
									colorPalette="teal"
								>
									<Switch.HiddenInput />
									<Switch.Control>
										<Switch.Thumb />
									</Switch.Control>
								</Switch.Root>
							</HStack>
						</Tooltip>
					</Box>
				)}

				{/* Default Form (Empty State) */}
				{currentTabValue === "Default" && (
					<Stack
						h="full"
						align="center"
						justify="center"
						gap={4}
						opacity={0.6}
						minH="150px"
					>
						<Text
							fontSize="sm"
							color="fg.muted"
							textAlign="center"
							maxW="250px"
						>
							This parameter is using the <br />
							<b>Default Prior</b> (Uninformative).
						</Text>
						<Text fontSize="xs" color="fg.muted">
							Select other tabs to constrain this parameter.
						</Text>
					</Stack>
				)}

				{/* Custom Forms */}
				{displayConfig && (
					<Box pt={1}>
						{(displayConfig.type === "Normal" ||
							displayConfig.type === "TruncatedNormal") && (
							<GaussianFamilyForm
								config={displayConfig}
								onChange={handleFormChange}
								model={currentModel}
								paramName={paramName}
							/>
						)}

						{displayConfig.type === "Uniform" && (
							<UniformForm config={displayConfig} onChange={handleFormChange} />
						)}

						{displayConfig.type === "Fixed" && (
							<FixedForm config={displayConfig} onChange={handleFormChange} />
						)}

						{displayConfig.type === "Deterministic" && (
							<DeterministicForm
								config={displayConfig}
								onChange={handleFormChange}
								allModels={allModels}
								currentModelId={modelId}
								paramName={paramName}
							/>
						)}
					</Box>
				)}
			</Box>
		</Tabs.Root>
	);
}
