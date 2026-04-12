import { defineSlotRecipe } from "@chakra-ui/react";

export const statBadgeRecipe = defineSlotRecipe({
	className: "target-hub-fit-job-stat-badge",
	slots: ["root", "label", "value"],
	base: {
		root: {
			display: "inline-flex",
			alignItems: "center",
			gap: 1.5,
			borderWidth: "1px",
			borderRadius: "999px",
			px: 3,
			py: 1.5,
		},
		label: {
			fontSize: "xs",
			fontWeight: "medium",
			opacity: 0.78,
		},
		value: {
			fontSize: "sm",
			fontWeight: "semibold",
		},
	},
	variants: {
		tone: {
			default: {
				root: {
					bg: "blackAlpha.300",
					borderColor: "border.subtle",
					color: "fg.default",
				},
			},
			success: {
				root: {
					bg: "rgba(34, 197, 94, 0.10)",
					borderColor: "rgba(34, 197, 94, 0.25)",
					color: "green.200",
				},
			},
			warning: {
				root: {
					bg: "rgba(249, 115, 22, 0.10)",
					borderColor: "rgba(249, 115, 22, 0.25)",
					color: "orange.200",
				},
			},
			accent: {
				root: {
					bg: "rgba(6, 182, 212, 0.10)",
					borderColor: "rgba(6, 182, 212, 0.25)",
					color: "cyan.200",
				},
			},
		},
	},
	defaultVariants: {
		tone: "default",
	},
});
