"use client";

import { Box, SimpleGrid, Text, useSlotRecipe } from "@chakra-ui/react";
import type { FitJobSummary } from "../../shared/types";
import { sourceInfoRecipe } from "./SourceInfo.recipe";

type SourceInfoProps = {
	summary: FitJobSummary;
};

function formatNumber(value: number | null, digits: number) {
	return value === null ? "-" : value.toFixed(digits);
}

export default function SourceInfo({ summary }: SourceInfoProps) {
	const recipe = useSlotRecipe({ recipe: sourceInfoRecipe });
	const styles = recipe();

	if (!summary.source) {
		return null;
	}

	const source = summary.source;

	return (
		<Box css={styles.root}>
			<Text css={styles.title}>Source</Text>
			<SimpleGrid css={styles.grid} columns={2}>
				<Box css={styles.field}>
					<Text css={styles.label}>Source ID</Text>
					<Text css={styles.value}>{source.source_id}</Text>
				</Box>
				<Box css={styles.field}>
					<Text css={styles.label}>Group ID</Text>
					<Text css={styles.value}>{source.group_id ?? "-"}</Text>
				</Box>
				<Box css={styles.field}>
					<Text css={styles.label}>RA / Dec</Text>
					<Text css={styles.value}>
						{formatNumber(source.ra, 5)} / {formatNumber(source.dec, 5)}
					</Text>
				</Box>
				<Box css={styles.field}>
					<Text css={styles.label}>RA / Dec HMS</Text>
					<Text css={styles.value}>
						{source.ra_hms ?? "-"} / {source.dec_dms ?? "-"}
					</Text>
				</Box>
				<Box css={styles.field}>
					<Text css={styles.label}>X / Y</Text>
					<Text css={styles.value}>
						{formatNumber(source.x, 1)} / {formatNumber(source.y, 1)}
					</Text>
				</Box>
				<Box css={styles.field}>
					<Text css={styles.label}>Redshift</Text>
					<Text css={styles.value}>{formatNumber(source.z, 4)}</Text>
				</Box>
			</SimpleGrid>
		</Box>
	);
}
