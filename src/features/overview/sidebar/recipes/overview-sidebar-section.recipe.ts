import { defineSlotRecipe } from "@chakra-ui/react";

export const overviewSidebarSectionRecipe = defineSlotRecipe({
	slots: [
		"root",
		"header",
		"description",
		"scrollRoot",
		"scrollArea",
		"panel",
		"panelTitle",
		"panelDescription",
	],
	className: "overview-sidebar-section",
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
		panel: {
			w: "100%",
			px: 4,
			py: 4,
			borderWidth: "1px",
			borderColor: "rgba(255, 255, 255, 0.16)",
			borderRadius: "xl",
			bg: "rgba(255, 255, 255, 0.04)",
		},
		panelTitle: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
		panelDescription: {
			mt: 1.5,
			fontSize: "xs",
			color: "whiteAlpha.600",
		},
	},
});
