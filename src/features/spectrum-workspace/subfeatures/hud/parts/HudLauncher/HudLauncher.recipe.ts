import { defineSlotRecipe } from "@chakra-ui/react";

export const hudLauncherRecipe = defineSlotRecipe({
	slots: ["root"],
	className: "spectrum-workspace-hud-launcher",
	base: {
		root: {
			w: 10,
			h: 10,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.200",
			bg: "rgba(8, 15, 24, 0.84)",
			color: "whiteAlpha.900",
			backdropFilter: "blur(18px) saturate(160%)",
			boxShadow:
				"0 14px 28px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
			transform: "translate(-50%, 50%)",
			transition:
				"transform 0.18s ease, background 0.18s ease, box-shadow 0.18s ease",
			_hover: {
				bg: "rgba(17, 28, 40, 0.9)",
				boxShadow:
					"0 18px 34px rgba(0, 0, 0, 0.46), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.300",
				outlineOffset: "2px",
			},
		},
	},
});
