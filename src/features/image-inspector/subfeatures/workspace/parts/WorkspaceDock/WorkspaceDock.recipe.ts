import { defineSlotRecipe } from "@chakra-ui/react";

export const workspaceDockRecipe = defineSlotRecipe({
	className: "image-inspector-workspace-dock",
	slots: ["root", "button"],
	base: {
		root: {
			pointerEvents: "auto",
			display: "flex",
			flexDirection: "column",
			gap: 1.5,
			p: 1.5,
			borderRadius: "lg",
			borderWidth: "1px",
			borderColor: "whiteAlpha.180",
			bg: "rgba(7, 12, 18, 0.76)",
			backdropFilter: "blur(20px) saturate(160%)",
			boxShadow:
				"0 18px 42px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
		},
		button: {
			w: 10,
			h: 10,
			borderRadius: "md",
			borderWidth: "1px",
			borderColor: "whiteAlpha.120",
			bg: "whiteAlpha.060",
			color: "whiteAlpha.760",
			transition:
				"transform 0.16s ease, background 0.16s ease, border-color 0.16s ease, color 0.16s ease",
			_hover: {
				transform: "translateY(-1px)",
				bg: "whiteAlpha.140",
				borderColor: "whiteAlpha.260",
				color: "white",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
			"& svg": {
				width: 4.5,
				height: 4.5,
			},
		},
	},
	variants: {
		active: {
			true: {
				button: {
					bg: "cyan.400/18",
					borderColor: "cyan.300/58",
					color: "cyan.100",
				},
			},
			false: {},
		},
	},
});
