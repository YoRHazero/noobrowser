import { defineSlotRecipe } from "@chakra-ui/react";

export const readonlyFieldValueRecipe = defineSlotRecipe({
	className: "target-hub-sheet-readonly-field-value",
	slots: ["readonlyField"],
	base: {
		readonlyField: {
			minH: "32px",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.100",
			bg: "rgba(255, 255, 255, 0.025)",
			color: "whiteAlpha.860",
			fontSize: "sm",
			px: 3,
			w: "full",
			display: "flex",
			alignItems: "center",
			fontVariantNumeric: "tabular-nums",
		},
	},
});
