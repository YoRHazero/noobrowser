import { 
    Box,
    Text,
    VStack,
    Grid,
    GridItem,
    Kbd,
} from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useGrismStore } from "@/stores/image";
import { useShallow } from "zustand/react/shallow";
import { useGrismData, useGrismOffsets } from "@/hook/connection-hook";
import { RoiCameraRig, CollapseRegionIndicator } from "@/components/three/RoiComponent"
import GrismImageLayer from "@/components/three/GrismImageLayer";
import GrismBackward1DChart from "@/features/grism/GrismBackward1DChart";
import { TraceLinesLayer } from "@/features/grism/GrismBackwardTraceLayer";
export default function GrismBackwardAnalysisPanel({currentBasename}: {currentBasename: string | undefined}) {
    return (
        <VStack h="100%" align="stretch" gap={0} bg="gray.800" borderLeft="1px solid #222">
            <RoiZoomView currentBasename={currentBasename} />
            <Box flex={1} minH="200px">
                <GrismBackward1DChart currentBasename={currentBasename} />
            </Box>
            <ShortcutLegend />
        </VStack>
    )
}


/* -------------------------------------------------------------------------- */
/*                                 ROI Region                                 */
/* -------------------------------------------------------------------------- */
function RoiZoomView({currentBasename}: {currentBasename: string | undefined}) {
    /* -------------------------------------------------------------------------- */
    /*                               Store Selectors                              */
    /* -------------------------------------------------------------------------- */
    const {
        roiState,
        backwardGlobalNorm,
        backwardRoiNorm,
        backwardNormIndependent
    } = useGrismStore(
        useShallow((state) => ({
            roiState: state.roiState,
            backwardGlobalNorm: state.backwardGlobalNorm,
            backwardRoiNorm: state.backwardRoiNorm,
            backwardNormIndependent: state.backwardNormIndependent,
        }))
    );
    /* -------------------------------------------------------------------------- */
    /*                                 Data Access                                */
    /* -------------------------------------------------------------------------- */
    const grismDataResults = useGrismData({}); // refetch will be triggered by other components, here just read from cache
    const grismOffsetsResults = useGrismOffsets({});

    const currentGrismData = currentBasename ?
        grismDataResults?.[currentBasename]?.data : undefined;
    const currentGrismOffsets = currentBasename ?
        grismOffsetsResults?.[currentBasename]?.data : undefined;

    /* -------------------------------------------------------------------------- */
    /*                             Norm to be applied                             */
    /* -------------------------------------------------------------------------- */
    const zoomVmin = backwardNormIndependent ? backwardRoiNorm.vmin : backwardGlobalNorm.vmin;
    const zoomVmax = backwardNormIndependent ? backwardRoiNorm.vmax : backwardGlobalNorm.vmax;

    /* -------------------------------------------------------------------------- */
    /*                                   Render                                   */
    /* -------------------------------------------------------------------------- */
    const ratio = roiState.width / roiState.height;
    return (
        <Box w="100%" h="auto" aspectRatio={ratio} bg="black" borderBottom="1px solid #444" position="relative" flexShrink={0}>
            <Text 
                position="absolute" 
                left={2} top={1} 
                fontSize="xs" 
                bg="blackAlpha.600" 
                zIndex={10} 
                color="whiteAlpha.800" 
                px={1}
                pointerEvents="none"
            >
                ROI ZOOM {backwardNormIndependent && "(Local Norm)"}
            </Text>
            <Canvas>
                <OrthographicCamera 
                    makeDefault
                    position={[0, 0, 100]}
                    left={-roiState.width / 2}
                    right={roiState.width / 2}
                    top={roiState.height / 2}
                    bottom={-roiState.height / 2}
                    near={0.1}
                    far={1000}
                />
                {currentGrismData && (
                    <>
                        <GrismImageLayer 
                            buffer={currentGrismData.buffer}
                            width={currentGrismData.width}
                            height={currentGrismData.height}
                            dx={currentGrismOffsets?.dx ?? 0}
                            dy={currentGrismOffsets?.dy ?? 0}
                            vmin={zoomVmin ?? -0.05}
                            vmax={zoomVmax ?? 0.05}
                            isVisible={true}
                        />

                        <RoiCameraRig 
                            x={roiState.x}
                            y={roiState.y}
                            width={roiState.width}
                            height={roiState.height}
                        />

                        <CollapseRegionIndicator />
                        <TraceLinesLayer />
                    </>
                )}
            </Canvas>

        </Box>
    )

}


/* -------------------------------------------------------------------------- */
/*                               Shortcut Region                              */
/* -------------------------------------------------------------------------- */
function ShortcutLegend() {
    return (
        <Box p={4} borderTop="1px solid #333" bg="gray.900">
            <Text fontSize="xs" fontWeight="bold" mb={3} color="gray.500" letterSpacing="wider">
                SHORTCUTS
            </Text>
            <Grid templateColumns="auto 1fr" gap={2} fontSize="xs" color="gray.400">
                <GridItem><Kbd>Shift</Kbd> + <Kbd>q</Kbd> / <Kbd>Shift</Kbd> + <Kbd>e</Kbd></GridItem>
                <GridItem>Previous Image / Next Image</GridItem>
                
                <GridItem><Kbd>Shift</Kbd> + <Kbd>c</Kbd></GridItem>
                <GridItem>Center Camera on ROI</GridItem>

                <GridItem><Kbd>↑</Kbd> / <Kbd>↓</Kbd> / <Kbd>←</Kbd> / <Kbd>→</Kbd></GridItem>
                <GridItem>Move ROI (1px)</GridItem>

                <GridItem><Kbd>Shift</Kbd> + <Kbd>↑</Kbd> / <Kbd>Shift</Kbd> + <Kbd>↓</Kbd> / <Kbd>Shift</Kbd> + <Kbd>←</Kbd> / <Kbd>Shift</Kbd> + <Kbd>→</Kbd></GridItem>
                <GridItem>Move ROI (10px)</GridItem>
                
                <GridItem><Kbd>⌘</Kbd> + <Kbd>↑</Kbd> / <Kbd>⌘</Kbd> + <Kbd>↓</Kbd> / <Kbd>⌘</Kbd> + <Kbd>←</Kbd> / <Kbd>⌘</Kbd> + <Kbd>→</Kbd></GridItem>
                <GridItem>Move ROI By Half Size</GridItem>
            </Grid>
        </Box>
)}