import { Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import type { Source, SourceVisibilityKey } from "@/stores/source";
import { TargetHubSourceCard } from "../components/TargetHubSourceCard";
import { sheetRecipe } from "../recipes/sheet.recipe";

interface SourcesPanelViewProps {
	sources: Source[];
	activeSourceId: string | null;
	onSelect: (sourceId: string) => void;
	onToggleVisibility: (sourceId: string, key: SourceVisibilityKey) => void;
	onDelete: (sourceId: string) => void;
}

export function SourcesPanelView({
	sources,
	activeSourceId,
	onSelect,
	onToggleVisibility,
	onDelete,
}: SourcesPanelViewProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Box css={styles.panelBody}>
			<Stack css={styles.panelContent}>
				<Text fontSize="sm" fontWeight="semibold" color="white">
					Sources
				</Text>

				{sources.length === 0 ? (
					<Box css={styles.emptyState}>
						<Text fontSize="sm" fontWeight="semibold" color="white">
							No sources yet
						</Text>
						<Text fontSize="xs" color="whiteAlpha.720" mt={1}>
							Use the source editor above to create the first local source.
						</Text>
					</Box>
				) : (
					sources.map((source) => (
						<TargetHubSourceCard
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
