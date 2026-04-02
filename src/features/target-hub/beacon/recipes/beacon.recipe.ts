import { defineSlotRecipe } from "@chakra-ui/react";
import {
	BEACON_HEIGHT,
	BEACON_TRANSLATE_X,
	BEACON_WIDTH,
} from "../../shared/constants";

export const beaconRecipe = defineSlotRecipe({
	className: "target-hub-beacon",
	slots: ["root", "shell", "glow", "core", "effectLayer"],
	base: {
		root: {
			position: "fixed",
			left: "0",
			w: `${BEACON_WIDTH}px`,
			h: `${BEACON_HEIGHT}px`,
			zIndex: "var(--target-hub-z-index)",
			transformOrigin: "left center",
			transition:
				"transform 160ms ease-out, opacity 180ms ease-out, filter 160ms ease-out",
			willChange: "transform, opacity",
		},
		shell: {
			position: "relative",
			w: `${BEACON_WIDTH}px`,
			h: `${BEACON_HEIGHT}px`,
			borderRadius: "0 999px 999px 0",
			borderWidth: "1px",
			borderLeftWidth: "0",
			borderColor: "border.subtle",
			bg: "bg.panel",
			boxShadow: "0 10px 26px rgba(2, 8, 23, 0.28)",
			backdropFilter: "blur(12px)",
			cursor: "grab",
			overflow: "visible",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			_active: {
				cursor: "grabbing",
			},
		},
		glow: {
			position: "absolute",
			inset: "-10px -14px -10px -6px",
			pointerEvents: "none",
			filter: "blur(12px)",
		},
		core: {
			position: "absolute",
			w: "12px",
			h: "12px",
			borderRadius: "full",
			bg: "var(--target-hub-color)",
			boxShadow: "0 0 18px var(--target-hub-color)",
		},
		effectLayer: {
			position: "absolute",
			inset: "0",
			pointerEvents: "none",
			overflow: "visible",
		},
	},
	variants: {
		reveal: {
			hidden: {
				root: {
					transform: `translateX(${BEACON_TRANSLATE_X.hidden}px)`,
					opacity: 0.16,
				},
			},
			peek: {
				root: {
					transform: `translateX(${BEACON_TRANSLATE_X.peek}px)`,
					opacity: 0.74,
				},
			},
			reveal: {
				root: {
					transform: `translateX(${BEACON_TRANSLATE_X.reveal}px)`,
					opacity: 1,
				},
			},
		},
	},
});
