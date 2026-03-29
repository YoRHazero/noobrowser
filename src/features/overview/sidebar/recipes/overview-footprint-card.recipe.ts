import { defineSlotRecipe } from "@chakra-ui/react";

export const overviewFootprintCardRecipe = defineSlotRecipe({
	slots: [
		"root",
		"body",
		"title",
		"coordinate",
		"filesTrigger",
		"filesTriggerLabel",
		"filesTriggerIcon",
		"popoverContent",
		"popoverBody",
		"fileItem",
		"emptyFiles",
	],
	className: "overview-footprint-card",
	base: {
		root: {
			w: "full",
			textAlign: "left",
			cursor: "pointer",
			borderWidth: "1px",
			transition:
				"background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
			_hover: {
				bg: "rgba(255, 255, 255, 0.07)",
				borderColor: "rgba(255, 255, 255, 0.24)",
				transform: "translateY(-1px)",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
		},
		body: {
			px: 4,
			py: 3,
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
			overflowWrap: "anywhere",
		},
		coordinate: {
			fontSize: "xs",
			color: "whiteAlpha.700",
			fontFamily: "mono",
			fontVariantNumeric: "tabular-nums",
		},
		filesTrigger: {
			display: "block",
			w: "full",
			px: 3,
			py: 2,
			borderWidth: "1px",
			borderColor: "rgba(255, 255, 255, 0.14)",
			borderRadius: "md",
			bg: "rgba(255, 255, 255, 0.03)",
			transition: "border-color 0.18s ease, background 0.18s ease",
			_hover: {
				bg: "rgba(255, 255, 255, 0.06)",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
		},
		filesTriggerLabel: {
			fontSize: "xs",
			fontWeight: "medium",
			color: "whiteAlpha.860",
		},
		filesTriggerIcon: {
			color: "whiteAlpha.700",
			flexShrink: 0,
		},
		popoverContent: {
			borderWidth: "1px",
			borderColor: "rgba(255, 255, 255, 0.12)",
			borderRadius: "lg",
			bg: "rgba(9, 14, 22, 0.98)",
			backdropFilter: "blur(18px)",
			boxShadow: "0 18px 36px rgba(0, 0, 0, 0.38)",
			overflow: "hidden",
		},
		popoverBody: {
			maxH: "180px",
			overflowY: "auto",
			px: 3,
			py: 2.5,
		},
		fileItem: {
			fontSize: "xs",
			color: "whiteAlpha.660",
			overflowWrap: "anywhere",
		},
		emptyFiles: {
			fontSize: "xs",
			color: "whiteAlpha.600",
		},
	},
	variants: {
		selected: {
			true: {
				root: {
					bg: "rgba(95, 196, 255, 0.14)",
					borderColor: "rgba(125, 211, 252, 0.88)",
					boxShadow: "0 0 0 1px rgba(103, 232, 249, 0.16)",
					_hover: {
						bg: "rgba(95, 196, 255, 0.18)",
						borderColor: "rgba(165, 243, 252, 0.92)",
					},
				},
			},
			false: {
				root: {
					bg: "rgba(255, 255, 255, 0.04)",
					borderColor: "rgba(255, 255, 255, 0.16)",
				},
			},
		},
		filesOpen: {
			true: {
				filesTrigger: {
					borderColor: "rgba(125, 211, 252, 0.62)",
				},
			},
		},
	},
});
