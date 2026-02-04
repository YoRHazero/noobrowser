import { defineSlotRecipe } from "@chakra-ui/react";

export const customSourceRecipe = defineSlotRecipe({
	slots: [
		"root",
		"label",
		"controls",
		"controlBase",
		"input",
		"selectContent",
		"selectItem",
	],
	className: "custom-source",
	base: {
		root: {
			gap: 2,
		},
		label: {
			fontSize: "2xs",
			fontWeight: "bold",
			color: "fg.muted",
			textTransform: "none", // Explicitly disable uppercase
			mb: 1,
		},
		controls: {
			gap: 4,
			alignItems: "end",
		},
		controlBase: {
			bg: { base: "white", _dark: "blackAlpha.200" },
			borderColor: { base: "gray.200", _dark: "whiteAlpha.100" },
			_hover: { borderColor: "cyan.400" },
			_focusWithin: {
				borderColor: "cyan.500",
				boxShadow: "0 0 0 1px var(--chakra-colors-cyan-500)",
			},
		},
		input: {
			fontFamily: "mono",
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
			fontSize: "xs",
			_hover: {
				bg: { base: "gray.100", _dark: "whiteAlpha.100" },
				color: { base: "cyan.600", _dark: "cyan.400" },
			},
			_highlighted: {
				bg: { base: "gray.100", _dark: "whiteAlpha.100" },
				color: { base: "cyan.600", _dark: "cyan.400" },
			},
		},
	},
});
