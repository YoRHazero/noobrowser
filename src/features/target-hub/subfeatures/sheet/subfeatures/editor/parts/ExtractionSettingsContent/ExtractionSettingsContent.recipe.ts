import { defineSlotRecipe } from "@chakra-ui/react";

export const extractionSettingsContentRecipe = defineSlotRecipe({
	className: "target-hub-sheet-extraction-settings-content",
	slots: [
		"content",
		"title",
		"fields",
		"helperText",
		"actions",
		"ghostButton",
		"outlineButton",
	],
	base: {
		content: {
			display: "flex",
			flexDirection: "column",
			gap: 3,
		},
		title: {
			fontSize: "xs",
			fontWeight: "semibold",
			letterSpacing: "normal",
			textTransform: "none",
			color: "white",
		},
		fields: {
			display: "flex",
			flexDirection: "column",
			gap: 3,
		},
		helperText: {
			fontSize: "xs",
			lineHeight: 1.5,
			minH: "18px",
		},
		actions: {
			justifyContent: "flex-end",
			gap: 2,
		},
		ghostButton: {
			color: "whiteAlpha.860",
			textTransform: "none",
		},
		outlineButton: {
			borderColor: "whiteAlpha.220",
			color: "white",
			textTransform: "none",
		},
	},
	variants: {
		canSave: {
			true: {
				helperText: {
					color: "whiteAlpha.660",
				},
			},
			false: {
				helperText: {
					color: "orange.200",
				},
			},
		},
	},
	defaultVariants: {
		canSave: true,
	},
});
