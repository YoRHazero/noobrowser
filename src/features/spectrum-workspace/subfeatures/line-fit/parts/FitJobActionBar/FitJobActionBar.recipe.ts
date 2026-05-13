import { defineSlotRecipe } from "@chakra-ui/react";

export const fitJobActionBarRecipe = defineSlotRecipe({
	className: "spectrum-workspace-line-fit-job-action-bar",
	slots: [
		"root",
		"meta",
		"badge",
		"statusText",
		"detailText",
		"actionGroup",
		"submitWrap",
		"iconButton",
		"popoverContent",
		"popoverHeader",
		"popoverTitle",
		"popoverBody",
		"fieldGrid",
		"fieldRoot",
		"modeFieldRoot",
		"fieldLabel",
		"modeGroup",
		"resetButton",
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
		actionGroup: {
			display: "inline-flex",
			alignItems: "center",
			gap: 1,
			flex: "0 0 auto",
		},
		submitWrap: {
			display: "inline-flex",
			flex: "0 0 auto",
		},
		iconButton: {
			w: 7,
			h: 7,
			minW: 7,
			flex: "0 0 auto",
		},
		popoverContent: {
			w: "18rem",
			maxW: "calc(100vw - 2rem)",
			borderRadius: "md",
			boxShadow: "lg",
		},
		popoverHeader: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
			px: 3,
			py: 2,
			borderBottomWidth: "1px",
			borderColor: "border.muted",
		},
		popoverTitle: {
			fontSize: "xs",
			fontWeight: "semibold",
			color: "fg",
		},
		popoverBody: {
			px: 3,
			py: 3,
		},
		fieldGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 3,
		},
		fieldRoot: {
			gap: 1,
		},
		modeFieldRoot: {
			gap: 1,
			gridColumn: "1 / -1",
		},
		fieldLabel: {
			fontSize: "2xs",
			fontWeight: "medium",
			color: "fg.muted",
		},
		modeGroup: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 1,
		},
		resetButton: {
			alignSelf: "flex-end",
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
