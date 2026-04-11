import { defineSlotRecipe } from "@chakra-ui/react";

export const dockSessionCardRecipe = defineSlotRecipe({
	className: "target-hub-dock-session-card",
	slots: ["card", "header", "dotFrame", "dot", "title", "metaText", "refText"],
	base: {
		card: {
			p: 3,
			gap: 2,
			borderRadius: "lg",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.card",
			position: "relative",
			overflow: "hidden",
		},
		header: {
			gap: 2,
			alignItems: "center",
			minW: 0,
		},
		dotFrame: {
			position: "relative",
			w: "10px",
			h: "10px",
			flexShrink: 0,
			overflow: "visible",
		},
		dot: {
			w: "10px",
			h: "10px",
			borderRadius: "full",
			flexShrink: 0,
			bg: "var(--source-color)",
			boxShadow: "0 0 10px var(--source-color)",
		},
		title: {
			fontSize: "sm",
			fontWeight: "bold",
			color: "fg",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
		metaText: {
			fontSize: "xs",
			color: "fg.muted",
			fontVariantNumeric: "tabular-nums",
		},
		refText: {
			fontSize: "xs",
			color: "fg.muted",
			maxW: "full",
			overflow: "hidden",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
		},
	},
	variants: {
		isEmpty: {
			true: {
				dot: {
					opacity: 0.7,
				},
			},
			false: {
				dot: {
					opacity: 1,
				},
			},
		},
	},
});
