import { defineSlotRecipe } from "@chakra-ui/react";

export const sourceCardRecipe = defineSlotRecipe({
	className: "target-hub-sheet-source-card",
	slots: [
		"sourceCard",
		"sourceIndicator",
		"sourceControls",
		"helperText",
		"chip",
	],
	base: {
		sourceCard: {
			display: "flex",
			alignItems: "flex-start",
			gap: 3,
			w: "full",
			p: 3,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "rgba(255, 255, 255, 0.03)",
			cursor: "pointer",
			textAlign: "left",
			transition:
				"transform 120ms ease, background 120ms ease, border-color 120ms ease",
			_hover: {
				transform: "translateY(-1px)",
				bg: "rgba(255, 255, 255, 0.06)",
				borderColor: "whiteAlpha.220",
			},
		},
		sourceIndicator: {
			w: "10px",
			h: "54px",
			borderRadius: "999px",
			flexShrink: 0,
			mt: 0.5,
			bg: "var(--source-color)",
			boxShadow: "0 0 16px var(--source-color)",
		},
		sourceControls: {
			display: "flex",
			alignItems: "center",
			gap: 1.5,
			flexShrink: 0,
			ml: "auto",
		},
		helperText: {
			fontSize: "xs",
			color: "whiteAlpha.700",
			lineHeight: 1.5,
		},
		chip: {
			minW: "28px",
			h: "28px",
			borderRadius: "full",
			borderWidth: "1px",
			borderColor: "whiteAlpha.200",
			bg: "transparent",
			color: "whiteAlpha.820",
			fontSize: "xs",
			fontWeight: "bold",
			letterSpacing: "0.08em",
			transition:
				"background 120ms ease, border-color 120ms ease, color 120ms ease",
			_hover: {
				bg: "whiteAlpha.120",
			},
			_disabled: {
				opacity: 0.42,
			},
		},
	},
	variants: {
		isActive: {
			true: {
				sourceCard: {
					borderColor: "cyan.300",
					bg: "rgba(34, 211, 238, 0.10)",
				},
			},
			false: {},
		},
	},
	defaultVariants: {
		isActive: false,
	},
});
