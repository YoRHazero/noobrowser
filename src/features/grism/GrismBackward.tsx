import { Grid, GridItem } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

import { useGlobeStore } from "@/stores/footprints";
import { useGrismNavigation } from "@/hook/hotkey-hook";
import GrismBackwardMainCanvas from "@/features/grism/GrismBackwardMainCanvas";
import GrismBackwardAnalysisPanel from "@/features/grism/GrismBackwardAnalysisPanel";

export default function GrismBackward() {
    /* -------------------------------------------------------------------------- */
    /*                               Initialization                               */
    /* -------------------------------------------------------------------------- */
    const { footprints, selectedFootprintId } = useGlobeStore(
        useShallow((state) => ({
            footprints: state.footprints,
            selectedFootprintId: state.selectedFootprintId,
        }))
    );

    const basenameList = useMemo(() => {
        if (!selectedFootprintId) return [];
        const selectedFootprint = footprints.find(fp => fp.id === selectedFootprintId);
        return selectedFootprint?.meta?.included_files ?? [];
    }, [footprints, selectedFootprintId]);

    const { currentImageIndex } = useGrismNavigation(basenameList.length);
    const currentBasename = basenameList[currentImageIndex];
    /* -------------------------------------------------------------------------- */
    /*                                 Render View                                */
    /* -------------------------------------------------------------------------- */
    return (
        <Grid 
            templateColumns="1fr 600px" 
            h="100vh" 
            bg="gray.900" 
            color="white" 
            overflow={"auto"}
            gap={0}
        >
            <GridItem minW={"700px"}>
                <GrismBackwardMainCanvas currentBasename={currentBasename} />
            </GridItem>
            <GridItem>
                <GrismBackwardAnalysisPanel currentBasename={currentBasename} />
            </GridItem>
        </Grid>
    );
}
