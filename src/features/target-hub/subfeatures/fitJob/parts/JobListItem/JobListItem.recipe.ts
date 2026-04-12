import { defineSlotRecipe } from "@chakra-ui/react";

export const jobListItemRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-list-item",
	slots: [
		"root",
		"main",
		"metaRow",
		"badgeContent",
		"status",
		"jobId",
		"error",
	],
	base: {
		root: {
			w: "full",
			p: 3,
			borderWidth: "1px",
			borderRadius: "lg",
			borderColor: "border.subtle",
			bg: "blackAlpha.200",
			cursor: "pointer",
			transition:
				"transform 140ms ease, border-color 140ms ease, background 140ms ease",
			textAlign: "left",
		},
		main: {
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: 3,
		},
		metaRow: {
			gap: 2,
			flexWrap: "wrap",
		},
		badgeContent: {
			gap: 1,
		},
		status: {
			fontSize: "xs",
			fontWeight: "semibold",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
		},
		jobId: {
			fontSize: "sm",
			fontWeight: "medium",
		},
		error: {
			mt: 2,
			fontSize: "xs",
			color: "fg.muted",
		},
	},
	variants: {
		selected: {
			true: {
				root: {
					borderColor: "cyan.300",
					bg: "rgba(6, 182, 212, 0.10)",
					transform: "translateY(-1px)",
				},
			},
		},
	},
});
