import { defineSlotRecipe } from "@chakra-ui/react";

export const dockActionButtonRecipe = defineSlotRecipe({
	className: "target-hub-dock-action-button",
	slots: ["button", "content"],
	base: {
		button: {
			w: "100%",
			h: "8",
			px: 3,
			fontSize: "sm",
			justifyContent: "flex-start",
			borderRadius: "lg",
			gap: 2,
			borderWidth: "1px",
			borderColor: "border.subtle",
		},
		content: {
			justifyContent: "flex-start",
			w: "full",
			gap: 2,
		},
	},
	variants: {
		tone: {
			default: {
				button: {
					bg: "bg.card",
					color: "fg",
					_hover: {
						bg: "rgba(255, 255, 255, 0.08)",
					},
				},
			},
			accent: {
				button: {
					borderColor: "cyan.300",
					color: "white",
					bg: "rgba(34, 211, 238, 0.10)",
					_hover: {
						bg: "rgba(34, 211, 238, 0.18)",
					},
				},
			},
		},
	},
});
