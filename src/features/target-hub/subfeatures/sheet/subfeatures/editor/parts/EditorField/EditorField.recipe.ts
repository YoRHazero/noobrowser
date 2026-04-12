import { defineSlotRecipe } from "@chakra-ui/react";

export const editorFieldRecipe = defineSlotRecipe({
	className: "target-hub-sheet-editor-field",
	slots: ["inlineField", "inlineFieldLabel", "fieldContent"],
	base: {
		inlineField: {
			display: "grid",
			gridTemplateColumns: "72px minmax(0, 1fr)",
			alignItems: "center",
			gap: 2,
			minW: 0,
			w: "full",
		},
		inlineFieldLabel: {
			fontSize: "11px",
			fontWeight: "bold",
			letterSpacing: "0.1em",
			textTransform: "none",
			color: "whiteAlpha.680",
			whiteSpace: "nowrap",
		},
		fieldContent: {
			minW: 0,
			w: "full",
		},
	},
});
