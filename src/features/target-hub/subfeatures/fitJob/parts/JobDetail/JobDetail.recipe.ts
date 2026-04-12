import { defineSlotRecipe } from "@chakra-ui/react";

export const jobDetailRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-detail",
	slots: [
		"root",
		"emptyState",
		"statusLine",
		"statusBadge",
		"jobMetaStack",
		"jobTitle",
		"jobStatusText",
		"failedMessageLine",
		"failedIcon",
		"summaryLoadingLine",
		"spinner",
		"errorText",
		"content",
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
		emptyState: {
			h: "full",
			alignItems: "center",
			justifyContent: "center",
			textAlign: "center",
			gap: 2,
			color: "fg.muted",
		},
		statusLine: {
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
		},
		statusBadge: {
			fontSize: "xs",
			textTransform: "uppercase",
			letterSpacing: "0.08em",
		},
		jobMetaStack: {
			gap: 0,
		},
		jobTitle: {
			fontWeight: "semibold",
		},
		jobStatusText: {
			fontSize: "sm",
			color: "fg.muted",
		},
		failedMessageLine: {
			gap: 2,
			mb: 2,
		},
		failedIcon: {
			color: "red.200",
		},
		summaryLoadingLine: {
			color: "fg.muted",
		},
		spinner: {
			color: "cyan.300",
		},
		errorText: {
			fontSize: "sm",
			color: "red.200",
		},
		content: {
			gap: 4,
			overflowY: "auto",
			pr: 1,
			minH: 0,
		},
	},
});
