import { defineSlotRecipe } from "@chakra-ui/react";

export const overviewRecipe = defineSlotRecipe({
	slots: ["root", "canvasPane", "canvasSurface", "sidebarPane"],
	className: "overview",
	base: {
		root: {
			w: "100%",
			h: "100vh",
			minH: 0,
			gridTemplateColumns: "minmax(0, 1fr) 400px",
			overflow: "hidden",
		},
		canvasPane: {
			minW: 0,
		},
		canvasSurface: {
			position: "relative",
			w: "100%",
			h: "100%",
			minH: 0,
		},
		sidebarPane: {
			minW: "400px",
			maxW: "400px",
			h: "100%",
			minH: 0,
		},
	},
});
