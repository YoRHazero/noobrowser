import { Box, HStack, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { dockSessionCardRecipe } from "./SessionCard.recipe";

interface SessionCardProps {
	title: string;
	raText: string;
	decText: string;
	refText: string;
	color: string;
	isEmpty: boolean;
}

export function SessionCard({
	title,
	raText,
	decText,
	refText,
	color,
	isEmpty,
}: SessionCardProps) {
	const recipe = useSlotRecipe({ recipe: dockSessionCardRecipe });
	const styles = recipe({ isEmpty });

	return (
		<Stack css={styles.card}>
			<HStack css={styles.header}>
				<Box css={styles.dotFrame}>
					<Box
						css={styles.dot}
						style={
							{
								"--source-color": color,
							} as CSSProperties
						}
					/>
				</Box>
				<Text css={styles.title}>{title}</Text>
			</HStack>

			<Text css={styles.metaText}>RA: {raText}</Text>
			<Text css={styles.metaText}>Dec: {decText}</Text>
			<Text css={styles.refText}>Ref: {refText}</Text>
		</Stack>
	);
}
