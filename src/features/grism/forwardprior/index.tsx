import {
	Box,
	CloseButton,
	Drawer,
	Flex,
	Separator,
	Stack,
	Text,
} from "@chakra-ui/react";
// Business Components (Root)
import PriorTitleHeader from "./PriorTitleHeader";
import PriorToolbar from "./PriorToolbar";
import PriorSelectionView from "./PriorSelectionView";
import PriorDetailView from "./PriorDetailView";
// Logic Hook
import { useForwardPrior } from "./hooks/useForwardPrior";
// Types
import type { FitModel, FitPrior } from "@/stores/stores-types";

interface GrismForwardPriorDrawerProps {
	isOpen: boolean;
	onClose: () => void;

	// --- Mode 1: Smart (Store ID) ---
	configId?: string | null;

	// --- Mode 2: Dumb (Props) ---
	models?: FitModel[];
	onUpdatePrior?: (
		modelId: number,
		paramName: string,
		newPrior: FitPrior | undefined,
	) => void;

	// Dumb Mode Title
	title?: string;
}

export default function GrismForwardPriorDrawer({
	configId,
	isOpen,
	onClose,
	models: propModels,
	onUpdatePrior: propOnUpdatePrior,
	title = "Model Settings",
}: GrismForwardPriorDrawerProps) {
	/* -------------------------------------------------------------------------- */
	/*                               Logic & State                                */
	/* -------------------------------------------------------------------------- */
	const {
		activeModels,
		selectedModelId,
		selectedParam,
		handleUpdatePrior,
		handleSelectModel,
		handleSelectParam,
	} = useForwardPrior({
		configId,
		propModels,
		propOnUpdatePrior,
	});

	// If no data, don't render
	if (!activeModels) return null;

	/* -------------------------------------------------------------------------- */
	/*                                   Render                                   */
	/* -------------------------------------------------------------------------- */
	return (
		<Drawer.Root
			open={isOpen}
			onOpenChange={(e) => !e.open && onClose()}
			size="md"
		>
			<Drawer.Backdrop />
			<Drawer.Positioner>
				<Drawer.Content>
					<Drawer.Header>
						<Stack gap={1} w="full">
							<Text fontSize="xs" color="fg.muted" fontWeight="medium">
								{configId ? "Configuration Settings" : "Active Model Settings"}
							</Text>

							{/* Title Area */}
							{configId ? (
								<PriorTitleHeader configId={configId} />
							) : (
								<Text fontWeight="bold" fontSize="md">
									{title}
								</Text>
							)}
						</Stack>
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" onClick={onClose} />
						</Drawer.CloseTrigger>
					</Drawer.Header>

					<Drawer.Body p={0}>
						<Flex direction="column" h="full">
							{/* Top: Toolbar */}
							<Stack p={4} pb={2} gap={4}>
								<PriorToolbar
									allModels={activeModels}
									updateModelPrior={handleUpdatePrior}
								/>
							</Stack>

							<Separator />

							{/* Middle: Selection */}
							<Flex
								h="180px"
								p={4}
								justify="center"
								bg="bg.subtle"
								borderBottomWidth="1px"
								borderColor="border.subtle"
							>
								<PriorSelectionView
									allModels={activeModels}
									selectedModelId={selectedModelId}
									selectedParam={selectedParam}
									onSelectModel={handleSelectModel}
									onSelectParam={handleSelectParam}
								/>
							</Flex>

							{/* Bottom: Detail/Form */}
							<Box flex="1" overflowY="auto" p={4}>
								{selectedModelId && selectedParam ? (
									<PriorDetailView
										allModels={activeModels}
										updateModelPrior={handleUpdatePrior}
										modelId={selectedModelId}
										paramName={selectedParam}
									/>
								) : (
									<Stack
										h="full"
										justify="center"
										align="center"
										color="fg.muted"
									>
										<Text fontSize="sm">
											Select a model and parameter above.
										</Text>
									</Stack>
								)}
							</Box>
						</Flex>
					</Drawer.Body>
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
