import {
	Box,
	Button,
	CloseButton,
	Drawer,
	HStack,
	Portal,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import type { LineFitPriorDrawerModel } from "../../hooks/lineFitPriorDrawerModels";
import { priorDrawerRecipe } from "./PriorDrawer.recipe";
import { PriorModelList } from "./PriorModelList";
import { PriorParameterEditor } from "./PriorParameterEditor";
import { PriorParameterList } from "./PriorParameterList";

export interface PriorDrawerProps {
	model: LineFitPriorDrawerModel;
}

export function PriorDrawer({ model }: PriorDrawerProps) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Drawer.Root
			open={model.isOpen}
			placement="end"
			size="md"
			onOpenChange={(details) => model.onOpenChange(details.open)}
		>
			<Portal>
				<Drawer.Backdrop css={styles.backdrop} />
				<Drawer.Positioner>
					<Drawer.Content css={styles.content}>
						<Drawer.Header css={styles.header}>
							<HStack css={styles.titleRow}>
								<Stack css={styles.titleStack}>
									<Text css={styles.title}>Priors</Text>
									<Text css={styles.subtitle}>
										{model.configurationName || "Fit configuration"}
									</Text>
								</Stack>
								<Drawer.CloseTrigger asChild>
									<CloseButton size="sm" css={styles.closeButton} />
								</Drawer.CloseTrigger>
							</HStack>
						</Drawer.Header>

						<Drawer.Body css={styles.body}>
							{model.models.length === 0 ? (
								<Stack css={styles.editorEmpty}>No active models</Stack>
							) : (
								<Stack css={styles.layout}>
									<Box css={styles.selectionArea}>
										<Box css={styles.selectionGrid}>
											<PriorModelList models={model.models} />
											<PriorParameterList parameters={model.parameters} />
										</Box>
									</Box>
									<Stack css={styles.editorPane}>
										{model.editor ? (
											<PriorParameterEditor {...model.editor} />
										) : (
											<Stack css={styles.editorEmpty}>Select a parameter</Stack>
										)}
									</Stack>
								</Stack>
							)}
						</Drawer.Body>

						<Drawer.Footer css={styles.footer}>
							<Tooltip content={model.autoFwhmPriors.tooltip}>
								<Box display="inline-flex">
									<Button
										size="sm"
										variant="solid"
										colorPalette="teal"
										disabled={!model.autoFwhmPriors.canApply}
										onClick={model.autoFwhmPriors.onApply}
									>
										Auto
									</Button>
								</Box>
							</Tooltip>
							<Button
								size="sm"
								variant="outline"
								disabled={!model.canClearActivePriors}
								onClick={model.onClearActivePriors}
							>
								Clear active priors
							</Button>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
}
