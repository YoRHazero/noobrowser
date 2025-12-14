import { useState, useRef, useMemo, memo, } from "react";
import { useImmer } from "use-immer";
import {
    Box,
    Grid,
    GridItem,
    VStack,
    HStack,
    Text,
    Kbd,
    Slider,
    Spinner,
    Center
} from "@chakra-ui/react"
import {
    Canvas,
    useFrame,
    useThree,    
} from "@react-three/fiber";
import { MapControls, OrthographicCamera } from "@react-three/drei";
import {
    DataTexture,
    RedFormat,
    HalfFloatType,
    ClampToEdgeWrapping,
    NearestFilter,
    PlaneGeometry,
    LineSegments,
    EdgesGeometry,
    LineBasicMaterial,
    ShaderMaterial,
} from "three";
import { useHotkeys } from "react-hotkeys-hook";
import { Float16Array } from "@petamoriken/float16";
import { useShallow } from "zustand/react/shallow";

import { useGrismData, useGrismErr, useGrismOffsets } from "@/hook/connection-hook";
import { scaleLinear } from "@visx/scale";
import { useGlobeStore } from "@/stores/footprints";
import type { Spectrum1D } from "@/utils/util-types";
import GrismMaterial from "@/components/three/GrismMaterial";
import { Spectrum1DSliceChart } from "@/features/grism/Spectrum1DChart";


type GrismMaterialType = InstanceType<typeof GrismMaterial>;
const ROI_WIDTH = 256;
const ROI_HEIGHT = 128;
const HALF_ROI_COLLAPSE_SIZE = 5;

const GrismImageLayer = memo(function GrismImageLayer({
    buffer,
    width,
    height,
    dx,
    dy,
    vmin,
    vmax,
    isVisible,
}: {
    buffer: ArrayBuffer;
    width: number;
    height: number;
    dx: number;
    dy: number;
    vmin: number;
    vmax: number;
    isVisible: boolean;
}) {
    const materialRef = useRef<GrismMaterialType>(null);
    const texture = useMemo(() => {
        const dataView = new Uint16Array(buffer);
        const textureInThree = new DataTexture(
            dataView,
            width,
            height,
            RedFormat,
            HalfFloatType
        );
        textureInThree.minFilter = NearestFilter;
        textureInThree.magFilter = NearestFilter;
        textureInThree.wrapS = ClampToEdgeWrapping;
        textureInThree.wrapT = ClampToEdgeWrapping;
        textureInThree.flipY = true;
        textureInThree.needsUpdate = true;
        return textureInThree;
    }, [buffer, width, height]);

    useFrame(() => {
        if (materialRef.current) {
            // Update material properties or perform animations here
            materialRef.current.uniforms.uVmin.value = vmin;
            materialRef.current.uniforms.uVmax.value = vmax;
        }
    })
    if (!isVisible) {
        return null;
    }
    return (
        <mesh position={[dx, -dy, 0]}>
            <planeGeometry args={[width, height]} />
            <grismMaterial
                ref={materialRef}
                uTexture={texture}
            />
        </mesh>
    );
})

const RoiIndicator = memo(function RoiIndicator({
    x,
    y,
    width,
    height,
    imgWidth,
    imgHeight,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    imgWidth: number;
    imgHeight: number;
}) {

    const worldX = -imgWidth / 2 + x + width / 2;
    const worldY = imgHeight / 2 - y - height / 2;
    
    return (
        <mesh position={[worldX, worldY, 1]} >
            <lineSegments>
                <edgesGeometry args={[new PlaneGeometry(width, height)]} />
                <lineBasicMaterial color={0xff0000} linewidth={4}/>
            </lineSegments>
        </mesh>
    );
})

function RoiCameraRig({
    x,
    y,
    width,
    height,
    imgWidth,
    imgHeight,
}: {
    x: number;
    y: number;
    width: number;
    height: number;
    imgWidth: number;
    imgHeight: number;
}) {
    const { camera } = useThree();

    useFrame(() => {
        const worldX = -imgWidth / 2 + x + width / 2;
        const worldY = imgHeight / 2 - y - height / 2;
        camera.position.set(worldX, worldY, 10);
        camera.updateProjectionMatrix();
    });
    
    return null;
}

