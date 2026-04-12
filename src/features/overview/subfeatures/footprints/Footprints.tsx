import { Box, ScrollArea, Stack, Text, useSlotRecipe } from "@chakra-ui/react";
import { footprintsRecipe } from "./Footprints.recipe";
import { FootprintCard } from "./parts/FootprintCard";
import { useFootprints } from "./useFootprints";

function StatePanel({
	description,
	title,
}: {
	title: string;
	description: string;
}) {
	const recipe = useSlotRecipe({ recipe: footprintsRecipe });
	const styles = recipe();

	return (
		<Box css={styles.statePanel}>
			<Text css={styles.stateTitle}>{title}</Text>
			<Text css={styles.stateDescription}>{description}</Text>
		</Box>
	);
}

export default function Footprints() {
	const recipe = useSlotRecipe({ recipe: footprintsRecipe });
	const styles = recipe();
	const { state, footprints, precision, selectedFootprintId, toggleFootprint } =
		useFootprints();

	return (
		<Box css={styles.root}>
			<Box css={styles.header}>
				<Text css={styles.description}>
					Select a footprint card to synchronize the panel and canvas selection.
				</Text>
			</Box>
			<ScrollArea.Root css={styles.scrollRoot}>
				<ScrollArea.Viewport>
					<ScrollArea.Content css={styles.scrollArea}>
						{state.kind === "list" ? (
							<Stack gap={3}>
								{footprints.map((footprint) => (
									<FootprintCard
										key={footprint.id}
										footprint={footprint}
										precision={precision}
										isSelected={footprint.id === selectedFootprintId}
										onSelect={() => toggleFootprint(footprint.id)}
									/>
								))}
							</Stack>
						) : (
							<StatePanel title={state.title} description={state.description} />
						)}
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
