import type { SystemStyleObject } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import type { BeaconEffectKind } from "../../../shared/types";

const breathPulse = keyframes`
  0%, 100% {
    transform: scale(0.92);
    opacity: 0.22;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.48;
  }
`;

const haloBurst = keyframes`
  0% {
    transform: scale(0.4);
    opacity: 0.75;
  }
  100% {
    transform: scale(2.15);
    opacity: 0;
  }
`;

const streakPulse = keyframes`
  0% {
    transform: translateX(-22px) scaleX(0.35);
    opacity: 0;
  }
  30% {
    opacity: 0.95;
  }
  100% {
    transform: translateX(6px) scaleX(1);
    opacity: 0;
  }
`;

const rimFlash = keyframes`
  0%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 0.95;
  }
`;

const colorMorph = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.45;
  }
  50% {
    transform: scale(1.18);
    opacity: 0.92;
  }
  100% {
    transform: scale(1);
    opacity: 0;
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

export const alphaColor = (hex: string, alpha: number) =>
	`rgba(${hexToRgb(hex)}, ${alpha})`;

export const getBeaconGlowStyle = (color: string): SystemStyleObject => ({
	background: `radial-gradient(circle, ${alphaColor(color, 0.52)} 0%, ${alphaColor(color, 0.18)} 42%, transparent 76%)`,
	animation: `${breathPulse} 3.2s ease-in-out infinite`,
});

export const getBeaconEffectStyles = (
	kind: BeaconEffectKind,
	color: string,
) => {
	switch (kind) {
		case "active-switch":
			return {
				primaryRing: {
					borderColor: alphaColor(color, 0.8),
					animation: `${colorMorph} 520ms ease-out forwards`,
				},
			};
		case "source-ready":
			return {
				primaryRing: {
					borderColor: alphaColor(color, 0.82),
					animation: `${haloBurst} 560ms ease-out forwards`,
				},
				streak: {
					background: `linear-gradient(90deg, transparent 0%, ${alphaColor(color, 0.9)} 50%, transparent 100%)`,
					animation: `${streakPulse} 280ms ease-out forwards`,
				},
			};
		case "fit-ready":
			return {
				primaryRing: {
					borderColor: alphaColor(color, 0.88),
					animation: `${haloBurst} 620ms ease-out forwards`,
				},
				secondaryRing: {
					borderColor: alphaColor(color, 0.42),
					animation: `${haloBurst} 720ms ease-out forwards`,
					animationDelay: "80ms",
				},
			};
		case "source-error":
			return {
				rim: {
					boxShadow: `0 0 0 2px ${alphaColor("#fb7185", 0.95)}, 0 0 24px ${alphaColor("#fb7185", 0.55)}`,
					animation: `${rimFlash} 320ms ease-out forwards`,
				},
			};
		default:
			return {};
	}
};
