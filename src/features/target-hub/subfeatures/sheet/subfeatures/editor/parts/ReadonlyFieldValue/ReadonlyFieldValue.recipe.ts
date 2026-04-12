import { defineSlotRecipe } from "@chakra-ui/react";

export const readonlyFieldValueRecipe = defineSlotRecipe({
	className: "target-hub-sheet-readonly-field-value",
	slots: ["readonlyField", "readonlyValue"],
	base: {
		readonlyField: {
			minW: 0,
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
		readonlyValue: {
			w: "full",
			minW: 0,
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
	},
	variants: {
		tone: {
			default: {
				readonlyValue: {
					color: "white",
				},
			},
			muted: {
				readonlyValue: {
					color: "whiteAlpha.820",
				},
			},
		},
	},
	defaultVariants: {
		tone: "default",
	},
});
