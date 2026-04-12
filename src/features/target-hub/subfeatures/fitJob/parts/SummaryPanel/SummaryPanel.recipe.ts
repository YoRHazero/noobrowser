import { defineSlotRecipe } from "@chakra-ui/react";

export const summaryPanelRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-summary-panel",
	slots: [
		"root",
		"header",
		"titleRow",
		"title",
		"modelList",
		"modelBadge",
		"bestBadge",
		"badgeIcon",
		"statsRow",
		"separator",
		"sectionTitle",
		"componentList",
		"emptyState",
	],
	base: {
		root: {
			p: 4,
			borderWidth: "1px",
			borderRadius: "xl",
			borderColor: "border.subtle",
			bg: "blackAlpha.200",
			gap: 4,
		},
		header: {
			gap: 3,
		},
		titleRow: {
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "fg.muted",
		},
		modelList: {
			display: "flex",
			flexWrap: "wrap",
			gap: 2,
		},
		modelBadge: {
			cursor: "pointer",
			userSelect: "none",
		},
		bestBadge: {
			bg: "rgba(34, 197, 94, 0.10)",
			color: "green.200",
		},
		badgeIcon: {
			display: "inline-flex",
			mr: 1,
		},
		statsRow: {
			display: "flex",
			flexWrap: "wrap",
			gap: 2,
		},
		separator: {
			borderColor: "border.subtle",
		},
		sectionTitle: {
			fontSize: "xs",
			letterSpacing: "0.12em",
			textTransform: "uppercase",
			color: "fg.muted",
		},
		componentList: {
			display: "flex",
			flexDirection: "column",
			gap: 3,
		},
		emptyState: {
			p: 6,
			textAlign: "center",
			color: "fg.muted",
		},
	},
});
