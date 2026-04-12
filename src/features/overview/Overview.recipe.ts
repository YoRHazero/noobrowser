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
			overflow: "hidden",
			borderLeftWidth: "1px",
			borderLeftColor: "rgba(255, 255, 255, 0.16)",
			bg: "linear-gradient(180deg, rgba(17, 25, 38, 0.96), rgba(6, 11, 20, 0.98))",
			backdropFilter: "blur(22px)",
			color: "white",
		},
	},
});
