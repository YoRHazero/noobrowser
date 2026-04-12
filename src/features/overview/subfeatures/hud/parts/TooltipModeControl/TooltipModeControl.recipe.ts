import { defineSlotRecipe } from "@chakra-ui/react";

export const tooltipModeControlRecipe = defineSlotRecipe({
	slots: ["root", "label", "segmentGroup", "segmentButton"],
	className: "overview-hud-tooltip-mode-control",
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: 2,
		},
		label: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.18em",
			textTransform: "uppercase",
			color: "whiteAlpha.700",
		},
		segmentGroup: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 1,
			p: 1,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "blackAlpha.300",
			boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
		},
		segmentButton: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			minH: 9,
			px: 3,
			borderRadius: "lg",
			fontSize: "sm",
			fontWeight: "semibold",
			color: "whiteAlpha.760",
			transition:
				"background 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
			_hover: {
				color: "white",
				bg: "whiteAlpha.100",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
			"&[data-active]": {
				color: "white",
				bg: "linear-gradient(155deg, rgba(67, 179, 255, 0.3), rgba(39, 84, 164, 0.18))",
				boxShadow:
					"inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 8px 18px rgba(17, 48, 90, 0.3)",
				transform: "translateY(-1px)",
			},
		},
	},
});
