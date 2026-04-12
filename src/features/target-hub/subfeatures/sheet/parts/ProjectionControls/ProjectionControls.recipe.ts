import { defineSlotRecipe } from "@chakra-ui/react";

export const projectionControlsRecipe = defineSlotRecipe({
	className: "target-hub-sheet-projection-controls",
	slots: ["chipGroup", "chip"],
	base: {
		chipGroup: {
			display: "flex",
			alignItems: "center",
			gap: 1.5,
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
		chipTone: {
			default: {},
			active: {
				chip: {
					borderColor: "cyan.300",
					bg: "rgba(34, 211, 238, 0.16)",
					color: "white",
					boxShadow: "0 0 0 1px rgba(34, 211, 238, 0.22)",
				},
			},
		},
	},
	defaultVariants: {
		chipTone: "default",
	},
});
