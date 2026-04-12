import { Box, Grid, GridItem, useSlotRecipe } from "@chakra-ui/react";
import { OverviewCanvas } from "./canvas";
import { OverviewViewerHud } from "./controls/OverviewViewerHud";
import { overviewRecipe } from "./Overview.recipe";
import { OverviewSidebar } from "./sidebar/OverviewSidebar";
import { useOverview } from "./useOverview";

export default function Overview() {
	const { isViewerHudOpen, setIsViewerHudOpen } = useOverview();
	const recipe = useSlotRecipe({ recipe: overviewRecipe });
	const styles = recipe();

	return (
		<Grid css={styles.root}>
			<GridItem css={styles.canvasPane}>
				<Box css={styles.canvasSurface}>
					<OverviewCanvas />
					<OverviewViewerHud
						open={isViewerHudOpen}
						onOpenChange={setIsViewerHudOpen}
					/>
				</Box>
			</GridItem>
			<GridItem css={styles.sidebarPane}>
				<OverviewSidebar />
			</GridItem>
		</Grid>
	);
}
