import { defineSlotRecipe } from "@chakra-ui/react";

export const editorViewRecipe = defineSlotRecipe({
	className: "target-hub-sheet-editor-view",
	slots: ["currentCard"],
	base: {
		currentCard: {
			display: "flex",
			flexDirection: "column",
			gap: 2.5,
			p: 3,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.140",
			bg: "rgba(255, 255, 255, 0.04)",
			flexShrink: 0,
		},
	},
});
