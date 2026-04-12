import { defineSlotRecipe } from "@chakra-ui/react";

export const spectrumSectionRecipe = defineSlotRecipe({
	className: "target-hub-sheet-spectrum-section",
	slots: ["editorActions", "chipGroup", "chip"],
	base: {
		editorActions: {
			display: "flex",
			alignItems: "center",
			gap: 2,
		},
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
		isDetail: {
			true: {
				editorActions: {
					justifyContent: "space-between",
				},
			},
			false: {
				editorActions: {
					justifyContent: "flex-end",
				},
			},
		},
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
		isDetail: true,
		chipTone: "default",
	},
});
