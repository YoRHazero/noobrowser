import { defineSlotRecipe } from "@chakra-ui/react";
import {
	BEACON_HEIGHT,
	BEACON_TRANSLATE_X,
	BEACON_WIDTH,
} from "../../shared/constants";
import {
	breathPulse,
	colorMorph,
	haloBurst,
	rimFlash,
	streakPulse,
} from "./animations/effects";

export const beaconRecipe = defineSlotRecipe({
	className: "target-hub-beacon",
	slots: [
		"root",
		"glow",
		"shell",
		"core",
		"effectLayer",
		"streak",
		"primaryRing",
		"secondaryRing",
		"rim",
	],
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
		glow: {
			position: "absolute",
			inset: "-10px -14px -10px -6px",
			pointerEvents: "none",
			filter: "blur(12px)",
			background:
				"radial-gradient(circle, rgba(var(--target-hub-color-rgb), 0.52) 0%, rgba(var(--target-hub-color-rgb), 0.18) 42%, transparent 76%)",
			animation: `${breathPulse} 3.2s ease-in-out infinite`,
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
			userSelect: "none",
			touchAction: "none",
		},
		core: {
			position: "absolute",
			w: "12px",
			h: "12px",
			borderRadius: "full",
			bg: "var(--target-hub-color)",
			boxShadow: "0 0 18px rgba(var(--target-hub-color-rgb), 1)",
		},
		effectLayer: {
			position: "absolute",
			inset: "0",
			pointerEvents: "none",
			overflow: "visible",
		},
		streak: {
			position: "absolute",
			left: "-18px",
			top: "50%",
			w: "30px",
			h: "2px",
			borderRadius: "full",
			transform: "translateY(-50%)",
		},
		primaryRing: {
			position: "absolute",
			inset: "8px",
			borderWidth: "2px",
			borderRadius: "full",
		},
		secondaryRing: {
			position: "absolute",
			inset: "8px",
			borderWidth: "2px",
			borderRadius: "full",
		},
		rim: {
			position: "absolute",
			inset: "0",
			borderRadius: "inherit",
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
		isAnchorDragging: {
			true: {
				shell: {
					cursor: "grabbing",
				},
			},
		},
		effectKind: {
			none: {},
			"active-switch": {
				primaryRing: {
					borderColor: "rgba(var(--target-hub-effect-rgb), 0.8)",
					animation: `${colorMorph} 520ms ease-out forwards`,
				},
			},
			"source-ready": {
				primaryRing: {
					borderColor: "rgba(var(--target-hub-effect-rgb), 0.82)",
					animation: `${haloBurst} 560ms ease-out forwards`,
				},
				streak: {
					background:
						"linear-gradient(90deg, transparent 0%, rgba(var(--target-hub-effect-rgb), 0.9) 50%, transparent 100%)",
					animation: `${streakPulse} 280ms ease-out forwards`,
				},
			},
			"fit-ready": {
				primaryRing: {
					borderColor: "rgba(var(--target-hub-effect-rgb), 0.88)",
					animation: `${haloBurst} 620ms ease-out forwards`,
				},
				secondaryRing: {
					borderColor: "rgba(var(--target-hub-effect-rgb), 0.42)",
					animation: `${haloBurst} 720ms ease-out forwards`,
					animationDelay: "80ms",
				},
			},
			"source-error": {
				rim: {
					boxShadow:
						"0 0 0 2px rgba(251, 113, 133, 0.95), 0 0 24px rgba(251, 113, 133, 0.55)",
					animation: `${rimFlash} 320ms ease-out forwards`,
				},
			},
		},
	},
});
