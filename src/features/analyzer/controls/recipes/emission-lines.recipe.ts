import { defineSlotRecipe } from "@chakra-ui/react";

export const emissionLinesRecipe = defineSlotRecipe({
	slots: ["emptyState", "emptyText"],
	className: "emission-lines",
	base: {
		emptyState: {
			alignItems: "center",
			justifyContent: "center",
			h: "full",
			color: "fg.muted",
			gap: 2,
			opacity: 0.6,
		},
		emptyText: {
			textStyle: "xs",
			letterSpacing: "wide",
		},
	},
});
