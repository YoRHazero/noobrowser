import { defineSlotRecipe } from "@chakra-ui/react";

export const jobFooterActionsRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-footer-actions",
	slots: [
		"root",
		"field",
		"label",
		"tagsInput",
		"helper",
		"actions",
		"deleteButton",
		"saveButton",
	],
	base: {
		root: {
			gap: 3,
		},
		field: {
			gap: 1.5,
		},
		label: {
			fontSize: "sm",
			fontWeight: "semibold",
		},
		tagsInput: {
			w: "full",
		},
		helper: {
			fontSize: "xs",
			color: "fg.muted",
		},
		actions: {
			justifyContent: "flex-end",
			gap: 2,
		},
		deleteButton: {
			borderColor: "rgba(239, 68, 68, 0.30)",
			color: "red.200",
		},
		saveButton: {
			color: "white",
		},
	},
});
