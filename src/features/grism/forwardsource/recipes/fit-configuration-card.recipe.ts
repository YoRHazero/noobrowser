import { defineSlotRecipe } from "@chakra-ui/react";

export const fitConfigurationCardRecipe = defineSlotRecipe({
	slots: [
		"root",
		"body",
		"name",
		"meta",
		"checkbox",
		"actionGroup",
		"actionButton",
		"removeButton",
	],
	className: "fit-configuration-card",
	base: {
		root: {
			minW: "160px",
			cursor: "pointer",
			transition: "all 0.2s ease-out",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.panel",
			boxShadow: "shadows.card",
			_hover: {
				borderColor: "cyan.400",
				bg: { base: "gray.50", _dark: "whiteAlpha.100" },
			},
		},
		body: {
			p: 3,
		},
	name: {
		fontWeight: "bold",
		fontSize: "xs",
		maxW: "110px",
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		fontFamily: "mono",
		color: "fg",
	},
		meta: {
			fontSize: "2xs",
			color: "fg.muted",
			letterSpacing: "wide",
		},
		checkbox: {
			borderColor: "border.subtle",
		},
		actionGroup: {
			gap: 0,
		},
		actionButton: {
			color: "fg.muted",
			_hover: { color: "cyan.400", bg: "whiteAlpha.200" },
		},
		removeButton: {
			color: "fg.muted",
			_hover: { color: "red.400", bg: "whiteAlpha.200" },
		},
	},
	variants: {
		selected: {
			true: {
				root: {
					borderColor: { base: "cyan.500", _dark: "cyan.500" },
					bg: { base: "cyan.50", _dark: "whiteAlpha.100" },
					boxShadow: {
						base: "0 0 0 1px var(--chakra-colors-cyan-500)",
						_dark: "0 0 10px rgba(6, 182, 212, 0.15)",
					},
				},
				name: {
					color: { base: "cyan.600", _dark: "cyan.300" },
				},
			},
		},
	},
});
