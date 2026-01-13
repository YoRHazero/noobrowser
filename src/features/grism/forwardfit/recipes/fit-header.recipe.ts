import { defineSlotRecipe } from "@chakra-ui/react";

export const fitHeaderRecipe = defineSlotRecipe({
	slots: [
		"root",
		"title",
		"controls",
		"selectControl",
		"selectContent",
		"selectItem",
		"iconButton",
		"addButton",
	],
	className: "fit-header",
	base: {
		root: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 3,
			w: "full",
			flexWrap: "wrap",
		},
		title: {
			fontSize: "sm",
			letterSpacing: "wide",
			fontWeight: "extrabold",
			textTransform: "uppercase",
			color: { base: "gray.700", _dark: "transparent" },
			bgGradient: { base: "none", _dark: "to-r" },
			gradientFrom: { _dark: "cyan.400" },
			gradientTo: { _dark: "purple.500" },
			bgClip: { base: "border-box", _dark: "text" },
		},
		controls: {
			display: "flex",
			alignItems: "center",
			gap: 2,
			flexWrap: "wrap",
			justifyContent: "flex-end",
		},
		selectControl: {
			bg: "bg.card",
			borderColor: "border.subtle",
			color: "fg",
			fontSize: "xs",
			transition: "all 0.2s",
			_hover: {
				borderColor: "cyan.400",
				bg: { base: "gray.50", _dark: "whiteAlpha.200" },
			},
			_focus: {
				borderColor: "cyan.500",
				boxShadow: "0 0 0 1px var(--chakra-colors-cyan-500)",
			},
		},
		selectContent: {
			bg: "bg.panel",
			borderColor: "border.subtle",
			backdropFilter: "blur(10px)",
		},
		selectItem: {
			cursor: "pointer",
			transition: "all 0.1s ease-out",
			borderRadius: "sm",
			_hover: {
				bg: { base: "gray.100", _dark: "whiteAlpha.100" },
				color: { base: "cyan.600", _dark: "cyan.400" },
			},
			_highlighted: {
				bg: { base: "gray.100", _dark: "whiteAlpha.100" },
				color: { base: "cyan.600", _dark: "cyan.400" },
			},
		},
		iconButton: {
			color: "fg.muted",
			_hover: {
				color: "cyan.400",
				bg: { base: "gray.100", _dark: "whiteAlpha.100" },
			},
		},
		addButton: {
			fontWeight: "semibold",
		},
	},
});
