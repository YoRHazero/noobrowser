import { defineSlotRecipe } from "@chakra-ui/react";

export const dockSessionCardRecipe = defineSlotRecipe({
	className: "target-hub-dock-session-card",
	slots: ["card", "dot"],
	base: {
		card: {
			p: 3,
			borderRadius: "lg",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.card",
			position: "relative",
			overflow: "hidden",
		},
		dot: {
			w: "10px",
			h: "10px",
			borderRadius: "full",
			flexShrink: 0,
		},
	},
});
