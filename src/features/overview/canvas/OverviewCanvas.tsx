import { Box, Text } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useOverviewStore } from "@/stores/overview";
import { createGraticuleLines } from "../utils/graticule";
import { GRATICULE_RADIUS_OFFSET } from "../shared/constants";
import type { GraticuleLine, HoveredGraticule } from "../shared/types";
import { useOverviewFootprints } from "../hooks/useOverviewFootprints";
import { parseOverviewTargetDraft } from "../utils/targets";
import { CameraRig } from "./core/CameraRig";
import { OVERVIEW_CANVAS_CONSTANTS } from "./core/constants";
import { SceneEnvironment } from "./core/SceneEnvironment";
import { DraftTargetLayer } from "./layers/DraftTargetLayer";
import { FootprintsLayer } from "./layers/FootprintsLayer";
import { GlobeLayer } from "./layers/GlobeLayer";
import { GraticuleLayer } from "./layers/GraticuleLayer";
import { ManualTargetsLayer } from "./layers/ManualTargetsLayer";
import { useFootprintInteractionResolver } from "./hooks/useFootprintInteractionResolver";
import { useCursorWorldCoordinateResolver } from "./hooks/useCursorWorldCoordinateResolver";
import { useGraticuleHoverResolver } from "./hooks/useGraticuleHoverResolver";
import { useOverviewGraticuleDensity } from "./hooks/useOverviewGraticuleDensity";

interface FootprintInteractionBridgeProps {
	footprints: ReturnType<typeof useOverviewFootprints>["footprints"];
	radius: number;
	selectedFootprintId: string | null;
	hoveredFootprintId: string | null;
	setSelectedFootprintId: (id: string | null) => void;
	setHoveredFootprint: (id: string | null, anchor?: { x: number; y: number } | null) => void;
	clearHoveredFootprint: () => void;
}

function FootprintInteractionBridge({
	footprints,
	radius,
	selectedFootprintId,
	hoveredFootprintId,
	setSelectedFootprintId,
	setHoveredFootprint,
	clearHoveredFootprint,
}: FootprintInteractionBridgeProps) {
	useFootprintInteractionResolver({
		footprints,
		radius,
		selectedFootprintId,
		hoveredFootprintId,
		setSelectedFootprintId,
		setHoveredFootprint,
		clearHoveredFootprint,
	});

	return null;
}

interface GraticuleInteractionBridgeProps {
	visible: boolean;
	radius: number;
	suppressHover: boolean;
	onHoverChange: (hoveredGraticule: HoveredGraticule | null) => void;
}

interface CursorWorldCoordinateBridgeProps {
	enabled: boolean;
	radius: number;
	setCursorWorldCoordinate: (coordinate: {
		ra: number;
		dec: number;
		anchor: { x: number; y: number };
	} | null) => void;
	clearCursorWorldCoordinate: () => void;
}

function GraticuleInteractionBridge({
	visible,
	radius,
	suppressHover,
	onHoverChange,
}: GraticuleInteractionBridgeProps) {
	const { meridianStepDeg, parallelStepDeg } = useOverviewGraticuleDensity({
		radius,
	});
	const lines = useMemo<GraticuleLine[]>(
		() =>
			createGraticuleLines({
				radius: radius * GRATICULE_RADIUS_OFFSET,
				meridianStepDeg,
				parallelStepDeg,
			}),
		[radius, meridianStepDeg, parallelStepDeg],
	);

	useGraticuleHoverResolver({
		lines,
		visible,
		suppressHover,
		onHoverChange,
	});

	return <GraticuleLayer visible={visible} lines={lines} />;
}

function CursorWorldCoordinateBridge({
	enabled,
	radius,
	setCursorWorldCoordinate,
	clearCursorWorldCoordinate,
}: CursorWorldCoordinateBridgeProps) {
	useCursorWorldCoordinateResolver({
		enabled,
		radius,
		setCursorWorldCoordinate,
		clearCursorWorldCoordinate,
	});

	return null;
}

