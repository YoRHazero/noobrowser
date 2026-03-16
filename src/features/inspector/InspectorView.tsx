import { Grid, GridItem } from "@chakra-ui/react";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import InspectorSidebar from "@/features/inspector/sidebar/InspectorSidebar";
import InspectorCanvas from "@/features/inspector/canvas/InspectorCanvas";
import { useGrismNavigation } from "@/features/inspector/components/hooks/useGrismNavigation";
import { useScrollFocus } from "@/hooks/ui/useScrollFocus";
import { useGlobeStore } from "@/stores/footprints";

export default function InspectorView() {
	const containerRef = useScrollFocus<HTMLDivElement>("shift+3", {
		offset: 0,
	});
	/* -------------------------------------------------------------------------- */
	/*                               Initialization                               */
	/* -------------------------------------------------------------------------- */
	const { footprints, selectedFootprintId } = useGlobeStore(
		useShallow((state) => ({
			footprints: state.footprints,
			selectedFootprintId: state.selectedFootprintId,
		})),
	);

	const basenameList = useMemo(() => {
		if (!selectedFootprintId) return [];
		const selectedFootprint = footprints.find(
			(fp) => fp.id === selectedFootprintId,
		);
		return selectedFootprint?.meta?.included_files ?? [];
	}, [footprints, selectedFootprintId]);

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
