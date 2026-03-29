import {
	Box,
	HStack,
	IconButton,
	Presence,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { FiSliders, FiX } from "react-icons/fi";
import { useShallow } from "zustand/react/shallow";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import { Switch } from "@/components/ui/switch";
import { useOverviewStore } from "@/stores/overview";
import { overviewViewerHudRecipe } from "./recipes/overview-viewer-hud.recipe";

export interface OverviewViewerHudProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function OverviewViewerHud({
	open,
	onOpenChange,
}: OverviewViewerHudProps) {
	const recipe = useSlotRecipe({ recipe: overviewViewerHudRecipe });
	const styles = recipe();
	const triggerTransitionDelay = open ? "0ms" : "140ms";
	const {
		showGrid,
		tooltipMode,
		targetCoordinatePrecision,
		setShowGrid,
		setTooltipMode,
		setTargetCoordinatePrecision,
	} = useOverviewStore(
		useShallow((state) => ({
			showGrid: state.showGrid,
			tooltipMode: state.tooltipMode,
			targetCoordinatePrecision: state.targetCoordinatePrecision,
			setShowGrid: state.setShowGrid,
			setTooltipMode: state.setTooltipMode,
			setTargetCoordinatePrecision: state.setTargetCoordinatePrecision,
		})),
	);

	return (
		<Box css={styles.anchor}>
			<IconButton
				aria-label="Open overview viewer controls"
				variant="plain"
				css={styles.trigger}
				opacity={open ? 0 : 1}
				transform={open ? "scale(0.92)" : "scale(1)"}
				pointerEvents={open ? "none" : "auto"}
				transition={[
					`opacity 0.16s ease ${triggerTransitionDelay}`,
					`transform 0.18s ease ${triggerTransitionDelay}`,
					"background 0.18s ease",
					"box-shadow 0.18s ease",
				].join(", ")}
				onClick={() => onOpenChange(true)}
			>
				<FiSliders />
			</IconButton>

			<Presence
				present={open}
				unmountOnExit
				position="absolute"
				top="0"
				left="0"
				transformOrigin="top left"
				animationStyle={{
					_open: "scale-fade-in",
					_closed: "scale-fade-out",
				}}
				animationDuration="180ms"
				animationTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
			>
				<Box css={styles.panel}>
						<HStack css={styles.header}>
							<Stack gap={0}>
								<Text
									fontSize="2xs"
									fontWeight="bold"
									letterSpacing="0.18em"
									textTransform="uppercase"
									color="whiteAlpha.700"
								>
									Viewer HUD
								</Text>
								<Text fontSize="sm" fontWeight="semibold" color="white">
									Overview Controls
								</Text>
							</Stack>

							<IconButton
								aria-label="Close overview viewer controls"
								variant="plain"
								css={styles.trigger}
								onClick={() => onOpenChange(false)}
							>
								<FiX />
							</IconButton>
						</HStack>

						<Stack gap={3}>
							<Box css={styles.section}>
								<Text css={styles.sectionLabel}>Tooltip Mode</Text>
								<Box css={styles.segmentGroup}>
									<Box
										as="button"
										css={styles.segmentButton}
										data-active={
											tooltipMode === "footprint" ? "true" : undefined
										}
										aria-pressed={tooltipMode === "footprint"}
										onClick={() => setTooltipMode("footprint")}
									>
										Footprint
									</Box>
									<Box
										as="button"
										css={styles.segmentButton}
										data-active={tooltipMode === "target" ? "true" : undefined}
										aria-pressed={tooltipMode === "target"}
										onClick={() => setTooltipMode("target")}
									>
										Target
									</Box>
								</Box>
							</Box>

							<Box css={styles.section}>
								<Text css={styles.sectionLabel}>Viewer State</Text>

								<Box css={styles.fieldRow}>
									<Text fontSize="sm" fontWeight="medium" color="whiteAlpha.900">
										Show Grid
									</Text>
									<Switch
										colorPalette="cyan"
										size="sm"
										checked={showGrid}
										onCheckedChange={(event) => setShowGrid(event.checked)}
									/>
								</Box>
							</Box>

							<Box css={styles.section}>
								<Text css={styles.sectionLabel}>Coordinate Precision</Text>
								<Box css={styles.fieldRow}>
									<CompactNumberInput
										label="Digits"
										value={targetCoordinatePrecision}
										onChange={setTargetCoordinatePrecision}
										step={1}
										min={0}
										max={100}
										decimalScale={0}
										inputWidth="88px"
										labelWidth="auto"
										disabled={tooltipMode !== "target"}
									/>
								</Box>
							</Box>
						</Stack>
				</Box>
			</Presence>
		</Box>
	);
}
