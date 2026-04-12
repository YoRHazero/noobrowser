import { defineSlotRecipe } from "@chakra-ui/react";

export const nedResultsContentRecipe = defineSlotRecipe({
	className: "target-hub-sheet-ned-results-content",
	slots: [
		"root",
		"title",
		"panel",
		"emptyState",
		"message",
		"table",
		"numericHeader",
		"actionHeader",
		"objectName",
		"redshift",
		"link",
	],
	base: {
		root: {
			gap: 3,
		},
		title: {
			fontSize: "xs",
			fontWeight: "semibold",
			letterSpacing: "normal",
			textTransform: "none",
			color: "white",
		},
		panel: {
			maxH: "320px",
			overflowY: "auto",
			borderWidth: "1px",
			borderColor: "whiteAlpha.180",
			borderRadius: "md",
			bg: "whiteAlpha.60",
		},
		emptyState: {
			p: 6,
			textAlign: "center",
		},
		message: {
			fontSize: "sm",
			lineHeight: 1.6,
		},
		numericHeader: {
			textAlign: "right",
		},
		actionHeader: {
			w: "40px",
		},
		objectName: {
			maxW: "220px",
			fontSize: "sm",
			color: "white",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		redshift: {
			textAlign: "right",
			fontSize: "sm",
			color: "whiteAlpha.820",
		},
		link: {
			color: "cyan.300",
		},
	},
	variants: {
		feedbackTone: {
			neutral: {
				message: {
					color: "whiteAlpha.760",
				},
			},
			error: {
				message: {
					color: "red.200",
				},
			},
		},
	},
	defaultVariants: {
		feedbackTone: "neutral",
	},
});
