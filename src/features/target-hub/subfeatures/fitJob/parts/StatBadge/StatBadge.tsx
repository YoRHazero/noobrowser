"use client";

import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import { statBadgeRecipe } from "./StatBadge.recipe";

type StatBadgeProps = {
	label: string;
	value: string | number;
	tone?: "default" | "success" | "warning" | "accent";
};

export default function StatBadge({
	label,
	value,
	tone = "default",
}: StatBadgeProps) {
	const recipe = useSlotRecipe({ recipe: statBadgeRecipe });
	const styles = recipe({ tone });

	return (
		<Box css={styles.root}>
			<Text css={styles.label}>{label}</Text>
			<Text css={styles.value}>{value}</Text>
		</Box>
	);
}
