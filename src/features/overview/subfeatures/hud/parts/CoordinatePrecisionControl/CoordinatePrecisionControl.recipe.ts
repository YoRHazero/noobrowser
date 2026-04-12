import { defineSlotRecipe } from "@chakra-ui/react";

export const coordinatePrecisionControlRecipe = defineSlotRecipe({
	slots: ["root", "label", "fieldRow"],
	className: "overview-hud-coordinate-precision-control",
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
		fieldRow: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
			px: 3,
			py: 2.5,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "blackAlpha.280",
			backdropFilter: "blur(12px) saturate(160%)",
			boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
		},
	},
});
