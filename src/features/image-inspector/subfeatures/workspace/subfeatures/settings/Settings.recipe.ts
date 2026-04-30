import { defineSlotRecipe } from "@chakra-ui/react";

export const settingsRecipe = defineSlotRecipe({
	className: "image-inspector-settings",
	slots: [
		"root",
		"section",
		"sectionTitle",
		"settingList",
		"settingRow",
		"label",
		"value",
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
		settingList: {
			display: "flex",
			flexDirection: "column",
			gap: 2,
		},
		settingRow: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.15fr)",
			gap: 2,
			p: 2.5,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "whiteAlpha.060",
		},
		label: {
			fontSize: "2xs",
			color: "whiteAlpha.560",
			lineHeight: 1.25,
		},
		value: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "whiteAlpha.920",
			lineHeight: 1.25,
		},
		note: {
			fontSize: "xs",
			color: "whiteAlpha.560",
			lineHeight: 1.45,
		},
	},
});
