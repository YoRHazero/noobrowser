import { defineSlotRecipe } from "@chakra-ui/react";

export const panelRecipe = defineSlotRecipe({
	slots: [
		"root",
		"header",
		"titleGroup",
		"eyebrow",
		"title",
		"closeButton",
		"content",
	],
	className: "overview-hud-panel",
	base: {
		root: {
			position: "relative",
			overflow: "hidden",
			minW: "280px",
			p: 3.5,
			borderRadius: "2xl",
			borderWidth: "1px",
			borderColor: "whiteAlpha.160",
			bg: "linear-gradient(160deg, rgba(17, 25, 38, 0.86), rgba(6, 11, 20, 0.74))",
			backdropFilter: "blur(26px) saturate(180%)",
			boxShadow:
				"0 18px 42px rgba(0, 0, 0, 0.44), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
			_before: {
				content: '""',
				position: "absolute",
				inset: 0,
				bg: "linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.02) 28%, rgba(255, 255, 255, 0) 60%)",
				pointerEvents: "none",
			},
		},
		header: {
			position: "relative",
			zIndex: 1,
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 3,
			mb: 3,
		},
		titleGroup: {
			display: "flex",
			flexDirection: "column",
			gap: 0,
		},
		eyebrow: {
			fontSize: "2xs",
			fontWeight: "bold",
			letterSpacing: "0.18em",
			textTransform: "uppercase",
			color: "whiteAlpha.700",
		},
		title: {
			fontSize: "sm",
			fontWeight: "semibold",
			color: "white",
		},
		closeButton: {
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
		content: {
			position: "relative",
			zIndex: 1,
		},
	},
});
