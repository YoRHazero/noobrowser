import { Box, ScrollArea, Text, useSlotRecipe } from "@chakra-ui/react";
import { overviewSidebarSectionRecipe } from "./recipes/overview-sidebar-section.recipe";

export function TargetsSection() {
	const recipe = useSlotRecipe({ recipe: overviewSidebarSectionRecipe });
	const styles = recipe();

	return (
		<Box css={styles.root}>
			<ScrollArea.Root css={styles.scrollRoot}>
				<ScrollArea.Viewport>
					<ScrollArea.Content css={styles.scrollArea}>
						<Box css={styles.panel}>
							<Text css={styles.panelTitle}>
								Target list is not implemented in this phase.
							</Text>
							<Text css={styles.panelDescription}>
								This section is reserved for the future target workflow and list UI.
							</Text>
						</Box>
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
