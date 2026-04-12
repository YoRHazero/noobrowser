import { Box, Grid, GridItem, useSlotRecipe } from "@chakra-ui/react";
import MapCanvas from "@/canvas/mapCanvas";
import { overviewRecipe } from "./Overview.recipe";
import Footprints from "./subfeatures/footprints";
import Hud from "./subfeatures/hud";
import { useOverview } from "./useOverview";

export default function Overview() {
	const { mapCanvasActions, mapCanvasModel } = useOverview();
	const recipe = useSlotRecipe({ recipe: overviewRecipe });
	const styles = recipe();

	return (
		<Grid css={styles.root}>
			<GridItem css={styles.canvasPane}>
				<Box css={styles.canvasSurface}>
					<MapCanvas model={mapCanvasModel} actions={mapCanvasActions} />
					<Hud />
				</Box>
			</GridItem>
			<GridItem css={styles.sidebarPane}>
				<Footprints />
			</GridItem>
		</Grid>
	);
}
