import { defineSlotRecipe } from "@chakra-ui/react";

export const imagePositionSectionRecipe = defineSlotRecipe({
	className: "target-hub-sheet-image-position-section",
	slots: ["editorRow", "readonlyField"],
	base: {
		editorRow: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 3,
			alignItems: "center",
			w: "full",
		},
		readonlyField: {
			minH: "32px",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.100",
			bg: "rgba(255, 255, 255, 0.025)",
			color: "whiteAlpha.860",
			fontSize: "sm",
			px: 3,
			w: "full",
			display: "flex",
			alignItems: "center",
			fontVariantNumeric: "tabular-nums",
		},
	},
});
