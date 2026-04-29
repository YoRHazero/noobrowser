import { Badge, Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { LineFitPriorDrawerModelOptionModel } from "../../hooks/useLineFitPriorDrawer";
import { priorDrawerRecipe } from "./PriorDrawer.recipe";

export interface PriorModelListProps {
	models: readonly LineFitPriorDrawerModelOptionModel[];
}

export function PriorModelList({ models }: PriorModelListProps) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.selectionColumn}>
			<Box css={styles.selectionHeader}>
				<Text css={styles.selectionTitle}>Models</Text>
			</Box>
			<Stack css={styles.selectionContent}>
				{models.length === 0 ? (
					<Stack css={styles.selectionEmpty}>No active models</Stack>
				) : (
					models.map((model) => {
						const rowStyles = recipe({
							selected: model.selected,
							hasPrior: model.hasPrior,
						});

						return (
							<Box
								key={model.modelId}
								as="button"
								css={rowStyles.selectionRow}
								onClick={model.onSelect}
							>
								<Stack css={rowStyles.selectionText}>
									<Text css={rowStyles.selectionName}>{model.name}</Text>
								</Stack>
								{model.hasPrior ? (
									<Badge size="sm" variant="subtle" css={rowStyles.priorBadge}>
										Prior
									</Badge>
								) : null}
							</Box>
						);
					})
				)}
			</Stack>
		</Stack>
	);
}
