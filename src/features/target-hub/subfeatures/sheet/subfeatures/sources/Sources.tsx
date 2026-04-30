"use client";

import { Box, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { SourceCard } from "./parts/SourceCard";
import { sourcesRecipe } from "./Sources.recipe";
import { useSources } from "./useSources";

export default function Sources() {
	const {
		sources,
		selectedGroup,
		groupedSources,
		activeSourceId,
		onSelect,
		onToggleVisibility,
		onDelete,
		onAddToSelectedGroup,
		onRemoveFromSelectedGroup,
	} = useSources();
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
				) : selectedGroup === null ? (
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
				) : (
					<>
						<Box css={styles.section}>
							<Box css={styles.sectionHeader}>
								<Text css={styles.sectionTitle}>In {selectedGroup}</Text>
								<Text css={styles.sectionCount}>
									{groupedSources.inGroup.length}
								</Text>
							</Box>
							<Box css={styles.sectionList}>
								{groupedSources.inGroup.length === 0 ? (
									<Text css={styles.sectionEmpty}>
										No sources in this group
									</Text>
								) : (
									groupedSources.inGroup.map((source) => (
										<SourceCard
											key={source.id}
											source={source}
											isActive={activeSourceId === source.id}
											onSelect={() => onSelect(source.id)}
											onToggleOverview={() =>
												onToggleVisibility(source.id, "overview")
											}
											onToggleInspector={() =>
												onToggleVisibility(source.id, "inspector")
											}
											onDelete={() => onDelete(source.id)}
											groupMembershipAction={{
												direction: "down",
												label: `Remove ${source.id} from ${selectedGroup}`,
												onClick: () => onRemoveFromSelectedGroup(source.id),
											}}
										/>
									))
								)}
							</Box>
						</Box>

						<Box css={styles.section}>
							<Box css={styles.sectionHeader}>
								<Text css={styles.sectionTitle}>Outside {selectedGroup}</Text>
								<Text css={styles.sectionCount}>
									{groupedSources.outsideGroup.length}
								</Text>
							</Box>
							<Box css={styles.sectionList}>
								{groupedSources.outsideGroup.length === 0 ? (
									<Text css={styles.sectionEmpty}>
										All sources are in this group
									</Text>
								) : (
									groupedSources.outsideGroup.map((source) => (
										<SourceCard
											key={source.id}
											source={source}
											isActive={activeSourceId === source.id}
											onSelect={() => onSelect(source.id)}
											onToggleOverview={() =>
												onToggleVisibility(source.id, "overview")
											}
											onToggleInspector={() =>
												onToggleVisibility(source.id, "inspector")
											}
											onDelete={() => onDelete(source.id)}
											groupMembershipAction={{
												direction: "up",
												label: `Add ${source.id} to ${selectedGroup}`,
												onClick: () => onAddToSelectedGroup(source.id),
											}}
										/>
									))
								)}
							</Box>
						</Box>
					</>
				)}
			</Stack>
		</Box>
	);
}
