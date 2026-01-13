import { defineSlotRecipe } from "@chakra-ui/react";

export const sectionHeaderRecipe = defineSlotRecipe({
	slots: ["root", "left", "title", "leftSlot", "rightSlot"],
	className: "section-header",
	base: {
		root: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			flexWrap: "wrap",
			columnGap: 3,
			rowGap: 2,
			gap: 2,
			w: "full",
			minW: 0,
		},
		left: {
			display: "flex",
			alignItems: "center",
			gap: 2,
			flex: "1 1 auto",
			minW: 0,
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
		leftSlot: {
			display: "flex",
			alignItems: "center",
			gap: 2,
		},
		rightSlot: {
			display: "flex",
			alignItems: "center",
			gap: 2,
			flexShrink: 0,
		},
	},
});
