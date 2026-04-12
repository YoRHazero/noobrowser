import { defineSlotRecipe } from "@chakra-ui/react";

export const sourceInfoRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-source-info",
	slots: ["root", "header", "title", "grid", "field", "label", "value"],
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
			alignItems: "baseline",
			justifyContent: "space-between",
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "fg.muted",
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 3,
		},
		field: {
			gap: 1,
		},
		label: {
			fontSize: "xs",
			color: "fg.muted",
		},
		value: {
			fontSize: "sm",
			fontWeight: "medium",
		},
	},
});
