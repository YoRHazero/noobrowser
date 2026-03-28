import { Box, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useOverviewStore } from "@/stores/overview";
import { useOverviewFootprints } from "../hooks/useOverviewFootprints";
import { CameraRig } from "./core/CameraRig";
import { OVERVIEW_CANVAS_CONSTANTS } from "./core/constants";
import { SceneEnvironment } from "./core/SceneEnvironment";
import { FootprintsLayer } from "./layers/FootprintsLayer";
import { GlobeLayer } from "./layers/GlobeLayer";
import { GraticuleLayer } from "./layers/GraticuleLayer";
import { ManualTargetsLayer } from "./layers/ManualTargetsLayer";
import { useFootprintEvents } from "./hooks/useFootprintEvents";
import { useFootprintInteractionResolver } from "./hooks/useFootprintInteractionResolver";

interface FootprintInteractionBridgeProps {
	footprints: ReturnType<typeof useOverviewFootprints>["footprints"];
	radius: number;
	hoveredFootprintId: string | null;
	events: ReturnType<typeof useFootprintEvents>;
}

function FootprintInteractionBridge({
	footprints,
	radius,
	hoveredFootprintId,
	events,
}: FootprintInteractionBridgeProps) {
	useFootprintInteractionResolver({
		footprints,
		radius,
		hoveredFootprintId,
		events,
	});

	return null;
}

export function OverviewCanvas() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const { footprints } = useOverviewFootprints();
	const {
		manualTargets,
		showGrid,
		showAtmosphere,
		pendingFlyToTargetId,
		selectedFootprintId,
		hoveredFootprintId,
		hoveredFootprintAnchor,
		setSelectedFootprintId,
		setHoveredFootprint,
		clearHoveredFootprint,
	} = useOverviewStore(
		useShallow((state) => ({
			manualTargets: state.manualTargets,
			showGrid: state.showGrid,
			showAtmosphere: state.showAtmosphere,
			pendingFlyToTargetId: state.pendingFlyToTargetId,
			selectedFootprintId: state.selectedFootprintId,
			hoveredFootprintId: state.hoveredFootprintId,
			hoveredFootprintAnchor: state.hoveredFootprintAnchor,
			setSelectedFootprintId: state.setSelectedFootprintId,
			setHoveredFootprint: state.setHoveredFootprint,
			clearHoveredFootprint: state.clearHoveredFootprint,
		})),
	);

	const footprintEvents = useFootprintEvents({
		selectedFootprintId,
		hoveredFootprintId,
		setSelectedFootprintId,
		setHoveredFootprint,
		clearHoveredFootprint,
	});

	const hoveredFootprint =
		footprints.find((footprint) => footprint.id === hoveredFootprintId) ?? null;
	const containerRect = containerRef.current?.getBoundingClientRect();
	const tooltipPosition =
		hoveredFootprintAnchor && containerRect
			? {
					left: hoveredFootprintAnchor.x - containerRect.left + 12,
					top: hoveredFootprintAnchor.y - containerRect.top + 12,
				}
			: null;
	const includedFiles = Array.isArray(hoveredFootprint?.meta.included_files)
		? hoveredFootprint.meta.included_files.filter(
				(file): file is string => typeof file === "string" && file.length > 0,
			)
		: [];
	const tooltipFiles = includedFiles.slice(0, 2);
	const remainingFiles = includedFiles.length - tooltipFiles.length;
	const tooltipFileLine =
		tooltipFiles.length > 0
			? [
					tooltipFiles.join(", "),
					remainingFiles > 0 ? `+${remainingFiles} more` : null,
				]
					.filter(Boolean)
					.join(" ")
			: null;

	return (
		<Box
			ref={containerRef}
			position="relative"
			w="100%"
			h="100%"
			minH="0"
			overflow="hidden"
		>
			<Canvas
				dpr={[1, 2]}
				gl={{ antialias: true, alpha: false }}
				camera={{ position: OVERVIEW_CANVAS_CONSTANTS.cameraPosition }}
			>
				<FootprintInteractionBridge
					footprints={footprints}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
					hoveredFootprintId={hoveredFootprintId}
					events={footprintEvents}
				/>
				<SceneEnvironment />
				<CameraRig pendingFlyToTargetId={pendingFlyToTargetId} />
				<GlobeLayer
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
					showAtmosphere={showAtmosphere}
				/>
				<GraticuleLayer
					visible={showGrid}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
				<FootprintsLayer
					footprints={footprints}
					selectedFootprintId={selectedFootprintId}
					hoveredFootprintId={hoveredFootprintId}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
				<ManualTargetsLayer
					manualTargets={manualTargets}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
			</Canvas>
			{hoveredFootprint && tooltipPosition ? (
				<Box
					position="absolute"
					left={`${tooltipPosition.left}px`}
					top={`${tooltipPosition.top}px`}
					transform="translate(0, 0)"
					pointerEvents="none"
					zIndex="1"
					maxW="sm"
					px="3"
					py="2"
					borderWidth="1px"
					borderColor="whiteAlpha.300"
					borderRadius="md"
					bg="blackAlpha.800"
					backdropFilter="blur(10px)"
					color="white"
					boxShadow="lg"
				>
					<Text fontSize="sm" fontWeight="semibold">
						Footprint {hoveredFootprint.id}
					</Text>
					<Text fontSize="xs" color="whiteAlpha.800">
						{includedFiles.length} files
					</Text>
					{tooltipFileLine ? (
						<Text fontSize="xs" color="whiteAlpha.700">
							{tooltipFileLine}
						</Text>
					) : null}
				</Box>
			) : null}
		</Box>
	);
}
