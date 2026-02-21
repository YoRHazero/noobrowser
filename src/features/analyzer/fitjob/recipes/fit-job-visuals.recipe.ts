import { defineSlotRecipe } from "@chakra-ui/react";

export const fitJobVisualsRecipe = defineSlotRecipe({
	slots: ["root", "tabList", "tabTrigger", "tabContent"],
	className: "fit-job-visuals",
	base: {
		root: {
			width: "full",
		},
		tabList: {
			bg: "bg.muted", 
			p: 1,
			borderRadius: "md",
			_dark: {
				bg: "blackAlpha.400",
			},
		},
		tabTrigger: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "fg.muted",
			borderRadius: "sm",
			px: 3,
			py: 1.5,
			transition: "all 0.2s",
			_hover: {
				bg: "bg.subtle",
				color: "fg.default",
				_dark: {
					bg: "whiteAlpha.100",
				},
			},
			_selected: {
				bg: "bg.panel",
				color: "cyan.600",
				shadow: "sm",
				_dark: {
					bg: "bg.panel", // Or a specific dark mode panel color
					color: "cyan.300",
				},
			},
		},
		tabContent: {
			p: 0,
			pt: 4,
			_focus: { outline: "none" },
		},
	},
});
