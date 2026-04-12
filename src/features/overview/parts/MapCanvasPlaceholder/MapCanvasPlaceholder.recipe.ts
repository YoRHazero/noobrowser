import { defineSlotRecipe } from "@chakra-ui/react";

export const mapCanvasPlaceholderRecipe = defineSlotRecipe({
	slots: ["root", "panel", "eyebrow", "title", "description", "actionButton"],
	className: "overview-map-canvas-placeholder",
	base: {
		root: {
			position: "absolute",
			inset: 0,
			display: "grid",
			placeItems: "center",
			px: 6,
			bg: "radial-gradient(circle at 50% 36%, rgba(34, 211, 238, 0.12), transparent 34%), linear-gradient(145deg, #050914, #101827 58%, #05070d)",
			overflow: "hidden",
			_before: {
				content: '""',
				position: "absolute",
				inset: 0,
				bgImage:
					"linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
				bgSize: "42px 42px",
				maskImage:
					"radial-gradient(circle at center, rgba(0,0,0,0.8), transparent 72%)",
				pointerEvents: "none",
			},
		},
		panel: {
			position: "relative",
			zIndex: 1,
			maxW: "360px",
			px: 6,
			py: 5,
			borderRadius: "2xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.180",
			bg: "linear-gradient(160deg, rgba(17, 25, 38, 0.82), rgba(6, 11, 20, 0.76))",
			backdropFilter: "blur(24px) saturate(180%)",
			boxShadow:
				"0 22px 60px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
			textAlign: "center",
		},
		eyebrow: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.18em",
			textTransform: "uppercase",
			color: "cyan.200",
		},
		title: {
			mt: 2,
			fontSize: "lg",
			fontWeight: "semibold",
			color: "white",
		},
		description: {
			mt: 2,
			fontSize: "sm",
			lineHeight: "1.7",
			color: "whiteAlpha.700",
		},
		actionButton: {
			mt: 5,
			borderRadius: "full",
			bg: "cyan.300",
			color: "gray.950",
			fontWeight: "bold",
			boxShadow: "0 16px 36px rgba(34, 211, 238, 0.28)",
			_hover: {
				bg: "cyan.200",
				transform: "translateY(-1px)",
				boxShadow: "0 18px 42px rgba(34, 211, 238, 0.34)",
			},
			_focusVisible: {
				outline: "2px solid",
				outlineColor: "cyan.100",
				outlineOffset: "3px",
			},
		},
	},
});
