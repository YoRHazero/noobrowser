import { Box, HStack, Stack, Switch, Tabs, Text } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
// Import Forms
import DeterministicForm from "./forms/DeterminsticForm";
import FixedForm from "./forms/FixedForm";
import GaussianFamilyForm from "./forms/GaussianForm";
import UniformForm from "./forms/UniformForm";
import type { FitModel, FitPrior } from "@/stores/stores-types";

interface PriorTypeTabsProps {
	modelId: number;
	paramName: string;
	allModels: FitModel[];
	
	// Hook Data
	displayConfig: FitPrior | undefined;
	useVelocity: boolean;
	canUseVelocity: boolean;
	
	// Handlers
	setUseVelocity: (v: boolean) => void;
	handleTypeChange: (type: string) => void;
	handleFormChange: (config: FitPrior) => void;
}

export function PriorTypeTabs(props: PriorTypeTabsProps) {
	const {
		modelId,
		paramName,
		allModels,
		displayConfig,
		useVelocity,
		canUseVelocity,
		setUseVelocity,
		handleTypeChange,
		handleFormChange,
	} = props;

	const currentModel = allModels.find((m) => m.id === modelId);
	if (!currentModel) return null;

	const currentTabValue = displayConfig?.type ?? "Default";

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
