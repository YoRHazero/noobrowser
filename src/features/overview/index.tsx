import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { OverviewCanvas } from "./canvas";
import { OverviewViewerHud } from "./controls/OverviewViewerHud";

export default function OverviewFeature() {
	const [isViewerHudOpen, setIsViewerHudOpen] = useState(false);

	return (
		<Box position="relative" w="100%" h="100%" minH="0">
			<OverviewCanvas />
			<OverviewViewerHud
				open={isViewerHudOpen}
				onOpenChange={setIsViewerHudOpen}
			/>
		</Box>
	);
}
