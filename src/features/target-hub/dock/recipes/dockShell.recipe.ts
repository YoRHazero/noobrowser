import { defineSlotRecipe } from "@chakra-ui/react";
import { DOCK_WIDTH } from "../../shared/constants";

export const dockShellRecipe = defineSlotRecipe({
	className: "target-hub-dock-shell",
	slots: ["root", "shell"],
	base: {
		root: {
			position: "fixed",
			left: "18px",
			w: `${DOCK_WIDTH}px`,
			zIndex: "var(--target-hub-z-index)",
		},
		shell: {
			p: 3,
			borderRadius: "xl",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "bg.panel",
			backdropFilter: "blur(14px)",
			boxShadow: "0 18px 44px rgba(2, 8, 23, 0.28)",
		},
	},
});
