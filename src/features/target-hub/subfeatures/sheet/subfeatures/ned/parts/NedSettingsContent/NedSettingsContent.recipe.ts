import { defineSlotRecipe } from "@chakra-ui/react";

export const nedSettingsContentRecipe = defineSlotRecipe({
	className: "target-hub-sheet-ned-settings-content",
	slots: [
		"root",
		"field",
		"label",
		"inputRow",
		"input",
		"unitButton",
		"helper",
		"actions",
		"actionWrap",
		"saveButton",
		"refetchButton",
	],
	base: {
		root: {
			gap: 3,
		},
		field: {
			gap: 1,
		},
		label: {
			fontSize: "11px",
			fontWeight: "medium",
			letterSpacing: "normal",
			textTransform: "none",
			color: "whiteAlpha.720",
		},
		inputRow: {
			alignItems: "stretch",
			gap: 2,
		},
		input: {
			flex: 1,
		},
		unitButton: {
			minW: "48px",
			borderColor: "whiteAlpha.220",
			color: "white",
		},
		helper: {
			minH: "18px",
			fontSize: "xs",
			lineHeight: 1.5,
		},
		actions: {
			justifyContent: "flex-end",
			gap: 2,
		},
		actionWrap: {
			display: "inline-flex",
		},
		saveButton: {
			color: "whiteAlpha.860",
			textTransform: "none",
		},
		refetchButton: {
			borderColor: "whiteAlpha.220",
			color: "white",
			textTransform: "none",
		},
	},
	variants: {
		feedbackTone: {
			default: {
				helper: {
					color: "whiteAlpha.720",
				},
			},
			warning: {
				helper: {
					color: "orange.200",
				},
			},
		},
	},
	defaultVariants: {
		feedbackTone: "default",
	},
});
