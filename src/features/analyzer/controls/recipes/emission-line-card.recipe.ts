import { defineSlotRecipe } from "@chakra-ui/react";

export const emissionLineCardRecipe = defineSlotRecipe({
	slots: ["root", "label", "value", "actionButton"],
	className: "emission-line-card",
	base: {
		root: {
			position: "relative",
			w: "full",
			p: 3,
			borderWidth: "1px",
			borderRadius: "md",
			cursor: "pointer",
			transition: "all 0.2s",
			bg: "bg.card",
			borderColor: "border.subtle",
			boxShadow: "shadows.card",
			_hover: {
				borderColor: "border.accent",
			},
		},
		label: {
			textStyle: "sm",
			fontWeight: "bold",
			fontFamily: "mono",
			color: "border.accent",
		},
		value: {
			textStyle: "xs",
			fontFamily: "mono",
			color: "fg.muted",
		},
		actionButton: {
			color: "fg.muted",
			_hover: {
				color: "red.500",
				bg: { base: "red.50", _dark: "whiteAlpha.100" },
			},
		},
	},
	variants: {
		selected: {
			true: {
				root: {
					bg: "bg.cardSelected",
					borderColor: "border.accent",
				},
				label: {
					color: "border.accent",
				},
				value: {
					color: "fg",
				},
			},
		},
	},
});
