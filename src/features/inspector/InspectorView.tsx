import { Grid, GridItem } from "@chakra-ui/react";
import InspectorSidebar from "@/features/inspector/sidebar/InspectorSidebar";
import InspectorCanvas from "@/features/inspector/canvas/InspectorCanvas";
import { useGrismNavigation } from "@/features/inspector/components/hooks/useGrismNavigation";
import { useSelectedOverviewFootprint } from "@/features/inspector/hooks/useSelectedOverviewFootprint";
import { useScrollFocus } from "@/hooks/ui/useScrollFocus";

export default function InspectorView() {
	const containerRef = useScrollFocus<HTMLDivElement>("shift+3", {
		offset: 0,
	});
	const { basenameList } = useSelectedOverviewFootprint();

	const { currentImageIndex } = useGrismNavigation(basenameList.length);
	const currentBasename = basenameList[currentImageIndex];
	/* -------------------------------------------------------------------------- */
	/*                                 Render View                                */
	/* -------------------------------------------------------------------------- */
	return (
		<Grid
			w="full"
			templateColumns="1fr 600px"
			h="100vh"
			bg="gray.900"
			color="white"
			overflow="hidden"
			gap={0}
			ref={containerRef}
		>
			<GridItem minW={"700px"}>
				<InspectorCanvas currentBasename={currentBasename} />
			</GridItem>
			<GridItem>
				<InspectorSidebar currentBasename={currentBasename} />
			</GridItem>
		</Grid>
	);
}
