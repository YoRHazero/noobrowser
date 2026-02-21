import { defineSlotRecipe } from "@chakra-ui/react";

export const sourceItemRecipe = defineSlotRecipe({
	slots: ["root", "indicator", "idText", "coordText", "runButton"],
	className: "target-source-item",
	base: {
		root: {
			p: 2,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.card",
			transition: "all 0.2s ease-out",
			cursor: "pointer",
			minW: 0,
			_hover: {
				borderColor: "cyan.300",
				bg: { base: "gray.50", _dark: "whiteAlpha.50" },
			},
		},
		indicator: {
			w: "8px",
			h: "8px",
			borderRadius: "full",
			boxShadow: "0 0 6px var(--source-color)",
			opacity: 0.8,
		},
		idText: {
			fontSize: "xs",
			fontWeight: "bold",
			fontFamily: "mono",
			color: "fg",
			truncate: true,
		},
		coordText: {
			fontSize: "2xs",
			color: "fg.subtle",
			fontFamily: "mono",
			mt: 0.5,
		},
		runButton: {
			minW: "24px",
			h: "24px",
			transition: "all 0.2s",
		},
	},
	variants: {
		selected: {
			true: {
				root: {
					borderColor: { base: "cyan.500", _dark: "cyan.500" },
					bg: { base: "cyan.50", _dark: "whiteAlpha.100" },
				},
				idText: {
					color: { base: "cyan.700", _dark: "cyan.300" },
				},
			},
		},
		runnable: {
			true: {
				runButton: {
					_hover: {
						transform: "scale(1.1)",
						bg: "cyan.500",
						color: "white",
						boxShadow: "0 0 8px rgba(6, 182, 212, 0.6)",
					},
				},
			},
			false: {
				runButton: {
					variant: "ghost",
					colorPalette: "gray",
				},
			},
		},
		running: {
			true: {
				runButton: {
					opacity: 0.7,
					pointerEvents: "none",
				},
			},
		},
	},
});
