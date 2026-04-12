import { defineSlotRecipe } from "@chakra-ui/react";

export const sourcesViewRecipe = defineSlotRecipe({
	className: "target-hub-sheet-sources-view",
	slots: ["panelBody", "panelContent", "emptyState"],
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
		emptyState: {
			p: 4,
			borderRadius: "xl",
			borderWidth: "1px",
			borderStyle: "dashed",
			borderColor: "whiteAlpha.140",
			bg: "rgba(255, 255, 255, 0.02)",
		},
	},
});
