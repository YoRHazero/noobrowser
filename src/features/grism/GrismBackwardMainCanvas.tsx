import { Box, Text } from "@chakra-ui/react";
import  { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera, MapControls } from "@react-three/drei";
import type  { MapControls as MapControlsType } from "three-stdlib";
import { useShallow } from "zustand/react/shallow";

import { useGlobeStore } from "@/stores/footprints";
import { useGrismStore } from "@/stores/image";
import { useGrismData, useGrismOffsets } from "@/hook/connection-hook";
import { useCameraCenteringOnRoi } from "@/hook/hotkey-hook";
import { RoiIndicator } from "@/components/three/RoiComponent";
import GrismImageLayer from "@/components/three/GrismImageLayer";
import GrismBackwardCounterpartImageLayer from "@/features/grism/GrismBackwardCounterpartImageLayer";
import GrismBackwardToolbar from "@/features/grism/GrismBackwardToolbar";
import GrismBackwardFetchControl from "@/features/grism/GrismBackwardFetchControl";
import GrismBackwardTraceLayer from "@/features/grism/GrismBackwardTraceLayer";
//import GrismTraceSourceDrawer from "@/features/grism/GrismTraceSourceDrawer";
import GrismTraceSourceDrawerContainer from "@/features/grism/tracesource/GrismTraceSourceDrawer.container";
export default function GrismBackwardMainCanvas({ currentBasename }: { currentBasename: string | undefined }) {
    /* -------------------------------------------------------------------------- */
    /*                               Store Selectors                              */
    /* -------------------------------------------------------------------------- */
    const {
        roiState,
        backwardGlobalNorm,
    } = useGrismStore(
        useShallow((state) => ({
            roiState: state.roiState,
            backwardGlobalNorm: state.backwardGlobalNorm,
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
    /*                                 Render View                                */
    /* -------------------------------------------------------------------------- */
    const controlRef = useRef<MapControlsType>(null);
    return (
        <Box position="relative" w="100%" h="100%" overflow="hidden" bg="black">
            <Canvas>
                <OrthographicCamera 
                    makeDefault 
                    position={[0, 0, 100]} 
                    zoom={0.5} 
                    near={0.1} 
                    far={1000} 
                />
                <MapControls 
                    ref={controlRef}
                    enableRotate={false} 
                    screenSpacePanning 
                    minZoom={0.1} 
                    maxZoom={20} 
                />
                <CanvasController controlRef={controlRef} />
                <color attach="background" args={["#050505"]} />
                <GrismBackwardCounterpartImageLayer/>
                <GrismBackwardTraceLayer />

                {currentGrismData && currentGrismOffsets && (
                    <>
                        <GrismImageLayer
                            buffer={currentGrismData.buffer}
                            width={currentGrismData.width}
                            height={currentGrismData.height}
                            dx={currentGrismOffsets.dx }
                            dy={currentGrismOffsets.dy}
                            vmin={backwardGlobalNorm.vmin ?? -0.05}
                            vmax={backwardGlobalNorm.vmax ?? 0.05}
                            isVisible={true}
                        />
                        <RoiIndicator
                            x={roiState.x}
                            y={roiState.y}
                            width={roiState.width}
                            height={roiState.height}
                        />
                    </>
                )}
            </Canvas>
            <GrismBackwardToolbar />
            <InfoLegend currentBasename={currentBasename} />
            <GrismBackwardFetchControl />
            <GrismTraceSourceDrawerContainer />
        </Box>
    )
}

function CanvasController({ controlRef }: { controlRef: React.RefObject<MapControlsType | null> }) {
    useCameraCenteringOnRoi(controlRef);
    return null;
}

function InfoLegend({currentBasename}: {currentBasename: string | undefined}) {
    const { footprints, selectedFootprintId } = useGlobeStore(
        useShallow((state) => ({
            footprints: state.footprints,
            selectedFootprintId: state.selectedFootprintId,
        }))
    );
    const basenameList: string[] = useMemo(() => {
            if (!selectedFootprintId) return [];
            const selectedFootprint = footprints.find(fp => fp.id === selectedFootprintId);
            return selectedFootprint?.meta?.included_files ?? [];
        }, [footprints, selectedFootprintId]);
    const totalImages = basenameList.length;
    const currentIndex = currentBasename ?
        basenameList.findIndex(name => name === currentBasename) : -1;
    return (
        <Box 
            position="absolute" 
            bottom={4} 
            left={4} 
            bg="blackAlpha.700" 
            px={3} py={1} 
            borderRadius="full" 
            pointerEvents="none"
            border="1px solid"
            borderColor="whiteAlpha.200"
        >
            <Text fontSize="xs" fontFamily="mono" color="gray.300">
                {currentBasename ?? "No Image Loaded"}
                <Text as="span" color="gray.500" ml={2}>
                    ({totalImages > 0 ? currentIndex + 1 : 0}/{totalImages})
                </Text>
            </Text>            
        </Box>
    )
}