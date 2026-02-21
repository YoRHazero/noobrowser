import { defineSlotRecipe } from "@chakra-ui/react";

export const fitConfigurationListRecipe = defineSlotRecipe({
	slots: [
		"root",
		"scrollArea",
		"listRow",
		"emptyState",
		"emptyTitle",
		"emptySubtitle",
	],
	className: "fit-configuration-list",
	base: {
		root: {
			gap: 3,
		},
		scrollArea: {
			overflowX: "auto",
			whiteSpace: "nowrap",
			pb: 1,
			px: 1,
		},
		listRow: {
			gap: 3,
			px: 1,
		},
		emptyState: {
			p: 4,
			borderWidth: "1px",
			borderStyle: "dashed",
			borderColor: "border.subtle",
			borderRadius: "md",
			textAlign: "center",
			bg: "bg.card",
		},
		emptyTitle: {
			fontSize: "xs",
			color: "fg.muted",
			fontWeight: "semibold",
			letterSpacing: "wide",
		},
		emptySubtitle: {
			fontSize: "2xs",
			color: "fg.subtle",
			mt: 1,
		},
	},
});
