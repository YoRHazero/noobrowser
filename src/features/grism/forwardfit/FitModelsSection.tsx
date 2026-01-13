import { ScrollArea, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import GaussianModelCard from "./GaussianModelCard";
import LinearModelCard from "./LinearModelCard";
import { useFitModelsSection } from "./hooks/useFitModelsSection";
import { fitModelsSectionRecipe } from "./recipes/fit-models-section.recipe";

export default function FitModelsSection() {
	const { models } = useFitModelsSection();

	const recipe = useSlotRecipe({ recipe: fitModelsSectionRecipe });
	const styles = recipe();

	return (
		<ScrollArea.Root flex="1" minH="0">
			<ScrollArea.Viewport>
				<ScrollArea.Content css={styles.content}>
					{models.length === 0 ? (
						<Stack css={styles.emptyState}>
							<Text css={styles.emptyTitle}>NO MODELS LOADED</Text>
							<Text css={styles.emptySubtitle}>
								Add a signal model to begin
							</Text>
						</Stack>
					) : (
						<Stack gap={3} pb={4}>
							{models.map((model) =>
								model.kind === "linear" ? (
									<LinearModelCard key={model.id} model={model} />
								) : (
									<GaussianModelCard key={model.id} model={model} />
								),
							)}
						</Stack>
					)}
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar>
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	);
}
