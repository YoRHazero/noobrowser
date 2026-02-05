import {
	Box,
	Flex,
	HStack,
	IconButton,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { memo } from "react";
import { LuTrash2 } from "react-icons/lu";
import { useEmissionLineCard } from "./hooks/useEmissionLineCard";
import { emissionLineCardRecipe } from "./recipes/emission-line-card.recipe";

interface EmissionLineCardProps {
	emissionId: string;
}

export const EmissionLineCard = memo(function EmissionLineCard({
	emissionId,
}: EmissionLineCardProps) {
	const recipe = useSlotRecipe({ recipe: emissionLineCardRecipe });
	const { name, isSelected, rest, obs, unit, toggleSelected, remove } =
		useEmissionLineCard(emissionId);
	const styles = recipe({ selected: isSelected });

	return (
		<Box
			css={styles.root}
			role="button"
			onClick={() => toggleSelected(!isSelected)}
		>
			<Flex justify="space-between" align="start">
				<Box flex={1} minW={0}>
					<Text css={styles.label} mb={1}>
						{name}
					</Text>
					<HStack align="center" gap={3} wrap="wrap">
						<Text css={styles.value}>
							Rest: {rest}
							{` ${unit}`}
						</Text>
						<Text css={styles.value}>
							Obs: {obs}
							{` ${unit}`}
						</Text>
					</HStack>
				</Box>

				<IconButton
					aria-label="Delete line"
					size="xs"
					variant="ghost"
					css={styles.actionButton}
					onClick={(e) => {
						e.stopPropagation();
						remove();
					}}
				>
					<LuTrash2 />
				</IconButton>
			</Flex>
		</Box>
	);
});
