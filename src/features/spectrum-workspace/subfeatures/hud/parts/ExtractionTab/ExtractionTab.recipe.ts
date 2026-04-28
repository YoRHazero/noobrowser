import { defineSlotRecipe } from "@chakra-ui/react";

export const extractionTabRecipe = defineSlotRecipe({
	slots: [
		"root",
		"fieldGrid",
		"field",
		"label",
		"sectionTitle",
		"numberInputRoot",
		"numberInput",
		"toggleGrid",
		"toggleRow",
		"toggleLabel",
		"switchControl",
	],
	className: "spectrum-workspace-hud-extraction-tab",
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: 2.5,
		},
		fieldGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 2,
		},
		field: {
			display: "flex",
			flexDirection: "column",
			gap: 1,
		},
		label: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.12em",
			textTransform: "uppercase",
			color: "whiteAlpha.700",
		},
		sectionTitle: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.14em",
			textTransform: "uppercase",
			color: "whiteAlpha.560",
		},
		numberInputRoot: {
			width: "100%",
		},
		numberInput: {
			h: 9,
			borderRadius: "lg",
			borderColor: "whiteAlpha.180",
			bg: "whiteAlpha.050",
			color: "white",
			fontFamily: "mono",
			fontSize: "xs",
			_focusVisible: {
				borderColor: "cyan.300",
				boxShadow: "0 0 0 1px var(--chakra-colors-cyan-300)",
			},
		},
		toggleGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 2,
		},
		toggleRow: {
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			justifyContent: "space-between",
			gap: 2,
			px: 2.5,
			py: 2.25,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.140",
			bg: "whiteAlpha.060",
		},
		toggleLabel: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "whiteAlpha.880",
		},
		switchControl: {
			bg: "whiteAlpha.200",
			_checked: {
				bg: "cyan.400",
			},
		},
	},
});
