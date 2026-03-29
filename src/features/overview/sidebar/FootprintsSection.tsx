import { Box, ScrollArea, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useOverviewFootprints } from "../hooks/useOverviewFootprints";
import { useOverviewStore } from "@/stores/overview";
import { OverviewFootprintCard } from "./OverviewFootprintCard";
import { overviewSidebarSectionRecipe } from "./recipes/overview-sidebar-section.recipe";

export function FootprintsSection() {
	const recipe = useSlotRecipe({ recipe: overviewSidebarSectionRecipe });
	const styles = recipe();
	const { footprints, isLoading, isError, error } = useOverviewFootprints();
	const { selectedFootprintId, targetCoordinatePrecision, setSelectedFootprintId } =
		useOverviewStore(
			useShallow((state) => ({
				selectedFootprintId: state.selectedFootprintId,
				targetCoordinatePrecision: state.targetCoordinatePrecision,
				setSelectedFootprintId: state.setSelectedFootprintId,
			})),
		);

	const renderContent = () => {
		if (isLoading && footprints.length === 0) {
			return (
				<StatePanel
					styles={styles}
					title="Loading footprints"
					description="Overview footprint cards will appear here once the query finishes."
				/>
			);
		}

		if (isError && footprints.length === 0) {
			return (
				<StatePanel
					styles={styles}
					title="Failed to load footprints"
					description={error?.message ?? "The overview footprint query returned an error."}
				/>
			);
		}

		if (footprints.length === 0) {
			return (
				<StatePanel
					styles={styles}
					title="No footprints available"
					description="The overview query returned no footprint records for this view."
				/>
			);
		}

		return (
			<Stack gap={3}>
				{footprints.map((footprint) => (
					<OverviewFootprintCard
						key={footprint.id}
						footprint={footprint}
						precision={targetCoordinatePrecision}
						isSelected={footprint.id === selectedFootprintId}
						onClick={() =>
							setSelectedFootprintId(
								footprint.id === selectedFootprintId ? null : footprint.id,
							)
						}
					/>
				))}
			</Stack>
		);
	};

	return (
		<Box css={styles.root}>
			<Box css={styles.header}>
				<Text css={styles.description}>
					Select a footprint card to synchronize sidebar and canvas selection.
				</Text>
			</Box>
			<ScrollArea.Root css={styles.scrollRoot}>
				<ScrollArea.Viewport>
					<ScrollArea.Content css={styles.scrollArea}>
						{renderContent()}
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar>
					<ScrollArea.Thumb />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>
		</Box>
	);
}

interface StatePanelProps {
	styles: Record<string, any>;
	title: string;
	description: string;
}

function StatePanel({ styles, title, description }: StatePanelProps) {
	return (
		<Box css={styles.panel}>
			<Text css={styles.panelTitle}>
				{title}
			</Text>
			<Text css={styles.panelDescription}>
				{description}
			</Text>
		</Box>
	);
}
