import { defineSlotRecipe } from "@chakra-ui/react";

export const fitModelCardRecipe = defineSlotRecipe({
	slots: [
		"root",
		"header",
		"nameInput",
		"actionGroup",
		"switchControl",
		"formula",
		"body",
		"iconButton",
	],
	className: "fit-model-card",
	base: {
		root: {
			position: "relative",
			gap: 2,
			p: 3,
			borderRadius: "lg",
			borderWidth: "1px",
			borderColor: "border.subtle",
			borderLeftWidth: "2px",
			borderLeftColor: "border.subtle",
			bg: "bg.card",
			boxShadow: "shadows.card",
			transition: "all 0.2s ease-out",
			animation: "enter",
			_hover: {
				borderColor: "border.accent",
				transform: "translateY(-1px)",
			},
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 2,
		},
		nameInput: {
			fontWeight: "semibold",
			fontFamily: "mono",
			bg: "transparent",
			color: "fg",
			_focus: {
				bg: "bg.subtle",
				borderColor: "border.accent",
				boxShadow: "none",
			},
			_placeholder: {
				color: "fg.subtle",
			},
		},
		actionGroup: {
			display: "flex",
			alignItems: "center",
			gap: 1,
		},
		switchControl: {
			bg: { base: "gray.200", _dark: "whiteAlpha.100" },
			borderColor: "border.subtle",
			transition: "all 0.2s",
			_checked: {
				bg: { base: "cyan.500", _dark: "cyan.600" },
				borderColor: { base: "cyan.600", _dark: "cyan.400" },
			},
		},
		formula: {
			textStyle: "xs",
			fontFamily: "mono",
			color: "fg.muted",
			bg: "bg.subtle",
			px: 2,
			py: 1,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "border.subtle",
			alignSelf: "start",
			fontWeight: { base: "medium", _dark: "normal" },
		},
		body: {
			gap: 2,
			pt: 1,
			transition: "opacity 0.2s",
		},
		iconButton: {
			color: "fg.muted",
			_hover: {
				color: "red.400",
				bg: { base: "red.50", _dark: "whiteAlpha.100" },
			},
		},
	},
	variants: {
		active: {
			true: {
				root: {
					opacity: 1,
					borderLeftWidth: "3px",
					borderLeftColor: "var(--fit-model-accent)",
					boxShadow: "shadows.card",
				},
				body: {
					opacity: 1,
					pointerEvents: "auto",
				},
			},
			false: {
				root: {
					opacity: 0.6,
				},
				body: {
					opacity: 0.6,
					pointerEvents: "none",
				},
			},
		},
	},
});
