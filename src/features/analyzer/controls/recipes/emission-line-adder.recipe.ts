import { defineSlotRecipe } from "@chakra-ui/react";

export const emissionLineAdderRecipe = defineSlotRecipe({
	slots: ["trigger", "content", "title", "label", "input", "button"],
	className: "emission-line-adder",
	base: {
		trigger: {
			color: "cyan.400",
			_hover: { bg: "cyan.600", color: "cyan.200" },
		},
		content: {
			width: "260px",
			bg: "bg.panel",
			borderColor: "border.subtle",
			backdropFilter: "blur(10px)",
			boxShadow: "xl",
			_dark: {
				bg: "rgba(20, 20, 25, 0.9)",
				borderColor: "whiteAlpha.200",
			},
		},
		title: {
			color: "cyan.400",
		},
		label: {
			textStyle: "2xs",
			fontWeight: "bold",
			color: "fg.muted",
			letterSpacing: "0.05em",
		},
		input: {
			fontFamily: "mono",
			bg: "blackAlpha.200",
			borderColor: "whiteAlpha.100",
			_focus: { borderColor: "cyan.500", bg: "blackAlpha.400" },
		},
		button: {
			width: "full",
			mt: 1,
		},
	},
});
