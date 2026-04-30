import { defineSlotRecipe } from "@chakra-ui/react";

export const groupsRecipe = defineSlotRecipe({
	className: "target-hub-sheet-groups",
	slots: [
		"root",
		"titleRow",
		"title",
		"countBadge",
		"toolbar",
		"selectRoot",
		"selectControl",
		"selectTrigger",
		"selectContent",
		"selectItem",
		"actionGroup",
		"iconButton",
		"popoverContent",
		"popoverArrow",
		"popoverBody",
		"popoverTitle",
		"popoverInput",
		"popoverActions",
		"popoverButton",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: 2,
			flexShrink: 0,
		},
		titleRow: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 2,
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
		countBadge: {
			minW: "28px",
			h: "22px",
			px: 2,
			borderRadius: "full",
			borderWidth: "1px",
			borderColor: "whiteAlpha.160",
			bg: "rgba(255, 255, 255, 0.04)",
			color: "whiteAlpha.760",
			fontSize: "xs",
			fontWeight: "semibold",
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			lineHeight: 1,
		},
		toolbar: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr) auto",
			gap: 2,
			alignItems: "center",
		},
		selectRoot: {
			minW: 0,
		},
		selectControl: {
			minW: 0,
		},
		selectTrigger: {
			h: "32px",
			borderRadius: "full",
			borderColor: "whiteAlpha.180",
			bg: "rgba(255, 255, 255, 0.04)",
			color: "whiteAlpha.880",
			fontSize: "xs",
			fontWeight: "medium",
			px: 3,
			_focusVisible: {
				borderColor: "cyan.300",
				boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.32)",
			},
			_disabled: {
				opacity: 0.48,
			},
		},
		selectContent: {
			borderColor: "whiteAlpha.180",
			bg: "rgba(9, 15, 28, 0.98)",
			boxShadow: "0 18px 42px rgba(2, 8, 23, 0.48)",
			color: "whiteAlpha.880",
			fontSize: "xs",
		},
		selectItem: {
			fontSize: "xs",
			_focus: {
				bg: "whiteAlpha.100",
			},
			_highlighted: {
				bg: "whiteAlpha.100",
			},
		},
		actionGroup: {
			display: "flex",
			alignItems: "center",
			gap: 1.5,
		},
		iconButton: {
			minW: "28px",
			h: "28px",
			borderRadius: "full",
			borderWidth: "1px",
			borderColor: "whiteAlpha.200",
			bg: "transparent",
			color: "whiteAlpha.820",
			transition:
				"background 120ms ease, border-color 120ms ease, color 120ms ease",
			_hover: {
				bg: "whiteAlpha.120",
			},
			_disabled: {
				opacity: 0.42,
			},
		},
		popoverContent: {
			w: "260px",
			borderColor: "whiteAlpha.180",
			bg: "rgba(9, 15, 28, 0.98)",
			boxShadow: "0 18px 42px rgba(2, 8, 23, 0.48)",
		},
		popoverArrow: {
			bg: "rgba(9, 15, 28, 0.98)",
		},
		popoverBody: {
			display: "flex",
			flexDirection: "column",
			gap: 3,
			p: 3,
		},
		popoverTitle: {
			fontSize: "xs",
			fontWeight: "semibold",
			color: "white",
		},
		popoverInput: {
			h: "32px",
			borderRadius: "full",
			borderColor: "whiteAlpha.160",
			bg: "rgba(255, 255, 255, 0.035)",
			color: "white",
			fontSize: "xs",
			_placeholder: {
				color: "whiteAlpha.520",
			},
			_focusVisible: {
				borderColor: "cyan.300",
				boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.32)",
			},
		},
		popoverActions: {
			display: "flex",
			justifyContent: "flex-end",
			gap: 2,
		},
		popoverButton: {
			h: "28px",
			borderRadius: "full",
			fontSize: "xs",
		},
	},
});
