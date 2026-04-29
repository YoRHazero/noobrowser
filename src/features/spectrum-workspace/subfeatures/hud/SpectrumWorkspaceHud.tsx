import { Box, Presence, useSlotRecipe } from "@chakra-ui/react";
import { DarkMode } from "@/components/ui/color-mode";
import { DisplayTab } from "./parts/DisplayTab";
import { ExtractionTab } from "./parts/ExtractionTab";
import { HudLauncher } from "./parts/HudLauncher";
import { HudPanel } from "./parts/HudPanel";
import { spectrumWorkspaceHudRecipe } from "./SpectrumWorkspaceHud.recipe";
import { useSpectrumWorkspaceHud } from "./useSpectrumWorkspaceHud";

export function SpectrumWorkspaceHud() {
	const recipe = useSlotRecipe({ recipe: spectrumWorkspaceHudRecipe });
	const styles = recipe();
	const hud = useSpectrumWorkspaceHud();

	if (hud.state !== "ready") {
		return null;
	}

	return (
		<Box css={styles.anchor}>
			<HudLauncher
				open={hud.open}
				onOpenChange={hud.setOpen}
				transitionDelay={hud.triggerTransitionDelay}
			/>

			<Presence
				present={hud.open}
				unmountOnExit
				position="absolute"
				top="0"
				left="0"
				transform="translate(14px, 12px)"
				transformOrigin="top left"
				animationStyle={{
					_open: "scale-fade-in",
					_closed: "scale-fade-out",
				}}
				animationDuration="180ms"
				animationTimingFunction="cubic-bezier(0.22, 1, 0.36, 1)"
			>
				<DarkMode>
					<HudPanel
						activeTab={hud.activeTab}
						onTabChange={hud.setActiveTab}
						onClose={() => hud.setOpen(false)}
						displayTab={<DisplayTab {...hud.displayTab} />}
						extractionTab={<ExtractionTab {...hud.extractionTab} />}
					/>
				</DarkMode>
			</Presence>
		</Box>
	);
}
