import { defineSlotRecipe } from "@chakra-ui/react";

export const annotationLayerRecipe = defineSlotRecipe({
	className: "image-inspector-annotation-layer",
	slots: [
		"root",
		"section",
		"sectionHeader",
		"sectionTitle",
		"metricGrid",
		"metric",
		"label",
		"value",
		"note",
		"switchControl",
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
		sectionHeader: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 2,
		},
		sectionTitle: {
			fontSize: "xs",
			fontWeight: "bold",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			color: "whiteAlpha.700",
		},
		metricGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 2,
		},
		metric: {
			minW: 0,
			p: 2.5,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "whiteAlpha.060",
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
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		note: {
			fontSize: "xs",
			color: "whiteAlpha.560",
			lineHeight: 1.45,
		},
		switchControl: {
			_checked: {
				bg: "cyan.500",
			},
		},
	},
});
