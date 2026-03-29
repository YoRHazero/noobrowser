import { Box, Grid, GridItem } from "@chakra-ui/react";
import { useState } from "react";
import { OverviewCanvas } from "./canvas";
import { OverviewViewerHud } from "./controls/OverviewViewerHud";
import { OverviewSidebar } from "./sidebar/OverviewSidebar";

export default function OverviewFeature() {
	const [isViewerHudOpen, setIsViewerHudOpen] = useState(false);

	return (
		<Grid
			w="100%"
			h="100%"
			minH="0"
			templateColumns="minmax(0, 1fr) 400px"
			overflow="hidden"
		>
			<GridItem minW="0">
				<Box position="relative" w="100%" h="100%" minH="0">
					<OverviewCanvas />
					<OverviewViewerHud
						open={isViewerHudOpen}
						onOpenChange={setIsViewerHudOpen}
					/>
				</Box>
			</GridItem>
			<GridItem minW="400px" maxW="400px" h="100%" minH="0">
				<OverviewSidebar />
			</GridItem>
		</Grid>
	);
}
