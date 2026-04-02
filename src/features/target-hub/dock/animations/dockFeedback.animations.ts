import type { SystemStyleObject } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import type { BeaconEffect, BeaconEffectKind } from "../../shared/types";

const topSweep = keyframes`
  0% {
    transform: translateX(-110%);
    opacity: 0;
  }
  20% {
    opacity: 0.95;
  }
  100% {
    transform: translateX(115%);
    opacity: 0;
  }
`;

const dotPulse = keyframes`
  0% {
    transform: scale(0.45);
    opacity: 0.78;
  }
  100% {
    transform: scale(2.3);
    opacity: 0;
  }
`;

const cardGlow = keyframes`
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0.95;
  }
  100% {
    opacity: 0;
  }
`;

const rimFlash = keyframes`
  0%, 100% {
    opacity: 0;
  }
  45% {
    opacity: 0.92;
  }
`;

const labelFade = keyframes`
  0% {
    opacity: 0.55;
    transform: translateY(2px);
  }
  40% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const noticeFade = keyframes`
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  16% {
    opacity: 1;
    transform: translateY(0);
  }
  82% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-2px);
  }
`;

const statusGlow = keyframes`
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.84;
  }
`;

const hexToRgb = (hex: string) => {
	const normalized = hex.replace("#", "");
	const expanded =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: normalized;
	const value = Number.parseInt(expanded, 16);
	const r = (value >> 16) & 255;
	const g = (value >> 8) & 255;
	const b = value & 255;
	return `${r}, ${g}, ${b}`;
};

const alphaColor = (hex: string, alpha: number) =>
	`rgba(${hexToRgb(hex)}, ${alpha})`;

export interface DockFeedbackVisuals {
	sweep?: SystemStyleObject;
	cardGlow?: SystemStyleObject;
	rim?: SystemStyleObject;
	dotPrimary?: SystemStyleObject;
	dotSecondary?: SystemStyleObject;
	label?: SystemStyleObject;
	status?: SystemStyleObject;
	notice?: SystemStyleObject;
}

export const getDockNoticeLabel = (kind: BeaconEffectKind) => {
	switch (kind) {
		case "active-switch":
			return "Source Updated";
		case "source-ready":
			return "Spectrum Ready";
		case "fit-ready":
			return "Fit Ready";
		case "source-error":
			return "Source Error";
		default:
			return "";
	}
};

export const getDockFeedbackStyles = (
	effect: BeaconEffect | null,
): DockFeedbackVisuals => {
	if (!effect) return {};

	switch (effect.kind) {
		case "active-switch":
			return {
				sweep: {
					background: `linear-gradient(90deg, transparent 0%, ${alphaColor(effect.color, 0.18)} 30%, ${alphaColor(effect.color, 0.72)} 55%, transparent 100%)`,
					animation: `${topSweep} 520ms ease-out forwards`,
				},
				dotPrimary: {
					borderColor: alphaColor(effect.color, 0.82),
					animation: `${dotPulse} 460ms ease-out forwards`,
				},
				label: {
					color: effect.color,
					animation: `${labelFade} 420ms ease-out forwards`,
					textShadow: `0 0 12px ${alphaColor(effect.color, 0.18)}`,
				},
				notice: {
					color: effect.color,
					animation: `${noticeFade} 900ms ease-out forwards`,
				},
			};
		case "source-ready":
			return {
				sweep: {
					background: `linear-gradient(90deg, transparent 0%, ${alphaColor(effect.color, 0.16)} 34%, ${alphaColor(effect.color, 0.84)} 52%, transparent 100%)`,
					animation: `${topSweep} 560ms ease-out forwards`,
				},
				dotPrimary: {
					borderColor: alphaColor(effect.color, 0.88),
					animation: `${dotPulse} 560ms ease-out forwards`,
				},
				status: {
					color: effect.color,
					animation: `${statusGlow} 620ms ease-out forwards`,
					textShadow: `0 0 14px ${alphaColor(effect.color, 0.2)}`,
				},
				notice: {
					color: effect.color,
					animation: `${noticeFade} 920ms ease-out forwards`,
				},
			};
		case "fit-ready":
			return {
				cardGlow: {
					boxShadow: `inset 0 0 0 1px ${alphaColor(effect.color, 0.38)}, 0 0 0 1px ${alphaColor(effect.color, 0.32)}, 0 0 24px ${alphaColor(effect.color, 0.18)}`,
					animation: `${cardGlow} 720ms ease-out forwards`,
				},
				dotPrimary: {
					borderColor: alphaColor(effect.color, 0.9),
					animation: `${dotPulse} 560ms ease-out forwards`,
				},
				dotSecondary: {
					borderColor: alphaColor(effect.color, 0.42),
					animation: `${dotPulse} 680ms ease-out forwards`,
					animationDelay: "80ms",
				},
				notice: {
					color: effect.color,
					animation: `${noticeFade} 940ms ease-out forwards`,
				},
			};
		case "source-error":
			return {
				rim: {
					boxShadow: `0 0 0 1px ${alphaColor("#fb7185", 0.95)}, 0 0 24px ${alphaColor("#fb7185", 0.42)}`,
					animation: `${rimFlash} 360ms ease-out forwards`,
				},
				dotPrimary: {
					borderColor: alphaColor("#fb7185", 0.92),
					animation: `${dotPulse} 420ms ease-out forwards`,
				},
				notice: {
					color: "#fb7185",
					animation: `${noticeFade} 940ms ease-out forwards`,
				},
			};
		default:
			return {};
	}
};
