"use client";

import { Box, HStack, SimpleGrid, Text, useSlotRecipe } from "@chakra-ui/react";
import type { FitJobComponentSummary } from "../../shared/types";
import StatBadge from "../StatBadge";
import { componentSummaryItemRecipe } from "./ComponentSummaryItem.recipe";

type ComponentSummaryItemProps = {
	component: FitJobComponentSummary;
};

function formatValue(value: number | null, digits = 2) {
	return value === null ? "-" : value.toFixed(digits);
}

export default function ComponentSummaryItem({
	component,
}: ComponentSummaryItemProps) {
	const recipe = useSlotRecipe({ recipe: componentSummaryItemRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<HStack css={styles.header}>
				<Text css={styles.name}>{component.name}</Text>
				<Text css={styles.type}>{component.component_type}</Text>
			</HStack>
			<SimpleGrid css={styles.grid} columns={3}>
				<Box css={styles.metric}>
					<Text css={styles.metricLabel}>Center</Text>
					<Text css={styles.metricValue}>
						{formatValue(component.center, 4)}
						{component.center_error !== null
							? ` ± ${formatValue(component.center_error, 4)}`
							: ""}
					</Text>
				</Box>
				<Box css={styles.metric}>
					<Text css={styles.metricLabel}>Amplitude</Text>
					<Text css={styles.metricValue}>
						{formatValue(component.amplitude, 3)}
						{component.amplitude_error !== null
							? ` ± ${formatValue(component.amplitude_error, 3)}`
							: ""}
					</Text>
				</Box>
				<Box css={styles.metric}>
					<Text css={styles.metricLabel}>FWHM</Text>
					<Text css={styles.metricValue}>
						{formatValue(component.fwhm_kms, 1)}
						{component.fwhm_kms_error !== null
							? ` ± ${formatValue(component.fwhm_kms_error, 1)}`
							: ""}
					</Text>
				</Box>
			</SimpleGrid>
			<HStack css={styles.badgeRow}>
				<StatBadge
					label="Physical"
					value={component.physical_name ?? "-"}
					tone="default"
				/>
			</HStack>
		</Box>
	);
}
