import { Box, Text, useSlotRecipe } from "@chakra-ui/react";
import type { FitSourceSummary } from "@/hooks/query/fit/schemas";
import { summaryPanelRecipe } from "../recipes/summary-panel.recipe";

export function SourceInfo({
	source,
}: {
	source: FitSourceSummary | null;
}) {
	const recipe = useSlotRecipe({ recipe: summaryPanelRecipe });
	const styles = recipe();

	if (!source) return null;

	// Reuse summary-panel styles for consistency, but as a standalone block
    // We override specific margins or borders if needed, but keeping it consistent is good.
    // The user wanted it independent, so it is visually it's own box.
	return (
		<Box css={styles.root}>
			<Text css={styles.sectionTitle} mb={4}>
				SOURCE INFO
			</Text>
			<Box css={styles.grid} style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
				<Box>
					<Text css={styles.gridLabel}>Source ID</Text>
					<Text css={styles.gridValue}>{source.source_id}</Text>
				</Box>
				<Box>
					<Text css={styles.gridLabel}>Group ID</Text>
					<Text css={styles.gridValue}>{source.group_id ?? "-"}</Text>
				</Box>
				<Box>
					<Text css={styles.gridLabel}>RA / Dec (deg)</Text>
					<Text css={styles.gridValue}>
						{source.ra?.toFixed(5) ?? "-"} / {source.dec?.toFixed(5) ?? "-"}
					</Text>
				</Box>
				<Box>
					<Text css={styles.gridLabel}>RA / Dec (HMS/DMS)</Text>
					<Text css={styles.gridValue}>
						{source.ra_hms ?? "-"} / {source.dec_dms ?? "-"}
					</Text>
				</Box>
				<Box>
					<Text css={styles.gridLabel}>X / Y (px)</Text>
					<Text css={styles.gridValue}>
						{source.x?.toFixed(1) ?? "-"} / {source.y?.toFixed(1) ?? "-"}
					</Text>
				</Box>
				<Box>
					<Text css={styles.gridLabel}>Redshift (z)</Text>
					<Text css={styles.gridValue}>{source.z?.toFixed(4) ?? "-"}</Text>
				</Box>
			</Box>
		</Box>
	);
}
