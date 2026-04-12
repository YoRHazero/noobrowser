import { defineSlotRecipe } from "@chakra-ui/react";

export const mapCanvasRecipe = defineSlotRecipe({
	slots: [
		"root",
		"canvasSurface",
		"overlay",
		"tooltip",
		"tooltipTitle",
		"tooltipBody",
		"tooltipMutedBody",
	],
	className: "map-canvas",
	base: {
		root: {
			position: "relative",
			w: "100%",
			h: "100%",
			minH: 0,
			overflow: "hidden",
			bg: "#03060a",
		},
		canvasSurface: {
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
			borderColor: "whiteAlpha.300",
			borderRadius: "md",
			bg: "blackAlpha.800",
			backdropFilter: "blur(10px)",
			color: "white",
			boxShadow: "lg",
			maxW: "sm",
		},
		tooltipTitle: {
			fontSize: "sm",
			fontWeight: "semibold",
		},
		tooltipBody: {
			fontSize: "xs",
			color: "whiteAlpha.800",
		},
		tooltipMutedBody: {
			fontSize: "xs",
			color: "whiteAlpha.700",
		},
	},
});
