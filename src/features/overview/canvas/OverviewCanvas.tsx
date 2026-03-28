import { Box } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
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

export function OverviewCanvas() {
	const { footprints } = useOverviewFootprints();
	const {
		manualTargets,
		showGrid,
		showAtmosphere,
		pendingFlyToTargetId,
		selectedFootprintId,
		hoveredFootprintId,
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
			setSelectedFootprintId: state.setSelectedFootprintId,
			setHoveredFootprint: state.setHoveredFootprint,
			clearHoveredFootprint: state.clearHoveredFootprint,
		})),
	);

	const footprintEvents = useFootprintEvents({
		setSelectedFootprintId,
		setHoveredFootprint,
		clearHoveredFootprint,
	});

	return (
		<Box position="relative" w="100%" h="100%" minH="0" overflow="hidden">
			<Canvas
				dpr={[1, 2]}
				gl={{ antialias: true, alpha: false }}
				camera={{ position: OVERVIEW_CANVAS_CONSTANTS.cameraPosition }}
			>
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
					events={footprintEvents}
				/>
				<ManualTargetsLayer
					manualTargets={manualTargets}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
			</Canvas>
		</Box>
	);
}
