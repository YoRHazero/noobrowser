import { defineSlotRecipe } from "@chakra-ui/react";

export const imagePositionSectionRecipe = defineSlotRecipe({
	className: "target-hub-sheet-image-position-section",
	slots: ["editorRow"],
	base: {
		editorRow: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 3,
			alignItems: "center",
			w: "full",
		},
	},
});