export function OverviewCanvas() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [hoveredGraticule, setHoveredGraticule] =
		useState<HoveredGraticule | null>(null);
	const { footprints } = useOverviewFootprints();
	const {
		manualTargets,
		selectedTargetIds,
		showGrid,
		pendingFlyToTargetId,
		tooltipMode,
		targetDraftRa,
		targetDraftDec,
		targetCoordinatePrecision,
		cursorWorldCoordinate,
		selectedFootprintId,
		hoveredFootprintId,
		hoveredFootprintAnchor,
		setSelectedFootprintId,
		setHoveredFootprint,
		clearHoveredFootprint,
		setActiveSidebarTab,
		fillTargetDraftCoordinates,
		setCursorWorldCoordinate,
		clearCursorWorldCoordinate,
	} = useOverviewStore(
		useShallow((state) => ({
			manualTargets: state.manualTargets,
			selectedTargetIds: state.selectedTargetIds,
			showGrid: state.showGrid,
			pendingFlyToTargetId: state.pendingFlyToTargetId,
			tooltipMode: state.tooltipMode,
			targetDraftRa: state.targetDraftRa,
			targetDraftDec: state.targetDraftDec,
			targetCoordinatePrecision: state.targetCoordinatePrecision,
			cursorWorldCoordinate: state.cursorWorldCoordinate,
			selectedFootprintId: state.selectedFootprintId,
			hoveredFootprintId: state.hoveredFootprintId,
			hoveredFootprintAnchor: state.hoveredFootprintAnchor,
			setSelectedFootprintId: state.setSelectedFootprintId,
			setHoveredFootprint: state.setHoveredFootprint,
			clearHoveredFootprint: state.clearHoveredFootprint,
			setActiveSidebarTab: state.setActiveSidebarTab,
			fillTargetDraftCoordinates: state.fillTargetDraftCoordinates,
			setCursorWorldCoordinate: state.setCursorWorldCoordinate,
			clearCursorWorldCoordinate: state.clearCursorWorldCoordinate,
		})),
	);
	const draftTargetPreview = parseOverviewTargetDraft({
		raInput: targetDraftRa,
		decInput: targetDraftDec,
	});

	const hoveredFootprint =
		footprints.find((footprint) => footprint.id === hoveredFootprintId) ?? null;
	const cursorTooltipCoordinate = cursorWorldCoordinate
		? {
				ra: cursorWorldCoordinate.ra.toFixed(targetCoordinatePrecision),
				dec: cursorWorldCoordinate.dec.toFixed(targetCoordinatePrecision),
			}
		: null;
	const hoveredFootprintCenter = hoveredFootprint
		? {
				ra: hoveredFootprint.center.ra.toFixed(targetCoordinatePrecision),
				dec: hoveredFootprint.center.dec.toFixed(targetCoordinatePrecision),
			}
		: null;
	const containerRect = containerRef.current?.getBoundingClientRect();
	const tooltipPosition =
		hoveredFootprintAnchor && containerRect
			? {
					left: hoveredFootprintAnchor.x - containerRect.left + 12,
					top: hoveredFootprintAnchor.y - containerRect.top + 12,
				}
			: null;
	const graticuleTooltipPosition =
		hoveredGraticule && containerRect
			? {
					left: hoveredGraticule.anchor.x - containerRect.left + 12,
					top: hoveredGraticule.anchor.y - containerRect.top + 12,
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
	const targetTooltipPosition =
		cursorWorldCoordinate && containerRect
			? {
					left: cursorWorldCoordinate.anchor.x - containerRect.left + 12,
					top: cursorWorldCoordinate.anchor.y - containerRect.top + 12,
				}
			: null;

	return (
		<Box
			ref={containerRef}
			position="relative"
			w="100%"
			h="100%"
			minH="0"
			overflow="hidden"
			onContextMenu={(event) => {
				if (tooltipMode !== "target") {
					return;
				}

				event.preventDefault();

				if (!cursorWorldCoordinate) {
					return;
				}

				setActiveSidebarTab("targets");
				fillTargetDraftCoordinates({
					ra: cursorWorldCoordinate.ra,
					dec: cursorWorldCoordinate.dec,
				});
			}}
		>
			<Canvas
				dpr={[1, 2]}
				gl={{ antialias: true, alpha: false }}
			>
				<FootprintInteractionBridge
					footprints={footprints}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
					selectedFootprintId={selectedFootprintId}
					hoveredFootprintId={hoveredFootprintId}
					setSelectedFootprintId={setSelectedFootprintId}
					setHoveredFootprint={setHoveredFootprint}
					clearHoveredFootprint={clearHoveredFootprint}
				/>
				<CursorWorldCoordinateBridge
					enabled={tooltipMode === "target"}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
					setCursorWorldCoordinate={setCursorWorldCoordinate}
					clearCursorWorldCoordinate={clearCursorWorldCoordinate}
				/>
				<SceneEnvironment />
				<CameraRig pendingFlyToTargetId={pendingFlyToTargetId} />
				<GlobeLayer radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius} />
				<GraticuleInteractionBridge
					visible={showGrid}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
					suppressHover={hoveredFootprintId !== null || tooltipMode === "target"}
					onHoverChange={setHoveredGraticule}
				/>
				<FootprintsLayer
					footprints={footprints}
					selectedFootprintId={selectedFootprintId}
					hoveredFootprintId={hoveredFootprintId}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
				<ManualTargetsLayer
					manualTargets={manualTargets}
					selectedTargetIds={selectedTargetIds}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
				<DraftTargetLayer
					draftTarget={draftTargetPreview}
					radius={OVERVIEW_CANVAS_CONSTANTS.globeRadius}
				/>
			</Canvas>
			{tooltipMode === "target" ? (
				cursorWorldCoordinate && cursorTooltipCoordinate && targetTooltipPosition ? (
					<Box
						position="absolute"
						left={`${targetTooltipPosition.left}px`}
						top={`${targetTooltipPosition.top}px`}
						transform="translate(0, 0)"
						pointerEvents="none"
						zIndex="1"
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
							Cursor Coordinate
						</Text>
						<Text fontSize="xs" color="whiteAlpha.800">
							RA {cursorTooltipCoordinate.ra}°
						</Text>
						<Text fontSize="xs" color="whiteAlpha.800">
							Dec {cursorTooltipCoordinate.dec}°
						</Text>
						<Text fontSize="10px" color="whiteAlpha.600">
							Right click to fill target form
						</Text>
					</Box>
				) : null
			) : hoveredFootprint && tooltipPosition ? (
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
					{hoveredFootprintCenter ? (
						<Text fontSize="xs" color="whiteAlpha.800">
							Center: ({hoveredFootprintCenter.ra}°, {hoveredFootprintCenter.dec}°)
						</Text>
					) : null}
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
			{tooltipMode === "footprint" &&
			!hoveredFootprint &&
			hoveredGraticule &&
			graticuleTooltipPosition ? (
				<Box
					position="absolute"
					left={`${graticuleTooltipPosition.left}px`}
					top={`${graticuleTooltipPosition.top}px`}
					pointerEvents="none"
					zIndex="1"
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
						{hoveredGraticule.kind === "ra" ? "RA" : "DEC"}{" "}
						{hoveredGraticule.valueDeg}°
					</Text>
				</Box>
			) : null}
		</Box>
	);
}
