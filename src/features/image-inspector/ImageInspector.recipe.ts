import { defineSlotRecipe } from "@chakra-ui/react";

export const imageInspectorRecipe = defineSlotRecipe({
	className: "image-inspector",
	slots: ["root", "canvasSurface"],
	base: {
		root: {
			position: "relative",
			w: "100%",
			h: "100vh",
			minH: 0,
			overflow: "hidden",
			bg: "#050505",
			color: "white",
		},
		canvasSurface: {
			position: "absolute",
			inset: 0,
			minW: 0,
			minH: 0,
		},
	},
});
