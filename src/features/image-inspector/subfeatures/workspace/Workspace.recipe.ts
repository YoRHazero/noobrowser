import { defineSlotRecipe } from "@chakra-ui/react";

export const workspaceRecipe = defineSlotRecipe({
	className: "image-inspector-workspace",
	slots: ["anchor"],
	base: {
		anchor: {
			position: "absolute",
			top: 4,
			left: 4,
			zIndex: 8,
			pointerEvents: "none",
		},
	},
});
