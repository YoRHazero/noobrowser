import { Box, Presence, useSlotRecipe } from "@chakra-ui/react";
import { hudRecipe } from "./Hud.recipe";
import { CoordinatePrecisionControl } from "./parts/CoordinatePrecisionControl";
import { GridControl } from "./parts/GridControl";
import { Panel } from "./parts/Panel";
import { TooltipModeControl } from "./parts/TooltipModeControl";
import { TriggerButton } from "./parts/TriggerButton";
import { useHud } from "./useHud";

export function Hud() {
	const recipe = useSlotRecipe({ recipe: hudRecipe });
	const styles = recipe();
	const {
		open,
		setOpen,
		showGrid,
		tooltipMode,
		targetCoordinatePrecision,
		setShowGrid,
		setTooltipMode,
		setTargetCoordinatePrecision,
		triggerTransitionDelay,
	} = useHud();

	return (
		<Box css={styles.anchor}>
			<TriggerButton
				open={open}
				onOpenChange={setOpen}
				transitionDelay={triggerTransitionDelay}
			/>

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
				<Panel title="Viewer HUD" onClose={() => setOpen(false)}>
					<TooltipModeControl
						tooltipMode={tooltipMode}
						onTooltipModeChange={setTooltipMode}
					/>
					<GridControl showGrid={showGrid} onShowGridChange={setShowGrid} />
					<CoordinatePrecisionControl
						precision={targetCoordinatePrecision}
						disabled={tooltipMode !== "coordinate"}
						onPrecisionChange={setTargetCoordinatePrecision}
					/>
				</Panel>
			</Presence>
		</Box>
	);
}
