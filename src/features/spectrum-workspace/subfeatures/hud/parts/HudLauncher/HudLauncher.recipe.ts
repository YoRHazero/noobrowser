import { defineSlotRecipe } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const hudLauncherBorderOrbit = keyframes`
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
`;

export const hudLauncherRecipe = defineSlotRecipe({
	slots: ["root"],
	className: "spectrum-workspace-hud-launcher",
	base: {
		root: {
			position: "relative",
			isolation: "isolate",
			w: 10,
			h: 10,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "transparent",
			bg: "rgba(8, 15, 24, 0.84)",
			color: "whiteAlpha.900",
			overflow: "hidden",
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
			_before: {
				content: '""',
				position: "absolute",
				inset: "-1px",
				borderRadius: "inherit",
				p: "1px",
				bg: "conic-gradient(from 0deg, rgba(103, 232, 249, 0.14) 0deg, rgba(103, 232, 249, 0.16) 82deg, rgba(103, 232, 249, 0.34) 124deg, rgba(103, 232, 249, 0.86) 170deg, rgba(255, 255, 255, 0.88) 205deg, rgba(103, 232, 249, 0.38) 252deg, rgba(103, 232, 249, 0.16) 302deg, rgba(103, 232, 249, 0.14) 360deg)",
				opacity: 0.9,
				animation: `${hudLauncherBorderOrbit} 6.5s linear infinite`,
				pointerEvents: "none",
				WebkitMask:
					"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
				WebkitMaskComposite: "xor",
				maskComposite: "exclude",
			},
			"& svg": {
				position: "relative",
				zIndex: 1,
			},
		},
	},
});
