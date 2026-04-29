import { defineSlotRecipe } from "@chakra-ui/react";

export const fitJobActionBarRecipe = defineSlotRecipe({
	className: "spectrum-workspace-line-fit-job-action-bar",
	slots: [
		"root",
		"meta",
		"badge",
		"statusText",
		"detailText",
		"submitWrap",
		"submitButton",
	],
	base: {
		root: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 2,
			minW: 0,
			w: "full",
		},
		meta: {
			display: "flex",
			alignItems: "center",
			gap: 2,
			minW: 0,
		},
		badge: {
			flex: "0 0 auto",
			borderRadius: "sm",
			px: 1.5,
			py: 0.5,
			fontSize: "2xs",
			fontWeight: "semibold",
			letterSpacing: 0,
		},
		statusText: {
			fontSize: "xs",
			fontWeight: "semibold",
			color: "fg",
			lineClamp: 1,
		},
		detailText: {
			fontSize: "2xs",
			color: "fg.muted",
			lineClamp: 1,
		},
		submitWrap: {
			display: "inline-flex",
			flex: "0 0 auto",
		},
		submitButton: {
			minW: "5.25rem",
		},
	},
	variants: {
		ready: {
			true: {
				badge: {
					bg: "cyan.subtle",
					color: "cyan.fg",
				},
			},
			false: {
				badge: {
					bg: "bg.muted",
					color: "fg.muted",
				},
			},
		},
	},
	defaultVariants: {
		ready: false,
	},
});
