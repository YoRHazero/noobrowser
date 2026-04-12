import { defineSlotRecipe } from "@chakra-ui/react";

export const nedRecipe = defineSlotRecipe({
	className: "target-hub-sheet-ned",
	slots: ["triggerFrame", "chip", "content", "arrow", "body"],
	base: {
		triggerFrame: {
			display: "inline-flex",
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
		content: {
			w: "320px",
			borderColor: "whiteAlpha.180",
			bg: "rgba(9, 15, 28, 0.98)",
			boxShadow: "0 18px 42px rgba(2, 8, 23, 0.48)",
		},
		arrow: {
			bg: "rgba(9, 15, 28, 0.98)",
		},
		body: {
			p: 3,
		},
	},
	variants: {
		triggerTone: {
			default: {},
			active: {
				chip: {
					borderColor: "cyan.300",
					bg: "rgba(34, 211, 238, 0.16)",
					color: "white",
					boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.22)",
				},
			},
			error: {
				chip: {
					borderColor: "red.300",
					bg: "rgba(239, 68, 68, 0.16)",
					color: "white",
					boxShadow: "0 0 0 1px rgba(248, 113, 113, 0.22)",
				},
			},
		},
	},
	defaultVariants: {
		triggerTone: "default",
	},
});
