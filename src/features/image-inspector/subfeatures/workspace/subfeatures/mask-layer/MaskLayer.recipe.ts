import { defineSlotRecipe } from "@chakra-ui/react";

export const maskLayerRecipe = defineSlotRecipe({
	className: "image-inspector-mask-layer",
	slots: [
		"root",
		"section",
		"sectionTitle",
		"label",
		"value",
		"mapList",
		"mapRow",
		"swatch",
		"note",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: 4,
		},
		section: {
			display: "flex",
			flexDirection: "column",
			gap: 2.5,
		},
		sectionTitle: {
			fontSize: "xs",
			fontWeight: "bold",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "whiteAlpha.700",
		},
		label: {
			fontSize: "2xs",
			color: "whiteAlpha.560",
			lineHeight: 1.1,
			mb: 1,
		},
		value: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "whiteAlpha.920",
			lineHeight: 1.35,
		},
		mapList: {
			display: "flex",
			flexDirection: "column",
			gap: 2,
		},
		mapRow: {
			display: "grid",
			gridTemplateColumns: "16px 44px minmax(0, 1fr)",
			alignItems: "center",
			gap: 2,
			p: 2.5,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "whiteAlpha.060",
		},
		swatch: {
			w: 3,
			h: 3,
			borderRadius: "sm",
			borderWidth: "1px",
			borderColor: "whiteAlpha.260",
			bg: "var(--mask-color)",
		},
		note: {
			fontSize: "xs",
			color: "whiteAlpha.560",
			lineHeight: 1.45,
		},
	},
});
