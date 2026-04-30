import { defineSlotRecipe } from "@chakra-ui/react";

export const referenceLayerRecipe = defineSlotRecipe({
	className: "image-inspector-reference-layer",
	slots: [
		"root",
		"section",
		"sectionHeader",
		"sectionTitle",
		"secondaryTitle",
		"label",
		"filterGrid",
		"filterCard",
		"filterHeader",
		"filterLabel",
		"filterSelectShell",
		"selectControl",
		"selectContent",
		"selectItem",
		"fetchButtonTrigger",
		"fetchButton",
		"opacityRow",
		"opacitySlider",
		"opacityTrack",
		"opacityRange",
		"opacityValue",
		"error",
	],
	base: {
		root: {
			display: "flex",
			flexDirection: "column",
			gap: 4.5,
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
			gap: 3,
			minH: 8,
		},
		sectionTitle: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "whiteAlpha.940",
		},
		secondaryTitle: {
			fontSize: "xs",
			fontWeight: "semibold",
			color: "whiteAlpha.740",
		},
		label: {
			fontSize: "2xs",
			color: "whiteAlpha.560",
			lineHeight: 1.1,
		},
		filterGrid: {
			display: "grid",
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			gap: 2,
		},
		filterCard: {
			minW: 0,
			overflow: "hidden",
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.140",
			bg: "blackAlpha.260",
			opacity: 0.74,
			cursor: "pointer",
			transition:
				"border-color 0.16s ease, background 0.16s ease, opacity 0.16s ease",
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
			_hover: {
				borderColor: "whiteAlpha.360",
				opacity: 1,
			},
			"&[data-active=true]": {
				opacity: 1,
				bg: "whiteAlpha.080",
			},
			"&[data-channel=r][data-active=true]": {
				borderColor: "red.300",
			},
			"&[data-channel=g][data-active=true]": {
				borderColor: "green.300",
			},
			"&[data-channel=b][data-active=true]": {
				borderColor: "blue.300",
			},
			"&[data-active=true] [data-part=filter-header]": {
				bg: "whiteAlpha.140",
				borderBottomColor: "whiteAlpha.180",
			},
		},
		filterHeader: {
			px: 2,
			py: 1,
			borderBottomWidth: "1px",
			borderBottomColor: "whiteAlpha.100",
			bg: "whiteAlpha.060",
		},
		filterLabel: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.08em",
			color: "whiteAlpha.800",
		},
		filterSelectShell: {
			p: 1,
		},
		selectControl: {
			"& [data-part=trigger]": {
				minH: 8,
				borderWidth: 0,
				borderRadius: 0,
				bg: "transparent",
				color: "whiteAlpha.900",
				fontSize: "xs",
				fontFamily: "mono",
				px: 2,
				_hover: {
					bg: "whiteAlpha.080",
				},
			},
		},
		selectContent: {
			bg: "gray.950",
			borderColor: "whiteAlpha.200",
			color: "whiteAlpha.900",
			zIndex: 1500,
		},
		selectItem: {
			fontSize: "xs",
			fontFamily: "mono",
			_hover: {
				bg: "whiteAlpha.120",
			},
		},
		fetchButtonTrigger: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			w: 8,
			h: 8,
		},
		fetchButton: {
			w: 8,
			h: 8,
			minW: 8,
			p: 0,
			borderRadius: "md",
			"& svg": {
				w: 4,
				h: 4,
			},
		},
		opacityRow: {
			display: "grid",
			gridTemplateColumns: "3.5rem minmax(0, 1fr) 2.5rem",
			gap: 2.5,
			alignItems: "center",
			minH: 8,
		},
		opacitySlider: {
			minW: 0,
		},
		opacityTrack: {
			bg: "whiteAlpha.160",
		},
		opacityRange: {
			bg: "cyan.400",
		},
		opacityValue: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "whiteAlpha.820",
			textAlign: "right",
			fontVariantNumeric: "tabular-nums",
		},
		error: {
			fontSize: "xs",
			color: "red.200",
			lineHeight: 1.35,
		},
	},
});