export default function GrismInspector() {
    const grismDataQuery = useGrismData({enabled: true});
    const grismErrQuery = useGrismErr({enabled: true});
    const grismOffsetsQuery = useGrismOffsets({enabled: true});    

    /* -------------------------------------------------------------------------- */
    /*            Get the list of basenames from the selected footprint           */
    /* -------------------------------------------------------------------------- */
    const { footprints, selectedFootprintId } = useGlobeStore(
        useShallow((state) => ({
            footprints: state.footprints,
            selectedFootprintId: state.selectedFootprintId,
        }))
    );
    const basenameList: string[] = useMemo(() => {
        if (!selectedFootprintId) return [];
        const selectedFootprint = footprints.find(fp => fp.id === selectedFootprintId);
        if (!selectedFootprint) return [];
        const targetBasenameList = selectedFootprint?.meta?.included_files ?? [];
        return targetBasenameList;
    }, [footprints, selectedFootprintId]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [vmin, setVmin] = useState(-0.05);
    const [vmax, setVmax] = useState(0.05);
    const [roi, setRoi] = useImmer({x:0, y:0, width: ROI_WIDTH, height:ROI_HEIGHT});
    
    /* -------------------------------------------------------------------------- */
    /*                             Keyboard Shortcuts                             */
    /* -------------------------------------------------------------------------- */
    const moveStep = 1;
    const jumpFactor = 0.5;
    /* ------------------------------ Single arrow ------------------------------ */
    useHotkeys("up", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.y = draft.y - moveStep });
    })
    useHotkeys("down", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.y = draft.y + moveStep });
    })
    useHotkeys("left", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.x = draft.x - moveStep });
    })
    useHotkeys("right", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.x = draft.x + moveStep });
    })
    /* ----------------------- cmd + arrow / ctrl + arrow ----------------------- */
    useHotkeys("mod+up", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.y = draft.y - jumpFactor * draft.height });
    })
    useHotkeys("mod+down", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.y = draft.y + jumpFactor * draft.height });
    })
    useHotkeys("mod+left", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.x = draft.x - jumpFactor * draft.width });
    })
    useHotkeys("mod+right", (e) => {
        e.preventDefault();
        setRoi(draft => { draft.x = draft.x + jumpFactor * draft.width });
    })
    /* -------------------------- Switch between frames ------------------------- */
    useHotkeys("shift+e", () => {
        setActiveIndex((prev) => (prev + 1) % basenameList.length);
    },
    {
        preventDefault: true,
    },
    [basenameList.length]);
    useHotkeys("shift+q", () => {
        setActiveIndex((prev) => (prev - 1 + basenameList.length) % basenameList.length);
    },
    {
        preventDefault: true,
    },
    [basenameList.length]);
    /* -------------------------------------------------------------------------- */
    /*                         Calculate 1D spectrum (CPU)                        */
    /* -------------------------------------------------------------------------- */
    const spectrum1D = useMemo<Spectrum1D[]>(() => {
        if (!basenameList.length) return [];
        const name = basenameList[activeIndex];
        const dataResult = grismDataQuery[name]?.data;
        const errResult = grismErrQuery[name]?.data;
        if (!dataResult || !errResult) return [];

        const dataF16 = new Float16Array(dataResult.buffer);
        const errF16 = new Float16Array(errResult.buffer);
        const width = dataResult.width;
        const height = dataResult.height;
        // Collapse along the vertical axis within the the (centerY - HALF_ROI_COLLAPSE_SIZE, centerY + HALF_ROI_COLLAPSE_SIZE) range of the ROI
        const startY = Math.max(0, roi.y + Math.floor(roi.height / 2) - HALF_ROI_COLLAPSE_SIZE);
        const endY = Math.min(height, roi.y + Math.ceil(roi.height / 2) + HALF_ROI_COLLAPSE_SIZE);

        const result: Spectrum1D[] = [];
        if (startY >= endY) return [];

        for (let col = 0; col < roi.width; col++) {
            let fluxSum = 0;
            let errSumSq = 0;
            let count = 0;
            
            const imageX = roi.x + col;
            if (imageX < 0 || imageX >= width) continue;

            for (let row = startY; row < endY; row++) {
                const imageY = row;
                const index = imageY * width + imageX;
                if (index < 0 || index >= dataF16.length) continue;

                const flux = dataF16[index];
                const err = errF16[index];
                if (isNaN(flux) || isNaN(err)) continue;

                fluxSum += flux;
                errSumSq += err * err;
                count++;
            }
            if (count === 0) continue;
            const flux = fluxSum;
            const err = Math.sqrt(errSumSq);
            result.push({ wavelength: col, flux, error: err, fluxMinusErr: flux - err, fluxPlusErr: flux + err });
        }
        return result;
    }, [basenameList, activeIndex, grismDataQuery, grismErrQuery, roi]);

    /* -------------------------------------------------------------------------- */
    /*                               Visx Chart Part                              */
    /* -------------------------------------------------------------------------- */
    const chartWidth = 400;
    const chartHeight = 200;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const xScale = useMemo(() => {
        return scaleLinear<number>({
            domain: [0, ROI_WIDTH],
            range: [margin.left, chartWidth - margin.right],
        });
    }, [margin.left, margin.right]);
    
    const yScale = useMemo(() => {
        const allFluxes = spectrum1D.flatMap(d => [d.fluxMinusErr, d.fluxPlusErr]);
        const minY = Math.min(...allFluxes);
        const maxY = Math.max(...allFluxes);
        const padding = (maxY - minY) * 0.1 || 0.1;
        return scaleLinear<number>({
            domain: [minY - padding, maxY + padding],
            range: [chartHeight - margin.bottom, margin.top],
        });
    }, [spectrum1D, margin.top, margin.bottom]);

    const currentBasename = basenameList[activeIndex];
    const currentOffsets = grismOffsetsQuery[currentBasename]?.data
    return (
        <Grid
            templateColumns="1fr 420px"
            h="100vh"
            bg="gray.900"
            color="white"
            gap={0}
        >
            {/* ---------------- Left: main image viewer ---------------- */}
            <GridItem position="relative" borderRight="1px solid #333">
                <Canvas>
                    {/* Use orthographic camera to simulate 2D view */}
                    <OrthographicCamera
                        makeDefault
                        position={[0, 0, 100]}
                        zoom={0.5}
                        near={0.1}
                        far={1000}
                    />

                    {/* MapControls: right-click to pan, mouse wheel to zoom */}
                    <MapControls
                        enableRotate={false}
                        screenSpacePanning
                        minZoom={0.1}
                        maxZoom={20}
                    />

                    <color attach="background" args={["#050505"]} />

                    {basenameList.map((name, idx) => {
                        const dataResult = grismDataQuery[name]?.data;
                        const offsetResult = grismOffsetsQuery[name]?.data;

                        if (!dataResult) return null;

                        return (
                            <GrismImageLayer
                                key={name}
                                buffer={dataResult.buffer}
                                width={dataResult.width}
                                height={dataResult.height}
                                dx={offsetResult?.dx ?? 0}
                                dy={offsetResult?.dy ?? 0}
                                vmin={vmin}
                                vmax={vmax}
                                isVisible={idx === activeIndex}
                            />
                        );
                    })}

                    {/* Render ROI indicator on top of the current image */}
                    {(() => {
                        if (!currentBasename) return null;
                        const dataResult =
                            grismDataQuery[currentBasename]?.data;
                        if (!dataResult) return null;

                        return (
                            <RoiIndicator
                                x={roi.x}
                                y={roi.y}
                                width={roi.width}
                                height={roi.height}
                                imgWidth={dataResult.width}
                                imgHeight={dataResult.height}
                            />
                        );
                    })()}
                </Canvas>

                {/* Top floating info panel */}
                <Box
                    position="absolute"
                    top={4}
                    left={4}
                    bg="blackAlpha.800"
                    p={3}
                    borderRadius="md"
                    pointerEvents="none"
                >
                    <Text fontSize="md" fontWeight="bold">
                        {currentBasename ?? "No image selected"}
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                        Offset: dx=
                        {currentOffsets?.dx ?? 0}, dy=
                        {currentOffsets?.dy ?? 0}
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                        Image{" "}
                        {basenameList.length
                            ? activeIndex + 1
                            : 0}{" "}
                        / {basenameList.length}
                    </Text>
                </Box>
            </GridItem>

            {/* ---------------- Right: control panel ---------------- */}
            <GridItem
                display="flex"
                flexDirection="column"
                bg="gray.800"
                borderLeft="1px solid #222"
                overflowY="auto"
            >
                {/* 1. ROI zoom view (mini map) */}
                <Box
                    h="256px"
                    w="100%"
                    position="relative"
                    bg="black"
                    borderBottom="1px solid #444"
                    flexShrink={0}
                >
                    <Text
                        position="absolute"
                        left={2}
                        top={1}
                        fontSize="xs"
                        bg="blackAlpha.600"
                        zIndex={10}
                    >
                        ROI Zoom
                    </Text>
                    <Canvas>
                        <OrthographicCamera 
                            makeDefault 
                            zoom={1}
                            position={[0, 0, 10]}
                            left={-roi.width / 2}
                            right={roi.width / 2}
                            top={roi.height / 2}
                            bottom={-roi.height / 2}
                            near={0.1}
                            far={1000}
                        />

                        {/* Reuse GrismImageLayer to render current image + camera rig */}
                        {(() => {
                            if (!currentBasename) return null;
                            const dataResult =
                                grismDataQuery[currentBasename]?.data;
                            const offsetResult =
                                grismOffsetsQuery[currentBasename]?.data;
                            if (!dataResult) return null;
                            return (
                                <>
                                    <GrismImageLayer
                                        buffer={dataResult.buffer}
                                        width={dataResult.width}
                                        height={dataResult.height}
                                        dx={offsetResult?.dx ?? 0}
                                        dy={offsetResult?.dy ?? 0}
                                        vmin={vmin}
                                        vmax={vmax}
                                        isVisible={true}
                                    />
                                    {/* Camera rig that automatically follows the ROI */}
                                    <RoiCameraRig
                                        x={roi.x}
                                        y={roi.y}
                                        width={roi.width}
                                        height={roi.height}
                                        imgWidth={dataResult.width}
                                        imgHeight={dataResult.height}
                                    />
                                </>
                            );
                        })()}
                    </Canvas>
                </Box>

                {/* 2. Slider controls (Slider.Root API) */}
                <VStack p={4} gap={5} align="stretch" flexShrink={0}>
                    {/* Vmin slider */}
                    <Box>
                        <HStack justify="space-between" mb={1}>
                            <Text fontSize="xs" color="gray.400">
                                Vmin
                            </Text>
                            <Text fontSize="xs" fontFamily="mono">
                                {vmin.toFixed(3)}
                            </Text>
                        </HStack>

                        <Slider.Root
                            aria-label={["vmin"]}
                            min={-1}
                            max={1}
                            step={0.001}
                            value={[vmin]}
                            onValueChange={(e) => {
                                const next = e.value[0];
                                if (typeof next === "number") {
                                    setVmin(next);
                                }
                            }}
                            size="sm"
                            colorPalette="teal"
                        >
                            <Slider.Control>
                                <Slider.Track bg="gray.600">
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Box>

                    {/* Vmax slider */}
                    <Box>
                        <HStack justify="space-between" mb={1}>
                            <Text fontSize="xs" color="gray.400">
                                Vmax
                            </Text>
                            <Text fontSize="xs" fontFamily="mono">
                                {vmax.toFixed(3)}
                            </Text>
                        </HStack>

                        <Slider.Root
                            aria-label={["vmax"]}
                            min={-1}
                            max={1}
                            step={0.001}
                            value={[vmax]}
                            onValueChange={(e) => {
                                const next = e.value[0];
                                if (typeof next === "number") {
                                    setVmax(next);
                                }
                            }}
                            size="sm"
                            colorPalette="teal"
                        >
                            <Slider.Control>
                                <Slider.Track bg="gray.600">
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                    </Box>
                </VStack>

                {/* 3. 1D spectrum chart */}
                <Box
                    flex="1"
                    p={2}
                    minH="250px"
                    display="flex"
                    flexDirection="column"
                >
                    <Text fontSize="sm" fontWeight="bold" mb={2} px={2}>
                        1D Spectrum (Sum over ROI)
                    </Text>
                    {spectrum1D.length > 0 ? (
                        <Box flex="1" w="100%">
                            <svg
                                width="100%"
                                height="100%"
                                viewBox={`0 0 ${chartWidth + 50} ${
                                    chartHeight + 30
                                }`}
                            >
                                <Spectrum1DSliceChart
                                    spectrum1D={spectrum1D}
                                    width={chartWidth}
                                    height={chartHeight}
                                    xScale={xScale}
                                    yScale={yScale}
                                    anchor={{ left: 40, top: 10 }}
                                />
                            </svg>
                        </Box>
                    ) : (
                        <Center h="100%">
                            <Spinner size="sm" mr={2} />
                            <Text fontSize="xs">
                                Loading data / No spectrum available
                            </Text>
                        </Center>
                    )}
                </Box>

                {/* 4. Keyboard shortcuts */}
                <Box
                    p={4}
                    borderTop="1px solid #333"
                    bg="gray.900"
                    flexShrink={0}
                >
                    <Text
                        fontSize="xs"
                        fontWeight="bold"
                        mb={2}
                        color="gray.500"
                    >
                        Shortcuts
                    </Text>
                    <Grid
                        templateColumns="auto 1fr"
                        gap={2}
                        fontSize="xs"
                        color="gray.400"
                    >
                        <GridItem>
                            <Kbd>Shift</Kbd> + <Kbd>q</Kbd> / <Kbd>e</Kbd>
                        </GridItem>
                        <GridItem>Switch to previous / next image</GridItem>

                        <GridItem>
                            <Kbd>↑</Kbd> / <Kbd>↓</Kbd> / <Kbd>←</Kbd> /{" "}
                            <Kbd>→</Kbd>
                        </GridItem>
                        <GridItem>Move ROI by 1 px</GridItem>

                        <GridItem>
                            <Kbd>⌘</Kbd> + <Kbd>Arrows</Kbd>
                        </GridItem>
                        <GridItem>Move ROI by half of ROI size</GridItem>
                    </Grid>
                </Box>
            </GridItem>
        </Grid>
    );
}