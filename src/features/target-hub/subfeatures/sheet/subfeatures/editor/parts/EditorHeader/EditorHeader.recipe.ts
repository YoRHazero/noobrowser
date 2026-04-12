import { defineSlotRecipe } from "@chakra-ui/react";

export const editorHeaderRecipe = defineSlotRecipe({
	className: "target-hub-sheet-editor-header",
	slots: ["editorHeader", "editorHeaderActions", "editorHeaderTitle"],
	base: {
		editorHeader: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 2,
			minH: "28px",
		},
		editorHeaderActions: {
			display: "flex",
			alignItems: "center",
			gap: 2,
			minH: "28px",
			justifyContent: "flex-end",
		},
		editorHeaderTitle: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
	},
});
