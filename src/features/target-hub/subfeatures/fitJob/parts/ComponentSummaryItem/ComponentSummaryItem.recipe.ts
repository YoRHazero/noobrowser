import { defineSlotRecipe } from "@chakra-ui/react";

export const componentSummaryItemRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-component-summary-item",
	slots: [
		"root",
		"header",
		"name",
		"type",
		"grid",
		"metric",
		"metricLabel",
		"metricValue",
		"badgeRow",
	],
	base: {
		root: {
			p: 4,
			borderWidth: "1px",
			borderRadius: "lg",
			borderColor: "border.subtle",
			bg: "blackAlpha.200",
			gap: 3,
		},
		header: {
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
		},
		name: {
			fontSize: "sm",
			fontWeight: "semibold",
			letterSpacing: "-0.01em",
		},
		type: {
			fontSize: "xs",
			textTransform: "uppercase",
			letterSpacing: "0.08em",
			color: "fg.muted",
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			gap: 3,
		},
		metric: {
			gap: 1,
		},
		metricLabel: {
			fontSize: "xs",
			color: "fg.muted",
		},
		metricValue: {
			fontSize: "sm",
			fontWeight: "medium",
		},
		badgeRow: {
			gap: 2,
			flexWrap: "wrap",
		},
	},
});
