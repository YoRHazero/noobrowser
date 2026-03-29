import { defineSlotRecipe } from "@chakra-ui/react";

export const overviewSidebarShellRecipe = defineSlotRecipe({
	slots: [
		"root",
		"tabsRoot",
		"tabsList",
		"tabTrigger",
	],
	className: "overview-sidebar-shell",
	base: {
		root: {
			w: "100%",
			h: "100%",
			minH: 0,
			borderLeftWidth: "1px",
			borderLeftColor: "rgba(255, 255, 255, 0.16)",
			bg: "linear-gradient(180deg, rgba(17, 25, 38, 0.96), rgba(6, 11, 20, 0.98))",
			backdropFilter: "blur(22px)",
			color: "white",
		},
		tabsRoot: {
			h: "100%",
		},
		tabsList: {
			px: 3,
			pt: 3,
			borderBottomWidth: "1px",
			borderBottomColor: "rgba(255, 255, 255, 0.12)",
		},
		tabTrigger: {
			fontWeight: "semibold",
			color: "whiteAlpha.700",
			transition: "color 0.18s ease, background 0.18s ease",
			"&[data-selected]": {
				color: "white",
			},
		},
	},
});
