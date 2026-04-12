import { defineSlotRecipe } from "@chakra-ui/react";

export const hudRecipe = defineSlotRecipe({
	slots: ["anchor"],
	className: "overview-hud",
	base: {
		anchor: {
			position: "absolute",
			top: 4,
			left: 4,
			zIndex: 4,
		},
	},
});
