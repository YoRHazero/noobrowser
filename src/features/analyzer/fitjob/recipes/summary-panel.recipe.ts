import { defineSlotRecipe } from "@chakra-ui/react";

export const summaryPanelRecipe = defineSlotRecipe({
	slots: [
		"root",
		"header",
		"statsRow",
		"sectionTitle",
		"componentList",
		"componentItem",
		"componentName",
		"componentType",
		"grid",
		"gridLabel",
		"gridValue",
	],
	className: "summary-panel",
	base: {
		root: {
			bg: "bg.panel",
			p: 4,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "border.subtle",
			shadow: "sm",
			_dark: {
				bg: "whiteAlpha.50",
				borderColor: "whiteAlpha.200",
			},
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			mb: 4,
			flexWrap: "wrap",
			gap: 2,
		},
		statsRow: {
			display: "flex",
			alignItems: "center",
			mb: 4,
			gap: 4,
		},
		sectionTitle: {
			fontSize: "xs",
			color: "fg.muted",
			fontWeight: "medium",
			letterSpacing: "wider",
			textTransform: "uppercase",
		},
		componentList: {
			display: "flex",
			flexDirection: "column",
			alignItems: "stretch",
			gap: 2,
		},
		componentItem: {
			p: 2,
			bg: "bg.muted",
			borderRadius: "sm",
			borderWidth: "1px",
			borderColor: "transparent",
			_dark: {
				bg: "whiteAlpha.100",
			},
		},
		componentName: {
			fontSize: "xs",
			fontWeight: "bold",
			color: "cyan.600",
			mb: 1,
			_dark: {
				color: "cyan.200",
			},
		},
		componentType: {
			color: "fg.muted",
			fontWeight: "normal",
			ml: 1,
		},
		grid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, 1fr)",
			gap: 2,
			fontSize: "xs",
		},
		gridLabel: {
			color: "fg.muted",
			fontSize: "2xs",
			textTransform: "uppercase",
		},
		gridValue: {
			color: "fg.default",
			fontFamily: "mono",
		},
	},
});
