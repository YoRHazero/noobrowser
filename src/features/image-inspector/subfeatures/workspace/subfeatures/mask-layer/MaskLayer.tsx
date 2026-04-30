"use client";

import { Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { maskLayerRecipe } from "./MaskLayer.recipe";
import { useMaskLayer } from "./useMaskLayer";

export function MaskLayer() {
	const recipe = useSlotRecipe({ recipe: maskLayerRecipe });
	const styles = recipe();
	const maskLayer = useMaskLayer();

	return (
		<Stack css={styles.root}>
			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Mask Source</Text>
				<Box>
					<Text css={styles.label}>Mode</Text>
					<Text css={styles.value}>{maskLayer.modeLabel}</Text>
				</Box>
				<Box>
					<Text css={styles.label}>Threshold</Text>
					<Text css={styles.value}>{maskLayer.thresholdLabel}</Text>
				</Box>
			</Stack>

			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Mask Map</Text>
				<Box css={styles.mapList}>
					{maskLayer.mapEntries.map((entry) => (
						<Box key={entry.value} css={styles.mapRow}>
							<Box
								as="span"
								css={styles.swatch}
								style={{ "--mask-color": entry.color } as CSSProperties}
							/>
							<Text css={styles.value}>{entry.value}</Text>
							<Text css={styles.value}>{entry.label}</Text>
						</Box>
					))}
				</Box>
				<Text css={styles.note}>
					Mask data controls are placeholders until the feature owns its backend
					model.
				</Text>
			</Stack>
		</Stack>
	);
}
