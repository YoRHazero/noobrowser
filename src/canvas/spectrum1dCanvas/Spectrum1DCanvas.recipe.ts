import { defineSlotRecipe } from "@chakra-ui/react";

export const spectrum1DCanvasRecipe = defineSlotRecipe({
	className: "spectrum-1d-canvas",
	slots: [
		"root",
		"surface",
		"overlay",
		"tooltip",
		"tooltipTitle",
		"tooltipBody",
		"tooltipMutedBody",
	],
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
		overlay: {
			position: "absolute",
			inset: 0,
			pointerEvents: "none",
		},
		tooltip: {
			position: "absolute",
			pointerEvents: "none",
			zIndex: 1,
			px: 3,
			py: 2,
			borderWidth: "1px",
			borderColor: "border.subtle",
			borderRadius: "sm",
			bg: "bg.panel",
			color: "fg",
			boxShadow: "lg",
			maxW: "xs",
		},
		tooltipTitle: {
			fontSize: "xs",
			fontWeight: "semibold",
		},
		tooltipBody: {
			fontSize: "xs",
		},
		tooltipMutedBody: {
			fontSize: "xs",
			color: "fg.muted",
		},
	},
});
