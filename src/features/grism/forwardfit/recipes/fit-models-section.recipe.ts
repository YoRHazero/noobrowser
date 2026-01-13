import { defineSlotRecipe } from "@chakra-ui/react";

export const fitModelsSectionRecipe = defineSlotRecipe({
	slots: ["content", "emptyState", "emptyTitle", "emptySubtitle"],
	className: "fit-models-section",
	base: {
		content: {
			px: 4,
			pb: 6,
			pt: 1,
		},
		emptyState: {
			alignItems: "center",
			justifyContent: "center",
			h: "full",
			gap: 1,
			textAlign: "center",
			color: "fg.muted",
		},
		emptyTitle: {
			textStyle: "sm",
			letterSpacing: "wider",
			fontWeight: "semibold",
		},
		emptySubtitle: {
			textStyle: "xs",
			color: "fg.subtle",
		},
	},
});
