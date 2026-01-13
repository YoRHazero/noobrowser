import { defineSlotRecipe } from "@chakra-ui/react";

export const extractionControlsRecipe = defineSlotRecipe({
	slots: [
		"root",
		"label",
		"valuePill",
		"switchControl",
		"sliderGroup",
		"rangeRow",
		"sliceRow",
		"sliceDivider",
	],
	className: "extraction-controls",
	base: {
		root: {
			gap: 4,
		},
		label: {
			textStyle: "2xs",
			color: "fg.muted",
			fontWeight: "bold",
			letterSpacing: "wider",
		},
		valuePill: {
			textStyle: "xs",
			fontFamily: "mono",
			px: 1.5,
			py: 0.5,
			borderRadius: "sm",
			borderWidth: "1px",
			bg: { base: "cyan.50", _dark: "blackAlpha.400" },
			color: { base: "cyan.800", _dark: "cyan.300" },
			borderColor: { base: "cyan.200", _dark: "transparent" },
			fontWeight: { base: "medium", _dark: "normal" },
		},
		switchControl: {
			bg: { base: "gray.300", _dark: "whiteAlpha.200" },
			borderColor: { base: "gray.400", _dark: "whiteAlpha.100" },
			transition: "all 0.2s",
			_checked: {
				bg: { base: "cyan.500", _dark: "cyan.600" },
				borderColor: { base: "cyan.600", _dark: "cyan.400" },
				boxShadow: { _dark: "0 0 10px rgba(0, 200, 255, 0.3)" },
			},
		},
		sliderGroup: {
			gap: 5,
			transition: "opacity 0.2s",
		},
		rangeRow: {
			justifyContent: "space-between",
			alignItems: "center",
		},
		sliceRow: {
			alignItems: "flex-end",
			gap: 3,
		},
		sliceDivider: {
			pb: 1.5,
			color: "fg.subtle",
			opacity: 0.5,
		},
	},
});
