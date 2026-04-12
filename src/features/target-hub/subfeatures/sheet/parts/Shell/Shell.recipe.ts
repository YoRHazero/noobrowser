import { defineSlotRecipe } from "@chakra-ui/react";
import {
	SHEET_BOTTOM_OFFSET,
	SHEET_LEFT_OFFSET,
	SHEET_TOP_OFFSET,
	SHEET_WIDTH,
	TARGET_HUB_Z_INDEX,
} from "../../../../shared/constants";

export const shellRecipe = defineSlotRecipe({
	className: "target-hub-sheet-shell",
	slots: ["root", "shell"],
	base: {
		root: {
			position: "fixed",
			left: `${SHEET_LEFT_OFFSET}px`,
			top: `${SHEET_TOP_OFFSET}px`,
			bottom: `${SHEET_BOTTOM_OFFSET}px`,
			w: `min(${SHEET_WIDTH}px, calc(100vw - 32px))`,
			zIndex: TARGET_HUB_Z_INDEX,
		},
		shell: {
			h: "100%",
			display: "flex",
			flexDirection: "column",
			p: 3,
			gap: 3,
			borderRadius: "2xl",
			borderWidth: "1px",
			borderColor: "border.subtle",
			bg: "rgba(11, 19, 32, 0.82)",
			backdropFilter: "blur(18px)",
			boxShadow: "0 24px 60px rgba(2, 8, 23, 0.42)",
			overflow: "hidden",
		},
	},
});
