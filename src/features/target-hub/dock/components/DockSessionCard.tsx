import { Box, HStack, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { dockSessionCardRecipe } from "../recipes/dockSessionCard.recipe";

interface DockSessionCardProps {
	title: string;
	raText: string;
	decText: string;
	refText: string;
	color: string;
	isEmpty: boolean;
}

export function DockSessionCard({
	title,
	raText,
	decText,
	refText,
	color,
	isEmpty,
}: DockSessionCardProps) {
	const recipe = useSlotRecipe({ recipe: dockSessionCardRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.card} gap={2}>
			<HStack gap={2} align="center" minW={0}>
				<Box
					position="relative"
					w="10px"
					h="10px"
					flexShrink={0}
					overflow="visible"
				>
					<Box
						css={styles.dot}
						w="10px"
						h="10px"
						style={{
							backgroundColor: color,
							boxShadow: `0 0 10px ${color}`,
							opacity: isEmpty ? 0.7 : 1,
						}}
					/>
				</Box>
				<Text
					fontSize="sm"
					fontWeight="bold"
					color="fg"
					css={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{title}
				</Text>
			</HStack>

			<Text fontSize="xs" color="fg.muted" fontVariantNumeric="tabular-nums">
				RA: {raText}
			</Text>
			<Text fontSize="xs" color="fg.muted" fontVariantNumeric="tabular-nums">
				Dec: {decText}
			</Text>
			<Text fontSize="xs" color="fg.muted" maxW="full" truncate>
				Ref: {refText}
			</Text>
		</Stack>
	);
}
