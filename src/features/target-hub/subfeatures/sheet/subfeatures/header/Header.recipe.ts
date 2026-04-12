import { defineSlotRecipe } from "@chakra-ui/react";

export const headerRecipe = defineSlotRecipe({
	className: "target-hub-sheet-header",
	slots: ["header", "headerActions", "titleEyebrow", "title"],
	base: {
		header: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
			pb: 3,
			borderBottomWidth: "1px",
			borderColor: "whiteAlpha.100",
		},
		headerActions: {
			display: "flex",
			alignItems: "center",
			gap: 2,
		},
		titleEyebrow: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.22em",
			textTransform: "uppercase",
			color: "cyan.200",
		},
		title: {
			fontSize: "lg",
			fontWeight: "semibold",
			color: "white",
			letterSpacing: "-0.02em",
		},
	},
});
