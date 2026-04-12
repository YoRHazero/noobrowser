import { defineSlotRecipe } from "@chakra-ui/react";

export const editorActionBarRecipe = defineSlotRecipe({
	className: "target-hub-sheet-editor-action-bar",
	slots: [
		"editorActions",
		"chipGroup",
		"chip",
		"popoverContent",
		"popoverArrow",
		"popoverBody",
	],
	base: {
		editorActions: {
			display: "flex",
			alignItems: "center",
			gap: 2,
		},
		chipGroup: {
			display: "flex",
			alignItems: "center",
			gap: 1.5,
		},
		chip: {
			minW: "28px",
			h: "28px",
			borderRadius: "full",
			borderWidth: "1px",
			borderColor: "whiteAlpha.200",
			bg: "transparent",
			color: "whiteAlpha.820",
			fontSize: "xs",
			fontWeight: "bold",
			letterSpacing: "0.08em",
			transition:
				"background 120ms ease, border-color 120ms ease, color 120ms ease",
			_hover: {
				bg: "whiteAlpha.120",
			},
			_disabled: {
				opacity: 0.42,
			},
		},
		popoverContent: {
			w: "240px",
			borderColor: "whiteAlpha.180",
			bg: "rgba(9, 15, 28, 0.98)",
			boxShadow: "0 18px 42px rgba(2, 8, 23, 0.48)",
		},
		popoverArrow: {
			bg: "rgba(9, 15, 28, 0.98)",
		},
		popoverBody: {
			p: 3,
		},
	},
	variants: {
		isDetail: {
			true: {
				editorActions: {
					justifyContent: "space-between",
				},
			},
			false: {
				editorActions: {
					justifyContent: "flex-end",
				},
			},
		},
		chipTone: {
			default: {},
			active: {
				chip: {
					borderColor: "cyan.300",
					bg: "rgba(34, 211, 238, 0.16)",
					color: "white",
					boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.22)",
				},
			},
		},
	},
	defaultVariants: {
		isDetail: true,
		chipTone: "default",
	},
});
