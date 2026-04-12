import { defineSlotRecipe } from "@chakra-ui/react";

export const footprintsRecipe = defineSlotRecipe({
	slots: [
		"root",
		"header",
		"description",
		"scrollRoot",
		"scrollArea",
		"statePanel",
		"stateTitle",
		"stateDescription",
	],
	className: "overview-footprints",
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			h: "100%",
			minH: 0,
			overflow: "hidden",
		},
		header: {
			px: 4,
			py: 4,
			flexShrink: 0,
			borderBottomWidth: "1px",
			borderBottomColor: "rgba(255, 255, 255, 0.12)",
		},
		description: {
			fontSize: "sm",
			color: "whiteAlpha.700",
		},
		scrollRoot: {
			flex: "1 1 auto",
			minH: 0,
			overflow: "hidden",
		},
		scrollArea: {
			px: 4,
			py: 4,
		},
		statePanel: {
			w: "100%",
			px: 4,
			py: 4,
			borderWidth: "1px",
			borderColor: "rgba(255, 255, 255, 0.16)",
			borderRadius: "xl",
			bg: "rgba(255, 255, 255, 0.04)",
		},
		stateTitle: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
		stateDescription: {
			mt: 1.5,
			fontSize: "xs",
			color: "whiteAlpha.600",
		},
	},
});
