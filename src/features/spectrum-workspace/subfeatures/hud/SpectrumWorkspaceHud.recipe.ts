import { defineSlotRecipe } from "@chakra-ui/react";

export const spectrumWorkspaceHudRecipe = defineSlotRecipe({
	slots: ["anchor"],
	className: "spectrum-workspace-hud",
	base: {
		anchor: {
			position: "absolute",
			left: 0,
			bottom: 0,
			zIndex: 6,
		},
	},
});
