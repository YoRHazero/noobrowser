import { defineSlotRecipe } from "@chakra-ui/react";

export const triggerButtonRecipe = defineSlotRecipe({
	slots: ["root"],
	className: "overview-hud-trigger-button",
	base: {
		root: {
			w: 11,
			h: 11,
			borderRadius: "full",
			borderWidth: "1px",
			borderColor: "whiteAlpha.200",
			bg: "linear-gradient(155deg, rgba(22, 33, 47, 0.86), rgba(7, 10, 16, 0.72))",
			backdropFilter: "blur(18px) saturate(165%)",
			color: "whiteAlpha.900",
			boxShadow:
				"0 10px 24px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
			transition:
				"transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
			_hover: {
				transform: "translateY(-1px)",
				bg: "linear-gradient(155deg, rgba(30, 46, 64, 0.92), rgba(9, 14, 23, 0.8))",
				boxShadow:
					"0 14px 28px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
		},
	},
});
