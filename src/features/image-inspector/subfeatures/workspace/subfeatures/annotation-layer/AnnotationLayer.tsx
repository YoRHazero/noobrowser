"use client";

import { Box, Stack, Switch, Text, useSlotRecipe } from "@chakra-ui/react";
import { annotationLayerRecipe } from "./AnnotationLayer.recipe";
import { useAnnotationLayer } from "./useAnnotationLayer";

export function AnnotationLayer() {
	const recipe = useSlotRecipe({ recipe: annotationLayerRecipe });
	const styles = recipe();
	const annotationLayer = useAnnotationLayer();

	return (
		<Stack css={styles.root}>
			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Source Annotations</Text>
				<Box css={styles.metricGrid}>
					<Box css={styles.metric}>
						<Text css={styles.label}>Visible Sources</Text>
						<Text css={styles.value}>{annotationLayer.sourceCount}</Text>
					</Box>
					<Box css={styles.metric}>
						<Text css={styles.label}>Active Source</Text>
						<Text css={styles.value}>{annotationLayer.activeSourceLabel}</Text>
					</Box>
				</Box>
			</Stack>

			<Stack css={styles.section}>
				<Box css={styles.sectionHeader}>
					<Text css={styles.sectionTitle}>ROI</Text>
					<Switch.Root
						size="sm"
						checked={annotationLayer.lockROI}
						aria-label="Lock ROI camera"
						onCheckedChange={({ checked }) =>
							annotationLayer.onLockROIChange(checked)
						}
					>
						<Switch.HiddenInput />
						<Switch.Control css={styles.switchControl}>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</Box>
				<Box css={styles.metric}>
					<Text css={styles.label}>Preview ROI</Text>
					<Text css={styles.value}>{annotationLayer.roiLabel}</Text>
				</Box>
				<Box css={styles.metric}>
					<Text css={styles.label}>Collapse Window</Text>
					<Text css={styles.value}>{annotationLayer.collapseWindowLabel}</Text>
				</Box>
				<Text css={styles.note}>
					Source markers are assembled from the public source store. ROI editing
					is a placeholder in this framework pass.
				</Text>
			</Stack>
		</Stack>
	);
}
