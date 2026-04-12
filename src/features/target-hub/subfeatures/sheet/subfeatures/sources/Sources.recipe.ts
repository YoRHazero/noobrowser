import { defineSlotRecipe } from "@chakra-ui/react";

export const sourcesRecipe = defineSlotRecipe({
	className: "target-hub-sheet-sources",
	slots: [
		"panelBody",
		"panelContent",
		"title",
		"emptyState",
		"emptyTitle",
		"emptyDescription",
	],
	base: {
		panelBody: {
			minH: 0,
			flex: "1",
			overflow: "hidden",
			display: "flex",
			flexDirection: "column",
		},
		panelContent: {
			minH: 0,
			flex: "1",
			overflowY: "auto",
			display: "flex",
			flexDirection: "column",
			gap: 2,
			pr: 1,
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
		emptyState: {
			p: 4,
			borderRadius: "xl",
			borderWidth: "1px",
			borderStyle: "dashed",
			borderColor: "whiteAlpha.140",
			bg: "rgba(255, 255, 255, 0.02)",
		},
		emptyTitle: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
		emptyDescription: {
			fontSize: "xs",
			color: "whiteAlpha.720",
			mt: 1,
		},
	},
});
