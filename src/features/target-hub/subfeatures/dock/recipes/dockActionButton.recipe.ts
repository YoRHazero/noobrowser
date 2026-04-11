import { defineSlotRecipe } from "@chakra-ui/react";

export const dockActionButtonRecipe = defineSlotRecipe({
	className: "target-hub-dock-action-button",
	slots: ["button"],
	base: {
		button: {
			w: "100%",
			justifyContent: "flex-start",
			borderRadius: "lg",
			gap: 2,
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.card",
			color: "fg",
			_hover: {
				bg: "rgba(255, 255, 255, 0.08)",
			},
		},
	},
});
