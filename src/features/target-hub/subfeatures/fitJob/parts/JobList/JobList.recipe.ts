import { defineSlotRecipe } from "@chakra-ui/react";

export const jobListRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-list",
	slots: [
		"root",
		"header",
		"title",
		"subtitleRow",
		"subtitle",
		"list",
		"emptyState",
		"errorText",
	],
	base: {
		root: {
			h: "full",
			p: 4,
			borderWidth: "1px",
			borderRadius: "2xl",
			borderColor: "border.subtle",
			bg: "blackAlpha.200",
			gap: 4,
			overflow: "hidden",
			minH: 0,
		},
		header: {
			gap: 1,
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "fg.muted",
		},
		subtitleRow: {
			justifyContent: "space-between",
		},
		subtitle: {
			fontSize: "xs",
			color: "fg.muted",
		},
		list: {
			gap: 2,
			overflowY: "auto",
			pr: 1,
			minH: 0,
		},
		emptyState: {
			p: 4,
			textAlign: "center",
			fontSize: "sm",
			color: "fg.muted",
		},
		errorText: {
			p: 3,
			borderWidth: "1px",
			borderRadius: "lg",
			borderColor: "rgba(239, 68, 68, 0.30)",
			bg: "rgba(239, 68, 68, 0.10)",
			color: "red.200",
			fontSize: "sm",
		},
	},
});
