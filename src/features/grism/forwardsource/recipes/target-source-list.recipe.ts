import { defineSlotRecipe } from "@chakra-ui/react";

export const targetSourceListRecipe = defineSlotRecipe({
	slots: ["root", "content", "emptyState", "emptyTitle", "emptySubtitle"],
	className: "target-source-list",
	base: {
		root: {
			gap: 0,
			flex: 1,
			minH: 0,
		},
		content: {
			px: 4,
			pb: 6,
			pt: 2,
		},
		emptyState: {
			alignItems: "center",
			justifyContent: "center",
			minH: "200px",
			gap: 1,
			textAlign: "center",
			color: "fg.muted",
			opacity: 0.7,
		},
		emptyTitle: {
			fontSize: "xs",
			fontWeight: "bold",
			letterSpacing: "wide",
		},
		emptySubtitle: {
			fontSize: "2xs",
			color: "fg.subtle",
		},
	},
});
