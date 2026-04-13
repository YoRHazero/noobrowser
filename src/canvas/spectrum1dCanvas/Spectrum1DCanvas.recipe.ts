import { defineSlotRecipe } from "@chakra-ui/react";

export const spectrum1DCanvasRecipe = defineSlotRecipe({
	className: "spectrum-1d-canvas",
	slots: ["root", "surface"],
	base: {
		root: {
			position: "relative",
			w: "100%",
			h: "100%",
			minH: 0,
			overflow: "hidden",
			bg: "bg",
			color: "fg",
			touchAction: "none",
		},
		surface: {
			position: "absolute",
			inset: 0,
		},
	},
});
