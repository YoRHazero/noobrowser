"use client";

import { Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { SourceCard } from "./parts/SourceCard";
import { sourcesRecipe } from "./Sources.recipe";
import { useSources } from "./useSources";

export default function Sources() {
	const { sources, activeSourceId, onSelect, onToggleVisibility, onDelete } =
		useSources();
	const recipe = useSlotRecipe({ recipe: sourcesRecipe });
	const styles = recipe();

	return (
		<Box css={styles.panelBody}>
			<Stack css={styles.panelContent}>
				<Text css={styles.title}>Sources</Text>

				{sources.length === 0 ? (
					<Box css={styles.emptyState}>
						<Text css={styles.emptyTitle}>No sources yet</Text>
						<Text css={styles.emptyDescription}>
							Use the source editor above to create the first local source.
						</Text>
					</Box>
				) : (
					sources.map((source) => (
						<SourceCard
							key={source.id}
							source={source}
							isActive={activeSourceId === source.id}
							onSelect={() => onSelect(source.id)}
							onToggleOverview={() => onToggleVisibility(source.id, "overview")}
							onToggleInspector={() =>
								onToggleVisibility(source.id, "inspector")
							}
							onDelete={() => onDelete(source.id)}
						/>
					))
				)}
			</Stack>
		</Box>
	);
}
