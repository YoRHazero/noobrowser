import { defineSlotRecipe } from "@chakra-ui/react";
import { DOCK_WIDTH } from "../../../../shared/constants";
import { getDockAnimation } from "../../animations/dock.animations";

export const dockShellRecipe = defineSlotRecipe({
	className: "target-hub-dock-shell",
	slots: ["root", "shell", "handle", "handleBar"],
	base: {
		root: {
			position: "fixed",
			left: "18px",
			w: `${DOCK_WIDTH}px`,
			zIndex: "var(--target-hub-z-index)",
			animation: getDockAnimation("enter"),
			pointerEvents: "auto",
		},
		shell: {
			p: 3,
			gap: 0,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.panel",
			backdropFilter: "blur(14px)",
			boxShadow: "0 18px 44px rgba(2, 8, 23, 0.28)",
		},
		handle: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			pb: 2,
			mb: 1,
			userSelect: "none",
			touchAction: "none",
			cursor: "grab",
		},
		handleBar: {
			w: "34px",
			h: "4px",
			borderRadius: "full",
			bg: "whiteAlpha.320",
			transform: "scaleX(1)",
			transition: "background-color 140ms ease-out, transform 140ms ease-out",
		},
	},
	variants: {
		isAnchorDragging: {
			true: {
				handle: {
					cursor: "grabbing",
				},
				handleBar: {
					bg: "whiteAlpha.560",
					transform: "scaleX(1.08)",
				},
			},
		},
		isClosing: {
			true: {
				root: {
					animation: getDockAnimation("exit"),
					pointerEvents: "none",
				},
			},
		},
	},
});
