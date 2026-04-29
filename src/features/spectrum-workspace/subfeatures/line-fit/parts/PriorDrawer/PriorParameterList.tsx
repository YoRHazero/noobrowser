import { Badge, Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { LineFitPriorDrawerParameterModel } from "../../hooks/useLineFitPriorDrawer";
import { priorDrawerRecipe } from "./PriorDrawer.recipe";

export interface PriorParameterListProps {
	parameters: readonly LineFitPriorDrawerParameterModel[];
}

export function PriorParameterList({ parameters }: PriorParameterListProps) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.selectionColumn}>
			<Box css={styles.selectionHeader}>
				<Text css={styles.selectionTitle}>Parameters</Text>
			</Box>
			<Stack css={styles.selectionContent}>
				{parameters.length === 0 ? (
					<Stack css={styles.selectionEmpty}>Select a model</Stack>
				) : (
					parameters.map((parameter) => {
						const hasPrior = parameter.priorType !== "Default";
						const rowStyles = recipe({
							selected: parameter.selected,
							hasPrior,
						});

						return (
							<Box
								key={`${parameter.modelId}:${parameter.paramName}`}
								as="button"
								css={rowStyles.selectionRow}
								onClick={parameter.onSelect}
							>
								<Stack css={rowStyles.selectionText}>
									<Text css={rowStyles.selectionName}>{parameter.label}</Text>
									<Text css={rowStyles.selectionValue}>
										{parameter.currentValue}
									</Text>
								</Stack>
								<Badge size="sm" variant="subtle" css={rowStyles.priorBadge}>
									{parameter.priorType}
								</Badge>
							</Box>
						);
					})
				)}
			</Stack>
		</Stack>
	);
}
